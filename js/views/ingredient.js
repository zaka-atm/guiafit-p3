/** ingredient.js — Selector d'ingredient que falta (Fase D). Placeholder inicial. */
export function renderIngredient(apatId) {
  return `
    <section class="view-placeholder">
      <i data-lucide="refrigerator" aria-hidden="true"></i>
      <h1>Ingredient · ${apatId || ""}</h1>
      <p>Vista en construcció (Fase D).</p>
    </section>
  `;
}
