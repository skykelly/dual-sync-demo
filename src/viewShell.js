export function renderShell({ content, label, scenes, state }) {
  return `
    <main class="screen">
      <header class="topbar">
        <div>
          <strong>Dual Sync Presentation</strong>
          <span>${label}</span>
        </div>
        <div class="status">
          <span>Step ${state.currentStep + 1}/${scenes.length}</span>
          <span data-timer>${formatTime(state.remainingSec)}</span>
          <span>${state.isPlaying ? "PLAY" : "PAUSE"}</span>
        </div>
      </header>
      <div class="progress"><div style="width:${progressPercent(state, scenes)}%"></div></div>
      ${content}
    </main>
  `;
}

export function formatTime(seconds) {
  const safeTotal = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeTotal / 60).toString().padStart(2, "0");
  const safeSeconds = (safeTotal % 60).toString().padStart(2, "0");
  return `${minutes}:${safeSeconds}`;
}

function progressPercent(state, scenes) {
  return ((state.currentStep + 1) / scenes.length) * 100;
}
