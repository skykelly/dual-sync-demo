import { renderShell } from "./viewShell.js";

const authorState = {
  videoSrc: "assets/videos/demo.mp4",
  currentTime: 0,
  duration: 0,
  lastPoint: { x: 50, y: 50 },
  isAddingHotspot: false,
  copyStatus: "",
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
            <label for="author-video-src">Video Path</label>
            <div>
              <input id="author-video-src" type="text" value="${escapeAttribute(authorState.videoSrc)}" data-author-video-src>
              <button type="submit">Load</button>
            </div>
          </form>

          <div class="author-toolbar">
            <button type="button" data-author-action="play">Play</button>
            <button type="button" data-author-action="pause">Pause</button>
            <span>Current Time: <strong data-author-current-time>${formatSeconds(authorState.currentTime)}</strong></span>
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
            <h2>Hotspot</h2>
            <div class="author-grid">
              <label>Label <input type="text" value="제품 추천 카드" data-hotspot-label></label>
              <label>Width % <input type="number" min="1" max="100" step="0.1" value="18" data-hotspot-width></label>
              <label>Height % <input type="number" min="1" max="100" step="0.1" value="12" data-hotspot-height></label>
              <label>Explain Step ID <input type="text" value="explain-product-card" data-hotspot-explain-step-id></label>
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
                </select>
              </label>
              <label>Explain Step ID <input type="text" value="explain-input" data-time-event-explain-step-id></label>
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
            <button type="button" data-author-action="add-zoom-event">Add Zoom Event</button>
          </section>

          <section class="author-card author-preview-card">
            <div class="author-preview-header">
              <h2>Generated JSON Preview</h2>
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

  updatePreview();
  updateMarker();

  root.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-author-load-form]");
    if (!form) return;

    event.preventDefault();
    const input = form.querySelector("[data-author-video-src]");
    authorState.videoSrc = input.value.trim() || "assets/videos/demo.mp4";
    video.src = authorState.videoSrc;
    video.load();
    updatePreview();
  }, { signal });

  root.addEventListener("click", (event) => {
    const actionControl = event.target.closest("[data-author-action]");
    if (!actionControl) return;

    const action = actionControl.dataset.authorAction;
    if (action === "play") video.play().catch(() => {});
    if (action === "pause") video.pause();
    if (action === "arm-hotspot") toggleHotspotPlacement();
    if (action === "add-time-event") addTimeEvent();
    if (action === "add-zoom-event") addZoomEvent();
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
    updatePreview();
  }, { signal });

  video.addEventListener("loadedmetadata", () => {
    authorState.duration = Number.isFinite(video.duration) ? video.duration : 0;
    updatePreview();
  }, { signal });
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

function addHotspot(point) {
  const label = getInputValue("[data-hotspot-label]", "Hotspot");
  const explainStepId = getInputValue("[data-hotspot-explain-step-id]", "explain-step");
  const hotspot = {
    id: `hotspot-${slugify(label)}-${authorState.hotspots.length + 1}`,
    type: "hotspot",
    timeRange: {
      start: round(authorState.currentTime),
      end: round(authorState.duration || authorState.currentTime + 5)
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
    event.explainStepId = getInputValue("[data-time-event-explain-step-id]", "explain-step");
  }

  authorState.timeEvents.push(event);
  updatePreview();
}

function addZoomEvent() {
  authorState.zoomEvents.push({
    id: `zoom-event-${authorState.zoomEvents.length + 1}`,
    time: round(authorState.currentTime),
    duration: getNumberInput("[data-zoom-duration]", 0.5),
    scale: getNumberInput("[data-zoom-scale]", 1.8),
    x: clampPercent(getNumberInput("[data-zoom-x]", authorState.lastPoint.x)),
    y: clampPercent(getNumberInput("[data-zoom-y]", authorState.lastPoint.y))
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
  const explainStepIds = Array.from(new Set([
    ...authorState.timeEvents.map((event) => event.explainStepId).filter(Boolean),
    ...authorState.hotspots.map((hotspot) => hotspot.action?.explainStepId).filter(Boolean)
  ]));
  const defaultStepId = explainStepIds[0] || "explain-default";

  return {
    id: "scene-author-draft",
    title: "Authoring Draft Scene",
    description: "Generated from Authoring View",
    demo: {
      videoSrc: authorState.videoSrc,
      trim: {
        start: 0,
        end: round(authorState.duration || authorState.currentTime || 0)
      },
      playbackRate: 1,
      timeEvents: authorState.timeEvents,
      interactions: authorState.hotspots,
      zoomEvents: authorState.zoomEvents
    },
    explain: {
      defaultStepId,
      steps: explainStepIds.map((id) => ({
        id,
        title: id,
        subtitle: "",
        bullets: [],
        keyMessage: "",
        script: ""
      }))
    }
  };
}

function updatePreview() {
  const preview = document.querySelector("[data-author-json-preview]");
  if (preview) preview.value = JSON.stringify(getSceneJson(), null, 2);
}

function updateCurrentTime() {
  const readout = document.querySelector("[data-author-current-time]");
  if (readout) readout.textContent = formatSeconds(authorState.currentTime);
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

function renderHotspotLayer() {
  const layer = document.querySelector("[data-author-hotspot-layer]");
  if (layer) layer.innerHTML = renderAuthorHotspots();
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

function getInputValue(selector, fallback) {
  return document.querySelector(selector)?.value.trim() || fallback;
}

function getNumberInput(selector, fallback) {
  const value = Number(document.querySelector(selector)?.value);
  return Number.isFinite(value) ? value : fallback;
}

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
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
