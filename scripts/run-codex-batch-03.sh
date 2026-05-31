#!/usr/bin/env bash
set -euo pipefail
./scripts/run-codex-phase.sh docs/codex-plan/07_controller_console.md
./scripts/run-codex-phase.sh docs/codex-plan/08_sample_demo_scenario.md
./scripts/run-codex-phase.sh docs/codex-plan/09_authoring_mode_mvp.md
./scripts/run-codex-phase.sh docs/codex-plan/10_test_checklist.md
