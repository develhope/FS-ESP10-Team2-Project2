/**
 * @typedef {Object} Pokemon
 *
 * @property {number} pokeId - El ID del Pokémon.
 *
 * @property {string} name - El nombre del Pokémon.
 *
 * @property {string[]} type - Un array de tipos de Pokémon.
 *
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
 *
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
 * @property {number} statistics.hp - Los puntos de vida del Pokémon.
 * @property {number} statistics.hp_percent - El porcentaje de vida del Pokémon, se calcula procesando la vida de todos los Pokémon de la lista.
 * @property {number} statistics.attack - La estadística de ataque del Pokémon.
 * @property {number} statistics.attack_percent - El porcentaje de ataque del Pokémon, se calcula procesando el ataque de todos los Pokémon de la lista.
 * @property {number} statistics.defense - La estadística de defensa del Pokémon.
 * @property {number} statistics.defense_percent - El porcentaje de defensa del Pokémon, se calcula procesando la defensa de todos los Pokémon de la lista.
 * @property {number} statistics.special_attack - La estadística del ataque especial del Pokémon.
 * @property {number} statistics.special_attack_percent - El porcentaje del ataque especial del Pokémon, se calcula procesando el ataque especial de todos los Pokémon de la lista.
 * @property {number} statistics.special_defense - La estadística de la defensa especial de los Pokémon.
 * @property {number} statistics.special_defense_percent - El porcentaje de la defensa especial del Pokémon, se calcula procesando la defensa especial de todos los Pokémon de la lista.
 * @property {number} statistics.speed - La estadística de la velocidad del Pokémon.
 * @property {number} statistics.speed_percent - El porcentaje de la velocidad del Pokémon, se calcula procesando la velocidad de todos los Pokémon de la lista.
 *
 * @property {number} statistics.power - La suma de todas sus estadisticas de lucha (hp, attack, defense, special_attack, special_defense, speed).
 * @property {number} statistics.power_percent - El porcentaje de la suma de todas sus estadisticas de lucha del Pokémon, se calcula procesando el power de todos los Pokémon de la lista.
 *
 * @property {Object} value - Un objeto que contiene los atributos de valor del Pokémon.
 * @property {number} value.base_experience - La experiencia base de los Pokémon.
 * @property {number} value.movements - La cantidad de movimientos que tiene el Pokémon.
 * @property {number} value.capture_rate_percent - El porcentaje de tasa de captura del Pokémon.
 * @property {boolean} value.isLegendary - Si el Pokémon es legendario.
 * @property {boolean} value.isMythical - Si el Pokémon es mítico.
 * @property {boolean} value.isFinalEvolution - Si el Pokémon ya no puede evolucionar mas porque se encuentra en su ultima evolución.
 *
 * @property {Array} evolutions - Una lista de nombres de todas las evoluciones a partir del Pokémon inicial`.
 * @property {Array|null|undefined} gender - Una lista de los generos disponibles del Pokémon, `null` si no tiene genero, `undefined` si no es ni "female" ni "male".
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
  evolutions: ["bulbasaur", "ivysaur", "venusaur"], // Cadena de todas las evoluciones disponibles
  gender: ["male", "female"], // Tios posibles de genero
  market: {
    price: 100, // Precio
    discount: 69, // Precio con el descuento por oferta
  },
};
