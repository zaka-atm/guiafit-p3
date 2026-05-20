/**
 * alternatives-exercici.js — Vista de les 3 alternatives IA (Tasca 1).
 *
 * Decisió de disseny clau: la vista renderitza la pàgina d'exercici
 * de fons + un sheet sobre. Mantenim el context (l'usuari veu d'on
 * ve) sense interrompre el flux. [Patró-4: Bottom Sheet / Side Panel]
 *
 * Mostra skeleton durant 1200ms [Patró-1] i després les 3 alternatives.
 * Sempre exactament 3 — mai més, mai menys (Insight 3 de P2).
 */

import { state, replaceExercise } from "../state.js";
import { getAlternatives, getExerciseAlternativeById } from "../ia-mock.js";
import { renderExercici } from "./exercici.js";
import { openSheet, skeletonAlternatives } from "../components.js";
import { escape, refreshIcons, showToast } from "../utils.js";

let currentExerciseId = null;

/**
 * Renderitza la vista de fons (l'exercici) i obre el sheet.
 *
 * @param {string} exerciseId - L'exercici que es vol substituir
 */
export function renderAlternativesExercici(exerciseId) {
  currentExerciseId = exerciseId;

  // Render del fons: la vista d'exercici Pull-down
  const backgroundHtml = renderExercici(exerciseId);

  // Sheet: primer skeleton, després contingut real
  // Cal fer-ho asíncronament — després d'injectar el fons.
  setTimeout(() => openIaSheet(exerciseId), 50);

  return backgroundHtml;
}

/**
 * Obre el sheet d'alternatives IA. Mostra skeleton 1200ms,
 * després substitueix pel contingut real.
 */
async function openIaSheet(exerciseId) {
  openSheet({
    title: "Alternatives equivalents",
    bodyHtml: skeletonAlternatives(3),
    ariaLabel: "Alternatives IA per substituir l'exercici",
    onClose: () => {
      // Si tanquen sense triar, tornem a la vista d'exercici
      if (window.location.hash.startsWith("#/entrenar/alternatives/")) {
        window.location.hash = `#/entrenar/exercici/${exerciseId}`;
      }
    },
  });

  // Carreguem les alternatives reals (delay 1200ms simulat)
  const data = await getAlternatives("machine-occupied");
  // Si l'usuari ha tancat mentre carregava, no fem res
  const sheetBody = document.querySelector(".sheet-body");
  if (!sheetBody || !data) return;

  sheetBody.innerHTML = renderAlternativesBody(data);
  sheetBody.removeAttribute("aria-busy");
  refreshIcons();
}

/**
 * HTML del body del sheet amb la capçalera contextual + 3 cards d'alternativa.
 */
function renderAlternativesBody(data) {
  return `
    <div class="ia-reasoning">
      <span class="badge-ia" aria-hidden="true">
        <i data-lucide="sparkles" style="width:12px;height:12px;" aria-hidden="true"></i> IA
      </span>
      <p class="ia-reasoning-main">${escape(data.reasoning)}</p>
      <p class="ia-reasoning-context">${escape(data.contextNote)}</p>
    </div>

    <div class="alternatives-list" role="list" aria-label="3 alternatives proposades per la IA">
      ${data.alternatives.map((alt, i) => renderAlternativeCard(alt, i + 1)).join("")}
    </div>

    <p style="text-align: center; color: var(--color-text-secondary); font-size: var(--text-sm);">
      Si cap et convenç,
      <a href="#/entrenar/exercici/${escape(currentExerciseId)}" class="btn-tertiary" style="display: inline; padding: 0;" data-action="wait-original">
        espera la politja alta
      </a>.
    </p>
  `;
}

/**
 * Card individual d'una alternativa proposada per la IA.
 */
function renderAlternativeCard(alt, num) {
  return `
    <article class="alternative-card" role="listitem" aria-labelledby="alt-name-${escape(alt.id)}">
      <span class="alternative-card-label">OPCIÓ ${num}</span>
      <h3 class="alternative-card-name" id="alt-name-${escape(alt.id)}">${escape(alt.name)}</h3>
      <p class="alternative-card-detail">${alt.sets}×${escape(String(alt.reps))} · ${alt.restSeconds} s descans</p>
      <div class="alternative-card-meta">
        <span><i data-lucide="dumbbell" style="width:14px;height:14px;" aria-hidden="true"></i> ${escape(alt.equipment)}</span>
        <span>·</span>
        <span><i data-lucide="target" style="width:14px;height:14px;" aria-hidden="true"></i> ${escape(alt.muscle)}</span>
      </div>
      <p style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-text-secondary);">
        ${escape(alt.difficulty)}
      </p>
      <div class="alternative-card-actions">
        <button class="btn-primary"
                data-action="choose-alternative"
                data-alt-id="${escape(alt.id)}"
                aria-label="Triar ${escape(alt.name)}">
          <span>Triar</span>
          <i data-lucide="arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </article>
  `;
}

/**
 * Event handler delegat: triar una alternativa.
 */
export function onAlternativesExerciciClick(e) {
  const chooseBtn = e.target.closest('[data-action="choose-alternative"]');
  if (!chooseBtn) return;

  e.preventDefault();
  const altId = chooseBtn.dataset.altId;
  const alt = getExerciseAlternativeById(altId);
  if (!alt) return;

  // Substituïm l'exercici a l'estat global
  replaceExercise(currentExerciseId, alt);
  // [Patró-3] Toast de confirmació
  showToast("Substitució aplicada ✓", "check");
  // Naveguem al detall del nou exercici (que ara és el mateix slot)
  // Com que replaceExercise canvia l'id, naveguem amb el nou id
  window.location.hash = `#/entrenar/exercici/${alt.id}`;
}
