# Dual Sync Interactive Demo Presentation - Codex Starter

This package contains:

- Starter HTML dual-sync demo
- Codex development plan markdown files
- `AGENTS.md` project instruction file
- Codex execution scripts
- Progress tracking template

## Folder Structure

```text
dual_sync_codex_starter/
├── AGENTS.md
├── README.md
├── README_CODEX_AUTORUN.md
├── index.html
├── app.js
├── scenes.js
├── styles.css
├── docs/
│   └── codex-plan/
├── scripts/
│   ├── run-codex-plan.sh
│   ├── run-codex-phase.sh
│   ├── run-codex-batch-01.sh
│   ├── run-codex-batch-02.sh
│   └── run-codex-batch-03.sh
└── progress/
    └── codex-progress.md
```

## Recommended Flow

### 1. Unzip and move into the folder

```bash
cd dual_sync_codex_starter
```

### 2. Initialize git

```bash
git init
git add .
git commit -m "initial dual sync codex starter"
```

### 3. Run Codex in safe batches

Recommended:

```bash
./scripts/run-codex-batch-01.sh
```

Then manually test:

- `index.html?view=controller`
- `index.html?view=demo`
- `index.html?view=explain`

Then continue:

```bash
./scripts/run-codex-batch-02.sh
./scripts/run-codex-batch-03.sh
```

## Run one phase only

```bash
./scripts/run-codex-phase.sh docs/codex-plan/01_refactor_project_structure.md
```

## Run all phases automatically

Use this only after you are comfortable with Codex making sequential edits:

```bash
./scripts/run-codex-plan.sh
```

## Notes

- The project is designed to remain static HTML with no backend.
- `BroadcastChannel` is used for same-device browser window sync.
- The scripts assume the `codex` CLI is installed and authenticated.
- For presentation UI work, batch execution with manual testing between batches is safer than full automation.
