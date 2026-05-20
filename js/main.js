/**
 * main.js — Punt d'entrada (bootstrap) de l'app.
 *
 * 1. Inicialitza la topnav.
 * 2. Inicialitza el router (escolta hashchange i carrega la vista inicial).
 * 3. Registra event delegation global per a:
 *      - Botó hamburger
 *      - Clicks dins del drawer
 *      - Subscripcions a canvis d'estat (re-render)
 */

import { initRouter, handleRouteChange } from "./router.js";
import { renderTopNav, openMobileDrawer, closeMobileDrawer } from "./components.js";
import { subscribe, state } from "./state.js";
import { onDashboardClick } from "./views/dashboard.js";
import { onExerciciClick } from "./views/exercici.js";
import { onAlternativesExerciciClick } from "./views/alternatives-exercici.js";

/**
 * Inicialitza l'app un cop el DOM està a punt.
 */
function bootstrap() {
  // Topnav inicial (es re-renderitza a cada canvi de ruta)
  renderTopNav("avui");

  // Inicialitzem el router (escolta hashchange i fa el primer render)
  initRouter();

  // Si carreguem sense hash, posem #/avui per defecte
  if (!window.location.hash) {
    window.location.hash = "#/avui";
  } else {
    handleRouteChange();
  }

  // === EVENT DELEGATION ===

  // Hamburger menu (mòbil)
  document.addEventListener("click", (e) => {
    const hamburger = e.target.closest("#btn-hamburger");
    if (hamburger) {
      openMobileDrawer();
      return;
    }
    const closeDrawerBtn = e.target.closest("#btn-close-drawer");
    if (closeDrawerBtn) {
      closeMobileDrawer();
      return;
    }
    // Click a links dins del drawer: tanca el drawer després de navegar
    const drawerLink = e.target.closest(".mobile-drawer a");
    if (drawerLink) {
      // Petit delay perquè el hash canviï abans
      setTimeout(closeMobileDrawer, 0);
      return;
    }

    // Handlers per vista (event delegation)
    onDashboardClick(e);
    onExerciciClick(e);
    onAlternativesExerciciClick(e);
  });

  // === SUBSCRIPCIÓ A CANVIS D'ESTAT ===
  // Quan canvia l'estat (ex: marcar exercici fet), re-renderitzem la vista actual.
  subscribe(() => {
    handleRouteChange();
  });

  console.info("GuIAFit P3 prototype carregat.");
}

// DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
