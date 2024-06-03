document.getElementById('carritoButton').addEventListener('click', () =>{
    history.pushState(null, '', '/carrito'); // Crea una nueva ruta
    cargarContenido('/carrito'); // carga contenido en la nueva ruta
});

window.addEventListener('popstate', () => {// permite ir hacia adelante y hacia atrás en la página
    cargarContenido(location.pathname); // carga contenido en la ruta actual
}); 

document.addEventListener('DOMContentLoaded', () => {
    cargarContenido(location.pathname); //carga el contenido correcto al iniciar
});


const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';
let carrito = [];

// async function obtenerProductos(){
//     try{
//         const response = await fetch(apiUrl);
//         const productos = await response.json();
//         mostrarPRoductos(productos);
//     } catch (error){
//         console.error('Error al obtener productos:', error);
//     }
// }


const pokemon = localStorage.getItem("pokemonPreview");
pokemonCarrito(pokemon);

function pokemonCarrito (pokemon){
    console.log(pokemon);
}

function mostrarPRoductos(pokemon){
    const listaProductos = document.getElementById('carritoDeCompraId');
    listaProductos.innerHTML = '';

    pokemon.forEach(producto => {
        const productoElemento = document.createElement('div');
        productoElemento.className = 'pokemonCarrito';
 
        productoElemento.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-image">
          <img src="${poke.images.illustration.default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
          <div class="name-container">
            <p class="pokemon-id">#${pokeId}</p>
            <h2 class="pokemon-name" id="${quality}">${name}</h2>
            <!-- <img class="pokemon-img_maxEvo" src="assets/images/pokeballMaxEvo.png" alt="pokeballMaxEvo}"> -->
          </div>
          <div class="pokemon-types">
            ${types}
          </div>
          <div class="pokemon-stats">
            <p class="stat">${height}</p>
            <p class="stat">${weight}</p>
          </div>
          <div class="pokemon-price">
            ${market}
          </div>
        </div>
        `;

        listaProductos.appendChild(productoElemento);
    });
}

function agregarAlCarrito(idProducto){
    const producto = carrito.find(item => item.id === idProducto);
    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({id: idProducto, cantidad:1});
    }

    mostrarCarrito();
}

function mostrarCarrito() {
    const carritoElemento = document.getElementById('cart');
    carritoElemento.innerHTML='';

    carrito.forEach(item => {
        const producto = item; // Obtener los detalles del producto a partir de la ID en el carrito
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHtml = `
        <span> 
            <a></a> 
        </span>

        <span> 
            <label for="cantidad"> Cantidad </label> 
            <input type="number" id="cantidad" min="1"> 
        </span>

        <span> 
            <p>Precio</p> 
        </span>

        <span> 
            <p>Precio</p> 
        </span>
        
        <span> 
            <label for="remove">Eliminar</label>
            <button id="remove">X</button>
        </span>

        <span> 
            <p>Total</p>
        </span>

        <span> 
            <button>COMPRAR</button>
        </span>

        `;

        carritoElemento.appendChild(cartItem);
    });
    
}

function cargarContenido(ruta){
    if (ruta === '/carrito'){
        document.getElementById('catálogoHome').style.display = 'none';
        const carritoDiv = document.getElementById('carritoDeCompraId');
        carritoDiv.style.display = 'block';
        carritoDiv.innerHTML = `
            <h1>Título</h1>
            <p>Esto es un párrafo</p>
            <input type="text" id="inputField" placeholder="Escribe algo aquí">
            <div style="width: 500px; height: 1000px; border: 1px solid black;">Esto es un div</div>
        `;
    } else {
        document.getElementById('catálogoHome').style.display = 'block';
        document.getElementById('carritoDeCompraId').style.display = 'none';
    }
}

obtenerProductos();



