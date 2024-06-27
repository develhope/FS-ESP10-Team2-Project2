import { addToCart } from "./../../2/js/carrito.js";
//? Libreria personal de utilidades
import _ from "./../../assets/general/js/lib/utilities.js";
import { getColorByPercentage } from "../../0/js/models/PokemonDOMHandler.js";

// Función principal para enlazar toda la lógica del código
function pokemonMain() {
  console.log(pokemon[pokemon._])
  // Llama a las funciones para mostrar detalles y crear el botón Comprar
  const pokemonOrigin = pokemon[pokemon._]
  const pokemonOriginName = _.str.capitalize(pokemonOrigin.name)
  displayPokemonDetails(pokemonOrigin, pokemonOriginName);
  createBuyButton(pokemonOrigin, pokemonOriginName);
}

// Función para mostrar detalles de Pokémon
function displayPokemonDetails(pokemonOrigin, pokemonOriginName) {
  const container = document.getElementById("pokemon-container");

  // Comprobamos si el Pokemon tiene un descuento
  let price;
  if (pokemonOrigin.market.discount) {
    // Si tiene un descuento guardamos su descuento como precio (price)
    price = pokemonOrigin.market.discount;
  } else {
    // Si no tiene un descuento guardamos su precio base
    price = pokemonOrigin.market.price;
  }

  let container1 = document.createElement("section");
  container1.className = "pokemon-container-img-text";

  let container2 = document.createElement("section")
  container2.className = "pokemon-container-img"
  let h1 = document.createElement("h1")
  h1.id = "h1"
  h1.innerText = `${pokemonOriginName} No: ${pokemonOrigin.pokeId.toString().padStart(4, "0")}`


  // let table = document.createElement("section")
  // table.className = "puntos-de-base"
  container.appendChild(h1)
  container.appendChild(container1)
  // container.appendChild(table)
  container1.appendChild(container2);

  // isLegendary: false, // Si es legendario
  // isMythical: false, // Si es mítico
  // isFinalEvolution: true, // Si es su evolucion final

  function habilitiesPokemon(pokemon) {
    console.log(pokemon.value.isLegendary);
    console.log(pokemon.value.isMythical);
    if (pokemon.value.isLegendary === true) {
      return "Hability: Legendary";
    } else if (pokemon.value.isMythical === true) {
      return "Hability: Mythical";
    }

    return " ";
  }

  container2.innerHTML = `
   <div class=imgs> 
   <div class=image><img src="${pokemonOrigin.images.illustration.shiny}" alt="${pokemonOriginName} front" id="img-shiny">
   <img src="${pokemonOrigin.images.gif.front_shiny}" alt="${pokemonOriginName} front" id="gif">
   </div>
   <span id="price-span-imgs"class="span-details-pokemon-container-text">${price}€ </span>
   </div>
   <div class="table">
   <h2>Base Points</h2>
   <ul class=ul>
   <li style="background-color: ${getColorByPercentage(
    pokemonOrigin.statistics.hp_percent
  )}">Hp: ${pokemonOrigin.statistics.hp}</li>
   <li>Attack: ${pokemonOrigin.statistics.attack} </li>
   <li>Defense: ${pokemonOrigin.statistics.defense}</li>
   <li>Special_attack: ${pokemonOrigin.statistics.special_attack}</li>
   <li>Special_defense: ${pokemonOrigin.statistics.special_defense}</li>
   <li>Speed:${pokemonOrigin.statistics.speed}</li>
   </ul>
     `;


  // let li=document.createElement("li")
  // li.textContent=chaos
  // table.appendChild(h2Table)
  // table.appendChild(ul)
  // ul.appendChild(li)

  let statisticsAll = pokemonOrigin.statistics
  console.log(statisticsAll)

  // let chaos=pokemon.statistics.forEach((a)=>{return`<li>${a.attack}</li>`})


  let container3 = document.createElement("section");
  container3.className = "pokemon-text-container";

  //   capture_rate_percent: 45, // Porcentaje de tasa de captura
  // cuantas evoluciones tiene o si es un pkemon que se encuentra en su ultima evolución
  // cantidad de  movements:
  // statistics.power
  // statistics.power_percent leer propiedad

  container3.innerHTML = `
  <div class="text-description">
  <p>${pokemonOriginName} can achieve a total of  ${pokemonOrigin.value.movements} movements.
Its percentage of power is ${pokemonOrigin.statistics.power_percent} and its percentage capture rate is ${pokemonOrigin.value.capture_rate_percent}. 
 ${indexEvolu(pokemonOrigin)} ${finalEvolution(pokemonOrigin)}  </p>
  </div>
<div class=pokemon-container-text>
 <div class="text-div-details-pokemon-container">
  <p class="p-details-pokemon-container-text">Height:<span class="span-details-pokemon-container-text">${pokemonOrigin.statistics.height.meters
    } ${metersFnc(pokemonOrigin)} </span></p>
  <p class="p-details-pokemon-container-text">Weight:<span class="span-details-pokemon-container-text">${pokemonOrigin.statistics.weight.kilograms
    } ${gramsFnc(pokemonOrigin)}</span></p></div>
    <p class=gender-text>Possible genders:<span class="gender-result"> ${genderFnc(pokemonOrigin)}</span></p>
   <div class="text-div-details-pokemon-container-text">
   <p id="hability-p-details-pokemon-container-tex"class="p-details-pokemon-container-text"><span class="habilitiy-span-details-pokemon-container-text"> ${habilitiesPokemon(
      pokemonOrigin
    )} </span> </p> <div>

  </div>

  `;
  /**
 * Determina la etapa de evolución de un Pokémon dado.
 * 
 * @param {Object} pokemonOrigin - Objeto que representa un Pokémon.
 * @param {string} pokemonOriginName - Nombre del Pokémon.
 * @param {string[]} pokemonOrigin.evolutions - Lista de nombres de las evoluciones del Pokémon en orden.
 * @returns {string} - Mensaje indicando la etapa de evolución del Pokémon.
 */
  function indexEvolu(pokemon) {
    const indice = pokemon.evolutions.indexOf(pokemon.name);
    const evolutions = [
      "first",
      "second",
      "third",
      "fourth ",
      "fifth"
    ];

    if (indice >= 0 && indice < evolutions.length) {
      return `${pokemon.name} is in its ${evolutions[indice]} evolution`;
    }

    return "";
  }

  indexEvolu(pokemonOrigin)
  console.log(pokemonOrigin)
  function finalEvolution(pokemon) {
    if (pokemon.value.isFinalEvolution === true) { return `and this is its last evolution!!` }

    return " "
  }
  function metersFnc(pokemon) {
    if (pokemon.statistics.height.meters === 1) {
      return "meter";
    } else {
      return "meters";
    }
  }
  function gramsFnc(pokemon) {
    if (pokemon.statistics.weight.kilograms === 1) {
      return "gram";
    } else {
      return "grams";
    }
  }
  function genderFnc(pokemon) {
    if (pokemon.gender === null) { return " " }
    else if (pokemon.gender === undefined) { return "" }
    else { return pokemon.gender }
  }
  container1.appendChild(container3);

  let typeSection = document.createElement("div");
  typeSection.className = "type-section-container3-pokemon";
  container3.appendChild(typeSection);
  let typeText = document.createElement("p");
  typeText.className = "text-type-section-container3-pokemon";
  typeText.innerText = "Type";
  let buttonType = document.createElement("button");
  buttonType.className += " button-type-section-container3-pokemon";
  // buttonType.className +=  ` ${type}`;

  const types = pokemonOrigin.type
    .map((t) => `<p id="types-container3-pokemon" class="${t} t">${t} </p>`)
    .join("");
  console.log(types);

  buttonType.innerHTML = types;

  typeSection.appendChild(typeText);
  typeSection.appendChild(buttonType);

  // function obtenerImagenDeEvolucion(pokemon) {
  //   const objetoRelacionado = pokemon.find(a => a.evolutions === pokemon);
  //   if (objetoRelacionado) {
  //     return objetoRelacionado.imagen;
  //   } else {
  //     return 'No se encontró una imagen para esta evolución.';
  //   }
  // }
  let container4 = document.createElement("section");
  container4.className = "evolutions-pokemon-container";
  container.appendChild(container4);

  const arrImgEvoluPoke = pokemonOrigin.evolutions.map((evolu) =>
    pokemon[evolu].images.illustration.default
  )
  arrImgEvoluPoke.map((imgs) => {
    let img = document.createElement("img")
    img.className = "imgs-evolutions"
    img.src = imgs
    container4.appendChild(img)
  })
  console.log(arrImgEvoluPoke)

  let pokemonName = pokemon[pokemon._].evolutions
  pokemonName.map((name) => {
    let nameEvoluPok = document.createElement("p")
    nameEvoluPok.textContent = name
    nameEvoluPok.className = "name-evolu-poke";

    container4.appendChild(nameEvoluPok)
  })
  console.log(pokemonName)

  const arrTypeEvoluPoke =
    pokemonOrigin.evolutions.map((type) =>
      pokemon[type].type
    )
  arrTypeEvoluPoke.map((types) => {
    let textType = document.createElement("P")
    textType.className = "type-evolutions"
    textType.innerHTML = `Type: <span class="span-type">${types}</span>`
    container4.appendChild(textType)
  })
  //   container4.innerHTML = `
  // <div class=imgs-evolutions>
  // <img class="img-evolutions-pokemon" src="${pokemonOrigin.images.illustration.default}" alt="${pokemonOriginName} front">
  // <span class="class=arrow-span-evolutions-pokemon"> > </span> 

  // </div>
  // <div id="map-evoltions"></div>
  // `;



}

// Función para crear el Botón Comprar
function createBuyButton(pokemonOrigin, pokemonOriginName) {
  // Crear un elemento de botón
  const button = document.createElement("button");
  button.innerText = "Add to cart";
  button.id = "buy-button";

  // Agregar un detector de eventos al botón
  button.addEventListener("click", function () {
    // Llama a la función externa para guardar el pokemon en el carrito
    addToCart(pokemonOrigin);
    alert(`${pokemonOriginName} has been added to cart successfully.`);
  });

  // Añade el botón al contenedor de Pokémon.
  const container = document.getElementById("pokemon-container");
  container.appendChild(button);
}

// Obtener el objeto Pokémon de sessionStorage y llamar a la función principal
const storedPokemon = sessionStorage.getItem("pokemonPreview");
const pokemon = JSON.parse(storedPokemon);

if (pokemon) {
  // Parsear el JSON almacenado en sessionStorage para obtener el objeto Pokémon

  //! (IMPORTANTE) El objeto `pokemon` contiene los objetos Pokémon de las evoluciones disponibles
  //* El objeto `pokemon` tiene una propiedad `_` que guarda el nombre del Pokémon original
  console.log(
    `  There is '${pokemon[pokemon._].evolutions.length}' available evolutions: `
  );


  //* Imprimir el objeto `pokemon` completo, que incluye las evoluciones
  console.log(pokemon);

  //* Imprimir el nombre del Pokémon original usando la propiedad `_` como clave
  console.log(`El Pokémon original es '${pokemon._}':`);
  //* Para que sea una clave válida se reemplaza el carácter "-" por "_" si es que `pokemon._` contiene el carácter "-"
  //* Si quieres obtener el nombre real, utiliza la siguiente nomenclatura para obtener el nombre real del Pokémon original `pokemon[pokemon._].name`
  console.log(`Nombre real: '${pokemon[pokemon._].name}'`);
  console.log(pokemon[pokemon._]);
  console.log("\n\n\n");

  //! (IMPORTANTE) Mandar el objeto completo `pokemon` a la función principal
  //* Más adelante, deberás establecer el elemento original `pokemon[pokemon._]` para manipularlo adecuadamente
  // pokemonMain(pokemon[pokemon._]); //? Aquí envío el objeto Pokémon original
  pokemonMain(); //! Pero tú deberás enviar el objeto entero y manipular sus datos para obtener todas las propiedades necesarias de los demás Pokémon como sus imágenes
} else {
  // Si no se encuentra ningún Pokémon seleccionado en sessionStorage, mostrar un error
  console.error(
    "No se encontró ningún Pokémon seleccionado en sessionStorage."
  );
}
