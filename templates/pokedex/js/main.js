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

// Cambia a modo oscuro inicialmente (puedes quitar esto si no deseas el modo oscuro por defecto)
// body.classList.toggle("dark-mode");

// Creación de la instancia del gestor de Pokémon
const pokemonManager = new PokemonManager(pokemonDivList, fittedButtonsByType);

// Inicia la carga de los Pokémon
pokemonManager
  .initialize(150) // Número de Pokémon a cargar
  .then(() => {
    try {
      console.log(`Pokémon Totales: ${pokemonManager.list.length}`);
      console.log("#---------------#");
    } catch (error) {
      console.error("Error durante el uso del PokemonManager:", error);
    }
  })
  .catch((error) => {
    console.error("Error al inicializar el PokemonManager:", error);
  });

// Manejo del filtrado de Pokémon por propiedades
pokemonFilter.addEventListener("change", function () {
  const selectedOption = this.value;
  const [property, order] = selectedOption.split("-");

  try {
    const filteredPokemon = pokemonManager.getPokemonByProperty(
      property,
      order
    );
    // console.log(filteredPokemon.length);
    pokemonManager.displayPokemon(filteredPokemon);
  } catch (error) {
    console.error("Error al filtrar los Pokémon:", error);
  }
});
