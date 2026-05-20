/**
 * perfil.js — Vista "Perfil".
 * No és una de les 2 tasques crítiques; es deixa com a placeholder
 * informant que la funcionalitat arribarà més endavant.
 */

export function renderPerfil() {
  return `
    <section class="view-placeholder">
      <i data-lucide="user-circle-2" aria-hidden="true"></i>
      <h1>Perfil</h1>
      <p>Aquesta secció estarà disponible pròximament.</p>
      <p style="font-family: var(--font-mono); font-size: var(--text-sm);">
        El prototip se centra en les 2 tasques principals: rutina i menú d'avui.
      </p>
      <a href="#/avui" class="btn-secondary">
        <i data-lucide="arrow-left" aria-hidden="true"></i>
        Tornar a Avui
      </a>
    </section>
  `;
}
