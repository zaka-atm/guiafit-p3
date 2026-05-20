/**
 * state.js — Estat global de l'aplicació GuIAFit.
 *
 * Gestió simple amb un objecte mutable + sistema de subscribers
 * per re-renderitzar les vistes quan canvia l'estat.
 *
 * Decisió de disseny: no usem localStorage perquè el prototip
 * es reseteja a cada càrrega (millor per al test d'usuari, que
 * sempre vol començar des de zero).
 */

import {
  backWorkoutExercises,
  todayMeals,
  todayContext,
  contextSignals,
  weeklyProgress,
  userData,
} from "./data.js";

// === ESTAT INICIAL ===
export const state = {
  user: { ...userData },

  today: {
    ...todayContext,
    workout: {
      muscleGroup: "esquena",
      durationEstimate: 45,  // minuts aproximats
      currentExerciseIndex: 0,
      completedCount: 0,
      // Copiem per evitar mutacions accidentals als arrays originals
      exercises: backWorkoutExercises.map(ex => ({ ...ex, techniqueKeys: [...ex.techniqueKeys] })),
    },
    meals: todayMeals.map(meal => ({
      ...meal,
      ingredients: meal.ingredients.map(ing => ({ ...ing })),
    })),
  },

  contextSignals: { ...contextSignals },
  progress: { ...weeklyProgress },

  // === UI ===
  ui: {
    currentRoute: "#/avui",
    isLoading: false,
    activeToast: null,            // { message, id, icon }
    activeSheet: null,            // { type, props } | null
    mobileDrawerOpen: false,
    rutinaSelectedExerciseId: "pull-down",
    apatSelectedMealId: "sopar",
    selectedAlternativeId: null,
  },

  // === Progres del test d'usuari (per a anàlisi posterior) ===
  taskProgress: {
    task1Started: false,
    task1Completed: false,
    task1StartTime: null,
    task1EndTime: null,
    task2Started: false,
    task2Completed: false,
    task2StartTime: null,
    task2EndTime: null,
  },
};

// === SUBSCRIBERS PATTERN ===
const subscribers = new Set();

/**
 * Subscriu una funció als canvis d'estat.
 * Retorna una funció per cancel·lar la subscripció.
 */
export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/**
 * Aplica updates al nivell superior de state (merge superficial).
 * Per a updates profunds, modificar state directament i cridar notifySubscribers().
 */
export function setState(updates) {
  Object.assign(state, updates);
  notifySubscribers();
}

/**
 * Notifica tots els subscribers que l'estat ha canviat.
 */
export function notifySubscribers() {
  subscribers.forEach(fn => fn(state));
}

/* ============================================
   HELPERS DE MUTACIÓ
   ============================================ */

/**
 * Marca un exercici com a completat.
 * Patró nº 2: Optimistic UI — l'estat canvia immediatament.
 */
export function markExerciseDone(exerciseId) {
  const exercise = state.today.workout.exercises.find(ex => ex.id === exerciseId);
  if (exercise && !exercise.completed) {
    exercise.completed = true;
    state.today.workout.completedCount++;
    notifySubscribers();
  }
}

/**
 * Substitueix un exercici per una alternativa de la IA.
 * Conserva l'estat de completat=false i marca isAlternative=true.
 */
export function replaceExercise(originalId, alternativeData) {
  const idx = state.today.workout.exercises.findIndex(ex => ex.id === originalId);
  if (idx === -1) return;

  state.today.workout.exercises[idx] = {
    ...alternativeData,
    completed: false,
    isAlternative: true,
    originalId: originalId,
    originalName: state.today.workout.exercises[idx].name,
  };
  notifySubscribers();
}

/**
 * Marca un àpat com a completat.
 * Patró nº 2: Optimistic UI.
 */
export function markMealDone(mealId) {
  const meal = state.today.meals.find(m => m.id === mealId);
  if (meal && !meal.completed) {
    meal.completed = true;
    meal.completedAt = new Date().toTimeString().slice(0, 5);
    notifySubscribers();
  }
}

/**
 * Substitueix un àpat per una recepta alternativa.
 * Manté l'id i el nom de l'àpat però canvia descripció i ingredients.
 */
export function replaceMeal(mealId, recipeData) {
  const meal = state.today.meals.find(m => m.id === mealId);
  if (!meal) return;

  meal.description = recipeData.name;
  meal.ingredients = recipeData.ingredients.map(ing => ({
    name: ing.name,
    quantity: ing.visual,
  }));
  meal.alternativeApplied = true;
  meal.alternativeId = recipeData.id;
  meal.hasIngredientIssue = false;
  meal.missingIngredient = null;
  notifySubscribers();
}

/**
 * Markers d'estat de tasca per al test d'usuari.
 */
export function startTask(n) {
  const key = `task${n}Started`;
  const tkey = `task${n}StartTime`;
  if (!state.taskProgress[key]) {
    state.taskProgress[key] = true;
    state.taskProgress[tkey] = Date.now();
  }
}

export function completeTask(n) {
  const key = `task${n}Completed`;
  const tkey = `task${n}EndTime`;
  if (!state.taskProgress[key]) {
    state.taskProgress[key] = true;
    state.taskProgress[tkey] = Date.now();
  }
}
