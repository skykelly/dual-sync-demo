import { renderShell } from "./viewShell.js";

export function renderDemoView({ scene, scenes, state }) {
  const demo = scene.demo;
  const trim = demo.trim || { start: 0, end: 0 };
  const queryDebug = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1";
  const debugHotspots = state.debugHotspots || queryDebug;

  return renderShell({
    label: "Demo View",
    scenes,
    state,
    content: `
      <section class="demo-stage">
        <div class="demo-copy">
          <p class="eyebrow">Demo View</p>
          <h1>${scene.title}</h1>
          <p class="subtitle">${scene.description}</p>
        </div>
        <div class="video-frame ${debugHotspots ? "debug-hotspots" : ""}" data-video="missing" data-debug-hotspots="${debugHotspots ? "true" : "false"}">
          <video
            class="demo-video"
            data-demo-video
            src="${demo.videoSrc}"
            preload="metadata"
            muted
            playsinline
            data-playback-rate="${demo.playbackRate}"
            onloadeddata="this.parentElement.dataset.video='ready'"
            onerror="this.parentElement.dataset.video='missing'"
          ></video>
          <div class="video-fallback">
            <strong>Demo video placeholder</strong>
            <span>${demo.videoSrc} 파일이 없어도 발표 화면은 계속 표시됩니다.</span>
          </div>
          <div class="hotspot-layer" aria-label="Demo interaction hotspots">
            ${renderHotspots(demo.interactions)}
          </div>
        </div>
        <div class="timeline-summary">
          <span>Trim ${formatSeconds(trim.start)}-${formatSeconds(trim.end)}</span>
          <span>Speed ${demo.playbackRate}x</span>
          <span>${demo.timeEvents.length} time events</span>
          <span>${demo.interactions.length} hotspots</span>
          <span>${demo.zoomEvents.length} zoom events</span>
        </div>
      </section>
    `
  });
}

function renderHotspots(interactions = []) {
  return interactions.filter((interaction) => interaction.type === "hotspot").map((interaction) => `
    <button
      type="button"
      class="demo-hotspot"
      data-hotspot-id="${interaction.id}"
      data-time-start="${interaction.timeRange?.start ?? 0}"
      data-time-end="${interaction.timeRange?.end ?? Number.POSITIVE_INFINITY}"
      style="left:${interaction.x}%;top:${interaction.y}%;width:${interaction.width}%;height:${interaction.height}%;"
      aria-label="${interaction.label}"
      title="${interaction.label}"
    >
      ${interaction.showLabel ? `<span class="hotspot-label">${interaction.label}</span>` : ""}
    </button>
  `).join("");
}

function formatSeconds(seconds) {
  return `${seconds.toFixed(1).replace(".0", "")}s`;
}
