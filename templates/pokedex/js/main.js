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

//! Cambia a modo oscuro inicialmente (puedes quitar esto si no deseas el modo oscuro por defecto)
body.classList.toggle("dark-mode");

// Creación de la instancia del gestor de Pokémon
const pokemonManager = new PokemonManager(
  pokemonDivList,
  fittedButtonsByType,
  pokemonFilter
);

// Inicia la carga de los Pokémon
pokemonManager
  .init(151) //! Número de Pokémon a descargar
  .then(() => {
    try {
      // console.log(`Pokémon Totales: ${pokemonManager.pokemon.length}`);
      console.log("#---------------#");
    } catch (error) {
      console.error("Error durante el uso del PokemonManager:", error);
    }
  })
  .catch((error) => {
    console.error("Error al inicializar el PokemonManager:", error);
  });
