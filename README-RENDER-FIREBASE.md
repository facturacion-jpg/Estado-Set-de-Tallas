# Publicar Estado de tallas integrado

Esta carpeta contiene la versión de Estado de tallas compatible con el panel. Usa Firebase Authentication y guarda sets y planos en `app_records`, con propietario por cuenta. No publiques la variante antigua que usa `appData/estado-set-de-tallas`.

## Render para el repositorio independiente Estado-Set-de-Tallas

Reemplaza el contenido del repositorio conectado al servicio por el contenido de esta carpeta. En Render conserva:

- Root Directory: vacío
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`

`src/firebase.js` apunta al proyecto `crearte-by-confeccionart-6febe` y no necesita variables `VITE_FIREBASE_*`. Para que funcione el envío de correos, agrega en el Environment del servicio las tres variables `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` y `VITE_EMAILJS_PUBLIC_KEY` que ya usas localmente. Después vuelve a desplegar.

## Firestore y acceso

Desde la raíz del repositorio `panel-accesos`, publica las reglas con:

```powershell
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules
```

El archivo `.firebaserc` de `panel-accesos` selecciona `crearte-by-confeccionart-6febe`; `firebase.json` publica `firestore.rules`. Las reglas permiten al administrador consultar `app_records` y a cada usuario autorizado consultar sus propios documentos.

En Firebase Console, habilita el proveedor Correo/contraseña y agrega `estado-set-de-tallas-8r39.onrender.com` en Authentication → Settings → Authorized domains. Desde el panel, concede el permiso `tallas` al mismo correo con que iniciará sesión.
