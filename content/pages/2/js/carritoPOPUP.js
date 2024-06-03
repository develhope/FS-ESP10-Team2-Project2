// variables
let allContainerCart = document.querySelector('.pokemon');

let buyPokemon = [];

//functions
loadEvenListeners()
function loadEvenListeners(){
    allContainerCart.addEventListener('click', addProduct);
}

function addProduct(e){ //Esta función evitará que addProduct se active en toda la card. Ahora sólo se activará con el botón add to cart.
    e.preventDedault();
    if (e.target.classList.contains('btn-add-cart')){
        const selectProduct = e.target.parentElement; //Nos arroja inforamción del contenedor padre (título card)
        readTheContent(selectProduct);
    }
}

function readTheContent({Pokemon}) {
    //Ahora sacamos los atributos necesarios de cada producto (imagen...)
    const infoPokemon = {
        image: images.querySelector('div img').src,
        title: name.querySelector('title').textContent,
        price: market.price.querySelector('div p span').textContent,
        id: pokeId.querySelector('a').getAttribute('data-id'),
        amount: 1,
    }

    buyPokemon = [...buyPokemon, infoProduct]
    loadHtml();
}

function loadHtml(){
    buyPokemon.forEach(product => { //Traemos del html la información del producto del carrito popup
        const {image, title, price, amount, id} = product;
        const row = document.createElement('div');
        row.classList.add('item');
        row.innerHTML=``//Copiar html del popup aquí dentro. Ejemplo:
        /* <img src=${image} alt="${name}"
        <div class="item-content">
            <h5>${title}</h5>
            <h5 class="cart-price">${price}€</h5>
            <h6>Cantidad: ${amount}</h6>
        <div>
        <span class="delete-product" data-id="${id}">X</span>
        */
        
    });
}