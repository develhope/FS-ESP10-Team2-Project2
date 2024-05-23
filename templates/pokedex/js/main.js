import { PokemonManager } from "./models/PokemonManager.js";

// Referencias a elementos del DOM
const darkModeToggle = document.querySelector("#darkModeToggle");
const body = document.body;
const pokemonDivList = document.querySelector("#pokemon-div-list");
const fittedButtonsByType = document.querySelectorAll(".btn-header");
const pokemonFilter = document.querySelector("#pokemon-filter");

// Configuración del modo oscuro
darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});

/**
 * Activa el modo oscuro por defecto.
 *! Quita esta línea si no deseas que el modo oscuro esté activo inicialmente.
 */
body.classList.toggle("dark-mode");

// Creación de la instancia del gestor de Pokémon
const pokemonManager = new PokemonManager(
  pokemonDivList,
  fittedButtonsByType,
  pokemonFilter
);

/**
 * Inicializa la carga de los Pokémon.
 * @param {number} count - El número de Pokémon a descargar.
 */
async function initializePokemonManager(count) {
  try {
    await pokemonManager.init(count);
    console.log("#---------------#");
  } catch (error) {
    console.error("Error al inicializar el PokemonManager:", error);
  }
}

//! Inicia la carga de los Pokémon (puedes cambiar el número por el numero de Pokémon que desees descargar)
initializePokemonManager(151);
