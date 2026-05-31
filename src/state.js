const STORAGE_KEY = "dual-presentation-step";
const DEBUG_HOTSPOTS_STORAGE_KEY = "dual-presentation-debug-hotspots";

export function createPresentationState(scenes) {
  const initialStep = Number(localStorage.getItem(STORAGE_KEY) || 0);

  const state = {
    currentStep: clampStep(initialStep, scenes),
    currentExplainStepId: getDefaultExplainStepId(scenes[clampStep(initialStep, scenes)]),
    debugHotspots: localStorage.getItem(DEBUG_HOTSPOTS_STORAGE_KEY) === "true",
    isPlaying: false,
    playbackRate: getScenePlaybackRate(scenes[clampStep(initialStep, scenes)]),
    timer: null,
    remainingSec: getSceneDurationSec(scenes[clampStep(initialStep, scenes)]),
    videoStatus: {
      sceneIndex: clampStep(initialStep, scenes),
      currentTime: 0,
      duration: getSceneDurationSec(scenes[clampStep(initialStep, scenes)]),
      isPlaying: false
    }
  };

  function setStep(step) {
    state.currentStep = clampStep(step, scenes);
    localStorage.setItem(STORAGE_KEY, String(state.currentStep));
    state.remainingSec = getSceneDurationSec(scenes[state.currentStep]);
    state.currentExplainStepId = getDefaultExplainStepId(scenes[state.currentStep]);
    state.playbackRate = getScenePlaybackRate(scenes[state.currentStep]);
    state.videoStatus = {
      sceneIndex: state.currentStep,
      currentTime: scenes[state.currentStep]?.demo?.trim?.start || 0,
      duration: getSceneDurationSec(scenes[state.currentStep]),
      isPlaying: false
    };
  }

  function setPlaying(isPlaying) {
    state.isPlaying = isPlaying;
  }

  function setRemainingSec(seconds) {
    state.remainingSec = seconds;
  }

  function setExplainStep(explainStepId) {
    const scene = scenes[state.currentStep];
    const exists = scene?.explain?.steps?.some((step) => step.id === explainStepId);
    state.currentExplainStepId = exists ? explainStepId : getDefaultExplainStepId(scene);
  }

  function setVideoStatus(videoStatus) {
    state.videoStatus = {
      ...state.videoStatus,
      ...videoStatus
    };
  }

  function setDebugHotspots(debugHotspots) {
    state.debugHotspots = Boolean(debugHotspots);
    localStorage.setItem(DEBUG_HOTSPOTS_STORAGE_KEY, String(state.debugHotspots));
  }

  function setPlaybackRate(playbackRate) {
    state.playbackRate = getSafePlaybackRate(playbackRate, getScenePlaybackRate(scenes[state.currentStep]));
  }

  function resetRemainingSec() {
    state.remainingSec = getSceneDurationSec(scenes[state.currentStep]);
  }

  function clearTimer() {
    clearInterval(state.timer);
    state.timer = null;
  }

  function setTimer(timer) {
    state.timer = timer;
  }

  return {
    state,
    setStep,
    setPlaying,
    setRemainingSec,
    setExplainStep,
    setVideoStatus,
    setDebugHotspots,
    setPlaybackRate,
    resetRemainingSec,
    clearTimer,
    setTimer
  };
}

function getDefaultExplainStepId(scene) {
  return scene?.explain?.defaultStepId || scene?.explain?.steps?.[0]?.id || "";
}

function getScenePlaybackRate(scene) {
  return getSafePlaybackRate(scene?.demo?.playbackRate, 1);
}

function getSafePlaybackRate(playbackRate, fallback) {
  const numericRate = Number(playbackRate);
  return Number.isFinite(numericRate) && numericRate > 0 ? numericRate : fallback;
}

export function clampStep(step, scenes) {
  return Math.max(0, Math.min(scenes.length - 1, step));
}

export function getSceneDurationSec(scene) {
  if (!scene) return 0;
  if (Number.isFinite(scene.durationSec)) return scene.durationSec;

  const trim = scene.demo?.trim;
  if (Number.isFinite(trim?.start) && Number.isFinite(trim?.end)) {
    return Math.max(0, Math.round(trim.end - trim.start));
  }

  return 0;
}
