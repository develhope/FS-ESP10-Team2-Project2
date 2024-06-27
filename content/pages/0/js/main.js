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
// initializePokemonManager(1025);
// initializePokemonManager(151, true);

// Instanciar la clase
console.log(T.tokens);
