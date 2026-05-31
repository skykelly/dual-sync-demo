#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: ./scripts/run-codex-phase.sh docs/codex-plan/01_refactor_project_structure.md"
  exit 1
fi

TASK_PATH="$1"

if [ ! -f "$TASK_PATH" ]; then
  echo "Task file not found: $TASK_PATH"
  exit 1
fi

PROMPT=$(cat <<PROMPT_EOF
You are working on the Dual Sync Interactive Demo Presentation project.

Read AGENTS.md, docs/codex-plan/00_overview.md, and this task file:

$TASK_PATH

Implement only this phase.
Keep the app runnable.
Preserve existing behavior.
Update progress/codex-progress.md with completed work, changed files, and test notes.
Run available checks or document manual checks.
PROMPT_EOF
)

codex exec \
  --cd . \
  --sandbox workspace-write \
  --ask-for-approval on-request \
  "$PROMPT"
