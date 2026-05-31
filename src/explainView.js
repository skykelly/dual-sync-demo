import { renderShell } from "./viewShell.js";

export function renderExplainView({ scene, scenes, state }) {
  const explain = scene.explain;
  const currentStep = getExplainStep(explain, state.currentExplainStepId);
  const bullets = currentStep.bullets || [];

  return renderShell({
    label: "Explain View",
    scenes,
    state,
    content: `
      <section class="hero explain-hero" data-explain-step-id="${currentStep.id}">
        <div class="explain-content">
          <p class="eyebrow">${scene.title}</p>
          <h1>${currentStep.title}</h1>
          ${currentStep.subtitle ? `<p class="lead">${currentStep.subtitle}</p>` : ""}
          ${bullets.length ? `<ul class="bullet-list">${bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>` : ""}
          ${currentStep.keyMessage ? `<div class="takeaway">${currentStep.keyMessage}</div>` : ""}
          ${currentStep.script ? `
            <aside class="speaker-script" aria-label="Speaker script">
              <h2>Speaker Note</h2>
              <p>${currentStep.script}</p>
            </aside>
          ` : ""}
        </div>
        <div class="explain-debug" aria-label="Explain debug information">
          <span>${scene.title}</span>
          <span>${currentStep.id}</span>
        </div>
      </section>
    `
  });
}

function getExplainStep(explain, explainStepId) {
  const steps = explain?.steps || [];
  return steps.find((step) => step.id === explainStepId)
    || steps.find((step) => step.id === explain?.defaultStepId)
    || steps[0]
    || {};
}
