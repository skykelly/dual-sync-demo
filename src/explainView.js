import { renderShell } from "./viewShell.js";

export function renderExplainView({ scene, scenes, state }) {
  const explain = scene.explain;
  const currentStep = getExplainStep(explain, state.currentExplainStepId);
  const supportingSteps = explain.steps.filter((step) => step.id !== currentStep.id);

  return renderShell({
    label: "Explain View",
    scenes,
    state,
    content: `
      <section class="hero explain-hero">
        <p class="eyebrow">${scene.title}</p>
        <h1>${currentStep.title}</h1>
        <p class="lead">${currentStep.subtitle}</p>
        <ul class="bullet-list">${currentStep.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>
        <div class="takeaway">${currentStep.keyMessage}</div>
        ${supportingSteps.length ? `
          <div class="explain-step-list" aria-label="Available explain steps">
            ${supportingSteps.map((step) => `<span>${step.title}</span>`).join("")}
          </div>
        ` : ""}
      </section>
    `
  });
}

function getExplainStep(explain, explainStepId) {
  return explain.steps.find((step) => step.id === explainStepId)
    || explain.steps.find((step) => step.id === explain.defaultStepId)
    || explain.steps[0];
}
