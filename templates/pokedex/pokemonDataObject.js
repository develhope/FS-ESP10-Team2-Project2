/**
 * @typedef {Object} Pokemon
 * @property {number} pokeId - The ID of the Pokémon.
 * @property {string} name - The name of the Pokémon.
 * @property {string[]} type - An array of the Pokémon's types.
 * @property {Object} images - An object containing image URLs of the Pokémon.
 * @property {Object} images.illustration - An object containing illustration URLs.
 * @property {string} images.illustration.default - The default illustration URL.
 * @property {string} images.illustration.shiny - The shiny illustration URL.
 * @property {Object} images.rendering - An object containing rendering URLs.
 * @property {string} images.rendering.default - The default rendering URL.
 * @property {string} images.rendering.shiny - The shiny rendering URL.
 * @property {Object} images.gif - An object containing GIF URLs.
 * @property {string} images.gif.back_default - The back default GIF URL.
 * @property {string} images.gif.back_shiny - The back shiny GIF URL.
 * @property {string} images.gif.front_default - The front default GIF URL.
 * @property {string} images.gif.front_shiny - The front shiny GIF URL.
 * @property {Object} statistics - An object containing the Pokémon's statistics.
 * @property {Object} statistics.height - An object containing height measurements.
 * @property {number} statistics.height.centimeter - Height in centimeters.
 * @property {number} statistics.height.decimeters - Height in decimeters.
 * @property {number} statistics.height.meters - Height in meters.
 * @property {Object} statistics.weight - An object containing weight measurements.
 * @property {number} statistics.weight.gram - Weight in grams.
 * @property {number} statistics.weight.hectograms - Weight in hectograms.
 * @property {number} statistics.weight.kilograms - Weight in kilograms.
 * @property {number} statistics.weight.tons - Weight in tons.
 * @property {number} statistics.hp - The hit points of the Pokémon.
 * @property {number} statistics.attack - The attack stat of the Pokémon.
 * @property {number} statistics.defense - The defense stat of the Pokémon.
 * @property {number} statistics.special_attack - The special attack stat of the Pokémon.
 * @property {number} statistics.special_defense - The special defense stat of the Pokémon.
 * @property {number} statistics.speed - The speed stat of the Pokémon.
 * @property {Object} value - An object containing the Pokémon's value attributes.
 * @property {number} value.base_experience - The base experience of the Pokémon.
 * @property {number} value.movements - The number of movements the Pokémon has.
 * @property {number} value.capture_rate_percent - The capture rate percentage of the Pokémon.
 * @property {boolean} value.isLegendary - Whether the Pokémon is legendary.
 * @property {boolean} value.isMythical - Whether the Pokémon is mythical.
 */

/** @type {Pokemon} */
const pokemon = {
  pokeId: 1, // Número ID del Pokémon
  name: "Bulbasaur", // Nombre del Pokémon
  type: ["Grass", "Poison"], // Tipos del Pokémon
  images: {
    illustration: {
      default: "default_illustration_url", // URL de la ilustración por defecto
      shiny: "shiny_illustration_url", // URL de la ilustración shiny
    },
    rendering: {
      default: "default_rendering_url", // URL del renderizado por defecto
      shiny: "shiny_rendering_url", // URL del renderizado shiny
    },
    gif: {
      back_default: "back_default_gif_url", // URL del gif por defecto visto desde atrás
      back_shiny: "back_shiny_gif_url", // URL del gif shiny visto desde atrás
      front_default: "front_default_gif_url", // URL del gif por defecto visto desde el frente
      front_shiny: "front_shiny_gif_url", // URL del gif shiny visto desde el frente
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
    hp: 45, // Puntos de golpe
    attack: 49, // Estadística de ataque
    defense: 49, // Estadística de defensa
    special_attack: 65, // Estadística de ataque especial
    special_defense: 65, // Estadística de defensa especial
    speed: 45, // Estadística de velocidad
  },
  value: {
    base_experience: 64, // Experiencia base
    movements: 20, // Número de movimientos
    capture_rate_percent: 45, // Porcentaje de tasa de captura
    isLegendary: false, // Si es legendario
    isMythical: false, // Si es mítico
  },
};
