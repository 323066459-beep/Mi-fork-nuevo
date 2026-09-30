import "./style.css";
import { productos } from "./datos.js";

const catalogo = document.getElementById("catalogo");

function mostrarProductos(lista) {
  catalogo.innerHTML = lista
    .map(
      (p) => `
      <div class="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
        <div>
          <h2 class="text-lg font-semibold">${p.nombre}</h2>
          <p class="text-sm text-gray-500 mt-1">${p.categoria}</p>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <span class="text-xl font-bold">$${p.precio}</span>
          <button data-id="${p.id}" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Agregar
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

const pedido = [];

// Ejercicio 6: pedidos registrados, estados y colores
const pedidosRegistrados = [];
const ESTADOS = ["Pendiente", "En preparación", "Entregado"];

const COLORES = {
  "Pendiente": "bg-yellow-100 border-yellow-400",
  "En preparación": "bg-blue-100 border-blue-400",
  "Entregado": "bg-green-100 border-green-400",
};

const contenedorPedidos = document.getElementById("pedidos-registrados");

const listaPedido = document.getElementById("lista-pedido");
const totalEl = document.getElementById("total");
const btnVaciar = document.getElementById("btn-vaciar");

function mostrarPedido() {
  listaPedido.innerHTML = pedido
    .map(
      (p) => `
      <li class="flex justify-between">
        <span>${p.nombre}</span>
        <span>$${p.precio}</span>
      </li>
    `
    )
    .join("");

  const total = pedido.reduce((suma, p) => suma + p.precio, 0);
  totalEl.textContent = `Total: $${total}`;
}

catalogo.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-id]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  const producto = productos.find((p) => p.id === id);
  pedido.push(producto);
  mostrarPedido();
});

btnVaciar.addEventListener("click", () => {
  pedido.length = 0;
  mostrarPedido();
});

const filtros = document.getElementById("filtros");

filtros.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-categoria]");
  if (!boton) return;

  const categoria = boton.dataset.categoria;
  const lista = categoria === "Todos"
    ? productos
    : productos.filter((p) => p.categoria === categoria);

  mostrarProductos(lista);

  document.querySelectorAll(".filtro-btn").forEach((btn) => {
    btn.classList.remove("bg-blue-600", "text-white");
    btn.classList.add("bg-white", "text-gray-800", "shadow");
  });
  boton.classList.remove("bg-white", "text-gray-800", "shadow");
  boton.classList.add("bg-blue-600", "text-white");
});

const formCliente = document.getElementById("form-cliente");

const inputNombre = document.getElementById("nombre");
const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");

const errorNombre = document.getElementById("error-nombre");
const errorTelefono = document.getElementById("error-telefono");
const errorCorreo = document.getElementById("error-correo");
const errorPedido = document.getElementById("error-pedido");

function mostrarError(input, elementoError, mensaje) {
  elementoError.textContent = mensaje;
  elementoError.classList.remove("hidden");
  if (input) input.classList.add("border-red-600");
}

function ocultarError(input, elementoError) {
  elementoError.textContent = "";
  elementoError.classList.add("hidden");
  if (input) input.classList.remove("border-red-600");
}

function validarNombre() {
  const nombre = inputNombre.value.trim();
  if (nombre === "") {
    mostrarError(inputNombre, errorNombre, "El nombre no puede estar vacío.");
    return false;
  }
  ocultarError(inputNombre, errorNombre);
  return true;
}

function validarTelefono() {
  const telefono = inputTelefono.value.trim();
  if (!/^\d{10}$/.test(telefono)) {
    mostrarError(inputTelefono, errorTelefono, "El teléfono debe tener exactamente 10 dígitos.");
    return false;
  }
  ocultarError(inputTelefono, errorTelefono);
  return true;
}

function validarCorreo() {
  const correo = inputCorreo.value.trim();
  if (!/^\S+@\S+\.\S+$/.test(correo)) {
    mostrarError(inputCorreo, errorCorreo, "El correo no tiene un formato válido.");
    return false;
  }
  ocultarError(inputCorreo, errorCorreo);
  return true;
}

function validarPedido() {
  if (pedido.length === 0) {
    mostrarError(null, errorPedido, "Tu pedido está vacío, agrega al menos un producto.");
    return false;
  }
  ocultarError(null, errorPedido);
  return true;
}

inputNombre.addEventListener("input", validarNombre);
inputTelefono.addEventListener("input", validarTelefono);
inputCorreo.addEventListener("input", validarCorreo);

// Ejercicio 6: dibuja una tarjeta por pedido registrado
function mostrarPedidosRegistrados() {
  contenedorPedidos.innerHTML = pedidosRegistrados
    .map(
      (p) => `
      <div class="border-2 rounded-lg p-4 ${COLORES[p.estado]}">
        <h3 class="text-lg font-semibold">${p.cliente.nombre}</h3>
        <ul class="text-sm mt-2 space-y-1">
          ${p.productos
            .map((prod) => `<li>${prod.nombre} — $${prod.precio}</li>`)
            .join("")}
        </ul>
        <p class="font-bold mt-2">Total: $${p.total}</p>
        <p class="text-sm mt-1">Estado: <strong>${p.estado}</strong></p>
        ${
          p.estado !== "Entregado"
            ? `<button data-avanzar="${p.id}" class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                 Avanzar estado
               </button>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

formCliente.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombreValido = validarNombre();
  const telefonoValido = validarTelefono();
  const correoValido = validarCorreo();
  const pedidoValido = validarPedido();

  if (!nombreValido || !telefonoValido || !correoValido || !pedidoValido) return;

  // Guardar ANTES de resetear el formulario
  const nuevoPedido = {
    id: Date.now(),
    cliente: {
      nombre: inputNombre.value.trim(),
      telefono: inputTelefono.value.trim(),
      correo: inputCorreo.value.trim(),
    },
    productos: [...pedido],
    total: pedido.reduce((suma, p) => suma + p.precio, 0),
    estado: "Pendiente",
  };

  pedidosRegistrados.push(nuevoPedido);

  pedido.length = 0;
  mostrarPedido();
  formCliente.reset();
  mostrarPedidosRegistrados();

  alert(`Pedido confirmado para ${nuevoPedido.cliente.nombre}. ¡Gracias por tu compra!`);
});

// Ejercicio 6: botón "Avanzar estado"
contenedorPedidos.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-avanzar]");
  if (!boton) return;

  const id = Number(boton.dataset.avanzar);
  const registrado = pedidosRegistrados.find((p) => p.id === id);
  if (!registrado) return;

  const posicion = ESTADOS.indexOf(registrado.estado);
  if (posicion < ESTADOS.length - 1) {
    registrado.estado = ESTADOS[posicion + 1];
  }
  mostrarPedidosRegistrados();
});

mostrarProductos(productos);