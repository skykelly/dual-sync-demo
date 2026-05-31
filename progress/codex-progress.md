# Codex Progress

Use this file to track phase execution.

## Current Status

- Step 3 complete: Demo View now has an HTML5 video timeline engine with trim playback, time events, controller commands, and video time broadcasts.

## Completed Tasks

### Step 1. Project Structure Refactor

Completed on 2026-05-31.

What changed:
- Converted the app to ES modules.
- Updated `index.html` to load only `./src/app.js`.
- Moved scene data into `data/scenes.js`.
- Moved styles into `styles/styles.css`.
- Split view rendering into:
  - `src/controllerView.js`
  - `src/demoView.js`
  - `src/explainView.js`
  - `src/viewShell.js`
- Moved presentation state handling into `src/state.js`.
- Moved BroadcastChannel setup and send/receive wrapper into `src/sync.js`.
- Added `src/videoEngine.js` as a placeholder for later video timeline work.
- Removed the old root-level `app.js`, `scenes.js`, and `styles.css`.

Changed files:
- `index.html`
- `data/scenes.js`
- `src/app.js`
- `src/state.js`
- `src/sync.js`
- `src/controllerView.js`
- `src/demoView.js`
- `src/explainView.js`
- `src/viewShell.js`
- `src/videoEngine.js`
- `styles/styles.css`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all ES module files.
- Rendered these local `file://` routes in headless Chrome:
  - `index.html?view=controller`
  - `index.html?view=demo`
  - `index.html?view=explain`
- Verified with headless Chrome CDP that clicking `Next` in Controller changes Controller, Demo, and Explain to Step 2 through BroadcastChannel synchronization.
- Runtime exception count from the CDP validation was `0` for all three views.

Manual test notes:
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` in separate browser windows.
- In Controller, click `Next` and `Prev`.
- Confirm Demo View and Explain View move to the same step.
- Confirm Play, Pause, and Reset Timer still render and update the controller timer state.

Notes:
- A phase commit was requested when possible, but this workspace is not currently inside a git repository (`git status` reports: `not a git repository`), so no commit was created.

DONE: 01_refactor_project_structure.md
- Completed at: 2026년  5월 31일 일요일 23시 48분 06초 KST

### Step 2. Scene Data Model Extension

Completed on 2026-05-31.

What changed:
- Replaced the old slide-oriented sample data with 3 scene definitions in the new declarative structure.
- Each scene now has `id`, `title`, `description`, `demo`, and `explain`.
- `demo` now includes `videoSrc`, `trim`, `playbackRate`, `timeEvents`, `interactions`, and `zoomEvents`.
- `explain` now includes `defaultStepId` and a `steps` array.
- Updated Demo View to read the video timeline model and show a stable fallback message when `assets/videos/demo.mp4` is missing.
- Kept hotspot guide rendering optional behind `index.html?view=demo&debug=1`.
- Updated Explain View to read the default explain step from the new `steps` array.
- Updated Controller View and state duration handling to use scene titles, default explain scripts, and `demo.trim` duration.

Changed files:
- `data/scenes.js`
- `src/controllerView.js`
- `src/demoView.js`
- `src/explainView.js`
- `src/state.js`
- `src/viewShell.js`
- `styles/styles.css`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all ES module files.
- Imported `data/scenes.js`, rendered Controller/Demo/Explain view HTML through Node, and confirmed all views render against the new data model.
- Confirmed state derives scene timer duration from `demo.trim` (`scene-02` resolves to 16 seconds).

Manual test notes:
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` in separate browser windows.
- Confirm Controller shows scene titles and default explain scripts.
- Confirm Demo View shows the video placeholder message if `assets/videos/demo.mp4` is not present.
- Confirm Explain View shows the default explain step for each scene.
- Click `Next` and `Prev` in Controller and confirm Demo View and Explain View stay synchronized.
- Optional: open `index.html?view=demo&debug=1` to inspect percentage-based hotspot guide positions.

Notes:
- Browser smoke testing through the in-app Browser plugin was not available because its JavaScript execution tool was not exposed, and Playwright is not installed in this project. Module-level render checks were used instead.
- A phase commit was requested when possible, but this workspace is not currently inside a git repository (`git status` reports: `not a git repository`), so no commit was created.

DONE: 02_scene_data_model.md
- Completed at: 2026-05-31 23:52:06 KST

DONE: 02_scene_data_model.md
- Completed at: 2026년  5월 31일 일요일 23시 52분 43초 KST

### Step 3. Video Timeline Engine

Completed on 2026-05-31.

What changed:
- Implemented `src/videoEngine.js` as the Demo View HTML5 video timeline engine.
- Demo video now seeks to `scene.demo.trim.start` on load and pauses at `scene.demo.trim.end`.
- Applied `scene.demo.playbackRate` to `video.playbackRate`.
- Added `timeupdate` handling for one-time `timeEvents`.
- Added initial support for `pause`, `syncExplain`, and `nextScene` time event types.
- Added periodic `VIDEO_TIME_UPDATE` BroadcastChannel messages with scene index, current time, duration, and playing state.
- Added Demo View response to Controller `PLAY`, `PAUSE`, and scene navigation commands without resetting video on every play/pause.
- Added internal `JUMP_TO_TIME` handling for future controller/authoring commands.
- Added Explain View state selection so `syncExplain` timeline events can change the displayed explanation step.
- Added a small Controller video status readout fed by `VIDEO_TIME_UPDATE`.

Changed files:
- `src/app.js`
- `src/videoEngine.js`
- `src/state.js`
- `src/demoView.js`
- `src/explainView.js`
- `src/controllerView.js`
- `styles/styles.css`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all ES module files.
- Imported scene data and rendered Controller/Demo/Explain view HTML through Node.
- Confirmed rendered Controller includes video status, Demo includes the timeline video element, and Explain View can render a non-default synced explanation step.
- Started a local static server with `python3 -m http.server 4173`.
- Confirmed these static routes return `index.html` successfully:
  - `http://127.0.0.1:4173/index.html?view=controller`
  - `http://127.0.0.1:4173/index.html?view=demo`
  - `http://127.0.0.1:4173/index.html?view=explain`

Manual test notes:
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` in separate browser windows.
- In Controller, click `Play` and confirm Demo View starts from the current scene trim start.
- Confirm `Pause` pauses Demo View without changing scenes.
- Click `Next` and `Prev` and confirm Demo View reloads the new scene at its trim start.
- With a valid `assets/videos/demo.mp4`, confirm scene 1 pauses around `8.5s` from the `pause` time event and does not repeatedly fire that event.
- Confirm scene 1 changes Explain View to `explain-input` around `3.5s`.
- Confirm Controller video status updates while Demo View is loaded.
- Confirm the fallback message remains visible and the app stays runnable if `assets/videos/demo.mp4` is missing.

Notes:
- The in-app Browser connector reported `Browser is not available: iab`, and Playwright/Puppeteer are not installed in this project, so full browser automation was not available.
- A phase commit was not created because the repository currently reports the whole project as untracked; committing only this phase would mix with the untracked baseline from previous phases.

DONE: 03_video_timeline_engine.md
- Completed at: 2026-05-31 23:56:52 KST

DONE: 03_video_timeline_engine.md
- Completed at: 2026년  5월 31일 일요일 23시 57분 39초 KST

