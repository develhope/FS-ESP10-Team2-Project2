import { PokemonManager } from "./models/PokemonManager.js";

// Referencias a elementos del DOM
const darkModeToggle = document.querySelector("#darkModeToggle");
const body = document.body;

// Configuración del modo oscuro
darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});

/**
 * Activa el modo oscuro por defecto.
 *! Quita esta línea si no deseas que el modo oscuro esté activo inicialmente.
 */
body.classList.toggle("dark-mode");

//! Eliminar todos los datos almacenados en localStorage
// localStorage.clear();

// Creación de la instancia del gestor de Pokémon
const pokemonManager = new PokemonManager();

/**
 * Inicializa la carga de los Pokémon.
 * @param {number} count - El número de Pokémon a descargar.
 */
async function initializePokemonManager(count, reload) {
  try {
    await pokemonManager.init(count, reload);
    console.log("#---------------#");
  } catch (error) {
    console.error("Error al inicializar el PokemonManager:", error);
  }
}

//! Inicia la carga de los Pokémon (puedes cambiar el número por el numero de Pokémon que desees descargar)
initializePokemonManager(151);
