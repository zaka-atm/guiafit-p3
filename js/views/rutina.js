/**
 * rutina.js — Vista "Rutina d'avui".
 *
 * Mostra els 6 exercicis de la rutina d'esquena amb:
 *  - Barra de progrés (X / 6 fets) — [Nielsen-1]
 *  - Cards clicables amb número, nom, sets/reps/descans/múscul
 *  - Estat visual diferenciat per a exercicis fets
 *  - Empty state si la rutina està completa [Patró-6]
 *  - Sidebar contextual a desktop amb mini-resums
 *
 * Compleix:
 *  - [Nielsen-4] Consistència: mateix patró que vista de menú (Tasca 2)
 *  - [Nielsen-5] Reconèixer: tot a la vista, no cal recordar
 */

import { state } from "../state.js";
import { progressBar, backLink } from "../components.js";
import { escape } from "../utils.js";

export function renderRutina() {
  const { workout } = state.today;
  const exercises = workout.exercises;
  const completedCount = workout.completedCount;
  const total = exercises.length;

  // [Patró-6] Empty state quan tot està fet
  if (completedCount === total) {
    return renderCompletedState();
  }

  return `
    <section class="view-rutina view-with-sidebar" aria-labelledby="rutina-title">

      <div class="view-main">
        ${backLink("#/avui", "Tornar a Avui")}

        <header class="view-rutina-header">
          <span class="mono-uppercase">RUTINA D'AVUI · ESQUENA</span>
          <h1 id="rutina-title">Dia d'esquena</h1>
          <p style="color: var(--color-text-secondary);">
            ${total} exercicis · estimació ~${workout.durationEstimate} min
          </p>
        </header>

        <div class="view-rutina-progress">
          ${progressBar(completedCount, total, `Progrés rutina: ${completedCount} de ${total} fets`)}
          <span class="mono-uppercase" aria-live="polite">${completedCount} / ${total} fets</span>
        </div>

        <ol class="rutina-list" aria-label="Llista d'exercicis de la rutina">
          ${exercises.map((ex, i) => renderExerciseCard(ex, i + 1)).join("")}
        </ol>
      </div>

      ${renderSidebar()}
    </section>
  `;
}

/**
 * Card individual d'un exercici dins la llista.
 * És un enllaç a la vista de detall.
 */
function renderExerciseCard(ex, num) {
  const detailParts = [
    `${ex.sets}×${ex.reps}`,
    `${ex.restSeconds} s descans`,
    ex.muscle,
  ];
  return `
    <li>
      <a href="#/entrenar/exercici/${escape(ex.id)}"
         class="exercise-card ${ex.completed ? "is-done" : ""}"
         aria-label="Exercici ${num}: ${escape(ex.name)}${ex.completed ? ", completat" : ""}">
        <span class="exercise-card-num" aria-hidden="true">
          ${ex.completed ? '<i data-lucide="check" style="width:18px;height:18px;"></i>' : num}
        </span>
        <span class="exercise-card-info">
          <span class="exercise-card-name">
            ${escape(ex.name)}
            ${ex.isAlternative ? '<span class="badge-ia" style="margin-left: var(--space-2);">IA</span>' : ""}
          </span>
          <span class="exercise-card-meta">${escape(detailParts.join(" · "))}</span>
        </span>
        ${ex.completed
          ? '<span class="badge-status badge-done">Fet</span>'
          : '<i data-lucide="chevron-right" aria-hidden="true"></i>'}
      </a>
    </li>
  `;
}

/* ============================================
   Empty state — patró nº 6
   ============================================ */
function renderCompletedState() {
  return `
    <section class="empty-state" aria-labelledby="rutina-complete-title">
      ${backLink("#/avui", "Tornar a Avui")}
      <i data-lucide="trophy" aria-hidden="true" style="color: var(--color-ia-500); width:72px; height:72px;"></i>
      <h1 id="rutina-complete-title">Rutina completada!</h1>
      <p style="color: var(--color-text-secondary); max-width: 360px;">
        Pots descansar o revisar el menú d'avui per al sopar.
      </p>
      <div style="display: flex; gap: var(--space-3); flex-wrap: wrap; justify-content: center;">
        <a href="#/menjar/menu" class="btn-primary">
          <span>Veure menú</span>
          <i data-lucide="arrow-right" aria-hidden="true"></i>
        </a>
        <a href="#/avui" class="btn-secondary">Tornar a Avui</a>
      </div>
    </section>
  `;
}

/* ============================================
   Sidebar contextual (desktop)
   ============================================ */
function renderSidebar() {
  const { meals } = state.today;
  const completedMeals = meals.filter(m => m.completed).length;
  const pendingMeal = meals.find(m => !m.completed);

  return `
    <aside class="view-sidebar" aria-label="Context d'avui">

      <article class="card">
        <div class="section-heading">
          <span class="label">MENÚ D'AVUI</span>
          <h2 style="font-size: var(--text-lg);">${completedMeals} / ${meals.length} fets</h2>
        </div>
        ${pendingMeal ? `
          <p style="color: var(--color-text-secondary);">
            Pendent: <strong>${escape(pendingMeal.name)}</strong>
            ${pendingMeal.hasIngredientIssue ? '<br><span style="color: var(--color-error);">Falta un ingredient</span>' : ""}
          </p>
          <a href="#/menjar/menu" class="btn-tertiary" style="margin-top: var(--space-2);">
            Veure menú
            <i data-lucide="arrow-right" aria-hidden="true"></i>
          </a>
        ` : '<p style="color: var(--color-text-secondary);">Tots els àpats fets.</p>'}
      </article>

      <article class="card">
        <div class="section-heading">
          <span class="label">PROGRÉS · SETMANA ${state.progress.weekNumber}</span>
          <h2 style="font-size: var(--text-lg);">${state.progress.sessionsCompleted} / ${state.progress.sessionsPlanned}</h2>
        </div>
        <div class="week-dots">
          ${state.progress.weekDays.map(d => {
            const done = state.progress.daysActive.includes(d);
            const isToday = d === state.progress.today;
            return `<span class="week-dot ${done ? "is-done" : ""} ${isToday ? "is-today" : ""}" aria-label="${escape(d)}">${escape(d)}</span>`;
          }).join("")}
        </div>
      </article>

    </aside>
  `;
}
