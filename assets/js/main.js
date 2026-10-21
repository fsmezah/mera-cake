// Mera Cake — formulario de pedido por WhatsApp y catálogo desde la Google Sheet.

const WHATSAPP = "584249298827";

// Enlace de compartir de la Google Sheet ("Cualquier persona con el enlace puede ver").
// Pestaña "Catalogo", columnas: Producto, Precio, Foto (enlace Drive). Plantilla en plantillas/.
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1DnWVLkb8YCFX6Dx_l6YpkQo9KS1MNRb-/edit";

// Formulario: arma el mensaje y abre WhatsApp.
const form = document.getElementById("form-pedido");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre;
    const error = document.getElementById("nombre-error");
    if (!nombre.value.trim()) {
      nombre.setAttribute("aria-invalid", "true");
      nombre.setAttribute("aria-describedby", "nombre-error");
      error.hidden = false;
      nombre.focus();
      return;
    }
    nombre.removeAttribute("aria-invalid");
    error.hidden = true;

    const datos = new FormData(form);
    const lineas = [
      "Hola Mera Cake, quiero hacer un pedido:",
      `• Nombre: ${datos.get("nombre").trim()}`,
      `• Producto: ${datos.get("producto")}`,
      datos.get("fecha") && `• Fecha: ${datos.get("fecha")}`,
      `• Entrega: ${datos.get("entrega")}`,
      datos.get("detalles").trim() && `• Detalles: ${datos.get("detalles").trim()}`,
    ].filter(Boolean);

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join("\n"))}`, "_blank", "noopener");
  });
}

// Animaciones al bajar por la página. Sin .anim (sin JS o con "reducir movimiento") todo se ve fijo.
if (document.documentElement.classList.contains("anim") && "IntersectionObserver" in window) {
  const grupos = ".cards > li, .gallery > li, .features > li";
  const sueltos = ".section .eyebrow, .section h2, .section__intro, .split > div > p, .gallery__more, .form";
  document.querySelectorAll(grupos).forEach((el) => {
    el.style.setProperty("--i", [...el.parentElement.children].indexOf(el));
    el.classList.add("reveal");
  });
  document.querySelectorAll(sueltos).forEach((el) => el.classList.add("reveal"));

  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      el.classList.add("is-visible");
      obs.unobserve(el);
      // Al terminar, quitar las clases para que no estorben al efecto hover de las tarjetas.
      el.addEventListener("transitionend", () => el.classList.remove("reveal", "is-visible"), { once: true });
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
}

// Sombra en la cabecera al bajar.
const header = document.querySelector(".header");
if (header) {
  const marcar = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", marcar, { passive: true });
  marcar();
}

// Catálogo desde la Sheet. Si falla, se queda lo que está escrito en la página.
const normalizar = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// CSV con comillas (los precios pueden llevar comas).
function leerCSV(texto) {
  const filas = [];
  let fila = [], campo = "", comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ",") { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      fila.push(campo); filas.push(fila); fila = []; campo = "";
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  return filas;
}

// Enlace de Drive -> imagen servida por Drive.
function fotoDrive(enlace) {
  const id = (enlace.match(/\/d\/([\w-]{10,})/) || enlace.match(/[?&]id=([\w-]{10,})/) || [])[1];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w960` : null;
}

// Carrusel de fotos de cada ficha. Con una sola foto no lleva flechas ni puntos.
const flecha = (d) => `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="${d}"/></svg>`;

function prepararCarrusel(carrusel) {
  const pista = carrusel.querySelector(".carrusel__pista");
  carrusel.querySelectorAll(".carrusel__btn, .carrusel__puntos").forEach((el) => el.remove());
  const total = pista.children.length;
  if (total < 2) return;

  const nombre = carrusel.getAttribute("aria-label") || "Fotos";
  const prev = document.createElement("button");
  const next = document.createElement("button");
  prev.type = next.type = "button";
  prev.className = "carrusel__btn carrusel__btn--prev";
  next.className = "carrusel__btn carrusel__btn--next";
  prev.setAttribute("aria-label", `${nombre}: foto anterior`);
  next.setAttribute("aria-label", `${nombre}: foto siguiente`);
  prev.innerHTML = flecha("m15 18-6-6 6-6");
  next.innerHTML = flecha("m9 18 6-6-6-6");

  const puntos = document.createElement("div");
  puntos.className = "carrusel__puntos";
  puntos.setAttribute("aria-hidden", "true");
  puntos.innerHTML = "<span></span>".repeat(total);
  carrusel.append(prev, next, puntos);

  const ir = (paso) => {
    pista.scrollBy({ left: paso * pista.clientWidth });
    setTimeout(marcar, 400); // por si el navegador no avisa del desplazamiento
  };
  prev.addEventListener("click", () => ir(-1));
  next.addEventListener("click", () => ir(1));

  const marcar = () => {
    const i = Math.round(pista.scrollLeft / pista.clientWidth);
    [...puntos.children].forEach((p, j) => p.classList.toggle("is-activo", j === i));
    prev.disabled = i <= 0;
    next.disabled = i >= total - 1;
  };
  pista.onscroll = marcar;
  marcar();
}
document.querySelectorAll(".carrusel").forEach(prepararCarrusel);

function agregarFoto(card, src, alt) {
  const carrusel = card.querySelector(".carrusel");
  const pista = carrusel.querySelector(".carrusel__pista");
  // Se guarda el hueco de la primera foto para devolverlo si fallan todas.
  carrusel.hueco ??= pista.querySelector("div.photo")?.parentElement;
  const hueco = carrusel.hueco;
  const li = document.createElement("li");
  const img = document.createElement("img");
  img.className = "photo";
  img.width = 960;
  img.height = 1280;
  img.loading = "lazy";
  img.decoding = "async";
  img.alt = alt;
  // Si el enlace falla se quita la foto; si era la única, vuelve el hueco.
  img.addEventListener("error", () => {
    li.remove();
    if (!pista.children.length && hueco) pista.append(hueco);
    prepararCarrusel(carrusel);
  }, { once: true });
  img.src = src;
  li.append(img);
  hueco?.remove();
  pista.append(li);
  prepararCarrusel(carrusel);
}

function crearTarjeta(nombre) {
  const li = document.createElement("li");
  li.className = "card";
  li.innerHTML = '<div class="carrusel"><ul class="carrusel__pista"><li><div class="photo" role="img"><span>Foto</span></div></li></ul></div><div class="card__body"><h3></h3><p class="card__price" data-precio>Precio a consultar</p></div>';
  li.querySelector("h3").textContent = nombre;
  li.querySelector(".carrusel").setAttribute("aria-label", `Fotos de ${nombre}`);
  li.querySelector(".photo").setAttribute("aria-label", `Foto de ${nombre} (pendiente)`);
  document.querySelector(".cards").append(li);
  const opcion = new Option(nombre);
  document.querySelector('#producto option:last-child')?.before(opcion);
  return li;
}

async function cargarCatalogo() {
  const id = (SHEET_URL.match(/\/spreadsheets\/d\/([\w-]+)/) || [])[1];
  if (!id) return;
  try {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=Catalogo`, { cache: "no-store" });
    if (!res.ok) return;
    const [cabecera, ...filas] = leerCSV(await res.text());
    const col = (nombre) => cabecera.findIndex((h) => normalizar(h).startsWith(nombre));
    const cP = col("producto"), cPrecio = col("precio");
    // Fotos: todas las columnas que empiecen por "Foto"; cada celda puede tener varios enlaces.
    const cFotos = cabecera.map((h, i) => (normalizar(h).startsWith("foto") ? i : -1)).filter((i) => i >= 0);
    if (cP < 0) return;

    const tarjetas = new Map([...document.querySelectorAll(".cards .card")].map((c) => [normalizar(c.querySelector("h3").textContent), c]));
    for (const fila of filas) {
      const nombre = (fila[cP] || "").trim();
      if (!nombre) continue;
      const card = tarjetas.get(normalizar(nombre)) || crearTarjeta(nombre);
      const precio = (fila[cPrecio] || "").trim();
      if (precio) card.querySelector("[data-precio]").textContent = `Desde ${precio}`;
      const enlaces = cFotos.flatMap((i) => (fila[i] || "").split(/[\s,;]+/));
      for (const foto of enlaces.map(fotoDrive).filter(Boolean)) agregarFoto(card, foto, nombre);
    }
  } catch {
    // Sin conexión o Sheet no compartida: se mantiene el catálogo de la página.
  }
}
cargarCatalogo();
