#!/usr/bin/env bash
set -euo pipefail

PLAN_DIR="docs/codex-plan"
PROGRESS_FILE="progress/codex-progress.md"

mkdir -p progress

if [ ! -f "$PROGRESS_FILE" ]; then
  echo "# Codex Progress" > "$PROGRESS_FILE"
  echo "" >> "$PROGRESS_FILE"
fi

TASKS=(
  "01_refactor_project_structure.md"
  "02_scene_data_model.md"
  "03_video_timeline_engine.md"
  "04_explain_step_sync.md"
  "05_hotspot_interactions.md"
  "06_zoom_and_speed.md"
  "07_controller_console.md"
  "08_sample_demo_scenario.md"
  "09_authoring_mode_mvp.md"
  "10_test_checklist.md"
)

for TASK in "${TASKS[@]}"; do
  TASK_PATH="$PLAN_DIR/$TASK"

  if grep -q "DONE: $TASK" "$PROGRESS_FILE"; then
    echo "Skipping completed task: $TASK"
    continue
  fi

  echo "========================================"
  echo "Running Codex task: $TASK"
  echo "========================================"

  PROMPT=$(cat <<PROMPT_EOF
You are working on the Dual Sync Interactive Demo Presentation project.

Read and follow this task file:

$TASK_PATH

Before coding:
1. Read AGENTS.md.
2. Read docs/codex-plan/00_overview.md.
3. Read the current task file: $TASK_PATH.
4. Inspect the current project structure.

Implementation rules:
- Implement only the current task scope.
- Keep the app runnable after this task.
- Preserve existing functionality.
- Avoid unnecessary dependencies.
- Update progress/codex-progress.md with what was completed, changed files, and manual test notes.
- If the task cannot be completed safely, stop and explain the blocker in progress/codex-progress.md.

Validation:
- Run available checks.
- If no checks exist, document manual test steps.
- Do not mark the task complete unless the project is in a runnable state.

At the end, write a concise summary.
PROMPT_EOF
)

  codex exec \
    --cd . \
    --sandbox workspace-write \
    --yolo \
    "$PROMPT"

  echo "" >> "$PROGRESS_FILE"
  echo "DONE: $TASK" >> "$PROGRESS_FILE"
  echo "- Completed at: $(date)" >> "$PROGRESS_FILE"
  echo "" >> "$PROGRESS_FILE"

  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git add .
    git commit -m "codex: complete ${TASK%.md}" || true
  fi
done

echo "All Codex plan tasks completed."
