# Mera

Página web informativa para un negocio de repostería casera. Objetivos:

- Posicionarse en la zona con SEO local.
- Usarla como sitio web en el Perfil de Negocio de Google.

## Decisiones tomadas

| Tema | Decisión |
|---|---|
| Diseño | Con la skill **ui-ux-pro-max**, pensado primero para el móvil |
| Alojamiento | Web estática en **GitHub Pages** (Cloudflare Pages como alternativa) |
| Por qué no solo GAS | Una web de Apps Script vive en `script.google.com/...`, carga en un iframe que Google apenas indexa, no admite dominio propio y muestra un aviso de Google. Va en contra del SEO. |
| Papel de GAS | Formulario de pedidos/contacto: guarda en una Google Sheet y avisa por correo |
| Actualizaciones | Precios, disponibilidad y productos de temporada en una **Google Sheet** que lee la web. Diseño, secciones y SEO: los cambia Claude y los publica en GitHub. |
| Texto fijo (para SEO) | Nombre del negocio, zona, descripción y productos estrella van escritos en la página, no en la Sheet |
| Dominio | Ni Google One AI Pro ni Workspace lo incluyen, y Google Domains ya no existe. Se compra aparte (10–15 USD/año) en Cloudflare Registrar, Namecheap o Porkbun. Pendiente de decidir. |

## Paso a paso

1. **Datos del negocio** (el dueño): nombre, logo, colores, zona y barrios de entrega, productos con precios y fotos, WhatsApp, horario, entregas o recogida, reseñas.
2. **Investigación SEO local**: búsquedas de la zona y competencia cercana.
3. **Diseño** con ui-ux-pro-max.
4. **Construcción**: secciones Inicio, Catálogo, Sobre nosotros, Pedidos, Zona de entrega, Reseñas y Contacto; botón de WhatsApp; títulos y descripciones, schema.org `Bakery`/`LocalBusiness`, mapa del sitio, imágenes ligeras.
5. **Formulario de pedidos con GAS** conectado a una Google Sheet.
6. **Publicación** en GitHub Pages y, opcionalmente, conexión del dominio.
7. **Google**: alta en Search Console, envío del mapa del sitio y URL en el Perfil de Negocio. El nombre, la dirección y el teléfono deben coincidir exactamente en la web y en el perfil.
8. **Mantenimiento**: fotos en el Perfil de Negocio, pedir reseñas, actualizar el catálogo por temporada.

## Datos del negocio

- **Nombre:** Mera Cake · lema "Postres con amor"
- **Zona:** Puerto Ordaz, Bolívar, Venezuela
- **WhatsApp:** 0424-9298827 (`wa.me/584249298827`)
- **Entregas:** a domicilio y retiro
- **Instagram:** [@mera.cake](https://www.instagram.com/mera.cake/) (destacadas: Cakes, Pingüinos, Clientes)
- **Logo:** `assets/img/logo-marron.png` y `assets/img/logo-blanco.png`; color de marca `#411F0F`

## Diseño (ui-ux-pro-max)

- Paleta marrón del logo sobre crema; verde `#157A3F` solo para WhatsApp (contraste AA).
- Títulos en Playfair Display (combina con la serif del logo), texto en Inter.
- Se descartó la tipografía Fredoka y el patrón "embudo" que sugirió la skill: no encajan con la marca.
- Estructura: portada → catálogo → nosotros → entregas → pedidos; botón flotante de WhatsApp.

## Archivos

- `index.html` — página única con el texto SEO fijo y schema.org `Bakery`.
- `assets/css/styles.css` — estilos, móvil primero.
- `assets/js/main.js` — formulario que arma el mensaje de WhatsApp; lee el catálogo de la Sheet si `SHEET_URL` tiene el enlace de compartir (pestaña `Catalogo`, columnas `Producto, Precio, Foto (enlace Drive)`). Un producto con el mismo nombre que uno fijo cambia su precio y añade sus fotos al carrusel; uno nuevo se añade como tarjeta y al formulario. Una celda de foto puede tener varios enlaces (espacio o coma), y vale cualquier columna que empiece por «Foto».
- `plantillas/catalogo-mera-cake.xlsx` — plantilla de la hoja, para importar en Google Sheets.

## Estado (2026-10-21)

- [x] Git instalado (2.55).
- [x] GitHub CLI instalado (2.102.1). No está en el PATH de la terminal de VS Code: reiniciar VS Code.
- [x] Sesión en GitHub con la cuenta personal **fsmezah**.
- [x] Git configurado solo en este repositorio: `fsmezah` / `330128277+fsmezah@users.noreply.github.com` (el correo de la cuenta es privado).
- [x] Datos básicos del negocio y logos recibidos.
- [x] Horario: de 8:00 a. m. a 9:00 p. m. todos los días (confirmado). Entregas en cualquier zona de Puerto Ordaz.
- [x] Primera versión de la página (diseño y estructura).
- [x] Repositorio local con el primer commit. La página ya apunta a `https://fsmezah.github.io/mera-cake/` (`canonical`, `sitemap.xml`, `robots.txt`); si se compra dominio, cambiar esas URL.
- [x] Publicada (2026-10-21): repositorio [fsmezah/mera-cake](https://github.com/fsmezah/mera-cake), web en <https://fsmezah.github.io/mera-cake/> (GitHub Pages desde `main`, raíz). Cada `git push` a `main` la actualiza.
- [x] Fotos de tortas en `assets/img/` (WebP a 480 y 960 px, generadas con Pillow desde las originales). `compartir.jpg` (1200×630) es la imagen al compartir el enlace.
- [x] Catálogo: personalizadas, cumpleaños, chocolate y pingüinos. Se quitó "Tortas de boda" porque no hay foto; volver a añadirla si el dueño la quiere.
- [ ] Foto de los pingüinos (la tarjeta aún tiene el hueco).
- [x] Animaciones con CSS y un poco de JS, sin librerías: la portada entra por partes, las secciones aparecen al bajar, las fotos se acercan al pasar el ratón, la cabecera toma sombra y el botón de WhatsApp late unas pocas veces. Solo se activan con la clase `.anim` (JS activo y sin "reducir movimiento"); sin ella todo se ve fijo.
- [x] Carrusel de fotos en cada ficha (deslizar con el dedo, flechas al pasar el ratón, puntos). Chocolate: 3 fotos; cumpleaños: 2. Se quitó la sección «Tortas recientes» porque repetía las mismas fotos; el enlace a Instagram quedó al final del catálogo.
- [ ] Videos para Instagram: proyecto aparte (no en esta web), basado en las skills de [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics) (MIT). Requiere instalar ffmpeg y Playwright.
- [ ] Precios.
- [ ] Reseñas: aún no hay. Añadir la sección cuando lleguen las primeras (no se inventan).
- [x] Plantilla de la hoja del catálogo y código que la lee (probado con datos de ejemplo).
- [x] Hoja del catálogo conectada: https://docs.google.com/spreadsheets/d/1DnWVLkb8YCFX6Dx_l6YpkQo9KS1MNRb-/edit (cuenta personal del dueño, compartida como lector con el enlace).
- [ ] Formulario con GAS (por ahora el formulario envía por WhatsApp).
- [ ] Alta en Search Console y URL en el Perfil de Negocio de Google.
- [ ] Decidir el dominio.
