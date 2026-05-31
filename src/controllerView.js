import { renderShell } from "./viewShell.js";

export function renderControllerView({ scene, scenes, state }) {
  const next = scenes[state.currentStep + 1];
  const currentExplainStep = getExplainStep(scene, state.currentExplainStepId);
  const explainSteps = scene.explain?.steps || [];
  const videoStatus = state.videoStatus || {};
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
          <h1>${scene.title}</h1>
          <p class="controller-description">${scene.description}</p>
          <div class="controls">
            <button type="button" data-action="prev">← Prev</button>
            <button type="button" class="primary" data-action="next">Next →</button>
            <button type="button" data-action="play-toggle">${state.isPlaying ? "Pause" : "Play"}</button>
            <button type="button" data-action="reset">Reset Timer</button>
            <button type="button" data-action="reset-zoom">Reset Zoom</button>
            <button
              type="button"
              class="${state.debugHotspots ? "active-toggle" : ""}"
              data-action="toggle-debug-hotspots"
              aria-pressed="${state.debugHotspots ? "true" : "false"}"
            >Hotspots ${state.debugHotspots ? "Debug On" : "Debug Off"}</button>
          </div>
          <div class="video-status" aria-label="Demo video status">
            <span>Video ${formatSeconds(videoStatus.currentTime || scene.demo.trim.start)} / ${formatSeconds(videoStatus.duration || scene.demo.trim.end)}</span>
            <span>${videoStatus.isPlaying ? "Playing" : "Paused"}</span>
            <span>Speed ${formatPlaybackRate(currentPlaybackRate)}x</span>
            <span>Explain ${currentExplainStep.id || "none"}</span>
          </div>
          <div class="speed-control" aria-label="Playback speed">
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
          <div class="explain-control">
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
          <div class="jump-grid">
            ${scenes.map((item, index) => `
              <button
                type="button"
                class="jump ${index === state.currentStep ? "active" : ""}"
                data-action="set-step"
                data-step="${index}"
              >${index + 1}. ${item.title}</button>
            `).join("")}
          </div>
        </div>
        <aside class="speaker-note">
          <h2>현재 스크립트</h2>
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

function formatSeconds(seconds) {
  return `${Number(seconds || 0).toFixed(1).replace(".0", "")}s`;
}

function formatPlaybackRate(rate) {
  return Number(rate || 1).toFixed(2).replace(/\.?0+$/, "");
}

function getExplainStep(scene, explainStepId) {
  const steps = scene.explain?.steps || [];
  return steps.find((step) => step.id === explainStepId)
    || steps.find((step) => step.id === scene.explain?.defaultStepId)
    || steps[0]
    || {};
}
