// ! Suma de todas las cards
// ! Función eliminar
// ! Pasarela de pago

// localStorage.clear();
// sessionStorage.clear();


let carrito = getCarritoStorage();

// Encapsulamos toda la lógica funcional del carrito en una función principal que ejecutará toda la lógica.
export function initCarrito() {

  const carritoStorageJs = carrito;

  // Contenedor del carrito
  const containerCarritoId = document.getElementById("carritoDeCompraId");

  carritoStorageJs.forEach((itemCarrito, index) => {
    const divCarrito = document.createElement("div");
    divCarrito.innerHTML = `
    <div class= carrito-items>
      <div class = target-sup>
        <h2 style="text-transform: uppercase;">${itemCarrito.name}</h2>
        <img src=${itemCarrito.image} alt=Imagen de ${itemCarrito.name}>
      </div>
      <div class = carrito-inf>
        <p>${itemCarrito.price}€</p>
        <div class="contador">
          <label for="quantity-${index}">Cantidad:</label>
          <input type="number" id="quantity-${index}" name="quantity-${index}" value="${itemCarrito.quantity}" min="1">
          <p id=precio-${index}> Total: ${itemCarrito.variablePrice.toFixed(2)}€</p>
        </div>
      </div>
      <button id=remove-${index}>
        <span class="material-symbols-outlined">
         delete
        </span> 
      </button> 
    </div>
    `;

    const inputCantidad = divCarrito.querySelector(`#quantity-${index}`);
      inputCantidad.addEventListener('change', (event) => {
        const nuevaCantidad = event.target.value;
        actualizarCantidadCarrito(index, nuevaCantidad);
        }
      ) 
    
    const removeButton = divCarrito.querySelector(`#remove-${index}`);
    removeButton.addEventListener('click', () => {
      eliminarPokemonCard(index);
    });

    containerCarritoId.appendChild(divCarrito);
  });

  function actualizarCantidadCarrito(index, nuevaCantidad) {
    const precioUnitario = carrito[index].price;
    carrito[index].quantity = parseInt(nuevaCantidad, 10);

    // Calcular el nuevo precio basado en la nueva cantidad
    const nuevoPrecio = precioUnitario * carrito[index].quantity;
    actualizarPrecioCarrito(index, nuevoPrecio);
    setCarritoStorage(carrito);
  }

  function actualizarPrecioCarrito(index, nuevoPrecio) {
    const precioElement = document.getElementById(`precio-${index}`);
    precioElement.textContent = `Total: ${nuevoPrecio.toFixed(2)}€`;
    carrito[index].variablePrice = nuevoPrecio;
    setCarritoStorage(carrito);
  } 
  
  function eliminarPokemonCard(index) {
    carrito.splice(index, 1);
    setCarritoStorage(carrito);
    renderCarrito();
  }

  function renderCarrito() {
    containerCarritoId.innerHTML = ''; // Limpiar el contenido anterior
    initCarrito(); // Vuelve a inicializar el carrito
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
    variablePrice: pokemon.market.price,
  };

  // Buscar si el Pokémon ya está en el carrito
  const existingPokemon = carrito.find(item => item.name === pokemon.name);

  if (existingPokemon) {
    // Si ya está, suma uno
    existingPokemon.quantity += 1;
    existingPokemon.variablePrice += pokemon.market.price;
  } else {
    // Si no está, agregar el nuevo objeto
    carrito.push(carritoItem);
  }

  console.log("EL CARRITO SUMADO", carritoItem);

  // Llamar a la función para guardar en localStorage
  setCarritoStorage(carrito);
}

// Función para guardar el carrito en localStorage
function setCarritoStorage(carrito) {
  const carritoStorageJSON = JSON.stringify(carrito);
  localStorage.setItem("carrito", carritoStorageJSON);
}

// Función para obtener el carrito del localStorage
function getCarritoStorage() {
  // Recuperar el carrito del localStorage
  const carritoStorageJSON = localStorage.getItem("carrito");

  if (!carritoStorageJSON) {
    console.log("CARRITO VACÍO");
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
