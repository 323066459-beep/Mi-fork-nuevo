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

mostrarProductos(productos);