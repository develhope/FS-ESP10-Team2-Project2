

// localStorage.clear();
// sessionStorage.clear();


let carrito = getCarritoStorage();

// Encapsulamos toda la lógica funcional del carrito en una función principal que ejecutará toda la lógica.
export function initCarrito() {

  const carritoStorageJs = carrito;

  // Contenedor del carrito
  const containerCarritoId = document.getElementById("carritoDeCompraId");

  carritoStorageJs.forEach((itemCarrito, index, priceQuantity) => {
    const divCarrito = document.createElement("div");
    divCarrito.innerHTML = `
    <div class= carrito-items>
      <div class = target-sup>
        <h2 style="text-transform: uppercase;">${itemCarrito.name}</h2>
        <img src=${itemCarrito.image} alt=Imagen de ${itemCarrito.name}>
      </div>
      <div class = carrito-inf>
        <p id=precio-${index}>${itemCarrito.price}€</p>
        <div class="contador">
          <label for="quantity-${index}">Cantidad:</label>
          <input type="number" id="quantity-${index}" name="quantity-${index}" value="${itemCarrito.quantity}" min="1">
        </div>
      </div>
    </div>
    `;

    const inputCantidad = divCarrito.querySelector(`#quantity-${index}`);
      inputCantidad.addEventListener('change', (event => {
        const nuevaCantidad = event.target.value;
        actualizarCantidadCarrito(index, nuevaCantidad);
        }
      ) 
    )


    containerCarritoId.appendChild(divCarrito);
  });

  //! Arreglar suma de precios, se está multiplicando precio*nuevaCantidad,
  //! pero el precio después de la primera vez ya no es el inicial 
  //! y por eso da error, comentar mañana en clase

  function actualizarCantidadCarrito(index, nuevaCantidad) {
    carrito[index].quantity = parseInt(nuevaCantidad, 10);
    //Actualizar precio en función de nueva cantidad
    const precioCarrito = carrito[index].price*nuevaCantidad;
    actualizarPrecioCarrito(index, precioCarrito);
    setCarritoStorage(carrito);
  }

  function actualizarPrecioCarrito(index, nuevoPrecio) {
    const precioElement = document.getElementById(`precio-${index}`);
    precioElement.textContent = `${nuevoPrecio}€`;
    carrito[index].price = nuevoPrecio;
    setCarritoStorage(carrito);
  }
  

}

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

  // Buscar si el Pokémon ya está en el carrito
  const existingPokemon = carrito.find(item => item.name === pokemon.name);

  if(existingPokemon){
    //Si ya está, suma uno
    existingPokemon.quantity += 1;
  } else {
    //Si no está agregar el nuevo objeto
    carrito.push(carritoItem);
  }
  console.log("EL CARRITO SUMADO" , carritoItem);

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




//  * Añade un Pokémon al carrito de compras.
//  *
//  * @param {Object} pokemon - El objeto Pokémon que se va a añadir al carrito.
//  * @throws {Error} Si el objeto Pokémon no está definido o es null.
//  * @param {Array} carrito - El array del carrito de compras que se va a guardar.
//  * @returns {Array} El array del carrito de compras recuperado.
//  * @throws {Error} Si el carrito no está guardado en el almacenamiento local.
