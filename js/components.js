/**
 * components.js — Generadors HTML de components reutilitzables.
 *
 * Cada funció retorna un string HTML. La lògica d'event listeners
 * sovint es delega per event delegation al document (vegeu main.js).
 */

import { escape, refreshIcons, $ } from "./utils.js";

/* ============================================
   TOP NAVIGATION
   ============================================ */

/**
 * Genera la topnav. Es renderitza una vegada al bootstrap i
 * actualitza la classe `is-active` quan canvia la ruta.
 */
export function renderTopNav(activeSection = "avui") {
  const links = [
    { href: "#/avui",            label: "Avui",     section: "avui" },
    { href: "#/entrenar/rutina", label: "Entrenar", section: "entrenar" },
    { href: "#/menjar/menu",     label: "Menjar",   section: "menjar" },
    { href: "#/perfil",          label: "Perfil",   section: "perfil" },
  ];

  const topnav = document.getElementById("topnav");
  if (!topnav) return;

  topnav.innerHTML = `
    <button class="btn-hamburger" id="btn-hamburger" aria-label="Obrir menú de navegació" aria-expanded="false" aria-controls="mobile-drawer">
      <i data-lucide="menu" aria-hidden="true"></i>
    </button>

    <a href="#/avui" class="topnav-logo" aria-label="GuIAFit, anar a Avui">
      <span class="logo-mark" aria-hidden="true"></span>
      <span>GuIAFit</span>
    </a>

    <nav aria-label="Navegació principal">
      <ul class="topnav-links">
        ${links.map(l => `
          <li>
            <a href="${l.href}" class="${l.section === activeSection ? "is-active" : ""}" ${l.section === activeSection ? 'aria-current="page"' : ""}>
              ${escape(l.label)}
            </a>
          </li>
        `).join("")}
      </ul>
    </nav>

    <div class="topnav-profile" role="img" aria-label="Perfil d'Àlex">À</div>
  `;

  renderMobileDrawer(activeSection, links);
  refreshIcons();
}

/**
 * Renderitza el drawer mòbil amb la mateixa navegació.
 */
function renderMobileDrawer(activeSection, links) {
  const drawer = document.getElementById("mobile-drawer");
  if (!drawer) return;

  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "true");
  drawer.setAttribute("aria-label", "Menú de navegació");
  drawer.innerHTML = `
    <div class="mobile-drawer-panel">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <a href="#/avui" class="topnav-logo">
          <span class="logo-mark" aria-hidden="true"></span>
          <span>GuIAFit</span>
        </a>
        <button class="btn-icon" id="btn-close-drawer" aria-label="Tancar menú">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </div>
      <nav aria-label="Navegació mòbil">
        <ul>
          ${links.map(l => `
            <li><a href="${l.href}" class="${l.section === activeSection ? "is-active" : ""}">${escape(l.label)}</a></li>
          `).join("")}
        </ul>
      </nav>
    </div>
  `;
}

/* ============================================
   MOBILE DRAWER — obrir/tancar
   ============================================ */

export function openMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  const btn = document.getElementById("btn-hamburger");
  if (!drawer) return;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  if (btn) btn.setAttribute("aria-expanded", "true");
  // [Nielsen-3] Control i llibertat: Esc tanca el drawer
  document.addEventListener("keydown", drawerEscListener);
}

export function closeMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  const btn = document.getElementById("btn-hamburger");
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  if (btn) {
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  }
  document.removeEventListener("keydown", drawerEscListener);
}

function drawerEscListener(e) {
  if (e.key === "Escape") closeMobileDrawer();
}

/* ============================================
   SHEET — bottom sheet / side panel
   Patró nº 4: Bottom Sheet / Side Panel
   ============================================ */

let lastFocusBeforeSheet = null;

/**
 * Obre un sheet amb el contingut HTML donat.
 * El contingut inclou header (títol + tancar) i body.
 *
 * @param {Object} opts
 * @param {string} opts.title - Títol visible al header del sheet
 * @param {string} opts.bodyHtml - HTML que es renderitza al body
 * @param {string} [opts.ariaLabel] - Label addicional per a a11y
 * @param {Function} [opts.onClose] - Callback en tancar
 */
export function openSheet({ title, bodyHtml, ariaLabel, onClose }) {
  const container = document.getElementById("sheet-container");
  if (!container) return;

  lastFocusBeforeSheet = document.activeElement;

  const titleId = `sheet-title-${Date.now()}`;
  container.innerHTML = `
    <div class="sheet-backdrop" data-sheet-backdrop></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="${titleId}" ${ariaLabel ? `aria-label="${escape(ariaLabel)}"` : ""}>
      <div class="sheet-handle" aria-hidden="true"></div>
      <div class="sheet-header">
        <h2 class="sheet-title" id="${titleId}">${escape(title)}</h2>
        <button class="btn-icon" data-sheet-close aria-label="Tancar ${escape(title)}">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
      </div>
      <div class="sheet-body">${bodyHtml}</div>
    </div>
  `;
  refreshIcons();

  // Listeners
  const backdrop = container.querySelector("[data-sheet-backdrop]");
  const closeBtn = container.querySelector("[data-sheet-close]");
  backdrop?.addEventListener("click", () => closeSheet(onClose));
  closeBtn?.addEventListener("click", () => closeSheet(onClose));
  document.addEventListener("keydown", sheetEscListener);

  // Focus trap bàsic: mou el focus al botó de tancar (o el primer focusable)
  setTimeout(() => {
    const first = container.querySelector(".sheet-body button, .sheet-body a, .sheet-body [tabindex]") || closeBtn;
    first?.focus();
  }, 50);

  function sheetEscListener(e) {
    if (e.key === "Escape") closeSheet(onClose);
  }

  // Guardem la referència per al cleanup
  container.__escListener = sheetEscListener;
}

/**
 * Tanca el sheet actualment obert.
 */
export function closeSheet(onClose) {
  const container = document.getElementById("sheet-container");
  if (!container) return;

  if (container.__escListener) {
    document.removeEventListener("keydown", container.__escListener);
    container.__escListener = null;
  }
  container.innerHTML = "";

  // [Nielsen-3] Retornem el focus a l'element que va obrir el sheet
  if (lastFocusBeforeSheet && typeof lastFocusBeforeSheet.focus === "function") {
    lastFocusBeforeSheet.focus();
    lastFocusBeforeSheet = null;
  }

  if (typeof onClose === "function") onClose();
}

/* ============================================
   SKELETON SCREENS — patró nº 1
   ============================================ */

/**
 * Genera HTML d'esquelet per simular càrrega.
 * Usat durant els 1200ms de "thinking" de la IA.
 */
export function skeletonAlternatives(count = 3) {
  return `
    <div aria-busy="true" aria-live="polite" class="alternatives-list">
      <div class="ia-reasoning">
        <div class="skeleton skeleton-title" style="width:80%"></div>
        <div class="skeleton skeleton-text" style="width:60%"></div>
      </div>
      ${Array(count).fill(0).map(() => `
        <div class="alternative-card">
          <div class="skeleton skeleton-text" style="width:30%"></div>
          <div class="skeleton skeleton-title" style="width:70%"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text" style="width:50%"></div>
        </div>
      `).join("")}
    </div>
  `;
}

/* ============================================
   VIDEO PLACEHOLDER
   ============================================ */
export function videoPlaceholder(label = "VÍDEO TÈCNICA · LOOP 5 S") {
  return `
    <div class="video-placeholder" role="img" aria-label="Vídeo placeholder de la tècnica">
      <i data-lucide="play-circle" aria-hidden="true"></i>
      <span class="video-placeholder-label">${escape(label)}</span>
    </div>
  `;
}

/* ============================================
   PROGRESS BAR
   ============================================ */
export function progressBar(value, max, label) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return `
    <div class="progress" role="progressbar"
         aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="${max}"
         aria-label="${escape(label || `${value} de ${max}`)}">
      <div class="progress-fill" style="width: ${percent}%"></div>
    </div>
  `;
}

/* ============================================
   BREADCRUMB "← Tornar"
   [Nielsen-3] Control i llibertat
   ============================================ */
export function backLink(href, label = "Tornar") {
  return `
    <a href="${href}" class="breadcrumb">
      <i data-lucide="arrow-left" aria-hidden="true"></i>
      <span>${escape(label)}</span>
    </a>
  `;
}
