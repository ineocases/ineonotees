# Correcciones aplicadas a iNeoNote

- Corregida la carga de `src/main.tsx` usando una ruta relativa en `index.html`, compatible con GitHub Pages bajo una URL de repositorio.
- Mantenido `base: "./"` en Vite para que los assets compilados también usen rutas relativas.
- Agregada la dependencia faltante `react-router-dom`.
- Corregido el export de `firebaseConfigured` en la configuración de Firebase.
- La configuración de Firebase ahora acepta variables `VITE_FIREBASE_*` y conserva los valores del proyecto existente como fallback.
- Agregado `mobile-web-app-capable` para eliminar el warning deprecado mostrado por Chrome.
- Corregido el workflow de GitHub Pages: el proyecto no tenía `package-lock.json`, por lo que `npm ci` y la caché de npm podían fallar. Ahora usa `npm install` y ejecuta typecheck + build antes de publicar.
- Los warnings `MaxListenersExceededWarning` / `ObjectMultipleX` de la captura corresponden al contexto de DevTools/extensión de Chrome, no a un listener creado por la aplicación.
