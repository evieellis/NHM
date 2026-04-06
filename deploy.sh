#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository."
  exit 1
fi

branch="$(git branch --show-current)"
if [[ "$branch" != "main" ]]; then
  echo "Current branch is '$branch'. Switch to 'main' to deploy."
  exit 1
fi

message="${1:-Deploy update $(date +"%Y-%m-%d %H:%M:%S")}" 

# Stage all changes and create a commit only when there is a diff.
git add -A
if git diff --cached --quiet; then
  echo "No staged changes to deploy."
  exit 0
fi

git commit -m "$message"
git push origin main

echo ""
echo "Deployed to origin/main."
echo "GitHub Pages will update from the latest commit shortly."
