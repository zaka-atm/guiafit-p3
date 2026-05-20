/**
 * menu.js — Vista "Menú d'avui".
 *
 * Mostra els 3 àpats del dia (esmorzar, dinar, sopar) amb el seu
 * estat: fets els 2 primers, pendent el sopar (i amb avís d'ingredient
 * que falta — el guió del test d'usuari).
 *
 * [Nielsen-1] Visibilitat de l'estat: badges "Fet" / "Pendent" amb color.
 * [Nielsen-4] Consistència: mateix patró de targetes que la rutina.
 * [Patró-6] Empty state si tot està fet.
 */

import { state } from "../state.js";
import { progressBar, backLink } from "../components.js";
import { escape } from "../utils.js";

export function renderMenu() {
  const meals = state.today.meals;
  const completedCount = meals.filter(m => m.completed).length;
  const total = meals.length;

  if (completedCount === total) {
    return renderAllDoneState();
  }

  return `
    <section class="view-menu view-with-sidebar" aria-labelledby="menu-title">

      <div class="view-main">
        ${backLink("#/avui", "Tornar a Avui")}

        <header class="view-rutina-header">
          <span class="mono-uppercase">MENÚ D'AVUI</span>
          <h1 id="menu-title">Menú d'avui</h1>
          <p style="color: var(--color-text-secondary);">
            ${total} àpats · ${completedCount}/${total} fets
          </p>
        </header>

        <div class="view-rutina-progress">
          ${progressBar(completedCount, total, `Progrés àpats: ${completedCount} de ${total} fets`)}
          <span class="mono-uppercase" aria-live="polite">${completedCount} / ${total} fets</span>
        </div>

        <ul class="meal-list" aria-label="Llista d'àpats del dia">
          ${meals.map(meal => renderMealCard(meal)).join("")}
        </ul>
      </div>

      ${renderSidebar()}
    </section>
  `;
}

/**
 * Card individual d'un àpat.
 * Estats visuals: completat (verd), pendent (neutre), pendent amb issue (groc).
 */
function renderMealCard(meal) {
  const stateClass = meal.completed
    ? "is-done"
    : (meal.hasIngredientIssue ? "is-pending-issue" : "");

  const timeLabel = meal.completed
    ? meal.completedAt
    : (meal.plannedTime || "—");

  const statusBadge = meal.completed
    ? '<span class="badge-status badge-done">Fet</span>'
    : (meal.hasIngredientIssue
        ? '<span class="badge-status badge-missing">Falta ingredient</span>'
        : '<span class="badge-status badge-pending">Pendent</span>');

  return `
    <li>
      <a href="#/menjar/apat/${escape(meal.id)}"
         class="meal-card ${stateClass}"
         aria-label="${escape(meal.name)}: ${meal.completed ? `completat a les ${escape(timeLabel)}` : (meal.hasIngredientIssue ? "pendent, falta ingredient" : "pendent")}">

        <span class="meal-card-icon" aria-hidden="true">
          <i data-lucide="${escape(meal.icon || "circle")}"></i>
        </span>

        <span class="meal-card-info">
          <span class="meal-card-label">
            <span>${escape(meal.name.toUpperCase())}</span>
            <span class="meal-card-time">${escape(timeLabel)}</span>
          </span>
          <span class="meal-card-name">${escape(meal.alternativeApplied ? meal.description + " (substituït)" : meal.description)}</span>
        </span>

        ${statusBadge}
      </a>
    </li>
  `;
}

/**
 * Empty state quan tots els àpats estan fets.
 */
function renderAllDoneState() {
  return `
    <section class="empty-state" aria-labelledby="menu-done-title">
      ${backLink("#/avui", "Tornar a Avui")}
      <i data-lucide="star" aria-hidden="true" style="color: var(--color-ia-500); width:72px; height:72px;"></i>
      <h1 id="menu-done-title">Avui ja està!</h1>
      <p style="color: var(--color-text-secondary); max-width: 360px;">
        Demà a les 9 h tornes a entrenar.
      </p>
      <a href="#/avui" class="btn-primary">
        <i data-lucide="arrow-left" aria-hidden="true"></i>
        <span>Tornar a Avui</span>
      </a>
    </section>
  `;
}

/* Sidebar amb context de la rutina. */
function renderSidebar() {
  const { workout } = state.today;
  return `
    <aside class="view-sidebar" aria-label="Context d'avui">
      <article class="card">
        <div class="section-heading">
          <span class="label">RUTINA D'AVUI</span>
          <h2 style="font-size: var(--text-lg);">${workout.completedCount} / ${workout.exercises.length}</h2>
        </div>
        <p style="color: var(--color-text-secondary);">
          Grup muscular: <strong>${escape(workout.muscleGroup)}</strong>
        </p>
        <a href="#/entrenar/rutina" class="btn-tertiary" style="margin-top: var(--space-2);">
          Veure rutina
          <i data-lucide="arrow-right" aria-hidden="true"></i>
        </a>
      </article>
    </aside>
  `;
}
