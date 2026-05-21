#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (cloud) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO_DIR="${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "$0")" rev-parse --show-toplevel)}"

echo "==> Installing web dependencies..."
cd "$REPO_DIR/web"
npm install

echo "==> Fetching Rust dependencies..."
cd "$REPO_DIR/api"
cargo fetch

echo "==> Session start complete."
