import { addToCart } from "./../../2/js/carrito.js";

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

let container1=document.createElement("div")
container1.className="pokemon-container-img-text"

let container2=document.createElement("div")
container2.className="pokemon-container-img"
let h1=document.createElement("h1")
h1.id="h1"
h1.innerText=`${pokemon.name} No: ${pokemon.pokeId}`
container.appendChild(h1)
container.appendChild(container1)
container1.appendChild(container2)

// isLegendary: false, // Si es legendario
// isMythical: false, // Si es mítico
// isFinalEvolution: true, // Si es su evolucion final
function habilitiesPokemon(pokemon){
  if(pokemon.value.isLegendary===false){
    return "Legendary"
  }
  else if(pokemon.value.isMythical===false)
    return "Mythical"

}
  container2.innerHTML = `
    <img src="${pokemon.images.illustration.shiny}" alt="${pokemon.name} front" id="img-shiny">
   <img src="${pokemon.images.gif.front_shiny}" alt="${pokemon.name} front" id="gif">
<p id="price-p-details-pokemon-container-text"class=p-details-pokemon-container-text><span class=span-details-pokemon-container-text>${price}€ </span> </p>
  `;
  let container3=document.createElement("div")
  container3.className="pokemon-text-container"
  container1.appendChild(container3)
container3.innerHTML = `
<section class=pokemon-container-text>
  <p class=p-details-pokemon-container-text>Height:<span class=span-details-pokemon-container-text>${pokemon.statistics.height.meters} meters</span></p>
  <p class=p-details-pokemon-container-text>Weight:<span class=span-details-pokemon-container-text>${pokemon.statistics.weight.kilograms}kilograms</span></p>
  
  </section>
  <p id="hability-p-details-pokemon-container-tex"class=p-details-pokemon-container-text>Hability:<span class=habilitiy-span-details-pokemon-container-text> ${habilitiesPokemon(pokemon)} </span> </p>

 
  `
  // <p class="p-type">Type: ${pokemon.type.join(", ")}</p>
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
    addToCart(pokemon);
    alert(`${pokemon.name} se añadió al carrito correctamente.`);
  });

  // Añade el botón al contenedor de Pokémon.
  const container = document.getElementById("pokemon-container");
  container.appendChild(button);
}

// Obtener el objeto Pokémon de sessionStorage y llamamos a la función principal
const storedPokemon = sessionStorage.getItem("pokemonPreview");
if (storedPokemon) {
  const pokemon = JSON.parse(storedPokemon);
  pokemonMain(pokemon);
} else {
  console.error(
    "No se encontró ningún Pokémon seleccionado en sessionStorage."
  );
}
