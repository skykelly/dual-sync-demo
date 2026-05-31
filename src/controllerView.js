import { renderShell } from "./viewShell.js";

export function renderControllerView({ scene, scenes, state }) {
  const next = scenes[state.currentStep + 1];
  const currentExplainStep = getExplainStep(scene, state.currentExplainStepId);
  const explainSteps = scene.explain?.steps || [];
  const videoStatus = state.videoStatus || {};
  const trim = scene.demo?.trim || { start: 0, end: 0 };
  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5];
  const currentPlaybackRate = state.playbackRate || scene.demo.playbackRate || 1;

  return renderShell({
    label: "Controller",
    scenes,
    state,
    content: `
      <section class="controller-layout">
        <div class="controller-main">
          <p class="eyebrow">Presenter Controller</p>
          <div class="controller-current">
            <div>
              <span class="console-label">현재 Scene</span>
              <h1>${padNumber(state.currentStep + 1)}. ${scene.title}</h1>
              <p class="controller-description">${scene.description}</p>
            </div>
            <div class="console-state ${state.isPlaying ? "is-playing" : ""}">
              <strong>${state.isPlaying ? "PLAY" : "PAUSE"}</strong>
              <span>Speed ${formatPlaybackRate(currentPlaybackRate)}x</span>
            </div>
          </div>

          <div class="video-status" aria-label="Demo video status">
            <span>현재 영상 시간 ${formatVideoClock(videoStatus.currentTime, trim.start)} / ${formatVideoClock(trim.end, 0)}</span>
            <span>Scene Time ${formatVideoClock(getSceneElapsed(videoStatus.currentTime, trim.start), 0)} / ${formatVideoClock(getSceneDuration(trim), 0)}</span>
            <span>현재 Explain ${currentExplainStep.title || "none"}</span>
          </div>

          <div class="controls transport-controls">
            <button type="button" data-action="prev">Prev</button>
            <button type="button" class="primary" data-action="play-toggle">${state.isPlaying ? "Pause" : "Play"}</button>
            <button type="button" data-action="next">Next</button>
            <button type="button" data-action="restart-scene">Restart Scene</button>
            <button type="button" data-action="reset-zoom">Reset Zoom</button>
            <button
              type="button"
              class="${state.debugHotspots ? "active-toggle" : ""}"
              data-action="toggle-debug-hotspots"
              aria-pressed="${state.debugHotspots ? "true" : "false"}"
            >Hotspot Debug ${state.debugHotspots ? "On" : "Off"}</button>
          </div>

          <form class="jump-time-control" data-jump-form>
            <label for="jump-time">Jump to Time</label>
            <div>
              <input
                id="jump-time"
                type="number"
                min="0"
                max="${getSceneDuration(trim)}"
                step="0.1"
                inputmode="decimal"
                placeholder="0.0"
                data-jump-time
              >
              <button type="submit">Jump</button>
            </div>
          </form>

          <div class="speed-control console-panel" aria-label="Playback speed">
            <h2>Playback Speed</h2>
            <div class="speed-buttons">
              ${playbackRates.map((rate) => `
                <button
                  type="button"
                  class="speed-button ${rate === currentPlaybackRate ? "active" : ""}"
                  data-action="set-playback-rate"
                  data-playback-rate="${rate}"
                >${formatPlaybackRate(rate)}x</button>
              `).join("")}
            </div>
          </div>

          <div class="explain-control console-panel">
            <h2>Explain Steps</h2>
            <div class="explain-step-buttons">
              ${explainSteps.map((step) => `
                <button
                  type="button"
                  class="explain-step-button ${step.id === currentExplainStep.id ? "active" : ""}"
                  data-action="sync-explain"
                  data-explain-step-id="${step.id}"
                >${step.title}</button>
              `).join("")}
            </div>
          </div>
        </div>

        <aside class="speaker-note">
          <h2>Scene 목록</h2>
          <div class="jump-grid">
            ${scenes.map((item, index) => `
              <button
                type="button"
                class="jump ${index === state.currentStep ? "active" : ""}"
                data-action="set-step"
                data-step="${index}"
              >
                <span>${padNumber(index + 1)}</span>
                <strong>${item.title}</strong>
              </button>
            `).join("")}
          </div>

          <h2>Speaker Script</h2>
          <p>${currentExplainStep.script || ""}</p>
          <h2>다음 장면</h2>
          <p>${next ? next.title : "마지막 장면입니다."}</p>
          <div class="open-links">
            <a href="index.html?view=demo" target="_blank">Open Demo View</a>
            <a href="index.html?view=explain" target="_blank">Open Explain View</a>
          </div>
        </aside>
      </section>
    `
  });
}

function formatVideoClock(seconds, fallback = 0) {
  const numericSeconds = Number.isFinite(Number(seconds)) ? Number(seconds) : fallback;
  const safeSeconds = Math.max(0, numericSeconds);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (safeSeconds % 60).toFixed(2).padStart(5, "0");
  return `${minutes}:${remainingSeconds}`;
}

function formatPlaybackRate(rate) {
  return Number(rate || 1).toFixed(2).replace(/\.?0+$/, "");
}

function getSceneElapsed(currentTime, trimStart) {
  return Math.max(0, Number(currentTime || trimStart || 0) - Number(trimStart || 0));
}

function getSceneDuration(trim) {
  const start = Number(trim?.start || 0);
  const end = Number(trim?.end || 0);
  return Math.max(0, end - start);
}

function padNumber(number) {
  return String(number).padStart(2, "0");
}

function getExplainStep(scene, explainStepId) {
  const steps = scene.explain?.steps || [];
  return steps.find((step) => step.id === explainStepId)
    || steps.find((step) => step.id === scene.explain?.defaultStepId)
    || steps[0]
    || {};
}
