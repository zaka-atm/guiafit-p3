/**
 * utils.js — Helpers genèrics per a tot el projecte.
 */

/**
 * Wrapper de querySelector amb log d'error si no troba res.
 * Útil per debug: detecta typos i refs trencades aviat.
 */
export function $(sel, root = document) {
  const el = root.querySelector(sel);
  if (!el) console.warn(`$: element no trobat per a "${sel}"`);
  return el;
}

export function $$(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

/**
 * Crea un node DOM a partir d'un string HTML.
 * El primer node fill esdevé l'element retornat.
 */
export function html(strings, ...values) {
  // Permet usar com a tag template: html`<div>${x}</div>`
  // O com a funció normal: html('<div>...</div>')
  let str;
  if (Array.isArray(strings)) {
    str = strings.reduce((acc, s, i) => acc + s + (values[i] !== undefined ? values[i] : ""), "");
  } else {
    str = strings;
  }
  const template = document.createElement("template");
  template.innerHTML = str.trim();
  return template.content.firstChild;
}

/**
 * Escapa text per inserir-lo de manera segura a HTML.
 * Bàsic, no per a contextos d'atribut amb cometes simples; en aquest
 * prototip totes les dades són hard-coded i controlades.
 */
export function escape(text) {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Calcula el percentatge de progrés (0-100) per a barres de progrés.
 */
export function progressPercent(done, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

/**
 * Aplica/refresca les icones Lucide al DOM injectat.
 * Cridar després de cada render de vista.
 */
export function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

/**
 * Toast — patró nº 3: Toast Notifications.
 * Mostra un missatge breu (3s) i s'oculta amb animació.
 */
export function showToast(message, iconName = "check") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const id = `toast-${Date.now()}`;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.id = id;
  toast.setAttribute("role", "status");
  toast.innerHTML = `
    <i data-lucide="${escape(iconName)}" aria-hidden="true"></i>
    <span>${escape(message)}</span>
  `;
  container.appendChild(toast);
  refreshIcons();

  // Començar fade-out als 2.7s i remoure als 3s
  setTimeout(() => {
    toast.classList.add("toast-leaving");
  }, 2700);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * Anuncia un missatge als lectors de pantalla via aria-live.
 * Útil per a canvis dinàmics fora del flux visual.
 */
export function announce(message) {
  // Reutilitzem el toast-container que ja té aria-live="polite"
  const tmp = document.createElement("span");
  tmp.className = "sr-only";
  tmp.textContent = message;
  const container = document.getElementById("toast-container");
  container?.appendChild(tmp);
  setTimeout(() => tmp.remove(), 1500);
}

/**
 * Format de minuts en text llegible: "12 min", "1 h 5 min".
 */
export function formatMinutes(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
