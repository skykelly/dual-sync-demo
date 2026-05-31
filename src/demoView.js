import { renderShell } from "./viewShell.js";

export function renderDemoView({ scene, scenes, state }) {
  const demo = scene.demo;
  const trim = demo.trim || { start: 0, end: 0 };
  const showDebug = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1";

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
        <div class="video-frame" data-video="missing">
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
          ${showDebug ? renderHotspotGuides(demo.interactions) : ""}
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

function renderHotspotGuides(interactions) {
  return interactions.map((interaction) => `
    <button
      type="button"
      class="hotspot-guide"
      style="left:${interaction.x}%;top:${interaction.y}%;width:${interaction.width}%;height:${interaction.height}%;"
      aria-label="${interaction.label}"
      title="${interaction.label}"
    >
      ${interaction.showLabel ? `<span>${interaction.label}</span>` : ""}
    </button>
  `).join("");
}

function formatSeconds(seconds) {
  return `${seconds.toFixed(1).replace(".0", "")}s`;
}
