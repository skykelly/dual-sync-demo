import { videos } from "../data/videos.js";
import { renderShell } from "./viewShell.js";

const firstVideo = normalizeVideo(videos[0]);

const authorState = {
  videoSrc: firstVideo.src || "assets/videos/demo.mp4",
  sceneTitle: "Authoring Draft Scene",
  sceneDescription: "Generated from Authoring View",
  trimStart: 0,
  trimEnd: 0,
  currentTime: 0,
  duration: 0,
  lastPoint: { x: 50, y: 50 },
  isAddingHotspot: false,
  copyStatus: "",
  explainSteps: [
    {
      id: "explain-default",
      title: "기본 설명",
      subtitle: "",
      bullets: [],
      keyMessage: "",
      script: ""
    }
  ],
  defaultStepId: "explain-default",
  hotspots: [],
  timeEvents: [],
  zoomEvents: []
};

let cleanupAuthorView = null;

export function renderAuthorView({ scenes, state }) {
  return renderShell({
    label: "Authoring",
    scenes,
    state,
    content: `
      <section class="author-layout">
        <div class="author-workspace">
          <p class="eyebrow">Authoring Mode</p>
          <h1>Scene JSON Builder</h1>

          <form class="author-video-control" data-author-load-form>
            <label for="author-video-select">Video Source</label>
            <div class="author-video-source">
              <select id="author-video-select" data-author-video-select>
                ${renderVideoOptions()}
              </select>
              <input id="author-video-src" type="text" value="${escapeAttribute(authorState.videoSrc)}" data-author-video-src>
              <button type="submit">Load</button>
            </div>
          </form>

          <div class="author-toolbar">
            <button type="button" data-author-action="play">Play</button>
            <button type="button" data-author-action="pause">Pause</button>
            <button type="button" data-author-action="set-trim-start">Set Start</button>
            <button type="button" data-author-action="set-trim-end">Set End</button>
            <button type="button" data-author-action="seek-trim-start">Go Start</button>
            <span>Current Time: <strong data-author-current-time>${formatSeconds(authorState.currentTime)}</strong></span>
            <span>Trim: <strong data-author-trim>${formatSeconds(authorState.trimStart)} - ${formatSeconds(getTrimEnd())}</strong></span>
            <span>Click X/Y: <strong data-author-point>${formatPercent(authorState.lastPoint.x)}, ${formatPercent(authorState.lastPoint.y)}</strong></span>
          </div>

          <div class="author-video-frame ${authorState.isAddingHotspot ? "is-armed" : ""}" data-author-video-frame>
            <video
              class="author-video"
              src="${escapeAttribute(authorState.videoSrc)}"
              preload="metadata"
              controls
              playsinline
              data-author-video
            ></video>
            <div class="author-click-marker" data-author-click-marker></div>
            <div class="author-hotspot-layer" data-author-hotspot-layer>
              ${renderAuthorHotspots()}
            </div>
          </div>
        </div>

        <aside class="author-panel">
          <section class="author-card">
            <h2>Scene</h2>
            <div class="author-grid">
              <label>Title <input type="text" value="${escapeAttribute(authorState.sceneTitle)}" data-scene-title></label>
              <label>Description <input type="text" value="${escapeAttribute(authorState.sceneDescription)}" data-scene-description></label>
              <label>Trim Start <input type="number" min="0" step="0.01" value="${round(authorState.trimStart)}" data-trim-start></label>
              <label>Trim End <input type="number" min="0" step="0.01" value="${round(getTrimEnd())}" data-trim-end></label>
            </div>
          </section>

          <section class="author-card">
            <h2>Explain Step</h2>
            <div class="author-grid">
              <label>Step ID <input type="text" value="explain-step" data-explain-id></label>
              <label>Title <input type="text" value="설명 제목" data-explain-title></label>
              <label>Subtitle <input type="text" value="" data-explain-subtitle></label>
              <label>Key Message <input type="text" value="" data-explain-key-message></label>
            </div>
            <label class="author-wide-label">Bullets <textarea data-explain-bullets placeholder="한 줄에 하나씩 입력"></textarea></label>
            <label class="author-wide-label">Script <textarea data-explain-script placeholder="발표자 스크립트"></textarea></label>
            <div class="author-section-actions">
              <button type="button" data-author-action="add-explain-step">Add / Update Step</button>
              <button type="button" data-author-action="set-default-step">Set Default</button>
            </div>
            <div class="author-step-list" data-author-step-list>
              ${renderExplainStepList()}
            </div>
          </section>

          <section class="author-card">
            <h2>Hotspot</h2>
            <div class="author-grid">
              <label>Label <input type="text" value="제품 추천 카드" data-hotspot-label></label>
              <label>Width % <input type="number" min="1" max="100" step="0.1" value="18" data-hotspot-width></label>
              <label>Height % <input type="number" min="1" max="100" step="0.1" value="12" data-hotspot-height></label>
              <label>Explain Step
                <select data-hotspot-explain-step-id>
                  ${renderExplainStepOptions()}
                </select>
              </label>
            </div>
            <button type="button" class="${authorState.isAddingHotspot ? "active-toggle" : ""}" data-author-action="arm-hotspot">
              ${authorState.isAddingHotspot ? "Click Video to Place" : "Add Hotspot"}
            </button>
          </section>

          <section class="author-card">
            <h2>Time Event</h2>
            <div class="author-grid">
              <label>Type
                <select data-time-event-type>
                  <option value="syncExplain">syncExplain</option>
                  <option value="pause">pause</option>
                  <option value="nextScene">nextScene</option>
                </select>
              </label>
              <label>Explain Step
                <select data-time-event-explain-step-id>
                  ${renderExplainStepOptions()}
                </select>
              </label>
            </div>
            <button type="button" data-author-action="add-time-event">Add Time Event</button>
          </section>

          <section class="author-card">
            <h2>Zoom Event</h2>
            <div class="author-grid">
              <label>Scale <input type="number" min="0.1" step="0.05" value="1.8" data-zoom-scale></label>
              <label>Duration <input type="number" min="0" step="0.1" value="0.5" data-zoom-duration></label>
              <label>Origin X % <input type="number" min="0" max="100" step="0.1" value="${round(authorState.lastPoint.x)}" data-zoom-x></label>
              <label>Origin Y % <input type="number" min="0" max="100" step="0.1" value="${round(authorState.lastPoint.y)}" data-zoom-y></label>
            </div>
            <div class="author-section-actions">
              <button type="button" data-author-action="add-zoom-event">Add Zoom Event</button>
              <button type="button" data-author-action="add-zoom-reset">Add Reset Zoom</button>
            </div>
          </section>

          <section class="author-card author-preview-card">
            <div class="author-preview-header">
              <h2>Generated Scene Entry</h2>
              <button type="button" data-author-action="copy-json">Copy JSON</button>
            </div>
            <textarea readonly data-author-json-preview></textarea>
            <p class="author-copy-status" data-author-copy-status>${escapeHtml(authorState.copyStatus)}</p>
          </section>
        </aside>
      </section>
    `
  });
}

export function mountAuthorView() {
  if (cleanupAuthorView) cleanupAuthorView();

  const controller = new AbortController();
  const { signal } = controller;
  const root = document.querySelector(".author-layout");
  const video = document.querySelector("[data-author-video]");
  const frame = document.querySelector("[data-author-video-frame]");

  cleanupAuthorView = () => controller.abort();

  if (!root || !video || !frame) return;

  syncFormFromState();
  updatePreview();
  updateMarker();

  root.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-author-load-form]");
    if (!form) return;

    event.preventDefault();
    loadVideo(video);
  }, { signal });

  root.addEventListener("change", (event) => {
    const videoSelect = event.target.closest("[data-author-video-select]");
    if (videoSelect) {
      const selected = normalizeVideo(videos[videoSelect.selectedIndex]);
      if (selected.src) {
        const input = document.querySelector("[data-author-video-src]");
        if (input) input.value = selected.src;
        authorState.videoSrc = selected.src;
        loadVideo(video);
      }
    }

    updateStateFromForm();
    updatePreview();
  }, { signal });

  root.addEventListener("input", () => {
    updateStateFromForm();
    updateTrimReadout();
    updatePreview();
  }, { signal });

  root.addEventListener("click", (event) => {
    const actionControl = event.target.closest("[data-author-action]");
    if (!actionControl) return;

    const action = actionControl.dataset.authorAction;
    if (action === "play") video.play().catch(() => {});
    if (action === "pause") video.pause();
    if (action === "set-trim-start") setTrimStart();
    if (action === "set-trim-end") setTrimEnd();
    if (action === "seek-trim-start") seekVideo(video, authorState.trimStart);
    if (action === "arm-hotspot") toggleHotspotPlacement();
    if (action === "add-explain-step") addExplainStep();
    if (action === "set-default-step") setDefaultExplainStep();
    if (action === "add-time-event") addTimeEvent();
    if (action === "add-zoom-event") addZoomEvent(false);
    if (action === "add-zoom-reset") addZoomEvent(true);
    if (action === "copy-json") copyJson();
  }, { signal });

  frame.addEventListener("click", (event) => {
    if (event.target.closest("[data-author-action]")) return;

    const point = getClickPercent(event, frame);
    authorState.lastPoint = point;
    syncZoomOriginInputs(point);
    updatePointReadout();
    updateMarker();

    if (authorState.isAddingHotspot) {
      addHotspot(point);
      authorState.isAddingHotspot = false;
      frame.classList.remove("is-armed");
      const button = document.querySelector('[data-author-action="arm-hotspot"]');
      if (button) {
        button.classList.remove("active-toggle");
        button.textContent = "Add Hotspot";
      }
    }
  }, { signal });

  video.addEventListener("timeupdate", () => {
    authorState.currentTime = video.currentTime || 0;
    updateCurrentTime();
  }, { signal });

  video.addEventListener("loadedmetadata", () => {
    authorState.duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!authorState.trimEnd || authorState.trimEnd < authorState.trimStart) {
      authorState.trimEnd = round(authorState.duration || authorState.currentTime || 0);
    }
    syncFormFromState();
    updateTrimReadout();
    updatePreview();
  }, { signal });
}

function loadVideo(video) {
  const input = document.querySelector("[data-author-video-src]");
  authorState.videoSrc = input?.value.trim() || "assets/videos/demo.mp4";
  video.src = authorState.videoSrc;
  video.load();
  updatePreview();
}

function setTrimStart() {
  authorState.trimStart = round(authorState.currentTime);
  if (authorState.trimEnd <= authorState.trimStart) {
    authorState.trimEnd = round(authorState.duration || authorState.trimStart + 5);
  }
  syncFormFromState();
  updatePreview();
}

function setTrimEnd() {
  authorState.trimEnd = round(authorState.currentTime);
  if (authorState.trimEnd <= authorState.trimStart) {
    authorState.trimEnd = round(authorState.trimStart + 5);
  }
  syncFormFromState();
  updatePreview();
}

function seekVideo(video, time) {
  const safeTime = Math.max(0, Number(time || 0));
  video.currentTime = safeTime;
  authorState.currentTime = safeTime;
  updateCurrentTime();
}

function toggleHotspotPlacement() {
  authorState.isAddingHotspot = !authorState.isAddingHotspot;
  const frame = document.querySelector("[data-author-video-frame]");
  const button = document.querySelector('[data-author-action="arm-hotspot"]');

  if (frame) frame.classList.toggle("is-armed", authorState.isAddingHotspot);
  if (button) {
    button.classList.toggle("active-toggle", authorState.isAddingHotspot);
    button.textContent = authorState.isAddingHotspot ? "Click Video to Place" : "Add Hotspot";
  }
}

function addExplainStep() {
  const id = slugify(getInputValue("[data-explain-id]", "explain-step"));
  const step = {
    id,
    title: getInputValue("[data-explain-title]", id),
    subtitle: getInputValue("[data-explain-subtitle]", ""),
    bullets: getTextareaLines("[data-explain-bullets]"),
    keyMessage: getInputValue("[data-explain-key-message]", ""),
    script: getTextareaValue("[data-explain-script]", "")
  };
  const existingIndex = authorState.explainSteps.findIndex((item) => item.id === id);

  if (existingIndex >= 0) authorState.explainSteps[existingIndex] = step;
  else authorState.explainSteps.push(step);

  if (!authorState.defaultStepId) authorState.defaultStepId = id;
  refreshExplainStepControls();
  updatePreview();
}

function setDefaultExplainStep() {
  const id = slugify(getInputValue("[data-explain-id]", authorState.defaultStepId));
  if (authorState.explainSteps.some((step) => step.id === id)) {
    authorState.defaultStepId = id;
    refreshExplainStepControls();
    updatePreview();
  }
}

function addHotspot(point) {
  const label = getInputValue("[data-hotspot-label]", "Hotspot");
  const explainStepId = getInputValue("[data-hotspot-explain-step-id]", authorState.defaultStepId);
  const end = Math.min(getTrimEnd(), Math.max(authorState.currentTime + 5, authorState.currentTime));
  const hotspot = {
    id: `hotspot-${slugify(label)}-${authorState.hotspots.length + 1}`,
    type: "hotspot",
    timeRange: {
      start: round(authorState.currentTime),
      end: round(end)
    },
    label,
    showLabel: true,
    x: round(point.x),
    y: round(point.y),
    width: getNumberInput("[data-hotspot-width]", 18),
    height: getNumberInput("[data-hotspot-height]", 12),
    action: {
      type: "syncExplain",
      explainStepId
    }
  };

  authorState.hotspots.push(hotspot);
  renderHotspotLayer();
  updatePreview();
}

function addTimeEvent() {
  const type = getInputValue("[data-time-event-type]", "syncExplain");
  const event = {
    id: `time-event-${type}-${authorState.timeEvents.length + 1}`,
    time: round(authorState.currentTime),
    type
  };

  if (type === "syncExplain") {
    event.explainStepId = getInputValue("[data-time-event-explain-step-id]", authorState.defaultStepId);
  }

  authorState.timeEvents.push(event);
  updatePreview();
}

function addZoomEvent(isReset) {
  authorState.zoomEvents.push({
    id: `zoom-event-${isReset ? "reset" : "focus"}-${authorState.zoomEvents.length + 1}`,
    time: round(authorState.currentTime),
    duration: getNumberInput("[data-zoom-duration]", 0.5),
    scale: isReset ? 1 : getNumberInput("[data-zoom-scale]", 1.8),
    x: isReset ? 50 : clampPercent(getNumberInput("[data-zoom-x]", authorState.lastPoint.x)),
    y: isReset ? 50 : clampPercent(getNumberInput("[data-zoom-y]", authorState.lastPoint.y))
  });
  updatePreview();
}

async function copyJson() {
  const preview = document.querySelector("[data-author-json-preview]");
  if (!preview) return;

  try {
    await navigator.clipboard.writeText(preview.value);
    authorState.copyStatus = "Copied to clipboard.";
  } catch {
    preview.select();
    document.execCommand("copy");
    authorState.copyStatus = "Copied to clipboard.";
  }

  const status = document.querySelector("[data-author-copy-status]");
  if (status) status.textContent = authorState.copyStatus;
}

function getSceneJson() {
  updateStateFromForm();

  return {
    id: `scene-${slugify(authorState.sceneTitle)}`,
    title: authorState.sceneTitle,
    description: authorState.sceneDescription,
    demo: {
      videoSrc: authorState.videoSrc,
      trim: {
        start: round(authorState.trimStart),
        end: round(getTrimEnd())
      },
      playbackRate: 1,
      timeEvents: authorState.timeEvents,
      interactions: authorState.hotspots,
      zoomEvents: authorState.zoomEvents
    },
    explain: {
      defaultStepId: authorState.defaultStepId,
      steps: authorState.explainSteps
    }
  };
}

function updateStateFromForm() {
  authorState.sceneTitle = getInputValue("[data-scene-title]", authorState.sceneTitle);
  authorState.sceneDescription = getInputValue("[data-scene-description]", authorState.sceneDescription);
  authorState.trimStart = getNumberInput("[data-trim-start]", authorState.trimStart);
  authorState.trimEnd = getNumberInput("[data-trim-end]", authorState.trimEnd);
}

function syncFormFromState() {
  setInputValue("[data-scene-title]", authorState.sceneTitle);
  setInputValue("[data-scene-description]", authorState.sceneDescription);
  setInputValue("[data-trim-start]", round(authorState.trimStart));
  setInputValue("[data-trim-end]", round(getTrimEnd()));
  updateTrimReadout();
}

function updatePreview() {
  const preview = document.querySelector("[data-author-json-preview]");
  if (preview) preview.value = JSON.stringify(getSceneJson(), null, 2);
}

function updateCurrentTime() {
  const readout = document.querySelector("[data-author-current-time]");
  if (readout) readout.textContent = formatSeconds(authorState.currentTime);
}

function updateTrimReadout() {
  const readout = document.querySelector("[data-author-trim]");
  if (readout) readout.textContent = `${formatSeconds(authorState.trimStart)} - ${formatSeconds(getTrimEnd())}`;
}

function updatePointReadout() {
  const readout = document.querySelector("[data-author-point]");
  if (readout) readout.textContent = `${formatPercent(authorState.lastPoint.x)}, ${formatPercent(authorState.lastPoint.y)}`;
}

function syncZoomOriginInputs(point) {
  const xInput = document.querySelector("[data-zoom-x]");
  const yInput = document.querySelector("[data-zoom-y]");
  if (xInput) xInput.value = round(point.x);
  if (yInput) yInput.value = round(point.y);
}

function updateMarker() {
  const marker = document.querySelector("[data-author-click-marker]");
  if (!marker) return;

  marker.style.left = `${authorState.lastPoint.x}%`;
  marker.style.top = `${authorState.lastPoint.y}%`;
}

function refreshExplainStepControls() {
  const list = document.querySelector("[data-author-step-list]");
  const hotspotSelect = document.querySelector("[data-hotspot-explain-step-id]");
  const eventSelect = document.querySelector("[data-time-event-explain-step-id]");
  if (list) list.innerHTML = renderExplainStepList();
  if (hotspotSelect) hotspotSelect.innerHTML = renderExplainStepOptions(hotspotSelect.value);
  if (eventSelect) eventSelect.innerHTML = renderExplainStepOptions(eventSelect.value);
}

function renderHotspotLayer() {
  const layer = document.querySelector("[data-author-hotspot-layer]");
  if (layer) layer.innerHTML = renderAuthorHotspots();
}

function renderVideoOptions() {
  return videos.map((video) => {
    const item = normalizeVideo(video);
    return `<option value="${escapeAttribute(item.src)}" ${item.src === authorState.videoSrc ? "selected" : ""}>${escapeHtml(item.label || item.src)}</option>`;
  }).join("");
}

function renderExplainStepOptions(selectedId = authorState.defaultStepId) {
  return authorState.explainSteps.map((step) => `
    <option value="${escapeAttribute(step.id)}" ${step.id === selectedId ? "selected" : ""}>${escapeHtml(step.title || step.id)}</option>
  `).join("");
}

function renderExplainStepList() {
  return authorState.explainSteps.map((step) => `
    <span class="${step.id === authorState.defaultStepId ? "is-default" : ""}">
      ${escapeHtml(step.id === authorState.defaultStepId ? `${step.title} (default)` : step.title)}
    </span>
  `).join("");
}

function renderAuthorHotspots() {
  return authorState.hotspots.map((hotspot) => `
    <span
      class="author-hotspot"
      style="left:${hotspot.x}%;top:${hotspot.y}%;width:${hotspot.width}%;height:${hotspot.height}%;"
      title="${escapeAttribute(hotspot.label)}"
    >${escapeHtml(hotspot.label)}</span>
  `).join("");
}

function getClickPercent(event, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: clampPercent(((event.clientX - rect.left) / rect.width) * 100),
    y: clampPercent(((event.clientY - rect.top) / rect.height) * 100)
  };
}

function getTrimEnd() {
  return authorState.trimEnd || authorState.duration || authorState.currentTime || authorState.trimStart;
}

function getInputValue(selector, fallback) {
  return document.querySelector(selector)?.value.trim() || fallback;
}

function getTextareaValue(selector, fallback) {
  return document.querySelector(selector)?.value.trim() || fallback;
}

function getTextareaLines(selector) {
  return getTextareaValue(selector, "").split("\n").map((line) => line.trim()).filter(Boolean);
}

function getNumberInput(selector, fallback) {
  const value = Number(document.querySelector(selector)?.value);
  return Number.isFinite(value) ? value : fallback;
}

function setInputValue(selector, value) {
  const input = document.querySelector(selector);
  if (input) input.value = value;
}

function normalizeVideo(video) {
  if (!video) return { src: "", label: "" };
  if (typeof video === "string") return { src: video, label: video.split("/").pop() || video };
  return {
    src: video.src || "",
    label: video.label || video.src || ""
  };
}

function slugify(value) {
  return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
}

function clampPercent(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 50;
  return Math.max(0, Math.min(100, numericValue));
}

function round(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

function formatSeconds(value) {
  return `${round(value).toFixed(2)}s`;
}

function formatPercent(value) {
  return `${round(value).toFixed(2)}%`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
