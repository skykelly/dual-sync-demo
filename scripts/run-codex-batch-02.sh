#!/usr/bin/env bash
set -euo pipefail
./scripts/run-codex-phase.sh docs/codex-plan/04_explain_step_sync.md
./scripts/run-codex-phase.sh docs/codex-plan/05_hotspot_interactions.md
./scripts/run-codex-phase.sh docs/codex-plan/06_zoom_and_speed.md
