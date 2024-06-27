//? Libreria personal de utilidades
import _ from "../../assets/general/js/lib/utilities.js";

//? Manejador de Tokens (Tokens Manager)
import T from "../../assets/general/js/models/TokensManager.js";

//? Manejador de Pokémon (Pokemon Manager )
import P_M from "./models/PokemonManager.js";

//! Eliminar todos los datos almacenados en localStorage y en el sessionStorage
// localStorage.clear();
// sessionStorage.clear();

// Creación de la instancia del gestor de Pokémon
const pokemonManager = new P_M();

/**
 * Inicializa la carga de los Pokémon.
 * @param {number} count - El número de Pokémon a cargar en el DOM.
 */
async function initializePokemonManager(count, reload) {
  try {
    await pokemonManager.init(count, reload);
    console.log("#---------------#");
  } catch (error) {
    console.error("Error al inicializar el PokemonManager:", error);
  }
}

//! Inicia la carga de los Pokémon (puedes cambiar el número por el numero de Pokémon que desees cargar en el DOM)
initializePokemonManager(1025);
// initializePokemonManager(151, true);

// Función para simular las operaciones con Tokens
function simulateTokenOperations() {
  setTimeout(() => {
    T.tokens = 0;
    console.log(`T.tokens = ${T.tokens}`);
  }, 1000);

  setTimeout(() => {
    T.tokens -= 5;
    console.log(`T.tokens -= 5: ${T.tokens}`);
  }, 2000);

  setTimeout(() => {
    T.tokens += 5;
    console.log(`T.tokens += 5: ${T.tokens}`);
  }, 3000);

  setTimeout(() => {
    T.addTokens(5);
    console.log(`T.addTokens(5): ${T.tokens}`);
  }, 4000);

  setTimeout(() => {
    console.log(`T.subtractTokens(5): ${T.subtractTokens(5)}`);
    console.log(`T.tokens: ${T.tokens}`);
  }, 5000);

  setTimeout(() => {
    console.log(`T.subtractTokens(6): ${T.subtractTokens(6)}`);
    console.log(`T.tokens: ${T.tokens}`);
  }, 6000);
}

// Llamar a la función para simular las operaciones
// simulateTokenOperations();
