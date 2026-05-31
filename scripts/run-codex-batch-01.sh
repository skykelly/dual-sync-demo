#!/usr/bin/env bash
set -euo pipefail
./scripts/run-codex-phase.sh docs/codex-plan/01_refactor_project_structure.md
./scripts/run-codex-phase.sh docs/codex-plan/02_scene_data_model.md
./scripts/run-codex-phase.sh docs/codex-plan/03_video_timeline_engine.md
