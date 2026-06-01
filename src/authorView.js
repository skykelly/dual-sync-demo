import { videos } from "../data/videos.js";
import { renderShell } from "./viewShell.js";

const firstVideo = normalizeVideo(videos[0]);
const toolConfig = [
  { id: "select", label: "Select", help: "타임라인 항목을 선택하고 드래그합니다." },
  { id: "hotspot", label: "Hotspot", help: "비디오 클릭 좌표와 타임라인 시간으로 인터랙션을 만듭니다." },
  { id: "zoom", label: "Zoom", help: "클릭 좌표를 중심으로 줌 이벤트를 만듭니다." },
  { id: "resetZoom", label: "Reset", help: "타임라인에 줌 리셋 이벤트를 만듭니다." },
  { id: "syncExplain", label: "Explain", help: "특정 시간에 Explain View를 동기화합니다." },
  { id: "pause", label: "Pause", help: "특정 시간에 Demo View를 일시정지합니다." },
  { id: "nextScene", label: "Next", help: "특정 시간에 다음 Scene으로 이동합니다." }
];

const authorState = {
  videoSrc: firstVideo.src || "assets/videos/demo.mp4",
  sceneTitle: "Authoring Draft Scene",
  sceneDescription: "Generated from Authoring View",
  trimStart: 0,
  trimEnd: 0,
  currentTime: 0,
  duration: 0,
  lastPoint: { x: 50, y: 50 },
  activeTool: "select",
  selectedItem: null,
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
          <h1>Timeline Scene Builder</h1>

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
            <button type="button" data-author-action="pause-video">Pause</button>
            <button type="button" data-author-action="set-trim-start">Set Start</button>
            <button type="button" data-author-action="set-trim-end">Set End</button>
            <button type="button" data-author-action="seek-trim-start">Go Start</button>
            <span>Current Time: <strong data-author-current-time>${formatSeconds(authorState.currentTime)}</strong></span>
            <span>Trim: <strong data-author-trim>${formatSeconds(authorState.trimStart)} - ${formatSeconds(getTrimEnd())}</strong></span>
            <span>Click X/Y: <strong data-author-point>${formatPercent(authorState.lastPoint.x)}, ${formatPercent(authorState.lastPoint.y)}</strong></span>
          </div>

          <div class="author-video-frame ${getVideoFrameClass()}" data-author-video-frame>
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

          <section class="author-toolbox" aria-label="Authoring tools">
            <div>
              <p class="eyebrow">Toolbox</p>
              <h2>CapCut-style Timeline Tools</h2>
            </div>
            <div class="author-tool-buttons">
              ${renderToolButtons()}
            </div>
            <p data-author-tool-help>${escapeHtml(getActiveTool().help)}</p>
          </section>

          <section class="author-timeline-card">
            <div class="author-timeline-header">
              <div>
                <p class="eyebrow">Timeline</p>
                <h2>Trim, interactions, zoom, and time events</h2>
              </div>
              <button type="button" data-author-action="add-active-tool">Add Tool at Playhead</button>
            </div>
            <div data-author-timeline>
              ${renderTimeline()}
            </div>
          </section>
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
            <h2>Tool Settings</h2>
            <p class="author-selected-summary" data-author-selected-summary>${escapeHtml(getSelectionSummary())}</p>
            <div class="author-grid">
              <label>Time <input type="number" min="0" step="0.01" value="${round(authorState.currentTime)}" data-tool-time></label>
              <label>Type
                <select data-time-event-type>
                  ${renderTimeTypeOptions()}
                </select>
              </label>
              <label>Label <input type="text" value="제품 추천 카드" data-hotspot-label></label>
              <label>Explain Step
                <select data-hotspot-explain-step-id data-time-event-explain-step-id>
                  ${renderExplainStepOptions()}
                </select>
              </label>
              <label>Width % <input type="number" min="1" max="100" step="0.1" value="18" data-hotspot-width></label>
              <label>Height % <input type="number" min="1" max="100" step="0.1" value="12" data-hotspot-height></label>
              <label>Origin X % <input type="number" min="0" max="100" step="0.1" value="${round(authorState.lastPoint.x)}" data-zoom-x></label>
              <label>Origin Y % <input type="number" min="0" max="100" step="0.1" value="${round(authorState.lastPoint.y)}" data-zoom-y></label>
              <label>Scale <input type="number" min="0.1" step="0.05" value="1.8" data-zoom-scale></label>
              <label>Duration <input type="number" min="0" step="0.1" value="0.5" data-zoom-duration></label>
            </div>
            <div class="author-section-actions">
              <button type="button" data-author-action="use-current-time">Use Playhead</button>
              <button type="button" data-author-action="add-active-tool">Add Tool</button>
              <button type="button" data-author-action="update-selected">Update Selected</button>
              <button type="button" data-author-action="delete-selected">Delete Selected</button>
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
  syncToolFormFromSelection();
  updatePreview();
  updateMarker();
  updateTimeline();

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
    updateTrimReadout();
    updateTimeline();
    updatePreview();
  }, { signal });

  root.addEventListener("input", (event) => {
    updateStateFromForm();
    updateTrimReadout();

    if (event.target.closest("[data-tool-time], [data-hotspot-label], [data-hotspot-width], [data-hotspot-height], [data-hotspot-explain-step-id], [data-time-event-type], [data-zoom-x], [data-zoom-y], [data-zoom-scale], [data-zoom-duration]")) {
      updateSelectedFromToolForm(false);
    }

    updateTimeline();
    renderHotspotLayer();
    updatePreview();
  }, { signal });

  root.addEventListener("click", (event) => {
    const tool = event.target.closest("[data-author-tool]");
    if (tool) {
      setActiveTool(tool.dataset.authorTool);
      return;
    }

    const marker = event.target.closest("[data-timeline-marker]");
    if (marker) {
      selectTimelineItem(marker.dataset.itemType, marker.dataset.itemId);
      return;
    }

    const row = event.target.closest("[data-timeline-row]");
    if (row && !event.target.closest("[data-trim-handle]")) {
      const time = getTimeFromTimelineEvent(event);
      seekVideo(video, time);
      setToolTime(time);
      if (authorState.activeTool !== "select") addActiveTool(time);
      updateTimeline();
      updatePreview();
      return;
    }

    const actionControl = event.target.closest("[data-author-action]");
    if (!actionControl) return;

    const action = actionControl.dataset.authorAction;
    if (action === "play") video.play().catch(() => {});
    if (action === "pause-video") video.pause();
    if (action === "set-trim-start") setTrimStart();
    if (action === "set-trim-end") setTrimEnd();
    if (action === "seek-trim-start") seekVideo(video, authorState.trimStart);
    if (action === "add-explain-step") addExplainStep();
    if (action === "set-default-step") setDefaultExplainStep();
    if (action === "use-current-time") setToolTime(authorState.currentTime);
    if (action === "add-active-tool") addActiveTool(getNumberInput("[data-tool-time]", authorState.currentTime));
    if (action === "update-selected") updateSelectedFromToolForm(true);
    if (action === "delete-selected") deleteSelectedItem();
    if (action === "copy-json") copyJson();
  }, { signal });

  root.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest("[data-trim-handle]");
    const marker = event.target.closest("[data-timeline-marker]");
    if (!handle && !marker) return;

    event.preventDefault();
    const drag = handle
      ? { kind: "trim", edge: handle.dataset.trimHandle }
      : { kind: "marker", type: marker.dataset.itemType, id: marker.dataset.itemId };
    const dragRect = (marker?.closest(".author-timeline-row")?.querySelector(".author-track") || handle?.closest(".author-ruler"))?.getBoundingClientRect();

    if (drag.kind === "marker") selectTimelineItem(drag.type, drag.id);

    const onMove = (moveEvent) => {
      const time = dragRect ? getTimeFromClientX(moveEvent.clientX, dragRect) : getTimeFromTimelineEvent(moveEvent);
      if (drag.kind === "trim") updateTrimFromDrag(drag.edge, time);
      else updateItemTime(drag.type, drag.id, time);
      seekVideo(video, time);
      setToolTime(time);
      syncFormFromState();
      syncToolFormFromSelection();
      updateTimeline();
      renderHotspotLayer();
      updatePreview();
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, { signal });

  frame.addEventListener("click", (event) => {
    if (event.target.closest("[data-author-action]")) return;

    const point = getClickPercent(event, frame);
    authorState.lastPoint = point;
    syncPointInputs(point);
    updatePointReadout();
    updateMarker();

    if (authorState.activeTool === "hotspot") addHotspot(point, getNumberInput("[data-tool-time]", authorState.currentTime));
    if (authorState.activeTool === "zoom") addZoomEvent(false, getNumberInput("[data-tool-time]", authorState.currentTime));

    updateTimeline();
    renderHotspotLayer();
    updatePreview();
  }, { signal });

  video.addEventListener("timeupdate", () => {
    authorState.currentTime = video.currentTime || 0;
    updateCurrentTime();
    setToolTime(authorState.currentTime, false);
    updateTimeline();
  }, { signal });

  video.addEventListener("loadedmetadata", () => {
    authorState.duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (!authorState.trimEnd || authorState.trimEnd < authorState.trimStart) {
      authorState.trimEnd = round(authorState.duration || authorState.currentTime || 0);
    }
    syncFormFromState();
    updateTrimReadout();
    updateTimeline();
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
  updateTimeline();
  updatePreview();
}

function setTrimEnd() {
  authorState.trimEnd = round(authorState.currentTime);
  if (authorState.trimEnd <= authorState.trimStart) {
    authorState.trimEnd = round(authorState.trimStart + 5);
  }
  syncFormFromState();
  updateTimeline();
  updatePreview();
}

function seekVideo(video, time) {
  const safeTime = clampTime(time);
  video.currentTime = safeTime;
  authorState.currentTime = safeTime;
  updateCurrentTime();
}

function setActiveTool(toolId) {
  if (!toolConfig.some((tool) => tool.id === toolId)) return;
  authorState.activeTool = toolId;
  authorState.selectedItem = null;
  syncToolFormFromSelection();
  updateToolbox();
  updateTimeline();
}

function addActiveTool(time = authorState.currentTime) {
  const safeTime = clampTime(time);
  if (authorState.activeTool === "hotspot") addHotspot(authorState.lastPoint, safeTime);
  if (authorState.activeTool === "zoom") addZoomEvent(false, safeTime);
  if (authorState.activeTool === "resetZoom") addZoomEvent(true, safeTime);
  if (["syncExplain", "pause", "nextScene"].includes(authorState.activeTool)) addTimeEvent(authorState.activeTool, safeTime);
  setToolTime(safeTime);
  updateTimeline();
  renderHotspotLayer();
  updatePreview();
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

function addHotspot(point, time = authorState.currentTime) {
  const label = getInputValue("[data-hotspot-label]", "Hotspot");
  const explainStepId = getInputValue("[data-hotspot-explain-step-id]", authorState.defaultStepId);
  const start = clampTime(time);
  const hotspot = {
    id: `hotspot-${slugify(label)}-${authorState.hotspots.length + 1}`,
    type: "hotspot",
    timeRange: {
      start: round(start),
      end: round(Math.min(getTimelineDuration(), Math.max(start + 5, start)))
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
  selectTimelineItem("hotspot", hotspot.id);
}

function addTimeEvent(type = getInputValue("[data-time-event-type]", "syncExplain"), time = authorState.currentTime) {
  const event = {
    id: `time-event-${type}-${authorState.timeEvents.length + 1}`,
    time: round(clampTime(time)),
    type
  };

  if (type === "syncExplain") {
    event.explainStepId = getInputValue("[data-time-event-explain-step-id]", authorState.defaultStepId);
  }

  authorState.timeEvents.push(event);
  selectTimelineItem("time", event.id);
}

function addZoomEvent(isReset, time = authorState.currentTime) {
  const event = {
    id: `zoom-event-${isReset ? "reset" : "focus"}-${authorState.zoomEvents.length + 1}`,
    time: round(clampTime(time)),
    duration: getNumberInput("[data-zoom-duration]", 0.5),
    scale: isReset ? 1 : getNumberInput("[data-zoom-scale]", 1.8),
    x: isReset ? 50 : clampPercent(getNumberInput("[data-zoom-x]", authorState.lastPoint.x)),
    y: isReset ? 50 : clampPercent(getNumberInput("[data-zoom-y]", authorState.lastPoint.y))
  };

  authorState.zoomEvents.push(event);
  selectTimelineItem("zoom", event.id);
}

function selectTimelineItem(type, id) {
  authorState.selectedItem = { type, id };
  authorState.activeTool = "select";
  syncToolFormFromSelection();
  updateToolbox();
  updateTimeline();
}

function getSelectedItem() {
  if (!authorState.selectedItem) return null;
  const { type, id } = authorState.selectedItem;
  if (type === "hotspot") return authorState.hotspots.find((item) => item.id === id) || null;
  if (type === "time") return authorState.timeEvents.find((item) => item.id === id) || null;
  if (type === "zoom") return authorState.zoomEvents.find((item) => item.id === id) || null;
  return null;
}

function updateSelectedFromToolForm(forceSelection) {
  const item = getSelectedItem();
  if (!item) return;

  const time = clampTime(getNumberInput("[data-tool-time]", getItemTime(item)));
  if (authorState.selectedItem.type === "hotspot") {
    item.timeRange.start = round(time);
    item.timeRange.end = round(Math.max(time, item.timeRange.end || time + 5));
    item.label = getInputValue("[data-hotspot-label]", item.label);
    item.width = getNumberInput("[data-hotspot-width]", item.width);
    item.height = getNumberInput("[data-hotspot-height]", item.height);
    item.x = clampPercent(getNumberInput("[data-zoom-x]", item.x));
    item.y = clampPercent(getNumberInput("[data-zoom-y]", item.y));
    item.action.explainStepId = getInputValue("[data-hotspot-explain-step-id]", item.action.explainStepId);
    authorState.lastPoint = { x: item.x, y: item.y };
  }

  if (authorState.selectedItem.type === "time") {
    item.time = round(time);
    item.type = getInputValue("[data-time-event-type]", item.type);
    if (item.type === "syncExplain") item.explainStepId = getInputValue("[data-time-event-explain-step-id]", item.explainStepId || authorState.defaultStepId);
    else delete item.explainStepId;
  }

  if (authorState.selectedItem.type === "zoom") {
    item.time = round(time);
    item.duration = getNumberInput("[data-zoom-duration]", item.duration);
    item.scale = getNumberInput("[data-zoom-scale]", item.scale);
    item.x = clampPercent(getNumberInput("[data-zoom-x]", item.x));
    item.y = clampPercent(getNumberInput("[data-zoom-y]", item.y));
    authorState.lastPoint = { x: item.x, y: item.y };
  }

  if (forceSelection) syncToolFormFromSelection();
  updateMarker();
  updateTimeline();
  renderHotspotLayer();
  updatePreview();
}

function updateItemTime(type, id, time) {
  const safeTime = round(clampTime(time));
  if (type === "hotspot") {
    const item = authorState.hotspots.find((hotspot) => hotspot.id === id);
    if (item) {
      const length = Math.max(0, (item.timeRange.end || safeTime) - (item.timeRange.start || safeTime));
      item.timeRange.start = safeTime;
      item.timeRange.end = round(Math.min(getTimelineDuration(), safeTime + length));
    }
  }
  if (type === "time") {
    const item = authorState.timeEvents.find((event) => event.id === id);
    if (item) item.time = safeTime;
  }
  if (type === "zoom") {
    const item = authorState.zoomEvents.find((event) => event.id === id);
    if (item) item.time = safeTime;
  }
}

function updateTrimFromDrag(edge, time) {
  const safeTime = round(clampTime(time));
  if (edge === "start") authorState.trimStart = Math.min(safeTime, Math.max(0, getTrimEnd() - 0.1));
  if (edge === "end") authorState.trimEnd = Math.max(safeTime, authorState.trimStart + 0.1);
}

function deleteSelectedItem() {
  if (!authorState.selectedItem) return;
  const { type, id } = authorState.selectedItem;
  if (type === "hotspot") authorState.hotspots = authorState.hotspots.filter((item) => item.id !== id);
  if (type === "time") authorState.timeEvents = authorState.timeEvents.filter((item) => item.id !== id);
  if (type === "zoom") authorState.zoomEvents = authorState.zoomEvents.filter((item) => item.id !== id);
  authorState.selectedItem = null;
  syncToolFormFromSelection();
  updateToolbox();
  updateTimeline();
  renderHotspotLayer();
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
  authorState.trimStart = clampTime(getNumberInput("[data-trim-start]", authorState.trimStart));
  authorState.trimEnd = Math.max(authorState.trimStart, clampTime(getNumberInput("[data-trim-end]", authorState.trimEnd)));
}

function syncFormFromState() {
  setInputValue("[data-scene-title]", authorState.sceneTitle);
  setInputValue("[data-scene-description]", authorState.sceneDescription);
  setInputValue("[data-trim-start]", round(authorState.trimStart));
  setInputValue("[data-trim-end]", round(getTrimEnd()));
  updateTrimReadout();
}

function syncToolFormFromSelection() {
  const item = getSelectedItem();
  if (!item) {
    setToolTime(authorState.currentTime, false);
    updateSelectionSummary();
    return;
  }

  setToolTime(getItemTime(item), false);
  if (authorState.selectedItem.type === "hotspot") {
    setInputValue("[data-hotspot-label]", item.label);
    setInputValue("[data-hotspot-width]", item.width);
    setInputValue("[data-hotspot-height]", item.height);
    setSelectValue("[data-hotspot-explain-step-id]", item.action?.explainStepId || authorState.defaultStepId);
    setInputValue("[data-zoom-x]", item.x);
    setInputValue("[data-zoom-y]", item.y);
    authorState.lastPoint = { x: item.x, y: item.y };
  }
  if (authorState.selectedItem.type === "time") {
    setSelectValue("[data-time-event-type]", item.type);
    setSelectValue("[data-time-event-explain-step-id]", item.explainStepId || authorState.defaultStepId);
  }
  if (authorState.selectedItem.type === "zoom") {
    setInputValue("[data-zoom-scale]", item.scale);
    setInputValue("[data-zoom-duration]", item.duration);
    setInputValue("[data-zoom-x]", item.x);
    setInputValue("[data-zoom-y]", item.y);
    authorState.lastPoint = { x: item.x, y: item.y };
  }
  updateMarker();
  updateSelectionSummary();
}

function setToolTime(time, overwriteFocusedInput = true) {
  const input = document.querySelector("[data-tool-time]");
  if (!input) return;
  if (!overwriteFocusedInput && document.activeElement === input) return;
  input.value = round(time);
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

function syncPointInputs(point) {
  setInputValue("[data-zoom-x]", round(point.x));
  setInputValue("[data-zoom-y]", round(point.y));
}

function updateMarker() {
  const marker = document.querySelector("[data-author-click-marker]");
  if (!marker) return;

  marker.style.left = `${authorState.lastPoint.x}%`;
  marker.style.top = `${authorState.lastPoint.y}%`;
}

function updateToolbox() {
  const toolbox = document.querySelector(".author-tool-buttons");
  const help = document.querySelector("[data-author-tool-help]");
  const frame = document.querySelector("[data-author-video-frame]");
  if (toolbox) toolbox.innerHTML = renderToolButtons();
  if (help) help.textContent = getActiveTool().help;
  if (frame) frame.className = `author-video-frame ${getVideoFrameClass()}`.trim();
}

function updateSelectionSummary() {
  const summary = document.querySelector("[data-author-selected-summary]");
  if (summary) summary.textContent = getSelectionSummary();
}

function refreshExplainStepControls() {
  const list = document.querySelector("[data-author-step-list]");
  const selects = document.querySelectorAll("[data-hotspot-explain-step-id], [data-time-event-explain-step-id]");
  if (list) list.innerHTML = renderExplainStepList();
  selects.forEach((select) => {
    const previousValue = select.value;
    select.innerHTML = renderExplainStepOptions(previousValue);
  });
}

function renderHotspotLayer() {
  const layer = document.querySelector("[data-author-hotspot-layer]");
  if (layer) layer.innerHTML = renderAuthorHotspots();
}

function updateTimeline() {
  const timeline = document.querySelector("[data-author-timeline]");
  if (timeline) timeline.innerHTML = renderTimeline();
  updateCurrentTime();
  updateTrimReadout();
  updateSelectionSummary();
}

function renderVideoOptions() {
  return videos.map((video) => {
    const item = normalizeVideo(video);
    return `<option value="${escapeAttribute(item.src)}" ${item.src === authorState.videoSrc ? "selected" : ""}>${escapeHtml(item.label || item.src)}</option>`;
  }).join("");
}

function renderToolButtons() {
  return toolConfig.map((tool) => `
    <button type="button" class="author-tool-button ${authorState.activeTool === tool.id ? "active" : ""}" data-author-tool="${escapeAttribute(tool.id)}">
      <strong>${escapeHtml(tool.label)}</strong>
      <span>${escapeHtml(tool.help)}</span>
    </button>
  `).join("");
}

function renderTimeTypeOptions(selectedType = "syncExplain") {
  return ["syncExplain", "pause", "nextScene"].map((type) => `
    <option value="${type}" ${type === selectedType ? "selected" : ""}>${type}</option>
  `).join("");
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
      class="author-hotspot ${isSelected("hotspot", hotspot.id) ? "is-selected" : ""}"
      style="left:${hotspot.x}%;top:${hotspot.y}%;width:${hotspot.width}%;height:${hotspot.height}%;"
      title="${escapeAttribute(hotspot.label)}"
    >${escapeHtml(hotspot.label)}</span>
  `).join("");
}

function renderTimeline() {
  const duration = getTimelineDuration();
  const trimStart = toPercent(authorState.trimStart, duration);
  const trimEnd = toPercent(getTrimEnd(), duration);
  const playhead = toPercent(authorState.currentTime, duration);

  return `
    <div class="author-timeline" data-timeline-duration="${duration}">
      <div class="author-ruler" data-timeline-row="ruler">
        ${renderRulerTicks(duration)}
        <span class="author-trim-range" style="left:${trimStart}%;width:${Math.max(0, trimEnd - trimStart)}%;"></span>
        <button type="button" class="author-trim-handle start" style="left:${trimStart}%;" data-trim-handle="start" aria-label="Drag trim start"></button>
        <button type="button" class="author-trim-handle end" style="left:${trimEnd}%;" data-trim-handle="end" aria-label="Drag trim end"></button>
        <span class="author-playhead" style="left:${playhead}%;"></span>
      </div>
      ${renderTimelineRow("hotspot", "Interactions", authorState.hotspots)}
      ${renderTimelineRow("zoom", "Zoom", authorState.zoomEvents)}
      ${renderTimelineRow("time", "Time Events", authorState.timeEvents)}
    </div>
  `;
}

function renderRulerTicks(duration) {
  const tickCount = Math.min(12, Math.max(4, Math.ceil(duration / 5)));
  return Array.from({ length: tickCount + 1 }, (_, index) => {
    const time = (duration / tickCount) * index;
    return `
      <span class="author-ruler-tick" style="left:${toPercent(time, duration)}%;">
        <i></i><b>${formatSeconds(time)}</b>
      </span>
    `;
  }).join("");
}

function renderTimelineRow(type, label, items) {
  return `
    <div class="author-timeline-row" data-timeline-row="${type}">
      <span class="author-track-label">${escapeHtml(label)}</span>
      <div class="author-track">
        ${items.map((item) => renderTimelineMarker(type, item)).join("")}
      </div>
    </div>
  `;
}

function renderTimelineMarker(type, item) {
  const duration = getTimelineDuration();
  const time = getItemTime(item);
  const start = toPercent(time, duration);
  const width = type === "hotspot" ? Math.max(2, toPercent(item.timeRange.end, duration) - start) : 2;
  const text = type === "hotspot" ? item.label : type === "zoom" ? `scale ${item.scale}` : item.type;
  return `
    <button
      type="button"
      class="author-timeline-marker ${type} ${isSelected(type, item.id) ? "is-selected" : ""}"
      style="left:${start}%;width:${width}%;"
      data-timeline-marker="${escapeAttribute(item.id)}"
      data-item-id="${escapeAttribute(item.id)}"
      data-item-type="${escapeAttribute(type)}"
      title="${escapeAttribute(`${formatSeconds(time)} ${text}`)}"
    >${escapeHtml(text)}</button>
  `;
}

function getClickPercent(event, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: clampPercent(((event.clientX - rect.left) / rect.width) * 100),
    y: clampPercent(((event.clientY - rect.top) / rect.height) * 100)
  };
}

function getTimeFromTimelineEvent(event) {
  const row = event.target.closest?.("[data-timeline-row]");
  const element = row?.querySelector?.(".author-track") || row || document.querySelector("[data-author-timeline] .author-timeline");
  if (!element) return authorState.currentTime;
  return getTimeFromClientX(event.clientX, element.getBoundingClientRect());
}

function getTimeFromClientX(clientX, rect) {
  const percent = clampPercent(((clientX - rect.left) / rect.width) * 100);
  return round((percent / 100) * getTimelineDuration());
}

function getItemTime(item) {
  return item.timeRange ? item.timeRange.start : item.time;
}

function getTimelineDuration() {
  return Math.max(1, authorState.duration || authorState.trimEnd || authorState.currentTime || 30);
}

function getTrimEnd() {
  return authorState.trimEnd || authorState.duration || authorState.currentTime || authorState.trimStart;
}

function getActiveTool() {
  return toolConfig.find((tool) => tool.id === authorState.activeTool) || toolConfig[0];
}

function getVideoFrameClass() {
  if (["hotspot", "zoom"].includes(authorState.activeTool)) return "is-armed";
  return "";
}

function getSelectionSummary() {
  const item = getSelectedItem();
  if (!item) return `Active tool: ${getActiveTool().label}. 타임라인이나 비디오를 클릭해 새 항목을 만드세요.`;
  return `Selected ${authorState.selectedItem.type}: ${item.id}`;
}

function isSelected(type, id) {
  return authorState.selectedItem?.type === type && authorState.selectedItem?.id === id;
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

function setSelectValue(selector, value) {
  const select = document.querySelector(selector);
  if (select) select.value = value;
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

function clampTime(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 0;
  return Math.max(0, Math.min(getTimelineDuration(), numericValue));
}

function clampPercent(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return 50;
  return Math.max(0, Math.min(100, numericValue));
}

function toPercent(time, duration) {
  return clampPercent((Number(time || 0) / Math.max(1, duration)) * 100);
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
