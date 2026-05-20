/**
 * exercici.js — Vista de detall d'un exercici.
 *
 * Mostra:
 *  - Breadcrumb ← Tornar a la rutina [Nielsen-3]
 *  - Etiqueta "EXERCICI N / 6 · ESQUENA"
 *  - Barra de progrés global de la rutina
 *  - Títol + meta (sets × reps · descans · múscul)
 *  - Video placeholder + label
 *  - Botó "Màquina ocupada?" (només si hasAvailabilityIssue) [Patró-4]
 *  - 3 claus de tècnica [Patró-7]
 *  - CTA primari "Començar exercici →" / "Marcar com a fet ✓"
 *  - Sticky CTA en mòbil [Patró-5]
 */

import { state, markExerciseDone } from "../state.js";
import { progressBar, backLink, videoPlaceholder } from "../components.js";
import { escape, showToast, refreshIcons } from "../utils.js";

/**
 * @param {string} exerciseId - ID de l'exercici dins de la rutina
 */
export function renderExercici(exerciseId) {
  const { workout } = state.today;
  const exercises = workout.exercises;
  const idx = exercises.findIndex(ex => ex.id === exerciseId);

  if (idx === -1) {
    return `
      <section class="empty-state">
        ${backLink("#/entrenar/rutina")}
        <h1>Exercici no trobat</h1>
        <p>L'identificador <code>${escape(exerciseId)}</code> no existeix a la rutina.</p>
      </section>
    `;
  }

  const ex = exercises[idx];
  const num = idx + 1;
  const total = exercises.length;

  // Substitució vs original: si és alternativa, mostrem l'origen
  const originBadge = ex.isAlternative
    ? `<span class="mono-uppercase" style="color: var(--color-ia-700);">
         SUBSTITUEIX · ${escape((ex.originalName || ex.originalId || "").toUpperCase())}
       </span>`
    : "";

  return `
    <section class="view-exercici" aria-labelledby="exercici-title">

      ${backLink("#/entrenar/rutina", "Tornar a la rutina")}

      <header class="exercici-header">
        <span class="mono-uppercase">EXERCICI ${num} / ${total} · ESQUENA</span>
        ${originBadge}

        ${progressBar(workout.completedCount, total, `Progrés rutina: ${workout.completedCount} de ${total} fets`)}

        <h1 id="exercici-title">${escape(ex.name)}</h1>

        <div class="exercici-meta">
          <span><strong>${ex.sets}×${ex.reps}</strong></span>
          <span>·</span>
          <span>descans ${ex.restSeconds} s</span>
          <span>·</span>
          <span>grup: ${escape(ex.muscle)}</span>
        </div>
      </header>

      ${videoPlaceholder(`VÍDEO TÈCNICA · ${escape(ex.name.toUpperCase())}`)}

      <!-- [Patró-7] Inline contextual help: 3 claus de tècnica -->
      <!-- [Nielsen-7] Ajuda i documentació: claus de tècnica accessibles entre sèries -->
      <div class="tech-keys" aria-labelledby="tech-keys-label-${escape(ex.id)}">
        <span class="tech-keys-label" id="tech-keys-label-${escape(ex.id)}">3 CLAUS DE TÈCNICA</span>
        <ol>
          ${ex.techniqueKeys.map(k => `<li>${escape(k)}</li>`).join("")}
        </ol>
      </div>

      <!-- Botó IA contextual: "Màquina ocupada?" (només si l'exercici el té marcat) -->
      <div class="exercici-actions">
        ${ex.hasAvailabilityIssue ? `
          <button class="btn-ia-block"
                  data-action="open-alternatives"
                  data-exercise-id="${escape(ex.id)}"
                  aria-label="Demanar 3 alternatives a la IA per màquina ocupada">
            <span class="btn-ia-block-title">
              <i data-lucide="alert-circle" aria-hidden="true"></i>
              <span>Màquina ocupada?</span>
            </span>
            <span class="btn-ia-block-subtext">La IA et proposarà 3 alternatives equivalents</span>
          </button>
        ` : ""}
      </div>

      <!-- CTA primari (sticky en mòbil) -->
      <!-- [Nielsen-6] Disseny minimalista: una sola acció primària per pantalla -->
      <div class="sticky-cta">
        ${ex.completed ? `
          <button class="btn-secondary" disabled aria-disabled="true">
            <i data-lucide="check" aria-hidden="true"></i>
            <span>Ja completat</span>
          </button>
        ` : `
          <button class="btn-primary"
                  data-action="mark-exercise-done"
                  data-exercise-id="${escape(ex.id)}">
            <span>Marcar com a fet</span>
            <i data-lucide="check" aria-hidden="true"></i>
          </button>
        `}
      </div>

    </section>
  `;
}

/**
 * Event handler delegat per a la vista d'exercici.
 * Capta els clicks dins de la vista i actua segons data-action.
 */
export function onExerciciClick(e) {
  // Acció: marcar exercici com a fet
  const markBtn = e.target.closest('[data-action="mark-exercise-done"]');
  if (markBtn) {
    e.preventDefault();
    const id = markBtn.dataset.exerciseId;
    // [Patró-2] Optimistic UI
    markExerciseDone(id);
    // [Patró-3] Toast
    showToast("Exercici completat ✓", "check");
    // Després d'un instant, naveguem a la vista de "completat"
    setTimeout(() => {
      window.location.hash = "#/entrenar/completat";
    }, 250);
    return;
  }

  // Acció: obrir el sheet d'alternatives IA (Tasca 1, [Patró-4])
  const altBtn = e.target.closest('[data-action="open-alternatives"]');
  if (altBtn) {
    e.preventDefault();
    const id = altBtn.dataset.exerciseId;
    // Naveguem a la ruta d'alternatives — la vista en si decideix
    // de presentar-se com a sheet o com a pàgina.
    window.location.hash = `#/entrenar/alternatives/${id}`;
    return;
  }
}
