/**
 * @typedef {Object} Pokemon
 * @property {number} pokeId - El ID del Pokémon.
 * @property {string} name - El nombre del Pokémon.
 * @property {string[]} type - Un array de tipos de Pokémon.
 * @property {Object} images - Un objeto que contiene URL de imágenes del Pokémon.
 * @property {Object} images.illustration - Un objeto que contiene URL de imagen de ilustración.
 * @property {string} images.illustration.default - La URL de ilustración predeterminada.
 * @property {string} images.illustration.shiny - La URL de la ilustración brillante.
 * @property {Object} images.rendering - Un objeto que contiene URL de una imagen tipo renderizado 3d.
 * @property {string} images.rendering.default - La URL de renderizado 3d predeterminada.
 * @property {string} images.rendering.shiny - La URL de renderizado 3d brillante.
 * @property {Object} images.gif - Un objeto que contiene URL de GIF.
 * @property {string} images.gif.back_default - La URL GIF predeterminada posterior.
 * @property {string} images.gif.back_shiny - La URL GIF brillante posterior.
 * @property {string} images.gif.front_default - La URL GIF predeterminada frontal.
 * @property {string} images.gif.front_shiny - La URL del GIF brillante frontal.
 * @property {Object} statistics - Un objeto que contiene las estadísticas del Pokémon.
 * @property {Object} statistics.height - Un objeto que contiene medidas de altura.
 * @property {number} statistics.height.centimeter - Altura en centímetros.
 * @property {number} statistics.height.decimeters - Altura en decímetros.
 * @property {number} statistics.height.meters - Altura en metros.
 * @property {Object} statistics.weight - Un objeto que contiene medidas de peso.
 * @property {number} statistics.weight.gram - Peso en gramos.
 * @property {number} statistics.weight.hectograms - Peso en hectogramos.
 * @property {number} statistics.weight.kilograms - Peso en kilogramos.
 * @property {number} statistics.weight.tons - Peso en toneladas.
 * @property {number} statistics.hp - Los puntos de vida de los Pokémon.
 * @property {number} statistics.attack - La estadística de ataque del Pokémon.
 * @property {number} statistics.defense - La estadística de defensa del Pokémon.
 * @property {number} statistics.special_attack - La estadística de ataque especial del Pokémon.
 * @property {number} statistics.special_defense - La estadística de defensa especial de los Pokémon.
 * @property {number} statistics.speed - La estadística de velocidad del Pokémon.
 * @property {Object} value - Un objeto que contiene los atributos de valor del Pokémon.
 * @property {number} value.base_experience - La experiencia base de los Pokémon.
 * @property {number} value.movements - La cantidad de movimientos que tiene el Pokémon.
 * @property {number} value.capture_rate_percent - El porcentaje de tasa de captura del Pokémon.
 * @property {boolean} value.isLegendary - Si el Pokémon es legendario.
 * @property {boolean} value.isMythical - Si el Pokémon es mítico.
 * @property {Object} market - Un objeto que contiene datos del mercado actual.
 * @property {number} market.price - La cantidad de dinero actual que vale el Pokémon si no hay un descuento vigente.
 * @property {number|undefined} market.discount - La cantidad de dinero vigente que vale el Pokémon con el descuento de la oferta, si se encuentra "undefined" no habrá  oferta disponible.
 *
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
  market: {
    price: 100, // Precio
    discount: 69, // Precio con el descuento por oferta
  },
};
