// Detalles de Pokémon
const pokemon = [
  {
    pokeId: 1,
    name: "bulbasaur",
    type: ["grass", "poison"],
    images: {
      illustration: {
        default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
        shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/1.png",
      },
      rendering: {
        default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png",
        shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/1.png",
      },
      gif: {
        back_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/1.gif",
        back_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/shiny/1.gif",
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1.gif",
        front_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/1.gif",
      },
    },
    statistics: {
      height: {
        centimeter: 70.0,
        decimeters: 7,
        meters: 0.7,
      },
      weight: {
        gram: 6900,
        hectograms: 69,
        kilograms: 6.9,
        tons: 0.0069,
      },
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    },
    value: {
      base_experience: 64,
      movements: 20,
      capture_rate_percent: 45,
      isLegendary: false,
      isMythical: false,
      isFinalEvolution: false,
    },
    evolutions: [
      { name: "bulbasaur", evolves_to: ["ivysaur"] },
      { name: "ivysaur", evolves_to: ["venusaur"] },
      { name: "venusaur", evolves_to: [] },
    ],
    market: {
      price: 100,
      discount: 69,
    },
  },
  {
    pokeId: 6,
    name: "charizard",
    type: ["fire", "flying"],
    images: {
      illustration: {
        default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/6.png",
      },
      rendering: {
        default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/6.png",
        shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/6.png",
      },
      gif: {
        back_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/6.gif",
        back_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/shiny/6.gif",
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif",
        front_shiny:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/6.gif",
      },
    },
    statistics: {
      height: {
        centimeter: 700.7,
        decimeters: 107,
        meters: 1.7,
      },
      weight: {
        gram: 90000,
        hectograms: 10000,
        kilograms: 90,
        tons: 0.0169,
      },
      hp: 69,
      attack: 75,
      defense: 30,
      special_attack: 70,
      special_defense: 70,
      speed: 30,
    },
    value: {
      base_experience: 100,
      movements: 25,
      capture_rate_percent: 20,
      isLegendary: false,
      isMythical: false,
      isFinalEvolution: true,
    },
    evolutions: [
      { name: "charmander", evolves_to: ["charmeleonion"] },
      { name: "charmeleonion", evolves_to: ["charizard"] },
      { name: "charizard", evolves_to: [] },
    ],
    market: {
      price: 1002.28,
      discount: undefined,
    },
  },
];

// Función principal para enlazar toda la logica del codigo
function pokemonMain(pokemon) {
  // Llame a las funciones para mostrar detalles y crear el botón Comprar
  displayPokemonDetails(pokemon);
  createBuyButton(pokemon);
}

//todo: Función para crear el Botón Comprar
function createBuyButton(pokemon) {
  // Crear un elemento de botón
  const button = document.createElement("button");
  button.innerText = "Añadir al carrito";
  button.id = "buy-button";

  // Agregar un detector de eventos al botón
  button.addEventListener("click", function () {
    //? Llama ha la función externa para guardar el pokemon en el carrito
    // AddCarito(pokemon);
    alert(`${pokemon.name} se añadio al carrito correctamente.`);
  });

  // Añade el botón al contenedor de Pokémon.
  const container = document.getElementById("pokemon-container");
  container.appendChild(button);
}

// Función para mostrar detalles de Pokémon
function displayPokemonDetails(pokemon) {
  const container = document.getElementById("pokemon-container");

  // Comprobamos si el Pokemon tiene un descuento
  let price;
  if (pokemon.market.discount) {
    // Si tiene un descuento guardamos su descuento como precio (price)
    price = pokemon.market.discount;
  } else {
    // Si no tiene un descuento guardamos su precio base
    price = pokemon.market.price;
  }

  container.innerHTML = `
      <h1>${pokemon.name}</h1>
      <img src="${pokemon.images.gif.front_default}" alt="${
    pokemon.name
  } front">
      <img src="${pokemon.images.gif.back_default}" alt="${pokemon.name}" back>
      <p>ID: ${pokemon.pokeId}</p>
      <p>Type: ${pokemon.type.join(", ")}</p>
      <p>Height: ${pokemon.statistics.height.meters} meters</p>
      <p>Weight: ${pokemon.statistics.weight.kilograms} kilograms</p>
      <p>Price: ${price}€</p>
    `;
}

//! Llamamos ha la función principal que administrara todo el codigo
//? Enviamos un objeto del array de ejemplo pokemon
//! He añadido un objeto mas para que pruebes la diferencia entre uno y otro
pokemonMain(pokemon[0]); //? Puedes probar con el elemento 1 para ver los cambios
