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
 * @property {string|null} images.gif.back_default - La URL GIF predeterminada posterior.
 * @property {string|null} images.gif.back_shiny - La URL GIF brillante posterior.
 * @property {string|null} images.gif.front_default - La URL GIF predeterminada frontal.
 * @property {string|null} images.gif.front_shiny - La URL del GIF brillante frontal.
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
 * @property {boolean} value.isFinalEvolution - Si el Pokémon ya no puede evolucionar mas porque se encuentra en su ultima evolución.
 * @property {Object[]} evolutions - Una lista de objetos que representan las evoluciones del Pokémon.
 *                                  Cada objeto contiene el nombre del Pokémon y una lista de nombres de los Pokémon a los que puede evolucionar.
 * @property {Object} market - Un objeto que contiene datos del mercado actual.
 * @property {number} market.price - La cantidad de dinero actual que vale el Pokémon si no hay un descuento vigente.
 * @property {number|undefined} market.discount - La cantidad de dinero vigente que vale el Pokémon con el descuento de la oferta, si se encuentra "undefined" no habrá oferta disponible.
 *
 *! Esto es un Pokemon de ejemplo, no todos los datos son correctos.
 */
const pokemon = {
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