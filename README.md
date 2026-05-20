# GuIAFit · Prototip P3

> Pràctica 3 de l'assignatura **Factors Humans i Computació (FHiC)** — Universitat de Barcelona, curs 2025-2026.

**Grup AF4** — Zakaria Ait Moha, Anass Baki, Danyal Anwar Akhtar

## 🌐 Prototip en viu

**[https://zaka-atm.github.io/guiafit-p3/](https://zaka-atm.github.io/guiafit-p3/)**

## 📋 Descripció

GuIAFit és una proposta de **web responsiva** que integra entrenament i nutrició amb una IA simulada al front-end. Aquest repositori conté el prototip funcional d'alta fidelitat desenvolupat per a la Pràctica 3 de l'assignatura.

El prototip implementa **2 tasques principals**:

1. **Substituir un exercici** quan el gimnàs està saturat.
2. **Decidir el sopar** quan falta un ingredient.

La proposta de valor és la **fricció cognitiva propera a zero** gràcies a una IA simulada al front-end que connecta de manera contextual les decisions d'entrenament i d'alimentació.

## 🚀 Executar localment

No cal cap procés de build. Només necessites un servidor estàtic:

```bash
# Amb Python 3
python -m http.server 8000

# Amb Node.js
npx http-server -p 8000

# Amb PHP
php -S localhost:8000
```

Llavors obre [http://localhost:8000](http://localhost:8000) al navegador.

## 🛠 Tecnologies

- **HTML5** semàntic
- **CSS3** amb variables CSS pròpies (`css/tokens.css`)
- **Tailwind CSS** via CDN (utility classes)
- **JavaScript** vanilla ES6+ (sense framework, sense build)
- **Inter** + **JetBrains Mono** (Google Fonts)
- **Lucide Icons** via CDN

## 📁 Estructura

```
guiafit-p3/
├── index.html              # Punt d'entrada únic (SPA)
├── css/
│   ├── tokens.css          # Variables CSS (colors, tipografia, espais)
│   ├── base.css            # Reset + estils globals
│   ├── components.css      # Botons, cards, sheet, toast, skeleton…
│   └── views.css           # Estils específics per vista
├── js/
│   ├── main.js             # Bootstrap de l'app
│   ├── state.js            # Estat global + subscribers
│   ├── router.js           # Hash-based routing
│   ├── data.js             # Dades mock (rutines, àpats, ingredients)
│   ├── ia-mock.js          # Mock IA (delay 1200ms + respostes hard-coded)
│   ├── components.js       # Generadors HTML de components reutilitzables
│   ├── utils.js            # Helpers (toast, escape, refreshIcons…)
│   └── views/              # Una vista per funcionalitat
└── assets/                 # Icones, placeholders
```

## 👥 Crèdits del grup

| Membre | Rol a P3 |
|---|---|
| Zakaria Ait Moha | Desenvolupament front-end |
| Anass Baki | Redacció memòria + guia d'estil |
| Danyal Anwar Akhtar | Planificació i execució del test d'usuari |

## 📝 Notes per al codi

- **Idioma**: tot el contingut visible és en català.
- **Accessibilitat**: el prototip compleix WCAG 2.1 AA (vegeu §15 de CLAUDE.md).
- **Responsive**: funciona en mòbil (≥ 375px), tablet (≥ 768px) i desktop (≥ 1024px).
- **IA simulada**: les respostes són hard-coded a `js/ia-mock.js` amb delay simulat de 1200ms per permetre mostrar skeleton screens.
- **Limitació coneguda**: refrescar la pàgina perd l'estat (no fa servir localStorage). Acceptable per a un prototip; no per a producció.

## 🎨 Patrons de disseny implementats

1. **Skeleton Screens** — durant els 1200ms de "thinking" de la IA.
2. **Optimistic UI** — l'estat canvia immediatament al marcar com a fet.
3. **Toast Notifications** — feedback breu després d'una acció.
4. **Bottom Sheet / Side Panel** — alternatives IA dins el flux.
5. **Sticky CTA** — botó principal sempre a l'abast del polze (mòbil).
6. **Empty States** — pantalla "rutina completada" amb missatge positiu.
7. **Inline Contextual Help** — les "3 claus de tècnica" sota cada vídeo.

## 📜 Llicència

Aquest projecte és un treball acadèmic per a la Universitat de Barcelona. Tot el contingut és propietat del grup AF4 i la professora Inmaculada Rodríguez.

## ❓ Pendents de clarificació

- **Vídeos d'exercicis**: actualment placeholders grisos amb icona play. Si s'han d'afegir GIFs reals, passar-los a `/assets/placeholders/`.
- **Imatges de plats**: actualment icones genèriques. Si calen fotos, passar-les a `/assets/images/`.
