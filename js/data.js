/**
 * data.js — Dades mock per al prototip GuIAFit P3.
 *
 * Tot el contingut és estàtic i hard-coded segons el guió de P2.
 * NO connectar a cap API real: és un prototip de fidelitat alta
 * per a un test d'usuari, no una aplicació de producció.
 */

// === USUARI ===
export const userData = {
  name: "Àlex",
  age: 26,
};

// === CONTEXT DEL DIA ===
// Coincideix amb el guió narratiu del test (Dimecres 18 maig, 18:32h).
export const todayContext = {
  date: "Dimecres 18 maig",
  dateShort: "DC 18 MAI",
  time: "18:32",
  dayOfWeek: "Dimecres",
  weekNumber: 20,
};

// === SENYALS CONTEXTUALS ===
// Influeixen en les recomanacions de la IA mockada.
export const contextSignals = {
  sleepHours: 6,                          // < 7 → recomanació "allargar descans"
  previousWorkoutMuscleGroup: "esquena",  // afecta la priorització proteica del sopar
};

// === PROGRÉS SETMANAL ===
export const weeklyProgress = {
  weekNumber: 20,
  sessionsCompleted: 3,
  sessionsPlanned: 5,
  daysActive:  ["Dl", "Dt", "Dc"],
  daysPending: ["Dj", "Dv"],
  // Ordre de la setmana per renderitzar els 7 cercles
  weekDays: ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"],
  today: "Dc",
};

// === RUTINA D'ESQUENA — 6 EXERCICIS ===
// El primer és "Pull-down" amb hasAvailabilityIssue=true (màquina ocupada).
export const backWorkoutExercises = [
  {
    id: "pull-down",
    name: "Pull-down a la politja alta",
    muscle: "Dorsal ample",
    sets: 4,
    reps: 10,
    restSeconds: 90,
    videoPlaceholder: "pull-down",
    completed: false,
    hasAvailabilityIssue: true,
    techniqueKeys: [
      "Espatlles enrere i pit obert durant tot el moviment.",
      "Baixa la barra fins a l'alçada del pit, no més avall.",
      "Activa el dorsal pensant a 'estirar amb els colzes'.",
    ],
  },
  {
    id: "rem-horitzontal",
    name: "Rem horitzontal a la màquina",
    muscle: "Dorsal ample, romboides",
    sets: 4,
    reps: 10,
    restSeconds: 90,
    videoPlaceholder: "rem-horitzontal",
    completed: false,
    techniqueKeys: [
      "Asseu-te amb el pit aferrat al respaller.",
      "Estira els colzes cap enrere, no els braços.",
      "Mantén l'esquena recta tot el moviment.",
    ],
  },
  {
    id: "pull-over",
    name: "Pull-over amb manuella",
    muscle: "Dorsal ample, serrats",
    sets: 3,
    reps: 12,
    restSeconds: 60,
    videoPlaceholder: "pull-over",
    completed: false,
    techniqueKeys: [
      "Estirat al banc amb cap i espatlles ben recolzats.",
      "Baixa la manuella per darrere del cap mantenint els colzes lleugerament flexionats.",
      "Activa el dorsal en pujar, no els braços.",
    ],
  },
  {
    id: "encongiments",
    name: "Encongiments d'espatlles",
    muscle: "Trapezi",
    sets: 3,
    reps: 12,
    restSeconds: 60,
    videoPlaceholder: "encongiments",
    completed: false,
    techniqueKeys: [
      "Manuelles als costats del cos, braços estesos.",
      "Aixeca les espatlles cap a les orelles, no facis rotació.",
      "Aguanta 1 segon a dalt, baixa controlat.",
    ],
  },
  {
    id: "curl-barra",
    name: "Curl bíceps amb barra",
    muscle: "Bíceps",
    sets: 4,
    reps: 10,
    restSeconds: 60,
    videoPlaceholder: "curl-barra",
    completed: false,
    techniqueKeys: [
      "Colzes enganxats al cos, no els moguis endavant.",
      "Puja la barra controlat, sense impuls de l'esquena.",
      "Baixa en 2 segons fins a estirar el braç.",
    ],
  },
  {
    id: "curl-martell",
    name: "Curl martell",
    muscle: "Bíceps braquial, avantbraç",
    sets: 3,
    reps: 12,
    restSeconds: 60,
    videoPlaceholder: "curl-martell",
    completed: false,
    techniqueKeys: [
      "Manuelles al costat del cos, palmes mirant-se entre elles.",
      "Puja sense rotació, mantenint la mateixa orientació.",
      "Concentra't en els avantbraços, no el moviment alt.",
    ],
  },
];

// === ÀPATS DEL DIA ===
// L'esmorzar i el dinar ja estan fets; el sopar és pendent
// i té un ingredient marcat com a "falta" (pollastre).
export const todayMeals = [
  {
    id: "esmorzar",
    name: "Esmorzar",
    icon: "coffee",
    description: "Iogurt grec amb fruits secs i mel",
    completed: true,
    completedAt: "08:15",
    ingredients: [
      { name: "Iogurt grec", quantity: "1 envàs (150g)" },
      { name: "Ametlles",    quantity: "un grapat" },
      { name: "Nous",        quantity: "4 unitats" },
      { name: "Mel",         quantity: "1 culleradeta" },
    ],
  },
  {
    id: "dinar",
    name: "Dinar",
    icon: "utensils",
    description: "Pollastre a la planxa amb arròs i verdures",
    completed: true,
    completedAt: "13:45",
    ingredients: [
      { name: "Pit de pollastre", quantity: "150g" },
      { name: "Arròs basmati",    quantity: "1 bol" },
      { name: "Carbassó",         quantity: "mig" },
      { name: "Pebrot",           quantity: "mig" },
      { name: "Oli d'oliva",      quantity: "1 cullerada" },
    ],
  },
  {
    id: "sopar",
    name: "Sopar",
    icon: "moon",
    description: "Amanida tèbia amb pollastre",
    completed: false,
    completedAt: null,
    plannedTime: "21:15",
    ingredients: [
      { name: "Pit de pollastre", quantity: "120g",       isMissing: true },
      { name: "Enciam variat",    quantity: "1 bol" },
      { name: "Tomàquet",         quantity: "1 unitat" },
      { name: "Alvocat",          quantity: "mig" },
      { name: "Ou dur",           quantity: "1 unitat" },
      { name: "Oli d'oliva",      quantity: "1 cullerada" },
    ],
    hasIngredientIssue: true,
    missingIngredient: "Pit de pollastre",
  },
];

// === INGREDIENTS DISPONIBLES A LA NEVERA ===
// L'usuari els pot consultar (no és vital però aporta realisme).
export const availableIngredients = [
  { id: "ous",                name: "Ous",                quantity: "6 unitats",   icon: "egg" },
  { id: "arros",              name: "Arròs basmati",      quantity: "mig paquet",  icon: "wheat" },
  { id: "verdura-congelada",  name: "Verdura congelada",  quantity: "1 bossa",     icon: "leaf" },
  { id: "tonyina",            name: "Tonyina (llauna)",   quantity: "2 llaunes",   icon: "fish" },
  { id: "enciam",             name: "Enciam variat",      quantity: "mig paquet",  icon: "salad" },
  { id: "tomaquet",           name: "Tomàquet",           quantity: "2 unitats",   icon: "circle" },
  { id: "alvocat",            name: "Alvocat",            quantity: "1 unitat",    icon: "circle" },
  { id: "oli-oliva",          name: "Oli d'oliva",        quantity: "ampolla",     icon: "droplet" },
];
