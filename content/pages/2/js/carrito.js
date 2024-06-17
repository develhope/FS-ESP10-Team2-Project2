//!!!!!!!!!!!!!!!!!!!!!!!!
//todo||| CODIGO NUEVO |||
//!!!!!!!!!!!!!!!!!!!!!!!!

//? He editado este archivo y el HTML para solucionar el problema del "appendChild".
//? Este problema ocurría porque el elemento "containerCarritoId" se estaba intentando establecer
//? antes de que se ejecutase el HTML del carrito, es decir, tanto en la página principal (página 0)
//? como en la página 1.

//? Esto sucedía porque el código JS fuera de cualquier función se ejecuta inmediatamente
//? cuando otro archivo JS importa cualquier función de este archivo.

//? Para solucionar esto, investigué y encontré que la solución más sencilla es encapsular
//? todo el código necesario del carrito en una función principal que ejecuta toda la lógica requerida.
//? Luego, esa función se llama únicamente cuando se carga el archivo HTML del carrito.

//? La lógica de tu código está "prácticamente" igual a como la tenías, solo he editado lo necesario para solucionar este problema.

//* Vas por buen camino, tu código se ve bien, sigue así :)

// localStorage.clear();
// sessionStorage.clear();

//? El código que está fuera de cualquier función se ejecutará cada vez que se importe cualquier función de este archivo.
console.log("'carrito.js' ámbito global ejecutado");

//! Esta línea debe estar en el ámbito global para que se establezca en cada página que importe la función "addToCart" o/y "initCarrito" y para que la variable esté preparada y establecida para la función "addToCart" y "initCarrito".
let carrito = getCarritoStorage();

//? Encapsulamos toda la lógica funcional del carrito en una función principal que ejecutará toda la lógica.
export function initCarrito() {
  //? El código de esta función puedes dividirlo en varias funciones para una mejor organización, eso te lo dejo en tus manos (Decisión opcional).
  console.log("'carrito.js' función principal 'initCarrito' ejecutada");

  const carritoStorageJs = carrito;

  // Contenedor del carrito
  const containerCarritoId = document.getElementById("carritoDeCompraId");

  //! No es necesario usar "map" ya que tiene otros usos que no se requieren para una simple iteración, en su lugar usa mejor "forEach".
  carritoStorageJs.forEach((itemCarrito) => {
    const divCarrito = document.createElement("div");
    divCarrito.innerHTML = `
    <h2>${itemCarrito.name}</h2>
    <p>${itemCarrito.price}</p>
    <img src=${itemCarrito.image} alt=Imagen de ${itemCarrito.name}>
    `;

    // const inputCantidad = divCarrito.querySelector(`#quantity-${index}`);
    // inputCantidad.addEventListener('change', (event => {
    //   const nuevaCantidad = event.target.value;
    //   actualizarCantidadCarrito(index, nuevaCantidad);
    // }))

    containerCarritoId.appendChild(divCarrito);
  });
}

{/* <div class=contador>
      <label for=quantity-${index}>Cantidad:</label>
      <input type=number id=quantity-${index} name=quantity-${index} value=${itemCarrito.quantity} min=1>
      </div> */}

// function actualizarCantidadCarrito(index, nuevaCantidad) {
//   carrito[index].quantity = parseInt(nuevaCantidad, 10);
//   setCarritoStorage(carrito);
// }

//!Buscar el pokemon en el array del carrito y si lo encuentra que sume la camtidad a 1
export function addToCart(pokemon) {
  if (!pokemon) {
    console.error("Error: Pokémon no detectado");
    return;
  }
  // Objeto sólo con las propiedades necesarias del pokemon para hacer carrito más ligero
  const carritoItem = {
    name: pokemon.name,
    price: pokemon.market.price,
    image: pokemon.images.illustration.default,
    quantity: 1, // Agregar una propiedad de cantidad
  };

  carrito.push(carritoItem);
  console.log(carritoItem);

  //llamar a la funcion para guardar en localStorage
  setCarritoStorage(carrito);
}

// Funcion para guardar el carrito en localStorage
function setCarritoStorage(carrito) {
  const carritoStorageJSON = JSON.stringify(carrito);
  localStorage.setItem("carrito", carritoStorageJSON);
}

// Funcion para optener el carrito del localStorage
function getCarritoStorage() {
  //Recuperar el carrito del localStorage
  const carritoStorageJSON = localStorage.getItem("carrito");

  if (!carritoStorageJSON) {
    console.error("Array CARRITO no guardado en localStorage");
    return [];
  }

  const carritoStorageJs = JSON.parse(carritoStorageJSON);

  return carritoStorageJs;
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!
//todo||| CODIGO ANTERIOR |||
//!!!!!!!!!!!!!!!!!!!!!!!!!!!



// // document.getElementById("carritoButton").addEventListener("click", () => {
// //   history.pushState(null, "", "/carrito"); // Crea una nueva ruta
// //   cargarContenido("/carrito"); // carga contenido en la nueva ruta
// // });

// // window.addEventListener("popstate", () => {
// //   // permite ir hacia adelante y hacia atrás en la página
// //   cargarContenido(location.pathname); // carga contenido en la ruta actual
// // });

// // document.addEventListener("DOMContentLoaded", () => {
// //   cargarContenido(location.pathname); //carga el contenido correcto al iniciar
// // });

// /**
//  * Añade un Pokémon al carrito de compras.
//  *
//  * @param {Object} pokemon - El objeto Pokémon que se va a añadir al carrito.
//  * @throws {Error} Si el objeto Pokémon no está definido o es null.
//  * @param {Array} carrito - El array del carrito de compras que se va a guardar.
//  * @returns {Array} El array del carrito de compras recuperado.
//  * @throws {Error} Si el carrito no está guardado en el almacenamiento local.
//  */
// let carrito = [];

// // localStorage.clear();
// // sessionStorage.clear();

// export function addToCart(pokemon) {
//   if (!pokemon) {
//     console.error("Error: Pokémon no detectado");
//     return;
//   }
//   // Objeto sólo con las propiedades necesarias del pokemon para hacer carrito más ligero
//   // const carritoItem = {
//   //   name: pokemon.name,
//   //   price: pokemon.price,
//   //   image: pokemon.image,
//   //   quantity: 1 // Agregar una propiedad de cantidad
//   // };

//   carrito.push(carrito);
//   console.log(carrito);
//   //llamar a la funcion para guardar en localStorage
//   carritoStorage(carrito);
// }

// // Funcion para guardar el carrito en localStorage
// function carritoStorage(carrito) {
//   const carritoStorageJSON = JSON.stringify(carrito);
//   localStorage.setItem("carrito", carritoStorageJSON);
// }

// // Contenedor del carrito
// const containerCarritoId = document.getElementById("carritoDeCompraId");

// //Recuperar el carrito del localStorage
// const carritoStorageJSON = localStorage.getItem("carrito");
// const carritoStorageJs = JSON.parse(carritoStorageJSON);

// // Función para obtener y mostrar el carrito guardado en localStorage
// function getCarritoStorage() {
//   if (!carritoStorageJSON) {
//     console.error("Array CARRITO no guardado en localStorage");
//     return [];
//   }

//   //COmentad esto y aparecerá vuestra parte

//   carritoStorageJs.map((itemCarrito) => {
//     const divCarrito = document.createElement("div");
//     divCarrito.innerHTML = `
//     <h2>${itemCarrito.name}</h2>
//     <p>${itemCarrito.price}</p>
//     <img src=${itemCarrito.image} alt=Imagen de ${itemCarrito.name}>
//     `;
//     containerCarritoId.appendChild(divCarrito);
//     // console.log("Esto es item carrito", {
//     //   nombre: itemCarrito.name,
//     //   id: itemCarrito.id,
//     //   precio: itemCarrito.market.price,
//     //   foto: itemCarrito.images.rendering.default
//     // });
//   });

//   carrito = JSON.parse(carritoStorageJSON);

//   console.log("Array CARRITO guardado el localStorage: ", carrito);
//   return carrito;
// }

// getCarritoStorage();

// // function conjuntoPrecios (carritoStorageJSON){
// //   const sumaPrecios = 0;

// // }
// // document.cart.addEventListener("click", () => {
// //   carritoContentHtml =
// // });

// // function agregarAlCarrito(idProducto) {
// //   const producto = carrito.find((item) => item.id === idProducto);
// //   if (producto) {
// //     producto.cantidad++;
// //   } else {
// //     carrito.push({ id: idProducto, cantidad: 1 });
// //   }

// //   mostrarCarrito();
// // }

// // function mostrarCarrito() {
// //   const carritoElemento = document.getElementById("cart");
// //   carritoElemento.innerHTML = "";

// //   carrito.forEach((item) => {
// //     const producto = item; // Obtener los detalles del producto a partir de la ID en el carrito
// //     const cartItem = document.createElement("div");
// //     cartItem.className = "cart-item";

// //     cartItem.innerHtml = `
// //         <span>
// //             <a></a>
// //         </span>

// //         <span>
// //             <label for="cantidad"> Cantidad </label>
// //             <input type="number" id="cantidad" min="1">
// //         </span>

// //         <span>
// //             <p>Precio</p>
// //         </span>

// //         <span>
// //             <p>Precio</p>
// //         </span>

// //         <span>
// //             <label for="remove">Eliminar</label>
// //             <button id="remove">X</button>
// //         </span>

// //         <span>
// //             <p>Total</p>
// //         </span>

// //         <span>
// //             <button>COMPRAR</button>
// //         </span>

// //         `;

// //     carritoElemento.appendChild(cartItem);
// //   });
// // }

// // function cargarContenido(ruta) {
// //   if (ruta === "/carrito") {
// //     document.getElementById("catálogoHome").style.display = "none";
// //     const carritoDiv = document.getElementById("carritoDeCompraId");
// //     carritoDiv.style.display = "block";
// //     carritoDiv.innerHTML = `
// //             <h1>Título</h1>
// //             <p>Esto es un párrafo</p>
// //             <input type="text" id="inputField" placeholder="Escribe algo aquí">
// //             <div style="width: 500px; height: 1000px; border: 1px solid black;">Esto es un div</div>
// //         `;
// //   } else {
// //     document.getElementById("catálogoHome").style.display = "block";
// //     document.getElementById("carritoDeCompraId").style.display = "none";
// //   }
// // }

// // obtenerProductos();
