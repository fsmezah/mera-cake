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
