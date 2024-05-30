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

function pokemon_Init(poke) {
  const divMain = document.querySelector("main");

  const div = document.createElement("div");
  div.classList.add("div-container");

  div.innerHTML = `
        <p>Nombre del pokemon: ${poke.name}</p>
        <img src="${poke.images.gif.front_default}" alt="${poke.name}">
      `;

  divMain.prepend(div);
}

pokemon_Init(pokemon);
