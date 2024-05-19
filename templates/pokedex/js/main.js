import { PokemonManager } from "./models/PokemonManager.js";

// Selección de elementos del DOM
const pokemonDivList = document.querySelector("#pokemon-div-list");
const FittedButtonsByType = document.querySelectorAll(".btn-header");

// Creación de la instancia del gestor de Pokémon
const pokemon = new PokemonManager(pokemonDivList, FittedButtonsByType);
// Iniciar la carga
pokemon
  .initialize(1025) // Numero de pokemon a cargar
  .then(() => {
    try {
      console.log(`Pokemon Totales: ${pokemon.list.length}`);
      console.log("#---------------#");

      // // Test 1: Filtrar por tipo "bug" o "poison" (sin coincidencia exacta)
      // let poke = pokemon.getPokemonByTypes(["bug", "poison"]);
      // console.log(`Pokemon con tipo bug o poison Totales: ${poke.length}`);
      // //   console.log(poke);

      // console.log("------------------------------");
    } catch (error) {
      console.error("Error durante el uso del PokemonManager:", error);
    }
  })
  .catch((error) => {
    console.error("Error al inicializar el PokemonManager:", error);
  });

const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});
