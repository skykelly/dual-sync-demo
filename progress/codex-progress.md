# Codex Progress

Use this file to track phase execution.

## Current Status

- Step 10 complete: test checklist validation notes are recorded.
- Added a presentation bundle path: `node scripts/build-single-html.mjs` generates `dist/index.html` so the app can be opened directly from `file://` while keeping the source modules intact.

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

### Step 7. Controller Console

Completed on 2026-06-01.

What changed:
- Reworked Controller View into a presenter console with a clear current scene header, play/pause state, current video time, scene-relative time, and active explain step.
- Added a scene list that highlights the current scene and lets the presenter jump directly to any scene.
- Added large transport controls for Prev, Play/Pause, Next, Restart Scene, Reset Zoom, and Hotspot Debug On/Off.
- Added Jump to Time control using scene-relative seconds, broadcast to Demo View as `JUMP_TO_TIME`.
- Added Restart Scene behavior that pauses, seeks Demo View back to the scene trim start, resets zoom, clears fired timeline/zoom events, and restores the scene default explain step.
- Kept playback speed buttons and direct Explain Step controls visible in the console.
- Moved speaker script notes beside the scene list for fast presenter reference.
- Added `SET_HOTSPOT_DEBUG` message handling while preserving the previous debug message handler for compatibility.

Changed files:
- `src/controllerView.js`
- `src/app.js`
- `src/videoEngine.js`
- `styles/styles.css`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all files in `src/*.js` and `data/*.js`.
- Rendered Controller, Demo, and Explain view HTML through Node with a stubbed `localStorage`.
- Confirmed Controller rendering includes Restart Scene, Jump to Time, scene list, direct Explain Step controls, and formatted current video time.
- Started a local static server with `python3 -m http.server 4173`.
- Confirmed these static routes return `index.html` successfully:
  - `http://127.0.0.1:4173/index.html?view=controller`
  - `http://127.0.0.1:4173/index.html?view=demo`
  - `http://127.0.0.1:4173/index.html?view=explain`

Manual test notes:
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` in separate browser windows.
- In Controller, click scene list items and confirm Demo View and Explain View move to the selected scene.
- Click Play/Pause, Prev, Next, Restart Scene, Reset Zoom, and Hotspot Debug On/Off and confirm Demo View responds.
- Enter a scene-relative time in Jump to Time and confirm Demo View seeks within the active scene trim range.
- Click each playback speed button and confirm Demo View video speed changes.
- Click each Explain Step button and confirm Explain View changes to the selected step while Controller updates the speaker script.
- With a valid `assets/videos/demo.mp4`, confirm current video time updates in Controller while Demo View plays.

Notes:
- Node render checks emit a package metadata warning because this static project has no local `package.json` with `"type": "module"`; the checks still passed.

DONE: 07_controller_console.md
- Completed at: 2026-06-01 00:11:53 KST

DONE: 07_controller_console.md
- Completed at: 2026년  6월  1일 월요일 00시 12분 30초 KST

### Step 8. Sample Demo Scenario

Completed on 2026-06-01.

What changed:
- Replaced the previous three-scene sample data with five AI Shopping Agent / Sales AI Team scenes.
- All scenes use `assets/videos/demo.mp4`.
- Each scene has a distinct `demo.trim.start` and `demo.trim.end` range.
- Each scene includes at least two explain steps and at least one `syncExplain` time event.
- Scene 2 includes hotspot interactions for customer context extraction and installation/budget constraints.
- Scene 3 includes hotspot interactions for Knowledge Atlas and the recommendation card.
- Scene 3 includes zoom events that enlarge the recommendation card area and then reset the zoom.
- Explain copy now covers AI Shopping Agent, Knowledge Atlas, Sales AI Team, online-to-offline handoff, and Sales Copilot messaging.

Changed files:
- `data/scenes.js`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all files in `src/*.js` and `data/*.js`.
- Ran a Node scene validation script confirming:
  - exactly five scenes exist;
  - all scenes use `assets/videos/demo.mp4`;
  - all trims are valid and different;
  - each scene has at least two explain steps;
  - each scene has at least one time event;
  - all time events and hotspot actions point to existing explain step IDs;
  - Scene 2 and Scene 3 include hotspots;
  - Scene 3 includes zoom events.
- Rendered Controller, Demo, and Explain view HTML through Node using Scene 3 and confirmed the views render against the new data.
- Started a local static server with `python3 -m http.server 4173`.
- Confirmed these static routes return `200 OK`:
  - `http://127.0.0.1:4173/index.html?view=controller`
  - `http://127.0.0.1:4173/index.html?view=demo`
  - `http://127.0.0.1:4173/index.html?view=explain`

Manual test notes:
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` in separate browser windows.
- In Controller, use the scene list and `Next` / `Prev` to confirm all five scenes render.
- Click each Explain Step button and confirm Explain View changes to the matching step.
- Turn on Hotspot Debug and confirm Scene 2 and Scene 3 show hotspot regions.
- With a valid `assets/videos/demo.mp4`, play Scene 3 and confirm the recommendation card zooms around `41s` and resets around `48s`.
- Confirm Play, Pause, Restart Scene, Reset Zoom, Jump to Time, speed controls, and direct Explain Step selection still work.

Notes:
- Node module render checks still emit the existing package metadata warning because this static project has no local `package.json` with `"type": "module"`; the checks passed.
- No production dependencies were added.

DONE: 08_sample_demo_scenario.md
- Completed at: 2026-06-01 00:15:13 KST

DONE: 08_sample_demo_scenario.md
- Completed at: 2026년  6월  1일 월요일 00시 15분 51초 KST

### Step 9. Authoring Mode MVP

Completed on 2026-06-01.

What changed:
- Added `index.html?view=author` routing.
- Added `src/authorView.js` with a static Authoring View MVP.
- Authoring View supports video path input and loading.
- Authoring View supports video play/pause and current time display.
- `Add Hotspot` arms placement mode; clicking the video container stores percentage-based `x`/`y` coordinates.
- Hotspot `width`, `height`, `label`, and `explainStepId` inputs generate hotspot JSON in the existing scene data shape.
- `Add Time Event` creates current-time `pause` or `syncExplain` events.
- `Add Zoom Event` creates current-time zoom events with `scale`, `x`, `y`, and `duration`.
- Added a generated Scene JSON preview and `Copy JSON` button.
- Added Authoring View styles while preserving Controller, Demo, and Explain layouts.

Changed files:
- `src/app.js`
- `src/authorView.js`
- `styles/styles.css`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all files in `src/*.js` and `data/*.js`.
- Rendered Controller, Demo, Explain, and Author view HTML through Node using a stubbed `localStorage`.
- Confirmed Author rendering includes the video frame, hotspot controls, time event controls, zoom event controls, JSON preview, and Copy JSON button.
- Started a local static server with `python3 -m http.server 4173`.
- Confirmed these static routes return `200 OK`:
  - `http://127.0.0.1:4173/index.html?view=controller`
  - `http://127.0.0.1:4173/index.html?view=demo`
  - `http://127.0.0.1:4173/index.html?view=explain`
  - `http://127.0.0.1:4173/index.html?view=author`

Manual test notes:
- Open `index.html?view=author`.
- Enter a video path such as `assets/videos/demo.mp4` and click `Load`.
- Play and pause the video; confirm `Current Time` updates.
- Click `Add Hotspot`, then click the video container; confirm a hotspot overlay appears and JSON preview includes percentage `x`/`y`, `width`, `height`, `label`, and `explainStepId`.
- Click another point on the video container and confirm the click X/Y readout and zoom origin inputs update.
- Click `Add Time Event` with `syncExplain` and confirm the current-time event appears in JSON.
- Change the time event type to `pause`, click `Add Time Event`, and confirm no `explainStepId` is added for that pause event.
- Click `Add Zoom Event` and confirm the current-time zoom event includes `scale`, `x`, `y`, and `duration`.
- Click `Copy JSON` and confirm the generated JSON is copied to the clipboard.
- Open `index.html?view=controller`, `index.html?view=demo`, and `index.html?view=explain` to confirm the existing views still load.

Notes:
- The in-app Browser connector was attempted for browser-level verification, but it reported `Browser is not available: iab`. Static route checks and Node render checks were used instead.
- Node module render checks still emit the existing package metadata warning because this static project has no local `package.json` with `"type": "module"`; the checks passed.
- No production dependencies were added.

DONE: 09_authoring_mode_mvp.md
- Completed at: 2026-06-01 00:24:00 KST

DONE: 09_authoring_mode_mvp.md
- Completed at: 2026년  6월  1일 월요일 00시 21분 07초 KST

### Step 10. Test Checklist

Completed on 2026-06-01.

What changed:
- Added a verification record to `docs/codex-plan/10_test_checklist.md`.
- Documented automated/static checks that were completed for the checklist phase.
- Documented manual test items that still require `assets/videos/demo.mp4`, a real browser session, and the actual dual-monitor presentation environment.

Changed files:
- `docs/codex-plan/10_test_checklist.md`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all files in `src/*.js` and `data/*.js`.
- Ran a Node scene validation script confirming scene count, trim ranges, playback rates, explain step references, hotspot coordinates, time event ranges, and zoom event ranges.
- Rendered Controller, Demo, Explain, and Author views through Node with a stubbed `localStorage`.
- Started a local static server with `python3 -m http.server 4173`.
- Confirmed these static routes return `200 OK`:
  - `http://127.0.0.1:4173/index.html?view=controller`
  - `http://127.0.0.1:4173/index.html?view=demo`
  - `http://127.0.0.1:4173/index.html?view=explain`
  - `http://127.0.0.1:4173/index.html?view=author`

Manual test notes:
- Full video timeline, hotspot timing, zoom timing, and browser autoplay behavior still need manual verification with a real `assets/videos/demo.mp4` file.
- Dual-monitor fullscreen behavior must be checked in the actual presentation environment.
- Existing fallback behavior keeps Demo View runnable when the video file is missing.

Notes:
- No production dependencies were added.
- Node module render checks still emit the existing package metadata warning because this static project has no local `package.json` with `"type": "module"`; the checks passed.

DONE: 10_test_checklist.md
- Completed at: 2026-06-01 00:22:49 KST

DONE: 10_test_checklist.md
- Completed at: 2026년  6월  1일 월요일 00시 23분 55초 KST

### Presentation Bundle Update

Completed on 2026-06-01.

What changed:
- Added `scripts/build-single-html.mjs`.
- The build script keeps the development source split across `src/`, `data/`, and `styles/`.
- The build script generates `dist/index.html` with CSS, JavaScript, and scene data inlined.
- Referenced `assets/...` files are copied into `dist/assets/...` when they exist.
- Updated `README.md` with separate presentation and development execution paths.

Changed files:
- `scripts/build-single-html.mjs`
- `README.md`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for all files in `src/*.js`, `data/*.js`, and `scripts/build-single-html.mjs`.
- Ran `node scripts/build-single-html.mjs`.
- Confirmed `dist/index.html?view=controller`, `dist/index.html?view=demo`, and `dist/index.html?view=explain` render through `file://` in headless Chrome.

Manual test notes:
- Open `dist/index.html?view=controller`, `dist/index.html?view=demo`, and `dist/index.html?view=explain` in separate browser windows.
- Confirm BroadcastChannel sync works between the bundled file windows.
- Add the real scene video file at the path referenced by `data/scenes.js`, rebuild, and verify video timeline, hotspot, and zoom behavior.

### Authoring Workflow Update

Completed on 2026-06-01.

What changed:
- Added `data/videos.js` as the static video manifest for Authoring View.
- Extended Authoring View with video selection, scene title/description inputs, trim start/end controls, explain step creation, default explain step selection, time event creation, hotspot creation, zoom event creation, and reset zoom event creation.
- Time events and hotspots now choose explain steps from a dropdown instead of requiring manual step ID typing.
- Generated JSON now outputs a complete scene entry intended for paste-in use inside `data/scenes.js`.
- Updated the single HTML build script to copy referenced `assets/...` files from all bundled modules, including `data/videos.js`.
- Updated README with the recommended scene editing workflow.

Changed files:
- `data/videos.js`
- `src/authorView.js`
- `styles/styles.css`
- `scripts/build-single-html.mjs`
- `README.md`
- `progress/codex-progress.md`

Validation:
- Ran JavaScript syntax checks with `node --check` for `data/*.js`, `src/*.js`, and `scripts/build-single-html.mjs`.
- Ran `node scripts/build-single-html.mjs`.

Manual test notes:
- Open `index.html?view=author`.
- Select a video from the manifest and confirm it loads.
- Use `Set Start` and `Set End`, add explain steps, add events/hotspots/zoom events, then confirm the generated scene entry is suitable for `data/scenes.js`.
