#!/usr/bin/env bash
set -euo pipefail

REMOTE_URL="${1:-}"
COMMIT_MESSAGE="${2:-Initial commit}"

cd "$(dirname "$0")/.."

if [ ! -d .git ]; then
  git init -b main
fi

paths=(
  .env.example \
  .gitignore \
  AGENTS.md \
  CLAUDE.md \
  Nomadabe_Travel_Knowledge_Base.md \
  README.md \
  data \
  eslint.config.mjs \
  next.config.ts \
  package-lock.json \
  package.json \
  postcss.config.mjs \
  public \
  scripts \
  src \
  supabase \
  tsconfig.json
)

existing_paths=()
for path in "${paths[@]}"; do
  if [ -e "$path" ]; then
    existing_paths+=("$path")
  else
    echo "Skipping missing path: $path"
  fi
done

# Stage project source files only. Generated files and secrets stay ignored.
git add "${existing_paths[@]}"

git status --short

if git diff --cached --quiet; then
  echo "No staged changes to commit."
else
  git commit -m "$COMMIT_MESSAGE"
fi

if [ -n "$REMOTE_URL" ]; then
  if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REMOTE_URL"
  else
    git remote add origin "$REMOTE_URL"
  fi
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Missing GitHub remote URL."
  echo "Usage: ./scripts/push-to-github.sh https://github.com/USER/REPO.git \"Initial commit\""
  exit 1
fi

git branch -M main
git push -u origin main
