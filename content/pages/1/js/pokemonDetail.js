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

  let container1 = document.createElement("section")
  container1.className = "pokemon-container-img-text"

  let container2 = document.createElement("section")
  container2.className = "pokemon-container-img"
  let h1 = document.createElement("h1")
  h1.id = "h1"
  h1.innerText = `${pokemon.name} No: ${pokemon.pokeId}`
  let table=document.createElement("section")
  table.className="puntos-de-base"
  container.appendChild(h1)
  container.appendChild(container1)
  container.appendChild(table)
  container1.appendChild(container2);

  let h2Table=document.createElement("h2")
  h2Table.className="h2-table"
  h2Table.innerText="Puntos de base"
    let ul0=document.createElement("ul")
    ul0.className="ul0";
    table.appendChild(h2Table)
    table.appendChild(ul0)
  
    let statisticsAll=pokemon.statistics
    console.log(statisticsAll)
    // pokemon.statistics.forEach((a)=>{
    // let li=document.createElement("li");
    // li.innerText=a.power
    // ul0.appendChild(li)
    // })
  // isLegendary: false, // Si es legendario
  // isMythical: false, // Si es mítico
  // isFinalEvolution: true, // Si es su evolucion final
  function habilitiesPokemon(pokemon) {
    if (pokemon.value.isLegendary === false) {
      return "Legendary"
    }
    else if (pokemon.value.isMythical === false)
      return "Mythical"

  }
  container2.innerHTML = `
   <div class=imgs> <img src="${pokemon.images.illustration.shiny}" alt="${pokemon.name} front" id="img-shiny">
   <img src="${pokemon.images.gif.front_shiny}" alt="${pokemon.name} front" id="gif">
   </div>
   <span id="price-span-imgs"class="span-details-pokemon-container-text">${price}€ </span> 
  `;


  let container3 = document.createElement("section");
  container3.className = "pokemon-text-container";

  container3.innerHTML = `
<div class=pokemon-container-text>
 <div class="text-div-details-pokemon-container">
  <p class="p-details-pokemon-container-text">Height:<span class="span-details-pokemon-container-text">${pokemon.statistics.height.meters} ${metersFnc(pokemon)} </span></p>
  <p class="p-details-pokemon-container-text">Weight:<span class="span-details-pokemon-container-text">${pokemon.statistics.weight.kilograms} ${gramsFnc(pokemon)}</span></p></div>
   <div class="text-div-details-pokemon-container-text">
   <p id="hability-p-details-pokemon-container-tex"class="p-details-pokemon-container-text">Hability:<span class="habilitiy-span-details-pokemon-container-text"> ${habilitiesPokemon(pokemon)} </span> </p> <div>

  </div>

  `
  function metersFnc(pokemon) {
    if (pokemon.statistics.height.meters === 1) { return "meter" }
    else { return "meters" }
  }
  function gramsFnc(pokemon) {
    if (pokemon.statistics.weight.kilograms === 1) { return "gram" }
    else { return "grams" }
  }
  container1.appendChild(container3);

  let typeSection = document.createElement("section");
  typeSection.className = "type-section-container3-pokemon"
  container3.appendChild(typeSection)
  let typeText = document.createElement("p")
  typeText.className = "text-type-section-container3-pokemon";
  typeText.innerText = "Type"
  let buttonType = document.createElement("button")
  buttonType.className += " button-type-section-container3-pokemon";
  // buttonType.className +=  ` ${type}`;


  const types = pokemon.type.map((t) => `<p id="types-container3-pokemon" class="${t} t">${t} </p>`).join("");
  console.log(types);

  buttonType.innerHTML = types;

  typeSection.appendChild(typeText);
  typeSection.appendChild(buttonType);

  let container4 = document.createElement("section")
  container4.className = "evolutions-pokemon-container"
  container4.innerHTML = `
<div class=imgs-evolutions>
<img class="img-evolutions-pokemon" src="${pokemon.images.illustration.shiny}" alt="${pokemon.name} front">
<span class="class=arrow-span-evolutions-pokemon"> > </span> 

</div>
<div id="map-evoltions"></div>
`
  container.appendChild(container4);

  let mapEvo = document.getElementById("map-evoltions")
  const evolutionsPoke = pokemon.evolutions.map((a) => `<p id="img-evolutions">${a.evolves_to}</p>`).join("");
  mapEvo.innerHTML = evolutionsPoke
  let evo=a.evolves_to
  console.log(evolutionsPoke);
  
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
