/**
 * apat.js — Detall d'un àpat (esmorzar / dinar / sopar).
 *
 * Mostra:
 *  - Capçalera amb l'hora i el nom del plat
 *  - Llista d'ingredients (amb badge "Falta" en vermell si manca algun)
 *  - Botó IA contextual "Em falta un ingredient" (només si hi ha issue)
 *  - CTA primari "Marcar com a fet" (deshabilitat si falta ingredient)
 *
 * [Nielsen-2] Coincidència món real: "Em falta un ingredient" en vocabulari natural
 * [Patró-4] Sheet (el selector d'ingredient s'obre com a sheet)
 * [Patró-5] Sticky CTA en mòbil
 */

import { state, markMealDone } from "../state.js";
import { backLink } from "../components.js";
import { escape, showToast } from "../utils.js";

export function renderApat(mealId) {
  const meal = state.today.meals.find(m => m.id === mealId);
  if (!meal) {
    return `
      <section class="empty-state">
        ${backLink("#/menjar/menu")}
        <h1>Àpat no trobat</h1>
      </section>
    `;
  }

  const ingredientItems = meal.ingredients.map(ing => `
    <li class="ingredient-item ${ing.isMissing ? "is-missing" : ""}">
      <i data-lucide="${ing.isMissing ? "alert-triangle" : "check"}" aria-hidden="true" style="color: ${ing.isMissing ? "var(--color-error)" : "var(--color-success)"};"></i>
      <span class="ingredient-name">${escape(ing.name)}</span>
      <span class="ingredient-qty">${escape(ing.quantity)}</span>
      ${ing.isMissing ? '<span class="badge-status badge-missing">Falta</span>' : ""}
    </li>
  `).join("");

  const titleLabel = meal.completed
    ? `${meal.name.toUpperCase()} · ${escape(meal.completedAt)} H`
    : `${meal.name.toUpperCase()}${meal.plannedTime ? ` · ${escape(meal.plannedTime)} H` : ""}`;

  return `
    <section class="view-apat" aria-labelledby="apat-title">

      ${backLink("#/menjar/menu", "Tornar al menú")}

      <header>
        <span class="mono-uppercase">${titleLabel}</span>
        <h1 id="apat-title" style="margin-top: var(--space-2);">${escape(meal.description)}</h1>
        ${meal.alternativeApplied
          ? '<p style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-ia-700);">SUBSTITUÏT PER LA IA</p>'
          : '<p style="color: var(--color-text-secondary);">Aport principal: proteïna</p>'}
      </header>

      <section aria-labelledby="ingredients-title">
        <div class="section-heading">
          <span class="label">INGREDIENTS</span>
          <h2 id="ingredients-title">Què necessites</h2>
        </div>
        <ul class="ingredients-list" aria-label="Llista d'ingredients">
          ${ingredientItems}
        </ul>
      </section>

      <!-- Botó IA contextual: "Em falta un ingredient" (només si hi ha issue) -->
      ${meal.hasIngredientIssue ? `
        <div class="exercici-actions">
          <button class="btn-ia-block"
                  data-action="open-ingredient-selector"
                  data-meal-id="${escape(meal.id)}"
                  aria-label="Demanar 3 receptes a la IA per ingredient que falta">
            <span class="btn-ia-block-title">
              <i data-lucide="alert-circle" aria-hidden="true"></i>
              <span>Em falta un ingredient</span>
            </span>
            <span class="btn-ia-block-subtext">La IA et proposarà 3 receptes amb el que tens</span>
          </button>
        </div>
      ` : ""}

      <!-- CTA primari sticky -->
      <!-- [Nielsen-6] Disseny minimalista: una sola acció primària per pantalla -->
      <div class="sticky-cta">
        ${meal.completed ? `
          <button class="btn-secondary" disabled aria-disabled="true">
            <i data-lucide="check" aria-hidden="true"></i>
            <span>Ja completat</span>
          </button>
        ` : (meal.hasIngredientIssue ? `
          <button class="btn-primary" disabled aria-disabled="true" title="Falta un ingredient">
            <i data-lucide="check" aria-hidden="true"></i>
            <span>Marcar com a fet</span>
          </button>
        ` : `
          <button class="btn-primary"
                  data-action="mark-meal-done"
                  data-meal-id="${escape(meal.id)}">
            <span>Marcar com a fet</span>
            <i data-lucide="check" aria-hidden="true"></i>
          </button>
        `)}
      </div>

    </section>
  `;
}

/**
 * Event handler delegat per a la vista d'àpat.
 */
export function onApatClick(e) {
  // Marcar àpat com a fet
  const markBtn = e.target.closest('[data-action="mark-meal-done"]');
  if (markBtn) {
    e.preventDefault();
    const id = markBtn.dataset.mealId;
    // [Patró-2] Optimistic UI
    markMealDone(id);
    // [Patró-3] Toast
    showToast("Sopar registrat ✓", "check");
    setTimeout(() => {
      window.location.hash = "#/menjar/menu";
    }, 250);
    return;
  }

  // Obrir selector d'ingredient
  const ingBtn = e.target.closest('[data-action="open-ingredient-selector"]');
  if (ingBtn) {
    e.preventDefault();
    const id = ingBtn.dataset.mealId;
    window.location.hash = `#/menjar/ingredient/${id}`;
    return;
  }
}
