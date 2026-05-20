/**
 * router.js — Sistema de routing basat en hash.
 *
 * Format de rutes:
 *   #/avui                                  → Dashboard
 *   #/entrenar/rutina                       → Llista d'exercicis del dia
 *   #/entrenar/exercici/:id                 → Detall d'un exercici
 *   #/entrenar/alternatives/:exerciseId     → 3 alternatives IA (vista normal + sheet)
 *   #/entrenar/completat                    → Exercici completat
 *   #/menjar/menu                           → Llista d'àpats del dia
 *   #/menjar/apat/:id                       → Detall d'un àpat
 *   #/menjar/ingredient/:apatId             → Selector ingredient (sheet)
 *   #/menjar/alternatives/:apatId           → 3 receptes alternatives IA
 *   #/menjar/recepta/:recipeId              → Detall d'una recepta
 *   #/perfil                                → Placeholder "Pròximament"
 */

import { state } from "./state.js";
import { refreshIcons } from "./utils.js";
import { renderTopNav, closeSheet, closeMobileDrawer } from "./components.js";

import { renderDashboard } from "./views/dashboard.js";
import { renderRutina } from "./views/rutina.js";
import { renderExercici } from "./views/exercici.js";
import { renderAlternativesExercici } from "./views/alternatives-exercici.js";
import { renderCompletatExercici } from "./views/completat-exercici.js";
import { renderMenu } from "./views/menu.js";
import { renderApat } from "./views/apat.js";
import { renderIngredient } from "./views/ingredient.js";
import { renderAlternativesRecepta } from "./views/alternatives-recepta.js";
import { renderRecepta } from "./views/recepta.js";
import { renderPerfil } from "./views/perfil.js";

// === Taula de rutes ===
// Cada entrada: pattern (RegExp), view (funció), title, section (per topnav)
const routes = [
  { pattern: /^#\/avui$/,                              view: renderDashboard,            title: "Avui",            section: "avui" },
  { pattern: /^#\/entrenar\/rutina$/,                  view: renderRutina,               title: "Rutina d'avui",   section: "entrenar" },
  { pattern: /^#\/entrenar\/exercici\/([\w-]+)$/,      view: renderExercici,             title: "Exercici",        section: "entrenar" },
  { pattern: /^#\/entrenar\/alternatives\/([\w-]+)$/,  view: renderAlternativesExercici, title: "Alternatives",    section: "entrenar" },
  { pattern: /^#\/entrenar\/completat$/,               view: renderCompletatExercici,    title: "Completat",       section: "entrenar" },
  { pattern: /^#\/menjar\/menu$/,                      view: renderMenu,                 title: "Menú d'avui",     section: "menjar" },
  { pattern: /^#\/menjar\/apat\/([\w-]+)$/,            view: renderApat,                 title: "Àpat",            section: "menjar" },
  { pattern: /^#\/menjar\/ingredient\/([\w-]+)$/,      view: renderIngredient,           title: "Ingredient",      section: "menjar" },
  { pattern: /^#\/menjar\/alternatives\/([\w-]+)$/,    view: renderAlternativesRecepta,  title: "Receptes",        section: "menjar" },
  { pattern: /^#\/menjar\/recepta\/([\w-]+)$/,         view: renderRecepta,              title: "Recepta",         section: "menjar" },
  { pattern: /^#\/perfil$/,                            view: renderPerfil,               title: "Perfil",          section: "perfil" },
];

/**
 * Gestiona el canvi de ruta. Es crida amb hashchange i load.
 */
export function handleRouteChange() {
  const hash = window.location.hash || "#/avui";
  state.ui.currentRoute = hash;

  // Tanquem qualsevol sheet/drawer obert quan canviem de ruta
  closeSheet();
  closeMobileDrawer();

  for (const route of routes) {
    const match = hash.match(route.pattern);
    if (match) {
      // [Nielsen-1] Visibilitat de l'estat: actualitzem el títol del document
      document.title = `GuIAFit · ${route.title}`;

      // Actualitzem la topnav per marcar la secció activa
      renderTopNav(route.section);

      // Renderitzem la vista capturant els paràmetres
      const params = match.slice(1);
      const html = route.view(...params);

      const app = document.getElementById("app");
      if (app) {
        app.innerHTML = html;
        refreshIcons();
        // Scroll-to-top en cada navegació (millora la UX en mòbil)
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }
  }

  // Fallback: redirigim a Dashboard si la ruta no matcheja
  console.warn(`Ruta no trobada: ${hash}. Redirigint a Avui.`);
  window.location.hash = "#/avui";
}

export function navigate(path) {
  window.location.hash = path;
}

export function initRouter() {
  window.addEventListener("hashchange", handleRouteChange);
  window.addEventListener("load", handleRouteChange);
}
