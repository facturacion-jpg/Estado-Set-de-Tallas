# Estado set de tallas

## Configurar el envío de correo con EmailJS

1. Crea un servicio de correo y una plantilla en [EmailJS](https://www.emailjs.com/).
2. Copia `.env.example` como `.env.local` en la raíz del proyecto y completa los tres valores:
   - `VITE_EMAILJS_SERVICE_ID`: ID del servicio.
   - `VITE_EMAILJS_TEMPLATE_ID`: ID de la plantilla.
   - `VITE_EMAILJS_PUBLIC_KEY`: Public Key de EmailJS.
3. En el aplicativo, escribe el correo destinatario en el campo **Enviar a**. Se recordará en ese navegador.
4. En la plantilla de EmailJS, configura **To Email** como `{{to_email}}` y **Subject** como `{{subject}}`. Reemplaza el texto genérico de la plantilla por este contenido:

   ```text
   Resultado de auditoría de set de tallas

   {{message}}
   ```

   La app también envía las variables `{{status}}`, `{{reason}}`, `{{reference}}`, `{{order}}`, `{{brand}}`, `{{date}}`, `{{completed_by}}` y `{{name}}` por si quieres personalizar el diseño con esos campos.
5. Guarda la plantilla en EmailJS y prueba nuevamente desde la app.

El botón **Enviar correo** realiza el envío a través de EmailJS y muestra confirmación o error. La Public Key está diseñada para uso en el navegador; no pongas una Private Key en variables `VITE_*`. Restringe los dominios permitidos desde la configuración de seguridad de EmailJS.
