//? Libreria personal de utilidades
import _ from "../../assets/general/js/lib/utilities.js";

//? Manejador de Pokémon (Pokemon Manager )
import P_M from "./models/PokemonManager.js";

//? Modulos de (PokemonBattle.js)
import {
  Pokemon,
  PokemonBattle,
  PokemonInventory,
} from "./models/PokemonBattle.js";

//! Eliminar todos los datos almacenados en localStorage y en el sessionStorage
// localStorage.clear();
// sessionStorage.clear();
// console.log(JSON.stringify(sessionStorage, null, 2));

// Creación de la instancia del gestor de Pokémon
const pokemonManager = new P_M();

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

const pokemonData = {
  pokeId: 1, // Número ID del Pokémon
  name: "bulbasaur", // Nombre del Pokémon
  type: ["grass", "poison"], // Tipos del Pokémon
  images: {
    illustration: {
      default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png", // URL de la ilustración por defecto
      shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png", // URL de la ilustración shiny
    },
    rendering: {
      default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png", // URL del renderizado por defecto
      shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/1.png", // URL del renderizado shiny
    },
    gif: {
      back_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/1.gif", // URL del gif por defecto visto desde atrás
      back_shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/shiny/1.gif", // URL del gif shiny visto desde atrás
      front_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1.gif", // URL del gif por defecto visto desde el frente
      front_shiny:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/1.gif", // URL del gif shiny visto desde el frente
    },
  },
  statistics: {
    height: {
      centimeter: 70.0, // Altura en centímetros
      decimeters: 7, // Altura en decímetros
      meters: 0.7, // Altura en metros
    },
    weight: {
      gram: 6900, // Peso en gramos
      hectograms: 69, // Peso en hectogramos
      kilograms: 6.9, // Peso en kilogramos
      tons: 0.0069, // Peso en toneladas
    },
    hp: 45, // Puntos de puntos de vida
    hp_percent: 10, // Porcentaje de puntos de vida
    attack: 49, // Estadística de puntos de ataque
    attack_percent: 50, // Porcentaje de puntos de ataque
    defense: 20, // Estadística de puntos de defensa
    defense_percent: 10, // Porcentaje de puntos de defensa
    special_attack: 65, // Estadística de puntos de ataque especial
    special_attack_percent: 65, // Porcentaje de puntos de ataque especial
    special_defense: 30, // Estadística de puntos de defensa especial
    special_defense_percent: 40, // Porcentaje de puntos de defensa especial
    speed: 45, // Estadística de puntos de velocidad
    speed_percent: 45, // Porcentaje de puntos de velocidad

    power: 254, // La suma de todas sus estadisticas de lucha.
    power_percent: 30, // Porcentaje de todas sus estadisticas de lucha.
  },
  value: {
    base_experience: 64, // Experiencia base
    movements: 20, // Número de movimientos
    capture_rate_percent: 45, // Porcentaje de tasa de captura
    isLegendary: false, // Si es legendario
    isMythical: false, // Si es mítico
    isFinalEvolution: true, // Si es su evolucion final
  },
  evolutions: [
    { name: "bulbasaur", evolves_to: ["ivysaur"] },
    { name: "ivysaur", evolves_to: ["venusaur"] },
    { name: "venusaur", evolves_to: [] },
  ],
  market: {
    price: 100, // Precio
    discount: 69, // Precio con el descuento por oferta
  },
};

// const inventory = myInventory.getPokemon("*");

// const mappedInventory = inventory.map((poke) => {
//   return {
//     values: [
//       poke.p.i.name,
//       poke.p.i.type,
//       poke.p.b.hp,
//       poke.p.b.attack,
//       poke.p.b.special_attack,
//       poke.p.b.defense,
//       poke.p.b.special_defense,
//       poke.p.b.speed,
//     ],
//     inInventory: poke.inInventory,
//   };
// });

// console.log(mappedInventory);

// localStorage.removeItem("inventory");
// _.DOM.saveToLocalStorage("inventory", mappedInventory);

//! Inicia la carga de los Pokémon (puedes cambiar el número por el numero de Pokémon que desees descargar)
initializePokemonManager(151);
// initializePokemonManager(151, true);
