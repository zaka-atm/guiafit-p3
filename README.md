# GuIAFit · Prototip P3

Pràctica 3 de l'assignatura **Factors Humans i Computació (FHiC)** — Universitat de Barcelona, curs 2025-2026.

**Grup AF4** — Zakaria Ait Moha, Anass Baki, Danyal Anwar Akhtar

## Prototip en viu

https://zaka-atm.github.io/guiafit-p3/

## Descripció

GuIAFit és una proposta de web responsiva que integra entrenament i nutrició amb un assistent virtual contextual. Aquest repositori conté el prototip funcional d'alta fidelitat desenvolupat per a la Pràctica 3 de l'assignatura.

El prototip implementa 2 tasques principals:

1. **Substituir un exercici** quan el gimnàs està saturat.
2. **Decidir el sopar** quan falta un ingredient.

La proposta de valor és la fricció cognitiva propera a zero gràcies a un assistent virtual que connecta de manera contextual les decisions d'entrenament i d'alimentació. Es tracta d'una simulació al front-end (sense backend real): totes les respostes contextuals estan pre-definides per permetre el test d'usuari.

## Com explorar el prototip

L'app obre per defecte al Dashboard "Avui" (`#/avui`). Des d'allà es poden seguir les dues tasques principals end-to-end:

### Tasca 1 — Substituir un exercici (gimnàs saturat)

1. Dashboard → clic a "Començar" a la targeta de Rutina.
2. Llista de 6 exercicis d'esquena → clic al primer (Pull-down a la politja alta).
3. Detall de l'exercici → clic a "Màquina ocupada?".
4. S'obre un sheet (bottom sheet en mòbil / side panel en desktop) amb skeleton durant 1.2 s i després 3 alternatives.
5. Clic "Triar" a qualsevol opció (per exemple, Remo amb manuella).
6. Detall de l'alternativa → clic a "Marcar com a fet".
7. Vista d'èxit amb el següent exercici suggerit.

### Tasca 2 — Decidir el sopar (ingredient faltant)

1. Dashboard → "Veure detall" a la targeta de Menú.
2. Llista d'àpats (esmorzar/dinar fets, sopar pendent amb badge "Falta ingredient").
3. Clic al Sopar → ingredients amb el pollastre marcat com a "Falta".
4. Clic a "Em falta un ingredient" → selector d'ingredients dins d'un sheet.
5. Clic a Pollastre → 3 receptes alternatives. La capçalera menciona explícitament *"Avui has entrenat esquena"*: aquesta és la connexió entre dominis (proposta de valor de GuIAFit).
6. Clic "Triar" en una recepta (per exemple, Bol d'arròs amb tonyina).
7. Detall de la recepta amb porcions visuals (1 bol, 2 llaunes…) sense grams ni calories.
8. Clic a "Marcar com a fet".

## Executar localment

No cal cap procés de build. Només cal un servidor estàtic:

```bash
# Amb Python 3
python -m http.server 8000

# Amb Node.js
npx http-server -p 8000

# Amb PHP
php -S localhost:8000
```

Després s'obre [http://localhost:8000](http://localhost:8000) al navegador.

## Tecnologies

- HTML5 semàntic
- CSS3 amb variables CSS pròpies (`css/tokens.css`)
- Tailwind CSS via CDN (utility classes)
- JavaScript vanilla ES6+ (sense framework, sense build)
- Inter + JetBrains Mono (Google Fonts)
- Lucide Icons via CDN

## Estructura

```
guiafit-p3/
├── index.html              Punt d'entrada únic (SPA)
├── css/
│   ├── tokens.css          Variables CSS (colors, tipografia, espais)
│   ├── base.css            Reset i estils globals
│   ├── components.css      Botons, cards, sheet, toast, skeleton
│   └── views.css           Estils específics per vista
├── js/
│   ├── main.js             Bootstrap de l'app
│   ├── state.js            Estat global i subscribers
│   ├── router.js           Hash-based routing
│   ├── data.js             Dades de rutines, àpats, ingredients
│   ├── ia-mock.js          Respostes contextuals simulades amb delay
│   ├── components.js       Generadors HTML de components reutilitzables
│   ├── utils.js            Helpers (toast, escape, refreshIcons)
│   └── views/              Una vista per funcionalitat
└── assets/                 Icones i placeholders
```

## Crèdits del grup

Hem treballat de manera col·laborativa en totes les fases de la pràctica. La taula següent indica el repartiment principal del lideratge de cada bloc, però totes les decisions de disseny i de redacció s'han pres conjuntament.

| Membre | Lideratge principal |
|---|---|
| Zakaria Ait Moha | Arquitectura del prototip i implementació front-end |
| Anass Baki | Sistema de disseny, accessibilitat i redacció de la memòria |
| Danyal Anwar Akhtar | Planificació del test, instruments i anàlisi de resultats |

## Notes tècniques

- **Idioma**: tot el contingut visible és en català.
- **Accessibilitat**: el prototip compleix WCAG 2.1 AA (focus visible, ARIA labels, contrast ≥ 4.5:1, navegació amb teclat, suport per a `prefers-reduced-motion`).
- **Responsive**: funciona en mòbil (≥ 375 px), tablet (≥ 768 px) i desktop (≥ 1024 px).
- **Simulació contextual**: les respostes pre-definides es troben a `js/ia-mock.js` amb un delay de 1200 ms per fer la simulació més creïble durant el test d'usuari.
- **Limitació coneguda**: refrescar la pàgina perd l'estat (no fem servir localStorage). És acceptable per a un prototip pensat per a un test guiat de 5-10 minuts.

## Patrons de disseny implementats

Cada patró es marca al codi amb un comentari `// [Patró-N]` on s'aplica:

| # | Patró | On s'aplica |
|---|---|---|
| 1 | Skeleton Screens | Durant els 1200 ms de càrrega simulada, a `alternatives-exercici.js` i `alternatives-recepta.js`. |
| 2 | Optimistic UI | `markExerciseDone`, `markMealDone`, `applyRecommendation` — l'estat canvia abans de qualsevol confirmació simulada. |
| 3 | Toast Notifications | `showToast` a `utils.js`. Confirmacions de 3 s després de marcar fet o aplicar recomanació. |
| 4 | Bottom Sheet / Side Panel | `openSheet` a `components.js`. Bottom sheet en mòbil, side panel a desktop ≥ 768 px. |
| 5 | Sticky CTA | Botons primaris d'acció amb `.sticky-cta` — sempre al abast del polze en mòbil. |
| 6 | Empty States | "Rutina completada" (trofeu) i "Avui ja està" (estrella) quan no queda res a fer. |
| 7 | Inline Contextual Help | "3 claus de tècnica" dins de la caixa `.tech-keys` a la vista de detall d'exercici. |

## Heurístiques de Nielsen aplicades

Cada heurística es marca al codi amb `// [Nielsen-N]`:

| # | Heurística | Aplicació |
|---|---|---|
| 1 | Visibilitat de l'estat | Barres de progrés (1/6, 2/6...), skeleton screens, toast de confirmació, `aria-live`. |
| 2 | Coincidència món real | "Màquina ocupada?", "Em falta un ingredient"; porcions visuals (1 bol, 2 ous) en lloc de grams. |
| 3 | Control i llibertat | Botó "Tornar" sempre disponible; Esc tanca sheets i drawer; backdrop click tanca. |
| 4 | Consistència | Mateix patró Wizard per a les 2 tasques; mateixos botons primaris teal. |
| 5 | Reconèixer en lloc de recordar | Dashboard mostra els 6 exercicis i 3 àpats d'un cop d'ull. |
| 6 | Disseny minimalista | Una sola acció primària per pantalla en mode Wizard. |
| 7 | Ajuda i documentació | "3 claus de tècnica" sota el vídeo de cada exercici. |

## Llicència

Aquest projecte és un treball acadèmic per a la Universitat de Barcelona. Tot el contingut és propietat del grup AF4.
