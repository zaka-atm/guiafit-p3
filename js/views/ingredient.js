/**
 * ingredient.js — Selector d'ingredient que falta.
 *
 * Es presenta com a sheet (sobre la vista de detall d'àpat).
 * L'usuari ha de seleccionar quin ingredient li falta abans de
 * que la IA proposi receptes alternatives.
 *
 * En aquest prototip, el guió narratiu fixa el pollastre com a faltant
 * — quan l'usuari clica "Pollastre" anem a #/menjar/alternatives/sopar.
 *
 * [Patró-4] Bottom Sheet / Side Panel
 */

import { state } from "../state.js";
import { renderApat } from "./apat.js";
import { openSheet } from "../components.js";
import { escape, refreshIcons } from "../utils.js";

let currentMealId = null;

export function renderIngredient(mealId) {
  currentMealId = mealId;
  // Render del fons: la vista d'àpat
  const backgroundHtml = renderApat(mealId);

  // Obrim el sheet del selector
  setTimeout(() => openIngredientSheet(mealId), 50);

  return backgroundHtml;
}

function openIngredientSheet(mealId) {
  const meal = state.today.meals.find(m => m.id === mealId);
  if (!meal) return;

  // Llista d'ingredients seleccionables (els del propi àpat)
  const ingredientsHtml = meal.ingredients.map(ing => `
    <button class="ingredient-option"
            data-action="select-missing"
            data-ingredient-name="${escape(ing.name)}"
            aria-label="Em falta ${escape(ing.name)}">
      <i data-lucide="${ing.isMissing ? "alert-triangle" : "circle"}" aria-hidden="true" style="${ing.isMissing ? "color: var(--color-error);" : ""}"></i>
      <span style="flex:1;">${escape(ing.name)}</span>
      <span class="ingredient-qty">${escape(ing.quantity)}</span>
    </button>
  `).join("");

  openSheet({
    title: "Quin ingredient et falta?",
    bodyHtml: `
      <p style="color: var(--color-text-secondary);">
        Selecciona-ho i la IA et proposarà alternatives amb el que tens a la nevera.
      </p>
      <div class="ingredient-selector-list" role="list">
        ${ingredientsHtml}
      </div>
    `,
    ariaLabel: "Selector d'ingredient que falta",
    onClose: () => {
      if (window.location.hash.startsWith("#/menjar/ingredient/")) {
        window.location.hash = `#/menjar/apat/${mealId}`;
      }
    },
  });
  refreshIcons();
}

/**
 * Event handler delegat: l'usuari ha seleccionat un ingredient.
 */
export function onIngredientClick(e) {
  const opt = e.target.closest('[data-action="select-missing"]');
  if (!opt) return;
  e.preventDefault();

  const name = opt.dataset.ingredientName;
  // El guió narratiu de P2 cobreix el cas del pollastre faltant. Per als
  // altres ingredients, la navegació és la mateixa: anem a la vista
  // d'alternatives, que mostra el conjunt de receptes definides.
  console.info(`Ingredient que falta seleccionat: ${name}`);
  window.location.hash = `#/menjar/alternatives/${currentMealId}`;
}
