/**
 * dashboard.js — Vista "Avui".
 *
 * Compleix:
 *  - [Nielsen-5] Reconèixer en lloc de recordar: tot el dia visible d'un cop d'ull.
 *  - [Nielsen-1] Visibilitat de l'estat: progrés rutina (0/6), àpats (2/3), setmana (3/5).
 *  - [Patró-2] Optimistic UI: aplicar recomanació IA actualitza l'estat al moment.
 *  - [Patró-3] Toast: confirmació "Descans allargat a 90 s ✓".
 *  - Mobile-first: una columna; tablet 2 cols; desktop asimètric.
 */

import { state } from "../state.js";
import { getDashboardRecommendation, applyRecommendation } from "../ia-mock.js";
import { progressBar } from "../components.js";
import { escape, showToast, progressPercent } from "../utils.js";

export function renderDashboard() {
  const { user, today, progress } = state;
  const workout = today.workout;
  const meals = today.meals;

  const completedMeals = meals.filter(m => m.completed).length;
  const totalMeals = meals.length;
  const recommendation = getDashboardRecommendation();

  // Mini-preview dels 3 primers exercicis (no inundem la targeta)
  const preview = workout.exercises.slice(0, 3).map((ex, i) => `
    <li class="routine-preview-item">
      <span class="routine-preview-num" aria-hidden="true">${i + 1}</span>
      <span>${escape(ex.name)}</span>
    </li>
  `).join("");

  return `
    <section class="view-dashboard" aria-labelledby="dashboard-title">

      <!-- ============ CAPÇALERA ============ -->
      <header class="dashboard-header">
        <h1 id="dashboard-title">Bon dia, ${escape(user.name)}</h1>
        <p class="subtitle">${escape(today.dayOfWeek)} · ${escape(today.date.replace(today.dayOfWeek + " ", ""))} · ${escape(today.time)} h</p>
      </header>

      <!-- ============ GRID DE TARGETES ============ -->
      <div class="dashboard-grid">

        <!-- TARGETA 1: Rutina d'avui (la més gran) -->
        <article class="card-dashboard dashboard-card-routine" aria-labelledby="card-routine-title">
          <div class="section-heading">
            <span class="label">RUTINA D'AVUI</span>
            <h2 id="card-routine-title">Dia d'esquena</h2>
          </div>
          <p style="color: var(--color-text-secondary);">
            ${workout.exercises.length} exercicis · ~${workout.durationEstimate} min · dorsal, romboides, bíceps
          </p>

          ${progressBar(workout.completedCount, workout.exercises.length, `Progrés rutina: ${workout.completedCount} de ${workout.exercises.length} fets`)}

          <p class="mono-uppercase" aria-live="polite">${workout.completedCount} / ${workout.exercises.length} fets</p>

          <ul class="routine-preview" aria-label="Primers 3 exercicis">
            ${preview}
            ${workout.exercises.length > 3 ? `<li class="routine-preview-item" style="color: var(--color-text-secondary); font-style: italic;">+ ${workout.exercises.length - 3} més…</li>` : ""}
          </ul>

          <div class="card-actions">
            <a href="#/entrenar/rutina" class="btn-primary">
              <span>${workout.completedCount > 0 ? "Continuar rutina" : "Començar"}</span>
              <i data-lucide="arrow-right" aria-hidden="true"></i>
            </a>
            <a href="#/entrenar/rutina" class="btn-tertiary">Veure detall</a>
          </div>
        </article>

        <!-- TARGETA 2: Menú d'avui -->
        <article class="card-dashboard dashboard-card-meals" aria-labelledby="card-meals-title">
          <div class="section-heading">
            <span class="label">MENÚ D'AVUI</span>
            <h2 id="card-meals-title">${totalMeals} àpats</h2>
          </div>
          <p style="color: var(--color-text-secondary);">${meals.map(m => m.name.toLowerCase()).join(" · ")}</p>

          ${progressBar(completedMeals, totalMeals, `Progrés àpats: ${completedMeals} de ${totalMeals} fets`)}

          <p class="mono-uppercase" aria-live="polite">${completedMeals} / ${totalMeals} fets</p>

          <div class="card-actions">
            <a href="#/menjar/menu" class="btn-secondary">
              <span>Veure detall</span>
              <i data-lucide="arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </article>

        <!-- TARGETA 3: Recomanació IA (només si hi és) -->
        ${recommendation ? renderRecommendationCard(recommendation) : renderEmptyRecommendationCard()}

        <!-- TARGETA 4: Progrés setmanal -->
        <article class="card-dashboard dashboard-card-progress" aria-labelledby="card-progress-title">
          <div class="section-heading">
            <span class="label">PROGRÉS · SETMANA ${progress.weekNumber}</span>
            <h2 id="card-progress-title">${progress.sessionsCompleted} / ${progress.sessionsPlanned} sessions previstes</h2>
          </div>

          <div class="week-dots" role="list" aria-label="Dies de la setmana amb sessions">
            ${progress.weekDays.map(d => {
              const done = progress.daysActive.includes(d);
              const isToday = d === progress.today;
              return `<span class="week-dot ${done ? "is-done" : ""} ${isToday ? "is-today" : ""}" role="listitem" aria-label="${escape(d)} ${done ? "fet" : "pendent"}${isToday ? ", avui" : ""}">${escape(d)}</span>`;
            }).join("")}
          </div>

          <p class="mono-uppercase" style="margin-top: var(--space-2);">
            ${progress.sessionsPlanned - progress.sessionsCompleted} sessions pendents aquesta setmana
          </p>
        </article>
      </div>
    </section>
  `;
}

/* ============================================
   TARGETA "Recomanació IA"
   Aplica el patró Optimistic UI quan l'usuari fa clic a "Aplicar".
   ============================================ */
function renderRecommendationCard(rec) {
  return `
    <article class="card-dashboard card-ia dashboard-card-ia" aria-labelledby="card-ia-title" style="padding-top: var(--space-10);">
      <span class="badge-ia" aria-hidden="true">
        <i data-lucide="sparkles" style="width:12px;height:12px;" aria-hidden="true"></i>
        IA
      </span>
      <div class="section-heading">
        <span class="label">RECOMANACIÓ DEL DIA</span>
        <h2 id="card-ia-title" style="font-size: var(--text-lg);">Ajust personalitzat</h2>
      </div>
      <p>${escape(rec.message)}</p>
      <div>
        <button class="btn-primary" id="btn-apply-recommendation" data-rec-id="${escape(rec.id)}">
          <i data-lucide="check" aria-hidden="true"></i>
          <span>${escape(rec.actionLabel)}</span>
        </button>
      </div>
    </article>
  `;
}

function renderEmptyRecommendationCard() {
  return `
    <article class="card-dashboard dashboard-card-ia" aria-labelledby="card-ia-empty-title">
      <div class="section-heading">
        <span class="label">AVÍS IA</span>
        <h2 id="card-ia-empty-title" style="font-size: var(--text-lg);">Tot a punt</h2>
      </div>
      <p style="color: var(--color-text-secondary);">No hi ha ajustaments contextuals pendents per avui.</p>
    </article>
  `;
}

/* ============================================
   Event delegation per al Dashboard
   (s'enganxa al document, vegeu main.js)
   ============================================ */

// Exposem un handler global per a la recomanació IA.
// El crida main.js via event delegation.
export function onDashboardClick(e) {
  const btn = e.target.closest("#btn-apply-recommendation");
  if (!btn) return;
  e.preventDefault();
  // [Patró-2] Optimistic UI: actualitzem l'estat al moment
  applyRecommendation();
  // [Patró-3] Toast: confirmem l'acció
  showToast("Descans allargat a 90 s ✓", "check");
}
