import { PokemonManager } from "./models/PokemonManager.js";

// Referencias a elementos del DOM
const darkModeToggle = document.querySelector("#darkModeToggle");
const body = document.body;

// Función para activar/desactivar el modo oscuro
const toggleDarkMode = () => {
  const isDarkMode = body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
};

// Event listener para el botón de modo oscuro
darkModeToggle.addEventListener("click", toggleDarkMode);

// Verificar el estado del modo oscuro en localStorage
const darkModeStatus = localStorage.getItem("darkMode");
if (darkModeStatus === "true") {
  body.classList.add("dark-mode");
}

//! Eliminar todos los datos almacenados en localStorage
// localStorage.clear();
// sessionStorage.clear();
// console.log(JSON.stringify(sessionStorage, null, 2));

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
