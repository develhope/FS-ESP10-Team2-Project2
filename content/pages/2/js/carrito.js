// localStorage.clear();
// sessionStorage.clear();

let carrito = getCarritoStorage();

// Encapsulamos toda la lógica funcional del carrito en una función principal que ejecutará toda la lógica.
export function initCarrito() {
  let importeTotal = 0;
  const carritoStorageJs = carrito;

  // Contenedor del carrito
  const containerCarritoId = document.getElementById("carritoDeCompraId");

  carritoStorageJs.forEach((itemCarrito, index) => {
    console.warn(itemCarrito);

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
          <input type="number" id="quantity-${index}" name="quantity-${index}" value="${
      itemCarrito.quantity
    }" min="1" max="100">
          <p id=precio-${index}> Total: ${itemCarrito.variablePrice.toFixed(
      2
    )}€</p>
        </div>
      </div>
      <div class= deleteButton>
      <button id=remove-${index}>
        <span class="material-symbols-outlined">
         delete
        </span> 
      </button> 
      </div>
    </div>
    `;

    // Suma de todas las cards
    importeTotal += itemCarrito.variablePrice;

    const inputCantidad = divCarrito.querySelector(`#quantity-${index}`);
    inputCantidad.addEventListener("change", (event) => {
      const nuevaCantidad = event.target.value;

      //Validar que la cantidad sea un numero natural entre 1-100

      if (validarCantidad(nuevaCantidad)) {
        actualizarCantidadCarrito(index, nuevaCantidad);
      } else {
        alert("Cantidad inválida. Debe ser un número natural 1-100");
        event.target.value = carrito[index].quantity;
      }
    });

    const removeButton = divCarrito.querySelector(`#remove-${index}`);
    removeButton.addEventListener("click", () => {
      divCarrito.classList.add("fade-out");
      setTimeout(() => {
        eliminarPokemonCard(index); // Llamar a la función de eliminación después de la animación
      }, 500);
    });

    containerCarritoId.appendChild(divCarrito);
  });

  const totalCarrito = document.createElement("div");
  totalCarrito.className = "totalCarrito";
  totalCarrito.innerHTML = `
  <p > IMPORTE TOTAL: <p>
  <p > ${importeTotal.toFixed(2)}€
  `;
  containerCarritoId.appendChild(totalCarrito);

  const checkoutButton = document.createElement("button");
  checkoutButton.className = "pasarelaCheck";
  checkoutButton.textContent = "Proceder al pago";
  containerCarritoId.appendChild(checkoutButton);

  checkoutButton.addEventListener("click", () => {
    window.location.href = '../3/pasarela.html';
  });

  // Restringir input a 0, no negativos, no por encima de 100, no separaciones entre números

  function validarCantidad(cantidad) {
    const importeTotalCarrito = parseInt(cantidad, 10);
    return (
      !isNaN(importeTotalCarrito) &&
      importeTotalCarrito > 0 &&
      importeTotalCarrito <= 100
    );
  }

  function actualizarImporteTotal() {
    let nuevoImporteTotal = 0;
    carrito.forEach((item) => {
      nuevoImporteTotal += item.variablePrice;
    });

    const totalCarritoElement = document.querySelector(
      ".totalCarrito p:last-child"
    );
    totalCarritoElement.textContent = `${nuevoImporteTotal.toFixed(2)}€`;
  }

  function actualizarCantidadCarrito(index, nuevaCantidad) {
    const precioUnitario = carrito[index].price;
    carrito[index].quantity = parseInt(nuevaCantidad, 10);

    // Calcular el nuevo precio basado en la nueva cantidad
    const nuevoPrecio = precioUnitario * carrito[index].quantity;
    actualizarPrecioCarrito(index, nuevoPrecio);
    actualizarImporteTotal();
    setCarritoStorage(carrito);
  }

  function actualizarPrecioCarrito(index, nuevoPrecio) {
    const precioElement = document.getElementById(`precio-${index}`);
    precioElement.textContent = `Total: ${nuevoPrecio.toFixed(2)}€`;
    carrito[index].variablePrice = nuevoPrecio;
    setCarritoStorage(carrito);
    actualizarImporteTotal();
  }

  function eliminarPokemonCard(index) {
    carrito.splice(index, 1);
    setCarritoStorage(carrito);
    renderCarrito();
  }

  function renderCarrito() {
    containerCarritoId.innerHTML = ""; // Limpiar el contenido anterior
    initCarrito(); // Vuelve a inicializar el carrito
  }
}

export function addToCart(pokemon) {
  if (!pokemon) {
    console.error("Error: Pokémon no detectado");
    return;
  }

  const realPrice = pokemon.market.discount
    ? pokemon.market.discount
    : pokemon.market.price;

  // Objeto sólo con las propiedades necesarias del pokemon para hacer carrito más ligero
  const carritoItem = {
    name: pokemon.name,
    price: realPrice,
    image: pokemon.images.rendering.default,
    quantity: 1, // Agregar una propiedad de cantidad
    variablePrice: realPrice,
  };

  // Buscar si el Pokémon ya está en el carrito
  const existingPokemon = carrito.find((item) => item.name === pokemon.name);

  if (existingPokemon) {
    // Si ya está, suma uno
    existingPokemon.quantity += 1;
    existingPokemon.variablePrice += realPrice;
  } else {
    // Si no está, agregar el nuevo objeto
    carrito.push(carritoItem);
  }

  console.log("EL CARRITO SUMADO", carritoItem);

  // Llamar a la función para guardar en localStorage
  setCarritoStorage(carrito);
}

/**
 ** Guarda el carrito en localStorage y emite un evento para notificar el cambio.
 * @param {Array} carrito - El carrito a guardar.
 */
function setCarritoStorage(carrito) {
  // Convierte el carrito en una cadena JSON
  const carritoStorageJSON = JSON.stringify(carrito);
  // Guarda la cadena JSON en localStorage bajo la clave "carrito"
  localStorage.setItem("carrito", carritoStorageJSON);
  // Llama a la función para emitir el evento personalizado de cambio de carrito
  emitCartChanged(carrito);
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

/**
 *! Función para emitir un evento personalizado cuando el carrito cambia.
 *? Esto permite notificar otras partes de la aplicación sobre el cambio en el carrito.
 * @param {Array} carrito - El carrito actualizado.
 */
function emitCartChanged(carrito) {
  // Crea un nuevo evento personalizado llamado "cartChanged"
  const event = new CustomEvent("cartChanged", {
    detail: { carrito }, // Pasa el carrito actualizado como detalle del evento
  });
  // Despacha el evento globalmente para que otros componentes puedan escucharlo
  window.dispatchEvent(event);
}

//  * Añade un Pokémon al carrito de compras.
//  *
//  * @param {Object} pokemon - El objeto Pokémon que se va a añadir al carrito.
//  * @throws {Error} Si el objeto Pokémon no está definido o es null.
//  * @param {Array} carrito - El array del carrito de compras que se va a guardar.
//  * @returns {Array} El array del carrito de compras recuperado.
//  * @throws {Error} Si el carrito no está guardado en el almacenamiento local.
