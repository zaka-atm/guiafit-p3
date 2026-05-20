/**
 * completat-exercici.js — Pantalla d'èxit després de marcar fet.
 *
 * Es mostra durant uns segons abans de tornar a la rutina.
 * Compleix [Nielsen-1] Visibilitat de l'estat: l'usuari sap
 * clarament que ha completat l'exercici.
 */

import { state } from "../state.js";
import { escape } from "../utils.js";

export function renderCompletatExercici() {
  const { workout } = state.today;
  const exercises = workout.exercises;

  // Trobem l'últim exercici completat (l'últim amb completed=true)
  const completed = [...exercises].reverse().find(ex => ex.completed);
  const lastName = completed ? completed.name : "exercici";
  const isSub = completed?.isAlternative;
  const originalName = completed?.originalName;

  // Següent exercici pendent
  const nextIdx = exercises.findIndex(ex => !ex.completed);
  const next = nextIdx !== -1 ? exercises[nextIdx] : null;

  return `
    <section class="view-completat" aria-labelledby="completat-title">

      <div class="completat-icon" aria-hidden="true">
        <i data-lucide="check"></i>
      </div>

      <h1 id="completat-title">Exercici completat</h1>

      <p style="max-width: 480px;">
        ${isSub && originalName
          ? `Has fet <strong>${escape(lastName)}</strong> en substitució del <strong>${escape(originalName)}</strong>.`
          : `Has fet <strong>${escape(lastName)}</strong>.`}
      </p>

      ${next ? `
        <p class="completat-next">
          SEGÜENT: ${escape(next.name.toLowerCase())} · sèrie 1 / ${next.sets}
        </p>
      ` : `
        <p class="completat-next">RUTINA COMPLETADA</p>
      `}

      <div class="completat-actions">
        ${next ? `
          <a href="#/entrenar/exercici/${escape(next.id)}" class="btn-primary">
            <span>Següent exercici</span>
            <i data-lucide="arrow-right" aria-hidden="true"></i>
          </a>
        ` : `
          <a href="#/entrenar/rutina" class="btn-primary">
            <span>Veure resum</span>
            <i data-lucide="trophy" aria-hidden="true"></i>
          </a>
        `}
        <a href="#/entrenar/rutina" class="btn-tertiary">
          <i data-lucide="pause" aria-hidden="true"></i>
          <span>Pausa · sortir de la rutina</span>
        </a>
      </div>

    </section>
  `;
}
