import { scenes } from "../data/scenes.js";
import { renderControllerView } from "./controllerView.js";
import { renderDemoView } from "./demoView.js";
import { renderExplainView } from "./explainView.js";
import { createPresentationState } from "./state.js";
import { createSyncChannel } from "./sync.js";
import {
  mountVideoTimeline,
  restartActiveVideo,
  resetActiveVideoZoom,
  resetVideoForScene,
  seekActiveVideo,
  setActiveVideoPlaybackRate,
  setActiveVideoPlaying
} from "./videoEngine.js";
import { formatTime } from "./viewShell.js";

const params = new URLSearchParams(window.location.search);
const view = params.get("view") || "controller";
const app = document.getElementById("app");
const presentation = createPresentationState(scenes);
const { state } = presentation;
const sync = createSyncChannel(handleSyncMessage);

function handleSyncMessage(data) {
  if (data.type === "SET_STEP" || data.type === "GO_TO_SCENE") {
    presentation.setStep(data.step ?? data.sceneIndex);
    resetVideoForScene();
    render();
  }

  if (data.type === "PLAY") {
    presentation.setPlaying(true);
    if (view === "demo") {
      setActiveVideoPlaying(true);
      renderPlaybackStatusOnly();
    } else {
      render();
    }
  }

  if (data.type === "PAUSE") {
    if (view === "controller") {
      pauseTimer(false);
    } else {
      presentation.setPlaying(false);
      if (view === "demo") {
        setActiveVideoPlaying(false);
        renderPlaybackStatusOnly();
      } else {
        render();
      }
    }
  }

  if (data.type === "RESET_TIMER") {
    presentation.resetRemainingSec();
    render();
  }

  if (data.type === "RESTART_SCENE") {
    presentation.setStep(data.sceneIndex ?? state.currentStep);
    presentation.setPlaying(false);
    presentation.clearTimer();
    if (view === "demo") {
      restartActiveVideo();
      renderPlaybackStatusOnly();
    } else {
      render();
    }
  }

  if (data.type === "SYNC_EXPLAIN") {
    if (Number.isFinite(data.sceneIndex) && data.sceneIndex !== state.currentStep) {
      presentation.setStep(data.sceneIndex);
    }
    presentation.setExplainStep(data.explainStepId);
    render();
  }

  if (data.type === "VIDEO_TIME_UPDATE" && view === "controller") {
    presentation.setVideoStatus(data);
    renderControllerVideoStatusOnly();
  }

  if (data.type === "JUMP_TO_TIME" && view === "demo") {
    seekActiveVideo(data.time);
  }

  if (data.type === "RESET_ZOOM" && view === "demo") {
    resetActiveVideoZoom();
  }

  if (data.type === "SET_PLAYBACK_RATE") {
    presentation.setPlaybackRate(data.playbackRate);
    if (view === "demo") {
      setActiveVideoPlaybackRate(state.playbackRate);
    } else {
      render();
    }
  }

  if (data.type === "SET_DEBUG_HOTSPOTS") {
    presentation.setDebugHotspots(data.debugHotspots);
    if (view === "demo") {
      updateDemoHotspotDebugOnly();
    } else {
      render();
    }
  }

  if (data.type === "SET_HOTSPOT_DEBUG") {
    presentation.setDebugHotspots(data.enabled);
    if (view === "demo") {
      updateDemoHotspotDebugOnly();
    } else {
      render();
    }
  }
}

function setStep(step, shouldBroadcast = true) {
  presentation.setStep(step);
  resetVideoForScene();
  render();

  if (shouldBroadcast) {
    sync.broadcast("SET_STEP", { step: state.currentStep });
  }
}

function nextStep() {
  setStep(state.currentStep + 1);
}

function prevStep() {
  setStep(state.currentStep - 1);
}

function startTimer() {
  presentation.setPlaying(true);
  presentation.clearTimer();
  presentation.setTimer(setInterval(() => {
    presentation.setRemainingSec(state.remainingSec - 1);

    if (state.remainingSec <= 0) {
      presentation.clearTimer();
      presentation.setPlaying(false);

      if (state.currentStep < scenes.length - 1) {
        nextStep();
      } else {
        render();
      }
    } else {
      renderTimerOnly();
    }
  }, 1000));

  sync.broadcast("PLAY", { step: state.currentStep });
  render();
}

function pauseTimer(shouldBroadcast = true) {
  presentation.setPlaying(false);
  presentation.clearTimer();

  if (shouldBroadcast) {
    sync.broadcast("PAUSE", { step: state.currentStep, remainingSec: state.remainingSec });
  }

  render();
}

function resetTimer() {
  pauseTimer(false);
  presentation.resetRemainingSec();
  sync.broadcast("RESET_TIMER", { step: state.currentStep });
  render();
}

function restartScene() {
  presentation.setPlaying(false);
  presentation.clearTimer();
  presentation.setStep(state.currentStep);
  sync.broadcast("RESTART_SCENE", { sceneIndex: state.currentStep });
  render();
}

function resetZoom() {
  sync.broadcast("RESET_ZOOM", { sceneIndex: state.currentStep });
}

function setPlaybackRate(playbackRate) {
  presentation.setPlaybackRate(playbackRate);
  sync.broadcast("SET_PLAYBACK_RATE", {
    sceneIndex: state.currentStep,
    playbackRate: state.playbackRate
  });
  render();
}

function jumpToSceneTime(sceneTime) {
  const scene = scenes[state.currentStep];
  const trimStart = scene?.demo?.trim?.start || 0;
  const trimEnd = scene?.demo?.trim?.end || trimStart;
  const numericSceneTime = Number(sceneTime);
  if (!Number.isFinite(numericSceneTime)) return;

  const targetTime = Math.max(trimStart, Math.min(trimEnd, trimStart + Math.max(0, numericSceneTime)));
  sync.broadcast("JUMP_TO_TIME", {
    sceneIndex: state.currentStep,
    time: targetTime
  });
  presentation.setVideoStatus({
    sceneIndex: state.currentStep,
    currentTime: targetTime,
    isPlaying: state.isPlaying
  });
  renderControllerVideoStatusOnly();
}

function formatVideoClock(seconds, fallback = 0) {
  const numericSeconds = Number.isFinite(Number(seconds)) ? Number(seconds) : fallback;
  const safeSeconds = Math.max(0, numericSeconds);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (safeSeconds % 60).toFixed(2).padStart(5, "0");
  return `${minutes}:${remainingSeconds}`;
}

function renderTimerOnly() {
  const timer = document.querySelector("[data-timer]");
  if (timer) timer.textContent = formatTime(state.remainingSec);
}

function renderControllerVideoStatusOnly() {
  const videoStatus = document.querySelector(".video-status");
  if (!videoStatus || view !== "controller") return;

  const scene = scenes[state.currentStep];
  const trim = scene.demo?.trim || { start: 0, end: 0 };
  const currentTime = state.videoStatus?.currentTime ?? trim.start;
  const sceneElapsed = Math.max(0, Number(currentTime || trim.start) - Number(trim.start || 0));
  const sceneDuration = Math.max(0, Number(trim.end || 0) - Number(trim.start || 0));
  const currentExplainStep = getExplainStep(scene, state.currentExplainStepId);

  videoStatus.innerHTML = `
    <span>현재 영상 시간 ${formatVideoClock(currentTime, trim.start)} / ${formatVideoClock(trim.end, 0)}</span>
    <span>Scene Time ${formatVideoClock(sceneElapsed, 0)} / ${formatVideoClock(sceneDuration, 0)}</span>
    <span>현재 Explain ${currentExplainStep.title || "none"}</span>
  `;
}

function renderPlaybackStatusOnly() {
  const status = document.querySelector(".status span:last-child");
  if (status) status.textContent = state.isPlaying ? "PLAY" : "PAUSE";
}

function updateDemoHotspotDebugOnly() {
  const frame = document.querySelector(".video-frame");
  if (!frame || view !== "demo") return;

  frame.classList.toggle("debug-hotspots", state.debugHotspots);
  frame.dataset.debugHotspots = state.debugHotspots ? "true" : "false";
}

function syncExplain(explainStepId, shouldBroadcast = true) {
  presentation.setExplainStep(explainStepId);
  if (view !== "demo") {
    render();
  }

  if (shouldBroadcast) {
    sync.broadcast("SYNC_EXPLAIN", {
      sceneIndex: state.currentStep,
      explainStepId
    });
  }
}

function handleVideoPause() {
  presentation.setPlaying(false);
  presentation.clearTimer();
  sync.broadcast("PAUSE", { step: state.currentStep, remainingSec: state.remainingSec });
  renderPlaybackStatusOnly();
}

function handleVideoPlaybackStateChange(isPlaying) {
  presentation.setPlaying(isPlaying);
  renderPlaybackStatusOnly();
}

function render() {
  const scene = scenes[state.currentStep];
  document.body.dataset.view = view;

  if (view === "demo") {
    app.innerHTML = renderDemoView({ scene, scenes, state });
    mountVideoTimeline({
      scene,
      sceneIndex: state.currentStep,
      isPlaying: state.isPlaying,
      broadcast: sync.broadcast,
      onPause: handleVideoPause,
      onNextScene: nextStep,
      onSyncExplain: syncExplain,
      onPlaybackStateChange: handleVideoPlaybackStateChange,
      playbackRate: state.playbackRate
    });
  } else if (view === "explain") {
    app.innerHTML = renderExplainView({ scene, scenes, state });
  } else {
    app.innerHTML = renderControllerView({ scene, scenes, state });
  }
}

app.addEventListener("click", (event) => {
  const control = event.target.closest("[data-action]");
  if (!control) return;

  const action = control.dataset.action;

  if (action === "prev") prevStep();
  if (action === "next") nextStep();
  if (action === "play-toggle") state.isPlaying ? pauseTimer() : startTimer();
  if (action === "reset") resetTimer();
  if (action === "restart-scene") restartScene();
  if (action === "reset-zoom") resetZoom();
  if (action === "set-step") setStep(Number(control.dataset.step));
  if (action === "sync-explain") syncExplain(control.dataset.explainStepId);
  if (action === "set-playback-rate") setPlaybackRate(Number(control.dataset.playbackRate));
  if (action === "toggle-debug-hotspots") {
    presentation.setDebugHotspots(!state.debugHotspots);
    sync.broadcast("SET_HOTSPOT_DEBUG", { enabled: state.debugHotspots });
    render();
  }
});

app.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-jump-form]");
  if (!form) return;

  event.preventDefault();
  jumpToSceneTime(form.querySelector("[data-jump-time]")?.value);
});

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "Space", "PageDown"].includes(event.code)) nextStep();
  if (["ArrowLeft", "PageUp"].includes(event.code)) prevStep();
  if (event.code === "KeyP") state.isPlaying ? pauseTimer() : startTimer();
  if (event.code === "KeyR") resetTimer();
});

render();

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
