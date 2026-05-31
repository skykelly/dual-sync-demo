import { scenes } from "../data/scenes.js";
import { renderControllerView } from "./controllerView.js";
import { renderDemoView } from "./demoView.js";
import { renderExplainView } from "./explainView.js";
import { createPresentationState } from "./state.js";
import { createSyncChannel } from "./sync.js";
import { mountVideoTimeline, resetVideoForScene, seekActiveVideo, setActiveVideoPlaying } from "./videoEngine.js";
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

function renderTimerOnly() {
  const timer = document.querySelector("[data-timer]");
  if (timer) timer.textContent = formatTime(state.remainingSec);
}

function renderControllerVideoStatusOnly() {
  const videoStatus = document.querySelector(".video-status");
  if (!videoStatus || view !== "controller") return;

  const currentTime = Number(state.videoStatus?.currentTime || 0).toFixed(1).replace(".0", "");
  const duration = Number(state.videoStatus?.duration || 0).toFixed(1).replace(".0", "");
  videoStatus.innerHTML = `
    <span>Video ${currentTime}s / ${duration}s</span>
    <span>${state.videoStatus?.isPlaying ? "Playing" : "Paused"}</span>
    <span>Explain ${state.currentExplainStepId || "none"}</span>
  `;
}

function renderPlaybackStatusOnly() {
  const status = document.querySelector(".status span:last-child");
  if (status) status.textContent = state.isPlaying ? "PLAY" : "PAUSE";
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
      onPlaybackStateChange: handleVideoPlaybackStateChange
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
  if (action === "set-step") setStep(Number(control.dataset.step));
  if (action === "sync-explain") syncExplain(control.dataset.explainStepId);
});

window.addEventListener("keydown", (event) => {
  if (["ArrowRight", "Space", "PageDown"].includes(event.code)) nextStep();
  if (["ArrowLeft", "PageUp"].includes(event.code)) prevStep();
  if (event.code === "KeyP") state.isPlaying ? pauseTimer() : startTimer();
  if (event.code === "KeyR") resetTimer();
});

render();
