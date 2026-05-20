/**
 * alternatives-recepta.js — 3 receptes alternatives (Tasca 2).
 *
 * Anàleg a alternatives-exercici.js però per al sopar.
 * IMPORTANT: la capçalera contextual menciona EXPLÍCITAMENT que
 * avui ha entrenat esquena → això demostra la coherència entre
 * dominis (proposta de valor de GuIAFit).
 *
 * [Patró-1] Skeleton + delay 1200ms
 * [Patró-4] Sheet (presentació)
 */

import { state, replaceMeal } from "../state.js";
import { getAlternatives, getRecipeAlternativeById } from "../ia-mock.js";
import { renderApat } from "./apat.js";
import { openSheet, skeletonAlternatives } from "../components.js";
import { escape, refreshIcons, showToast } from "../utils.js";

let currentMealId = null;

export function renderAlternativesRecepta(mealId) {
  currentMealId = mealId;
  const backgroundHtml = renderApat(mealId);
  setTimeout(() => openRecipeSheet(mealId), 50);
  return backgroundHtml;
}

async function openRecipeSheet(mealId) {
  openSheet({
    title: "3 receptes alternatives",
    bodyHtml: skeletonAlternatives(3),
    ariaLabel: "Receptes alternatives proposades per la IA",
    onClose: () => {
      if (window.location.hash.startsWith("#/menjar/alternatives/")) {
        window.location.hash = `#/menjar/apat/${mealId}`;
      }
    },
  });

  const data = await getAlternatives("missing-ingredient-pollastre");
  const sheetBody = document.querySelector(".sheet-body");
  if (!sheetBody || !data) return;

  sheetBody.innerHTML = renderRecipesBody(data);
  sheetBody.removeAttribute("aria-busy");
  refreshIcons();
}

/**
 * HTML del body del sheet: capçalera contextual + 3 cards de recepta.
 * El text de "reasoning" inclou explícitament "Avui has entrenat esquena".
 */
function renderRecipesBody(data) {
  return `
    <div class="ia-reasoning">
      <span class="badge-ia" aria-hidden="true">
        <i data-lucide="sparkles" style="width:12px;height:12px;" aria-hidden="true"></i> IA
      </span>
      <p class="ia-reasoning-main">${escape(data.reasoning)}</p>
      <p class="ia-reasoning-context">${escape(data.contextNote)}</p>
    </div>

    <div class="alternatives-list" role="list" aria-label="3 receptes alternatives">
      ${data.alternatives.map((alt, i) => renderRecipeCard(alt, i + 1)).join("")}
    </div>
  `;
}

function renderRecipeCard(alt, num) {
  return `
    <article class="alternative-card" role="listitem" aria-labelledby="rec-name-${escape(alt.id)}">
      <span class="alternative-card-label">OPCIÓ ${num}</span>
      <h3 class="alternative-card-name" id="rec-name-${escape(alt.id)}">${escape(alt.name)}</h3>
      <p class="alternative-card-detail">
        <i data-lucide="clock" style="width:14px;height:14px;" aria-hidden="true"></i> ${alt.prepTimeMinutes} MIN
        ·
        <i data-lucide="beef" style="width:14px;height:14px;" aria-hidden="true"></i> ${escape(alt.proteinSource.split(" (")[0].toUpperCase())}
      </p>
      <div class="chip-list" style="margin-top: var(--space-2);">
        ${alt.visualPortions.map(p => `<span class="chip">${escape(p)}</span>`).join("")}
      </div>
      <div class="alternative-card-actions">
        <button class="btn-primary"
                data-action="choose-recipe"
                data-recipe-id="${escape(alt.id)}"
                aria-label="Triar ${escape(alt.name)}">
          <span>Triar</span>
          <i data-lucide="arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </article>
  `;
}

/**
 * Event handler delegat: triar una recepta.
 */
export function onAlternativesReceptaClick(e) {
  const btn = e.target.closest('[data-action="choose-recipe"]');
  if (!btn) return;
  e.preventDefault();

  const recipeId = btn.dataset.recipeId;
  const recipe = getRecipeAlternativeById(recipeId);
  if (!recipe) return;

  // Substituïm l'àpat per la recepta seleccionada
  replaceMeal(currentMealId, recipe);
  // [Patró-3] Toast
  showToast("Recepta seleccionada ✓", "check");
  // Anem al detall de la recepta
  window.location.hash = `#/menjar/recepta/${recipeId}`;
}
