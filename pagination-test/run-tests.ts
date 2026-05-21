/**
 * Test driver: builds pagination-test-server, starts it, waits for schema export,
 * runs relay-compiler, typechecks, then executes the integration test suite.
 */
import { spawn, spawnSync } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { existsSync, unlinkSync, watchFile, unwatchFile } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = __dirname;
const API_DIR = resolve(ROOT, '../api');
const SCHEMA_PATH = resolve(ROOT, 'schema.graphql');
const SERVER_URL = 'http://localhost:8001/';
const SCHEMA_TIMEOUT_MS = 30_000;
const HTTP_TIMEOUT_MS = 15_000;
const HTTP_POLL_INTERVAL_MS = 250;

let serverProcess: ChildProcess | null = null;

function cleanup(code: number): never {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
  process.exit(code);
}

process.on('SIGINT', () => cleanup(1));
process.on('SIGTERM', () => cleanup(1));

function run(cmd: string, args: string[], cwd: string, label: string): void {
  console.log(`\n▶  ${label}`);
  const result = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`\n✗  ${label} failed (exit ${result.status ?? 'signal'})`);
    cleanup(1);
  }
}

function waitForSchema(): Promise<void> {
  return new Promise((res, rej) => {
    if (existsSync(SCHEMA_PATH)) {
      res();
      return;
    }
    const timer = setTimeout(() => {
      unwatchFile(SCHEMA_PATH);
      rej(new Error(`Timed out waiting for schema.graphql after ${SCHEMA_TIMEOUT_MS}ms`));
    }, SCHEMA_TIMEOUT_MS);

    watchFile(SCHEMA_PATH, { interval: 200 }, () => {
      if (existsSync(SCHEMA_PATH)) {
        clearTimeout(timer);
        unwatchFile(SCHEMA_PATH);
        res();
      }
    });
  });
}

async function waitForHttp(): Promise<void> {
  const deadline = Date.now() + HTTP_TIMEOUT_MS;
  while (Date.now() < deadline) {
    try {
      const resp = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' }),
        signal: AbortSignal.timeout(2000),
      });
      if (resp.ok || resp.status === 400) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, HTTP_POLL_INTERVAL_MS));
  }
  throw new Error(`Server at ${SERVER_URL} did not respond within ${HTTP_TIMEOUT_MS}ms`);
}

async function main(): Promise<void> {
  // ── Step 1: build ───────────────────────────────────────────────────────────

  run('cargo', ['build', '--bin', 'pagination-test-server'], API_DIR, 'cargo build --bin pagination-test-server');

  // ── Step 2: remove stale schema ─────────────────────────────────────────────

  if (existsSync(SCHEMA_PATH)) {
    unlinkSync(SCHEMA_PATH);
    console.log('  Removed stale schema.graphql');
  }

  // ── Step 3: start server ────────────────────────────────────────────────────

  console.log('\n▶  Starting pagination-test-server');
  serverProcess = spawn(
    resolve(API_DIR, 'target/debug/pagination-test-server'),
    ['--schema-out', SCHEMA_PATH],
    { stdio: ['ignore', 'inherit', 'inherit'] },
  );
  serverProcess.on('exit', (code: number | null, signal: NodeJS.Signals | null) => {
    if (code !== 0 && code !== null) {
      console.error(`\nServer exited unexpectedly (code=${code}, signal=${signal})`);
      cleanup(1);
    }
  });

  // ── Step 4: wait for schema ──────────────────────────────────────────────────

  console.log('  Waiting for schema.graphql...');
  await waitForSchema();
  console.log('  schema.graphql ready');

  // ── Step 5: wait for HTTP ────────────────────────────────────────────────────

  console.log('  Waiting for HTTP...');
  await waitForHttp();
  console.log('  Server accepting requests');

  // ── Step 6: relay-compiler ───────────────────────────────────────────────────

  run('npx', ['relay-compiler'], ROOT, 'relay-compiler');

  // ── Step 7: typecheck ────────────────────────────────────────────────────────

  run('npx', ['tsc', '--noEmit'], ROOT, 'tsc --noEmit');

  // ── Step 8: integration tests ────────────────────────────────────────────────

  console.log('\n▶  Running integration tests\n');
  const testResult = spawnSync('npx', ['tsx', 'src/tests/pagination.test.ts'], {
    cwd: ROOT,
    stdio: 'inherit',
  });

  cleanup(testResult.status ?? 1);
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : String(e));
  cleanup(1);
});
