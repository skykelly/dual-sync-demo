# Codex Progress

Use this file to track phase execution.

## Current Status

- Step 6 complete: Demo View now supports zoom events/reset zoom, and Controller can set playback speed.

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

### Step 4. Explain View Step Sync

Completed on 2026-06-01.

What changed:
- Explain View now renders the active `scene.explain.steps` item instead of treating the scene as the only explain unit.
- `scene.explain.defaultStepId` is used whenever a scene is loaded or an invalid/missing explain step is requested.
- `SYNC_EXPLAIN` messages update the active explain step, including messages from Demo View time events.
- Added `GO_TO_SCENE` handling as an alias for scene navigation messages; scene navigation resets Explain View to the default step.
- Explain View now displays scene title, explain title, subtitle, bullets, key message, speaker script, and a small debug area with scene title and step id.
- Added a short fade animation when Explain View content renders.
- Controller View now shows direct explain step selection buttons and updates the speaker script for the active explain step.

Changed files:
- `src/app.js`
- `src/controllerView.js`
- `src/explainView.js`
- `src/state.js`
- `styles/styles.css`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all files in `src/*.js` and `data/*.js`.
- Rendered Controller and Explain view HTML through Node with a stubbed `localStorage`.
- Confirmed default explain step rendering, synced step rendering, invalid step fallback to default, debug area rendering, speaker script rendering, and Controller explain step controls.
- Started a local static server with `python3 -m http.server 4173`.
- Confirmed these static routes return `index.html` successfully:
  - `http://127.0.0.1:4173/index.html?view=controller`
  - `http://127.0.0.1:4173/index.html?view=demo`
  - `http://127.0.0.1:4173/index.html?view=explain`

Manual test notes:
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` in separate browser windows.
- In Controller, click `Next` or `Prev` and confirm Explain View returns to the new scene's default explain step.
- In Controller, click each Explain Step button and confirm Explain View changes to that step and the Controller script updates.
- With a valid `assets/videos/demo.mp4`, play Demo View and confirm timeline `syncExplain` events change Explain View at the configured times.
- Send or simulate a `SYNC_EXPLAIN` message with a missing `explainStepId` and confirm Explain View falls back to the scene default.

Notes:
- The in-app Browser connector was attempted for a frontend smoke test, but it reported `Browser is not available: iab`. Static route checks and Node render checks were used instead.
- Phase commit created with message `phase-04: implement explain step sync`.

DONE: 04_explain_step_sync.md
- Completed at: 2026-06-01 00:00:46 KST

DONE: 04_explain_step_sync.md
- Completed at: 2026년  6월  1일 월요일 00시 01분 36초 KST

### Step 5. Hotspot Interaction

Completed on 2026-06-01.

What changed:
- Demo View now renders hotspot buttons from `scene.demo.interactions`.
- Hotspot positions and sizes use percentage-based `x`, `y`, `width`, and `height` values relative to the video frame.
- Video Timeline Engine now shows each hotspot only within its `timeRange.start` through `timeRange.end` window.
- Hotspot clicks now support `syncExplain`, `pause`, `jumpToTime`, and `nextScene` actions.
- `syncExplain` hotspot actions broadcast the selected explain step through the existing `SYNC_EXPLAIN` flow.
- Controller View now includes a Hotspots Debug toggle that broadcasts `SET_DEBUG_HOTSPOTS` to Demo View.
- Demo View can switch hotspot debug styling without remounting the active video timeline.

Changed files:
- `src/app.js`
- `src/controllerView.js`
- `src/demoView.js`
- `src/state.js`
- `src/videoEngine.js`
- `styles/styles.css`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all files in `src/*.js` and `data/*.js`.
- Rendered Controller, Demo, and Explain view HTML through Node with a stubbed `localStorage`.
- Confirmed Demo rendering includes hotspot elements, Controller rendering includes the debug toggle, and debug mode adds `data-debug-hotspots="true"`.
- Started a local static server with `python3 -m http.server 4173`.
- Confirmed these static routes return `index.html` successfully:
  - `http://127.0.0.1:4173/index.html?view=controller`
  - `http://127.0.0.1:4173/index.html?view=demo`
  - `http://127.0.0.1:4173/index.html?view=explain`

Manual test notes:
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` in separate browser windows.
- In Controller, click `Hotspots Debug On` and confirm Demo View shows hotspot borders and labels clearly.
- Click the same toggle again and confirm Demo View hides hotspot borders while keeping the app usable.
- With a valid `assets/videos/demo.mp4`, play Demo View and confirm hotspots appear only during their configured time ranges.
- Click the scene 1 input hotspot while visible and confirm Explain View changes to `explain-input`.
- Add or temporarily modify a hotspot action to `pause`, `jumpToTime`, or `nextScene` and confirm each action runs without breaking manual Controller controls.
- Confirm `Next`, `Prev`, `Play`, `Pause`, direct Explain Step selection, and all three required routes still work.

Notes:
- The in-app Browser connector was attempted for browser-level verification, but it reported `Browser is not available: iab`. Static route checks and Node render checks were used instead.

DONE: 05_hotspot_interactions.md

### Step 6. Zoom In/Out and Playback Speed

Completed on 2026-06-01.

What changed:
- Added a transformable `.video-layer` wrapper around the Demo View video and hotspot layer.
- Video Timeline Engine now runs `scene.demo.zoomEvents` once when their `time` is reached.
- Zoom events apply `scale`, percentage-based `x`/`y` transform origin, and `duration` as CSS transition duration.
- Zoom events with `explainStepId` now sync Explain View through the existing `SYNC_EXPLAIN` flow.
- Added `RESET_ZOOM` BroadcastChannel handling and a Controller `Reset Zoom` button.
- Added Controller playback speed buttons for `0.5x`, `0.75x`, `1x`, `1.25x`, and `1.5x`.
- Added `SET_PLAYBACK_RATE` BroadcastChannel handling so Demo View updates `video.playbackRate` immediately.
- Added `state.playbackRate`; scene changes restore `scene.demo.playbackRate`, while Controller speed changes override the active scene default.
- Controller now displays the currently selected playback rate.

Changed files:
- `src/app.js`
- `src/controllerView.js`
- `src/demoView.js`
- `src/state.js`
- `src/videoEngine.js`
- `styles/styles.css`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all files in `src/*.js` and `data/*.js`.
- Rendered Controller, Demo, and Explain view HTML through Node with a stubbed `localStorage`.
- Confirmed Controller rendering includes Reset Zoom and playback speed controls.
- Confirmed Demo rendering includes the transformable video layer.
- Confirmed playback rate override works and scene navigation restores the scene default playback rate.
- Started a local static server with `python3 -m http.server 4173`.
- Confirmed these static routes return `index.html` successfully:
  - `http://127.0.0.1:4173/index.html?view=controller`
  - `http://127.0.0.1:4173/index.html?view=demo`
  - `http://127.0.0.1:4173/index.html?view=explain`

Manual test notes:
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` in separate browser windows.
- In Controller, click each playback speed button and confirm Demo View video speed changes immediately.
- Click `Next` or `Prev` and confirm playback speed returns to the new scene's `scene.demo.playbackRate`.
- With a valid `assets/videos/demo.mp4`, play Demo View and confirm configured zoom events zoom the video layer at their configured times.
- Confirm zoom events with `explainStepId` update Explain View.
- Click `Reset Zoom` in Controller after a zoom event and confirm Demo View returns to scale `1`.
- Confirm manual `Play`, `Pause`, `Next`, `Prev`, direct Explain Step selection, and Hotspots Debug still work.

Notes:
- The in-app Browser connector was attempted for browser-level verification, but it reported `Browser is not available: iab`. Static route checks and Node render checks were used instead.

DONE: 06_zoom_and_speed.md
- Completed at: 2026-06-01 00:04:20 KST

DONE: 05_hotspot_interactions.md
- Completed at: 2026년  6월  1일 월요일 00시 05분 02초 KST

DONE: 06_zoom_and_speed.md
- Completed at: 2026년  6월  1일 월요일 00시 08분 43초 KST

