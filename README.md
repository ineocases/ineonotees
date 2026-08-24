# Notes — Goodnotes-inspired app

Base inicial de una aplicación de apuntes con React + TypeScript + Vite + Firebase.

## Incluye

- Registro e inicio de sesión con Firebase Auth.
- Recuperación de contraseña.
- Biblioteca de cuadernos.
- Carpetas.
- Favoritos.
- Papelera/eliminación.
- Cuadernos con páginas.
- Plantillas blanca, rayada, cuadriculada y punteada.
- Editor Canvas.
- Pluma.
- Resaltador.
- Goma preparada para la siguiente iteración.
- Colores y grosor.
- Undo/redo.
- Persistencia de páginas en Firestore.
- Reglas básicas de Firestore y Storage.

## Instalación

1. Instalar Node.js 20+.
2. Ejecutar `npm install`.
3. Crear un proyecto Firebase.
4. Activar Authentication > Email/Password.
5. Crear Firestore Database.
6. Crear Storage.
7. Copiar `.env.example` a `.env`.
8. Completar las variables `VITE_FIREBASE_*`.
9. Publicar las reglas de `firebase/firestore.rules` y `firebase/storage.rules`.
10. Ejecutar `npm run dev`.

## Importante

Las claves públicas de Firebase pueden estar en el frontend; la seguridad real se controla con las reglas de Firestore/Storage.

Este proyecto es la base funcional. El siguiente gran módulo es mejorar el motor de escritura para Apple Pencil, selección/lazo, goma por trazo/segmento, páginas múltiples y almacenamiento offline con cola de sincronización.