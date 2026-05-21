/**
 * End-to-end pagination integration tests against the poem-test-pagination server.
 *
 * Relay-compiler generates typed artifacts from the .graphql query files; we import
 * those artifacts directly (no babel/graphql-tag transform needed at runtime) and
 * pass them to fetchQuery. TypeScript uses the generated types for full type safety.
 */
import { fetchQuery } from 'relay-runtime';
import { environment } from '../environment';

// Import generated relay artifacts (resolved by esbuild: .graphql → .graphql.ts)
import PaginationForwardQueryDef from '../__generated__/PaginationForwardQuery.graphql';
import PaginationLastQueryDef from '../__generated__/PaginationLastQuery.graphql';
import PaginationParityQueryDef from '../__generated__/PaginationParityQuery.graphql';
import type { PaginationForwardQuery } from '../__generated__/PaginationForwardQuery.graphql';
import type { PaginationLastQuery } from '../__generated__/PaginationLastQuery.graphql';
import type { PaginationParityQuery } from '../__generated__/PaginationParityQuery.graphql';

// The 62 row names in order (matches seed_test_pagination.py ALPHABET)
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// ── Helpers ───────────────────────────────────────────────────────────────────

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

type ForwardPage = NonNullable<PaginationForwardQuery['response']['testPagination']>;
type ForwardNode = NonNullable<ForwardPage['edges']>[number]['node'];

async function fetchForward(first: number, after?: string | null): Promise<ForwardPage> {
  const data = await fetchQuery<PaginationForwardQuery>(
    environment,
    PaginationForwardQueryDef,
    { first, after: after ?? null },
    { fetchPolicy: 'network-only' },
  ).toPromise();
  assert(data?.testPagination != null, 'testPagination must be present');
  return data!.testPagination!;
}

type LastPage = NonNullable<PaginationLastQuery['response']['testPagination']>;

async function fetchLast(last: number): Promise<LastPage> {
  const data = await fetchQuery<PaginationLastQuery>(
    environment,
    PaginationLastQueryDef,
    { last },
    { fetchPolicy: 'network-only' },
  ).toPromise();
  assert(data?.testPagination != null, 'testPagination must be present');
  return data!.testPagination!;
}

type ParityPage = NonNullable<PaginationParityQuery['response']['testPagination']>;
type Parity = PaginationParityQuery['variables']['parity'];

async function fetchParity(first: number, after: string | null, parity: Parity): Promise<ParityPage> {
  const data = await fetchQuery<PaginationParityQuery>(
    environment,
    PaginationParityQueryDef,
    { first, after, parity },
    { fetchPolicy: 'network-only' },
  ).toPromise();
  assert(data?.testPagination != null, 'testPagination must be present');
  return data!.testPagination!;
}

function nodes(page: { edges: ReadonlyArray<{ node: ForwardNode }> | null }): ForwardNode[] {
  return (page.edges ?? []).map((e) => e.node);
}

// ── Test runner ───────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ✗  ${name}\n       ${msg}`);
    failed++;
  }
}

// ── Tests ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  await test('forward: fetch all 62 rows 5 at a time', async () => {
    const allNodes: ForwardNode[] = [];
    let cursor: string | null = null;
    let pageCount = 0;

    while (true) {
      const page = await fetchForward(5, cursor);
      const pageNodes = nodes(page);
      allNodes.push(...pageNodes);
      pageCount++;

      if (page.pageInfo.hasNextPage) {
        assert(page.pageInfo.endCursor != null, 'endCursor must be set when hasNextPage');
        assert(pageNodes.length === 5, `full page must have 5 nodes, got ${pageNodes.length}`);
        cursor = page.pageInfo.endCursor ?? null;
      } else {
        break;
      }
    }

    assert(allNodes.length === 62, `expected 62 rows, got ${allNodes.length}`);
    assert(pageCount === 13, `expected 13 pages (12×5 + 2), got ${pageCount}`);

    // Numbers must be 1..62 in order
    for (let i = 0; i < 62; i++) {
      const n = allNodes[i]!;
      assert(n.number === i + 1, `row ${i}: expected number ${i + 1}, got ${n.number}`);
      assert(n.name === ALPHABET[i], `row ${i}: expected name "${ALPHABET[i]}", got "${n.name}"`);
      assert(n.mod5 === (i + 1) % 5, `row ${i}: expected mod5 ${(i + 1) % 5}, got ${n.mod5}`);
      if ((i + 1) % 2 === 1) {
        assert(n.odd === 1, `row ${i}: odd row must have odd=1`);
        assert(n.even == null, `row ${i}: odd row must not have even`);
      } else {
        assert(n.even === 'y', `row ${i}: even row must have even="y"`);
        assert(n.odd == null, `row ${i}: even row must not have odd`);
      }
    }
  });

  await test('forward: default page size is 5', async () => {
    const page = await fetchForward(5);
    assert(nodes(page).length === 5, 'first page should have 5 nodes');
    assert(page.pageInfo.hasNextPage, 'should have next page');
    assert(!page.pageInfo.hasPreviousPage, 'first page should not have previous page');
  });

  await test('forward: cursor continuity — two chunks equal one bigger fetch', async () => {
    // Fetch rows 1..10 in one shot
    const big = await fetchForward(10);
    const bigNodes = nodes(big);

    // Fetch rows 1..5, then 6..10 via cursor
    const first5 = await fetchForward(5);
    const cursor = first5.pageInfo.endCursor;
    assert(cursor != null, 'endCursor must be set');
    const next5 = await fetchForward(5, cursor);

    const chunkedNumbers = [...nodes(first5), ...nodes(next5)].map((n) => n.number);
    const bigNumbers = bigNodes.map((n) => n.number);
    assert(
      JSON.stringify(chunkedNumbers) === JSON.stringify(bigNumbers),
      `chunked [${chunkedNumbers}] !== big [${bigNumbers}]`,
    );
  });

  await test('forward: hasNextPage false on last page', async () => {
    // Fetch all but the last page and verify the final page reports correctly
    let cursor: string | null = null;
    let lastPage: ForwardPage | null = null;
    while (true) {
      const page = await fetchForward(5, cursor);
      lastPage = page;
      if (!page.pageInfo.hasNextPage) break;
      cursor = page.pageInfo.endCursor ?? null;
    }
    assert(!lastPage!.pageInfo.hasNextPage, 'last page must have hasNextPage=false');
    assert(nodes(lastPage!).length === 2, `last page should have 2 rows (62 = 12×5+2)`);
    assert(nodes(lastPage!).at(-1)!.number === 62, 'last row must be number 62');
  });

  await test('last: fetch last 5 rows', async () => {
    const page = await fetchLast(5);
    const ns = nodes(page);
    assert(ns.length === 5, `expected 5 rows, got ${ns.length}`);
    // last 5 of 1..62 are 58..62, returned in ascending order
    const numbers = ns.map((n) => n.number);
    assert(
      JSON.stringify(numbers) === JSON.stringify([58, 59, 60, 61, 62]),
      `expected [58..62], got [${numbers}]`,
    );
    assert(!page.pageInfo.hasNextPage, 'last 5 should not have next page');
  });

  await test('last: fetch last 1 row', async () => {
    const page = await fetchLast(1);
    const ns = nodes(page);
    assert(ns.length === 1, `expected 1 row, got ${ns.length}`);
    assert(ns[0]!.number === 62, `expected row 62, got ${ns[0]!.number}`);
    assert(ns[0]!.name === 'Z', `expected name "Z", got "${ns[0]!.name}"`);
    assert(ns[0]!.even === 'y', 'row 62 is even');
    assert(ns[0]!.mod5 === 62 % 5, `mod5 mismatch`);
  });

  await test('filter odd: all returned rows are odd', async () => {
    const allNodes: ForwardNode[] = [];
    let cursor: string | null = null;

    while (true) {
      const page = await fetchParity(10, cursor, 'ODD');
      allNodes.push(...nodes(page));
      if (!page.pageInfo.hasNextPage) break;
      cursor = page.pageInfo.endCursor ?? null;
    }

    assert(allNodes.length === 31, `expected 31 odd rows (1,3,…,61), got ${allNodes.length}`);
    for (const n of allNodes) {
      assert(n.number % 2 === 1, `row ${n.number} should be odd`);
      assert(n.odd === 1, `row ${n.number} must have odd=1`);
      assert(n.even == null, `row ${n.number} must not have even`);
    }
    // Numbers must be strictly ascending
    for (let i = 1; i < allNodes.length; i++) {
      assert(allNodes[i]!.number > allNodes[i - 1]!.number, 'odd rows must be ascending');
    }
  });

  await test('filter even: all returned rows are even', async () => {
    const allNodes: ForwardNode[] = [];
    let cursor: string | null = null;

    while (true) {
      const page = await fetchParity(10, cursor, 'EVEN');
      allNodes.push(...nodes(page));
      if (!page.pageInfo.hasNextPage) break;
      cursor = page.pageInfo.endCursor ?? null;
    }

    assert(allNodes.length === 31, `expected 31 even rows (2,4,…,62), got ${allNodes.length}`);
    for (const n of allNodes) {
      assert(n.number % 2 === 0, `row ${n.number} should be even`);
      assert(n.even === 'y', `row ${n.number} must have even="y"`);
      assert(n.odd == null, `row ${n.number} must not have odd`);
    }
  });

  await test('filter odd: cursor pagination collects same set as single large fetch', async () => {
    // Collect via pagination
    const paginated: number[] = [];
    let cursor: string | null = null;
    while (true) {
      const page = await fetchParity(5, cursor, 'ODD');
      paginated.push(...nodes(page).map((n) => n.number));
      if (!page.pageInfo.hasNextPage) break;
      cursor = page.pageInfo.endCursor ?? null;
    }

    // Expected: 1, 3, 5, ..., 61
    const expected = Array.from({ length: 31 }, (_, i) => i * 2 + 1);
    assert(
      JSON.stringify(paginated) === JSON.stringify(expected),
      `odd paginated [${paginated}] !== expected [${expected}]`,
    );
  });

  await test('mod5 correctness spot-check (first 20 rows)', async () => {
    const page = await fetchForward(20);
    for (const n of nodes(page)) {
      assert(n.mod5 === n.number % 5, `row ${n.number}: mod5 should be ${n.number % 5}, got ${n.mod5}`);
    }
  });

  // ── Summary ─────────────────────────────────────────────────────────────────

  console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
