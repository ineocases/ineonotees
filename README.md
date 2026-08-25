# INEO Notes

Proyecto React + TypeScript + Vite + Firebase ya configurado para `ineonotees`.

## Arranque

No abras `index.html` con doble clic. Eso provoca el 404 de `main.tsx` porque Vite debe resolver los módulos.

```bash
npm install
npm run dev
```

Luego abre la URL que muestre Vite, normalmente `http://localhost:5173/`.

## Firebase

En Firebase Console activa:

1. Authentication > Sign-in method > Email/Password.
2. Firestore Database.
3. Storage.

Publica las reglas de `firebase/firestore.rules` y `firebase/storage.rules`.

## Incluye

- Registro/login/logout
- Recuperación de contraseña
- Biblioteca
- Carpetas
- Cuadernos
- Favoritos
- Plantillas
- Páginas
- Canvas de escritura
- Pluma
- Resaltador
- Colores/grosor
- Undo/redo
- Persistencia de páginas en Firestore
- Reglas privadas por usuario
- Base para Storage

## Próximo desarrollo

- Goma real por trazo/segmento
- Lasso
- Apple Pencil/presión mejorados
- Zoom/pan
- Texto/imágenes
- PDF
- IndexedDB/offline-first
- Cola de sincronización
- Audio
- Compartir
