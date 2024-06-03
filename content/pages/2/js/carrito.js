// document.getElementById("carritoButton").addEventListener("click", () => {
//   history.pushState(null, "", "/carrito"); // Crea una nueva ruta
//   cargarContenido("/carrito"); // carga contenido en la nueva ruta
// });

// window.addEventListener("popstate", () => {
//   // permite ir hacia adelante y hacia atrás en la página
//   cargarContenido(location.pathname); // carga contenido en la ruta actual
// });

// document.addEventListener("DOMContentLoaded", () => {
//   cargarContenido(location.pathname); //carga el contenido correcto al iniciar
// });

  
let carrito = [];

/**
 * Añade un Pokémon al carrito de compras.
 *
 * @param {Object} pokemon - El objeto Pokémon que se va a añadir al carrito.
 * @throws {Error} Si el objeto Pokémon no está definido o es null.
 * @param {Array} carrito - El array del carrito de compras que se va a guardar.
 * @returns {Array} El array del carrito de compras recuperado.
 * @throws {Error} Si el carrito no está guardado en el almacenamiento local. 
*/

export function addToCart(pokemon) {
  if (!pokemon) {
    console.error("Error: Pokémon no detectado");
    return;
  }
  carrito.push(pokemon);
  console.log(carrito);
  //llamar a la funcion
  carritoStorage(carrito);
  
}

let carritoStore = getCarritoStorage();
console.log(carritoStore);
// funcion guardar carrito en localstorage

function carritoStorage(carrito) {
  const carritoStorageJSON = JSON.stringify(carrito);
  localStorage.setItem("carrito", carritoStorageJSON);
}

function getCarritoStorage(){
const carritoStorageJSON = localStorage.getItem("carrito");

if (!carritoStorageJSON) {
  console.error("Array CARRITO no guardado en localStorage");
  return[];
}
  carrito = JSON.parse(carritoStorageJSON);
  console.log("Array CARRITO guardado el localStorage: ", carrito);
  return carrito;
}


// Obtener el objeto Pokémon de sessionStorage y llamamos a la función principal
// const storedPokemon = sessionStorage.getItem("pokemonPreview");
// if (storedPokemon) {
//   const pokemon = JSON.parse(storedPokemon);
//   pokemonMain(pokemon);
// } else {
//   console.error(
//     "No se encontró ningún Pokémon seleccionado en sessionStorage."
//   );
// }

// function pokemonCarrito(pokemon) {
//   console.log(pokemon);
// }

// function mostrarPRoductos(pokemon) {
//   const listaProductos = document.getElementById("carritoDeCompraId");
//   listaProductos.innerHTML = "";

//   pokemon.forEach((producto) => {
//     const productoElemento = document.createElement("div");
//     productoElemento.className = "pokemonCarrito";

//     productoElemento.innerHTML = `
//         <p class="pokemon-id-back">#${pokeId}</p>
//         <div class="pokemon-image">
//           <img src="${poke.images.illustration.default}" alt="${poke.name}">
//         </div>
//         <div class="pokemon-info">
//           <div class="name-container">
//             <p class="pokemon-id">#${pokeId}</p>
//             <h2 class="pokemon-name" id="${quality}">${name}</h2>
//             <!-- <img class="pokemon-img_maxEvo" src="assets/images/pokeballMaxEvo.png" alt="pokeballMaxEvo}"> -->
//           </div>
//           <div class="pokemon-types">
//             ${types}
//           </div>
//           <div class="pokemon-stats">
//             <p class="stat">${height}</p>
//             <p class="stat">${weight}</p>
//           </div>
//           <div class="pokemon-price">
//             ${market}
//           </div>
//         </div>
//         `;

//     listaProductos.appendChild(productoElemento);
//   });
// }

// function agregarAlCarrito(idProducto) {
//   const producto = carrito.find((item) => item.id === idProducto);
//   if (producto) {
//     producto.cantidad++;
//   } else {
//     carrito.push({ id: idProducto, cantidad: 1 });
//   }

//   mostrarCarrito();
// }

// function mostrarCarrito() {
//   const carritoElemento = document.getElementById("cart");
//   carritoElemento.innerHTML = "";

//   carrito.forEach((item) => {
//     const producto = item; // Obtener los detalles del producto a partir de la ID en el carrito
//     const cartItem = document.createElement("div");
//     cartItem.className = "cart-item";

//     cartItem.innerHtml = `
//         <span>
//             <a></a>
//         </span>

//         <span>
//             <label for="cantidad"> Cantidad </label>
//             <input type="number" id="cantidad" min="1">
//         </span>

//         <span>
//             <p>Precio</p>
//         </span>

//         <span>
//             <p>Precio</p>
//         </span>

//         <span>
//             <label for="remove">Eliminar</label>
//             <button id="remove">X</button>
//         </span>

//         <span>
//             <p>Total</p>
//         </span>

//         <span>
//             <button>COMPRAR</button>
//         </span>

//         `;

//     carritoElemento.appendChild(cartItem);
//   });
// }

// function cargarContenido(ruta) {
//   if (ruta === "/carrito") {
//     document.getElementById("catálogoHome").style.display = "none";
//     const carritoDiv = document.getElementById("carritoDeCompraId");
//     carritoDiv.style.display = "block";
//     carritoDiv.innerHTML = `
//             <h1>Título</h1>
//             <p>Esto es un párrafo</p>
//             <input type="text" id="inputField" placeholder="Escribe algo aquí">
//             <div style="width: 500px; height: 1000px; border: 1px solid black;">Esto es un div</div>
//         `;
//   } else {
//     document.getElementById("catálogoHome").style.display = "block";
//     document.getElementById("carritoDeCompraId").style.display = "none";
//   }
// }

// obtenerProductos();
