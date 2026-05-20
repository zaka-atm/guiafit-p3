/**
 * ia-mock.js — Mock de la IA per al prototip GuIAFit.
 *
 * Simula respostes "intel·ligents" basant-se en el context global.
 * Cada crida té un delay de 1200ms per simular el processament,
 * cosa que permet mostrar skeleton screens (Patró nº 1).
 *
 * IMPORTANT: cap connexió a API real. Totes les respostes són
 * hard-coded i deterministes (millor per al test d'usuari).
 */

import { state } from "./state.js";

/* ============================================
   ALTERNATIVES PER A "MÀQUINA OCUPADA" (Tasca 1)
   Sempre 3 alternatives, totes dorsal ample.
   ============================================ */
const machineOccupiedAlternatives = {
  context: "Substituint Pull-down a la politja alta",
  reasoning: "Aquestes 3 opcions treballen el mateix múscul (dorsal ample).",
  contextNote: "Amb l'equipament que tens lliure ara mateix.",
  alternatives: [
    {
      id: "remo-manuella",
      name: "Remo amb manuella, 1 braç",
      equipment: "Banc pla + manuella",
      sets: 4,
      reps: "10 cada braç",
      restSeconds: 90,
      muscle: "Dorsal ample, romboides",
      difficulty: "Tècnica accessible",
      videoPlaceholder: "remo-manuella",
      techniqueKeys: [
        "Esquena paral·lela al terra, una mà i un genoll al banc.",
        "Estira la manuella cap al maluc, no cap a l'espatlla.",
        "Controla la baixada 2 segons.",
      ],
    },
    {
      id: "pull-over-alt",
      name: "Pull-over amb manuella",
      equipment: "Banc pla + 1 manuella",
      sets: 4,
      reps: 12,
      restSeconds: 60,
      muscle: "Dorsal ample, serrats",
      difficulty: "Més estirament",
      videoPlaceholder: "pull-over",
      techniqueKeys: [
        "Estirat al banc amb cap i espatlles ben recolzats.",
        "Baixa la manuella per darrere del cap mantenint els colzes lleugerament flexionats.",
        "Activa el dorsal en pujar, no els braços.",
      ],
    },
    {
      id: "dominades-assistides",
      name: "Dominades assistides",
      equipment: "Màquina d'assistència",
      sets: 4,
      reps: 8,
      restSeconds: 120,
      muscle: "Dorsal ample, romboides",
      difficulty: "Més exigent però disponible ara",
      videoPlaceholder: "dominades",
      techniqueKeys: [
        "Mans una mica més amples que les espatlles.",
        "Puja fins que la barbeta superi la barra.",
        "Baixa controlat en 2-3 segons.",
      ],
    },
  ],
};

/* ============================================
   ALTERNATIVES PER A "EM FALTA UN INGREDIENT: POLLASTRE" (Tasca 2)
   IMPORTANT: la resposta menciona explícitament que avui
   ha entrenat esquena — demostra la coherència entre dominis.
   ============================================ */
const missingChickenAlternatives = {
  context: "Substituint sopar amb pollastre",
  reasoning: "Avui has entrenat esquena, prioritzem opcions amb un bon aport proteic.",
  contextNote: "Amb el que tens a la nevera ara mateix.",
  alternatives: [
    {
      id: "bol-tonyina",
      name: "Bol d'arròs amb tonyina i verdures",
      prepTimeMinutes: 12,
      proteinSource: "Tonyina (2 llaunes)",
      proteinGrams: 38,
      visualPortions: ["1 bol arròs", "2 llaunes tonyina", "1 cassola verdura"],
      ingredients: [
        { name: "Arròs basmati",     visual: "1 bol" },
        { name: "Tonyina (llauna)",  visual: "2 llaunes" },
        { name: "Verdura congelada", visual: "1 cassola" },
        { name: "Oli d'oliva",       visual: "1 cullerada" },
      ],
      steps: [
        "Bull l'arròs 10 min en aigua salada.",
        "Mentre, saltejar la verdura congelada en una paella amb una mica d'oli.",
        "Quan tot estigui llest, mescla a un bol i afegeix la tonyina escorreguda per sobre.",
      ],
    },
    {
      id: "truita-verdures",
      name: "Truita amb verdures",
      prepTimeMinutes: 15,
      proteinSource: "Ous (3 unitats)",
      proteinGrams: 24,
      visualPortions: ["3 ous", "1 cassola verdura"],
      ingredients: [
        { name: "Ous",               visual: "3 unitats" },
        { name: "Verdura congelada", visual: "1 cassola" },
        { name: "Oli d'oliva",       visual: "1 cullerada" },
      ],
      steps: [
        "Saltejar la verdura congelada en una paella amb oli.",
        "Batre els 3 ous en un bol i incorporar la verdura cuita.",
        "Cuinar la truita 4 min cada cantó a foc mig fins que estigui qualla.",
      ],
    },
    {
      id: "amanida-arros-ou",
      name: "Amanida tèbia d'arròs amb ou dur",
      prepTimeMinutes: 10,
      proteinSource: "Ous durs (2 unitats)",
      proteinGrams: 22,
      visualPortions: ["1 bol arròs", "2 ous durs", "1 tomàquet"],
      ingredients: [
        { name: "Arròs basmati",  visual: "1 bol" },
        { name: "Ou dur",         visual: "2 unitats" },
        { name: "Enciam variat",  visual: "1 grapat" },
        { name: "Tomàquet",       visual: "1 unitat" },
        { name: "Oli d'oliva",    visual: "1 cullerada" },
      ],
      steps: [
        "Bull l'arròs 10 min i deixa entebir.",
        "Pela i trinxa els ous durs i el tomàquet en daus.",
        "Mescla tot amb l'enciam i una mica d'oli al gust.",
      ],
    },
  ],
};

/* ============================================
   RECOMANACIÓ CONTEXTUAL DEL DASHBOARD
   Es mostra si sleepHours < 7 i no s'ha aplicat encara.
   ============================================ */
const dashboardRecommendation = {
  id: "rest-extension",
  message: "Has dormit només 6 h. Et proposo allargar el descans entre sèries a 90 s (en lloc de 60 s).",
  actionLabel: "Aplicar a la rutina",
  applied: false,
};

/* ============================================
   FUNCIONS PÚBLIQUES
   ============================================ */

/**
 * Simula una crida a la IA per obtenir alternatives.
 * Aplica un delay de 1200ms per fer-ho creïble i permetre
 * mostrar skeleton screens (Patró nº 1: Skeleton Screens).
 *
 * @param {string} context - Identificador del context d'alternatives
 *   - "machine-occupied" → 3 exercicis equivalents
 *   - "missing-ingredient-pollastre" → 3 receptes amb el que hi ha
 * @returns {Promise<Object|null>} Objecte amb alternatives o null si context desconegut
 */
export async function getAlternatives(context) {
  // Simular delay de "thinking" de la IA
  await new Promise(resolve => setTimeout(resolve, 1200));

  switch (context) {
    case "machine-occupied":
      return machineOccupiedAlternatives;
    case "missing-ingredient-pollastre":
      return missingChickenAlternatives;
    default:
      console.warn(`Context IA desconegut: ${context}`);
      return null;
  }
}

/**
 * Recupera per ID una alternativa d'exercici.
 * Usat quan l'usuari ha triat una alternativa i naveguem al detall.
 */
export function getExerciseAlternativeById(id) {
  return machineOccupiedAlternatives.alternatives.find(a => a.id === id) || null;
}

/**
 * Recupera per ID una recepta alternativa.
 */
export function getRecipeAlternativeById(id) {
  return missingChickenAlternatives.alternatives.find(a => a.id === id) || null;
}

/**
 * Retorna la recomanació contextual del Dashboard si encara és vigent.
 * Es basa en l'estat actual (sleepHours).
 */
export function getDashboardRecommendation() {
  if (state.contextSignals.sleepHours < 7 && !dashboardRecommendation.applied) {
    return dashboardRecommendation;
  }
  return null;
}

/**
 * Marca la recomanació com aplicada i propaga el canvi a la rutina.
 * Patró nº 2: Optimistic UI — l'estat canvia immediatament sense esperar.
 */
export function applyRecommendation() {
  dashboardRecommendation.applied = true;
  // Allargar tots els descansos curts (60s) a 90s
  state.today.workout.exercises.forEach(ex => {
    if (ex.restSeconds < 90) ex.restSeconds = 90;
  });
}
