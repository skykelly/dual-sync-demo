let activeEngine = null;

export function mountVideoTimeline({
  scene,
  sceneIndex,
  isPlaying,
  broadcast,
  onPause,
  onNextScene,
  onSyncExplain,
  onPlaybackStateChange
}) {
  resetVideoForScene();

  const video = document.querySelector("[data-demo-video]");
  if (!video || !scene?.demo) return;

  const frame = video.closest(".video-frame");
  const demo = scene.demo;
  const trim = normalizeTrim(demo.trim);
  const executedEventIds = new Set();
  const hotspotElements = Array.from(document.querySelectorAll("[data-hotspot-id]"));
  const listeners = [];
  let timeUpdateTimer = null;
  let didInitialSeek = false;
  let hasReachedTrimEnd = false;

  video.playbackRate = Number.isFinite(demo.playbackRate) ? demo.playbackRate : 1;

  function addListener(target, eventName, handler) {
    target.addEventListener(eventName, handler);
    listeners.push(() => target.removeEventListener(eventName, handler));
  }

  function seekToTrimStart() {
    if (didInitialSeek) return;
    didInitialSeek = true;
    if (Number.isFinite(trim.start)) {
      video.currentTime = trim.start;
    }
  }

  function playVideo() {
    seekToTrimStart();
    video.play().catch(() => {
      onPlaybackStateChange(false);
      broadcastVideoTime();
    });
  }

  function pauseVideo() {
    video.pause();
  }

  function broadcastVideoTime() {
    broadcast("VIDEO_TIME_UPDATE", {
      sceneIndex,
      currentTime: video.currentTime || 0,
      duration: Number.isFinite(video.duration) ? video.duration : trim.end,
      isPlaying: !video.paused
    });
  }

  function handleTimeUpdate() {
    const currentTime = video.currentTime || 0;

    updateHotspots(currentTime);

    for (const timeEvent of demo.timeEvents || []) {
      if (!timeEvent?.id || executedEventIds.has(timeEvent.id)) continue;
      if (currentTime < timeEvent.time) continue;

      executedEventIds.add(timeEvent.id);
      runTimeEvent(timeEvent);
    }

    if (!hasReachedTrimEnd && Number.isFinite(trim.end) && currentTime >= trim.end) {
      hasReachedTrimEnd = true;
      video.currentTime = trim.end;
      pauseVideo();
      onPause();
    }

    broadcastVideoTime();
  }

  function updateHotspots(currentTime = video.currentTime || 0) {
    const hotspotMap = new Map((demo.interactions || []).map((interaction) => [interaction.id, interaction]));

    for (const element of hotspotElements) {
      const interaction = hotspotMap.get(element.dataset.hotspotId);
      const timeRange = interaction?.timeRange || {};
      const start = Number.isFinite(timeRange.start) ? timeRange.start : trim.start;
      const end = Number.isFinite(timeRange.end) ? timeRange.end : trim.end;
      const isActive = currentTime >= start && currentTime <= end;

      element.hidden = !isActive;
      element.disabled = !isActive;
      element.setAttribute("aria-hidden", String(!isActive));
    }
  }

  function handleHotspotClick(event) {
    const hotspot = event.target.closest("[data-hotspot-id]");
    if (!hotspot) return;

    const interaction = (demo.interactions || []).find((item) => item.id === hotspot.dataset.hotspotId);
    if (!interaction?.action || hotspot.hidden || hotspot.disabled) return;

    event.preventDefault();
    runHotspotAction(interaction.action);
  }

  function runHotspotAction(action) {
    if (action.type === "syncExplain" && action.explainStepId) {
      onSyncExplain(action.explainStepId);
    }

    if (action.type === "pause") {
      pauseVideo();
      onPause();
    }

    if (action.type === "jumpToTime") {
      activeEngine?.seek(action.time);
    }

    if (action.type === "nextScene") {
      pauseVideo();
      onNextScene();
    }
  }

  function runTimeEvent(timeEvent) {
    if (timeEvent.type === "pause") {
      pauseVideo();
      onPause();
    }

    if (timeEvent.type === "syncExplain" && timeEvent.explainStepId) {
      onSyncExplain(timeEvent.explainStepId);
    }

    if (timeEvent.type === "nextScene") {
      pauseVideo();
      onNextScene();
    }
  }

  addListener(video, "loadedmetadata", () => {
    seekToTrimStart();
    updateHotspots();
    broadcastVideoTime();
    if (isPlaying) playVideo();
  });

  addListener(video, "loadeddata", () => {
    if (frame) frame.dataset.video = "ready";
  });

  addListener(video, "error", () => {
    if (frame) frame.dataset.video = "missing";
    onPlaybackStateChange(false);
    broadcastVideoTime();
  });

  addListener(video, "timeupdate", handleTimeUpdate);
  addListener(video, "play", () => {
    onPlaybackStateChange(true);
    broadcastVideoTime();
  });
  addListener(video, "pause", () => {
    onPlaybackStateChange(false);
    broadcastVideoTime();
  });

  timeUpdateTimer = window.setInterval(broadcastVideoTime, 500);
  updateHotspots(trim.start);

  for (const hotspotElement of hotspotElements) {
    addListener(hotspotElement, "click", handleHotspotClick);
  }

  activeEngine = {
    play: playVideo,
    pause: pauseVideo,
    seek(time) {
      const safeTime = clampTime(time, trim);
      didInitialSeek = true;
      video.currentTime = safeTime;
      updateHotspots(safeTime);
      broadcastVideoTime();
    },
    cleanup() {
      if (timeUpdateTimer) window.clearInterval(timeUpdateTimer);
      listeners.forEach((removeListener) => removeListener());
      pauseVideo();
    }
  };

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    seekToTrimStart();
    broadcastVideoTime();
    if (isPlaying) playVideo();
  }
}

export function setActiveVideoPlaying(isPlaying) {
  if (!activeEngine) return false;
  if (isPlaying) activeEngine.play();
  else activeEngine.pause();
  return true;
}

export function seekActiveVideo(time) {
  if (!activeEngine) return false;
  activeEngine.seek(time);
  return true;
}

export function resetVideoForScene() {
  if (!activeEngine) return;
  activeEngine.cleanup();
  activeEngine = null;
}

function normalizeTrim(trim = {}) {
  return {
    start: Number.isFinite(trim.start) ? trim.start : 0,
    end: Number.isFinite(trim.end) ? trim.end : Infinity
  };
}

function clampTime(time, trim) {
  const numericTime = Number(time);
  if (!Number.isFinite(numericTime)) return trim.start;
  return Math.max(trim.start, Math.min(trim.end, numericTime));
}
