// import { AddToCart } from "./cart.js";

// Función principal para enlazar toda la lógica del código
function pokemonMain(pokemon) {
  // Llama a las funciones para mostrar detalles y crear el botón Comprar
  displayPokemonDetails(pokemon);
  createBuyButton(pokemon);
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
    <img src="${pokemon.images.gif.front_default}" alt="${pokemon.name} front">
    <img src="${pokemon.images.gif.back_default}" alt="${pokemon.name}" back>
    <p>ID: ${pokemon.pokeId}</p>
    <p>Type: ${pokemon.type.join(", ")}</p>
    <p>Height: ${pokemon.statistics.height.meters} meters</p>
    <p>Weight: ${pokemon.statistics.weight.kilograms} kilograms</p>
    <p>Price: ${price}€</p>
  `;
}

// Función para crear el Botón Comprar
function createBuyButton(pokemon) {
  // Crear un elemento de botón
  const button = document.createElement("button");
  button.innerText = "Añadir al carrito";
  button.id = "buy-button";

  // Agregar un detector de eventos al botón
  button.addEventListener("click", function () {
    // Llama a la función externa para guardar el pokemon en el carrito
    // AddToCart(pokemon);
    alert(`${pokemon.name} se añadió al carrito correctamente.`);
  });

  // Añade el botón al contenedor de Pokémon.
  const container = document.getElementById("pokemon-container");
  container.appendChild(button);
}

// Obtener el objeto Pokémon de localStorage y llamamos a la función principal
const storedPokemon = localStorage.getItem("pokemonPreview");
if (storedPokemon) {
  const pokemon = JSON.parse(storedPokemon);
  pokemonMain(pokemon);
} else {
  console.error("No se encontró ningún Pokémon seleccionado en localStorage.");
}
