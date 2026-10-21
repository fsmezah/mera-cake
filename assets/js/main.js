// Mera Cake — formulario de pedido por WhatsApp y precios desde la Google Sheet.

const WHATSAPP = "584249298827";

// URL CSV de la Google Sheet (Archivo > Compartir > Publicar en la web > CSV).
// Columnas: producto, precio, disponible (si/no). "producto" coincide con data-producto.
const SHEET_CSV_URL = "";

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

// Precios y disponibilidad. Si la Sheet falla, se queda "Precio a consultar".
async function cargarPrecios() {
  if (!SHEET_CSV_URL) return;
  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-store" });
    if (!res.ok) return;
    const filas = (await res.text()).trim().split(/\r?\n/).slice(1);
    for (const fila of filas) {
      const [producto, precio, disponible] = fila.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
      const card = document.querySelector(`[data-producto="${CSS.escape(producto)}"]`);
      if (!card) continue;
      const el = card.querySelector("[data-precio]");
      if ((disponible || "").toLowerCase() === "no") {
        card.classList.add("is-agotado");
        el.textContent = "No disponible por ahora";
      } else if (precio) {
        el.textContent = `Desde ${precio}`;
      }
    }
  } catch {
    // Sin conexión o Sheet no publicada: se mantiene el texto por defecto.
  }
}
cargarPrecios();
