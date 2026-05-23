/**
 * recepta.js — Detall d'una recepta seleccionada.
 *
 * Mostra:
 *  - Etiqueta "SUBSTITUINT · SOPAR AMB POLLASTRE"
 *  - Títol + meta (temps · proteïna)
 *  - Ingredients en porcions visuals (sense grams ni calories)
 *  - Passos numerats
 *  - CTA "Marcar com a fet ✓"
 *
 * [Nielsen-2] Coincidència món real: porcions visuals "1 bol", "2 ous"
 *             en lloc de grams (insight 1 de P2)
 */

import { state, markMealDone } from "../state.js";
import { getRecipeAlternativeById } from "../ia-mock.js";
import { backLink } from "../components.js";
import { escape, showToast } from "../utils.js";

export function renderRecepta(recipeId) {
  const recipe = getRecipeAlternativeById(recipeId);
  if (!recipe) {
    return `
      <section class="empty-state">
        ${backLink("#/menjar/menu")}
        <h1>Recepta no trobada</h1>
      </section>
    `;
  }

  // Busquem l'àpat associat per saber si ja està marcat fet
  const linkedMeal = state.today.meals.find(m => m.alternativeId === recipeId);
  const isDone = linkedMeal?.completed;
  const mealId = linkedMeal?.id || "sopar";

  return `
    <section class="view-recepta" aria-labelledby="recepta-title">

      ${backLink(`#/menjar/apat/${escape(mealId)}`, "Tornar al sopar")}

      <header>
        <span class="mono-uppercase" style="color: var(--color-ia-700);">
          SUBSTITUINT · SOPAR AMB POLLASTRE
        </span>
        <h1 id="recepta-title" style="margin-top: var(--space-2);">${escape(recipe.name)}</h1>
        <p style="font-family: var(--font-mono); color: var(--color-text-secondary); margin-top: var(--space-1);">
          ${recipe.prepTimeMinutes} min · ${recipe.proteinGrams} g proteïna
        </p>
      </header>

      <!-- Ingredients en porcions visuals -->
      <section aria-labelledby="recepta-ingredients-title">
        <div class="section-heading">
          <span class="label">INGREDIENTS</span>
          <h2 id="recepta-ingredients-title">Què necessites</h2>
        </div>
        <div class="recipe-portions" role="list">
          ${recipe.ingredients.map(ing => `
            <div class="recipe-portion" role="listitem">
              <span class="recipe-portion-visual">${escape(ing.visual)}</span>
              <span class="recipe-portion-name">${escape(ing.name)}</span>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- Passos numerats -->
      <section aria-labelledby="recepta-steps-title">
        <div class="section-heading">
          <span class="label">PASSOS</span>
          <h2 id="recepta-steps-title">Com es fa</h2>
        </div>
        <ol class="recipe-steps">
          ${recipe.steps.map(step => `
            <li class="recipe-step">${escape(step)}</li>
          `).join("")}
        </ol>
      </section>

      <!-- CTA Marcar com a fet (sticky en mòbil) -->
      <div class="sticky-cta">
        ${isDone ? `
          <button class="btn-secondary" disabled aria-disabled="true">
            <i data-lucide="check" aria-hidden="true"></i>
            <span>Ja completat</span>
          </button>
        ` : `
          <button class="btn-primary"
                  data-action="mark-meal-done"
                  data-meal-id="${escape(mealId)}">
            <span>Marcar com a fet</span>
            <i data-lucide="check" aria-hidden="true"></i>
          </button>
        `}
      </div>

    </section>
  `;
}

/**
 * Event handler: el botó "Marcar com a fet" comparteix data-action
 * amb apat.js, però per ser explícits l'afegim també aquí. main.js
 * crida ambdós handlers — el primer que matchi guanya.
 */
export function onReceptaClick(e) {
  const markBtn = e.target.closest('[data-action="mark-meal-done"]');
  if (!markBtn) return;
  // delegat a onApatClick (ja gestionat); res a fer aquí
}
