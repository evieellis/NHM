#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository."
  exit 1
fi

branch="$(git branch --show-current)"
if [[ "$branch" != "main" ]]; then
  echo "Current branch is '$branch'. Switch to 'main' to rollback deploys."
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: ./rollback.sh <commit-hash>"
  echo "Example: ./rollback.sh a1b2c3d"
  echo ""
  echo "Recent commits:"
  git --no-pager log --oneline -n 10
  exit 1
fi

commit="$1"

if ! git cat-file -e "$commit^{commit}" 2>/dev/null; then
  echo "Commit '$commit' was not found."
  exit 1
fi

# Safe rollback for shared history: create a new commit that reverts the target commit.
git revert --no-edit "$commit"
git push origin main

echo ""
echo "Rollback committed and pushed."
echo "GitHub Pages will redeploy this rollback commit shortly."
