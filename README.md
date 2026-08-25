# iNeoNote

Aplicación de notas manuscritas con React, TypeScript, Vite y Firebase.

## Desarrollo
`npm install` → `npm run dev`

## Build
`npm run check` → `npm run build`

## GitHub Pages
Usa `HashRouter`, compatible con GitHub Pages. El workflow `.github/workflows/deploy.yml` publica automáticamente `dist` en cada push a `main`. En GitHub: Settings → Pages → Source → GitHub Actions.

## Firebase
Configurá Authentication y Firestore para el dominio donde publiques la app. Las reglas están en `firebase/`.
