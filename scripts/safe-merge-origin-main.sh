#!/usr/bin/env bash
set -euo pipefail

REMOTE="${1:-origin}"
BRANCH="${2:-main}"

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

current_branch="$(git branch --show-current)"
if [[ -z "$current_branch" ]]; then
  echo "Detached HEAD байна. Эхлээд branch дээрээ checkout хийнэ үү."
  exit 1
fi

dirty="$(git status --porcelain --untracked-files=no)"
if [[ -n "$dirty" ]]; then
  echo "Local өөрчлөлт байна. Merge хийхээс өмнө commit эсвэл stash хийнэ үү:"
  echo "$dirty"
  exit 1
fi

git config rerere.enabled true

echo "Fetching $REMOTE/$BRANCH..."
git fetch "$REMOTE" "$BRANCH"

remote_ref="$REMOTE/$BRANCH"
local_head="$(git rev-parse HEAD)"
remote_head="$(git rev-parse "$remote_ref")"

if [[ "$local_head" == "$remote_head" ]]; then
  echo "$current_branch аль хэдийн $remote_ref-тэй адил байна."
  exit 0
fi

backup_branch="backup/pre-merge-${current_branch}-$(date +%Y%m%d-%H%M%S)"
git branch "$backup_branch"
echo "Backup branch үүслээ: $backup_branch"

set +e
git merge --no-commit --no-ff "$remote_ref"
merge_code=$?
set -e

if [[ "$merge_code" -ne 0 ]]; then
  echo
  echo "Merge conflict гарлаа. Дараах файлуудыг гараар засна:"
  git diff --name-only --diff-filter=U
  echo
  echo "Болих бол: git merge --abort"
  echo "Засаж дуусаад: git add <files> && git commit"
  echo "Backup руу буцах бол: git reset --hard $backup_branch"
  exit "$merge_code"
fi

echo
echo "Merge clean орлоо, гэхдээ commit хийгээгүй."
echo "Одоо шалгаад OK бол:"
echo "  git status --short"
echo "  npm run build"
echo "  git commit -m \"Merge $remote_ref\""
echo
echo "Болих бол: git merge --abort"
