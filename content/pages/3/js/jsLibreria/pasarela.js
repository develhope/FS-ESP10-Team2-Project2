//import { getCarritoStorage } from './carrito.js';
//import Stripe from "stripe";

import TokensManager from "../../assets/general/js/models/TokensManager.js";
//import { addListPokemonToInventory } from "../../../0/js/models/PokemonManager.js";
const dinero = new TokensManager();

const stripe = Stripe('pk_test_51PWJAjKkZigXo74zEaZF9NVcLF7Fxks1wH2hoT9tQW7MJy2IlSCZhvIpRq9twM2wmauQKFLaOOtIcG2xB0LL9TxQ00G5kA3Nao');
console.log(stripe)
const elements = stripe.elements();

document.addEventListener('DOMContentLoaded', () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    console.log('Carrito cargado:', carrito);
    mostrarPokemonCarrito(carrito);
    inicializarFormularioPago();
});

function mostrarPokemonCarrito(carrito) {
    const pokemonList = document.getElementById('pokemon-list');
    const cartTotal = document.getElementById('cart-total');
    
    if (!pokemonList || !cartTotal) {
        console.error('Elementos del DOM no encontrados');
        return;
    }

    let total = 0;

    pokemonList.innerHTML = ''; // Limpiar la lista antes de añadir nuevos elementos

    if (carrito.length === 0) {
        pokemonList.innerHTML = '<p>No hay Pokémon en el carrito</p>';
        cartTotal.innerHTML = '<h3>Total a pagar: 0.00€</h3>';
        return;
    }

    carrito.forEach(item => {
        const pokemonElement = document.createElement('div');
        pokemonElement.className = 'pokemon-item';
        pokemonElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="pokemon-image">
            <div class="pokemon-details">
                <h3>${item.name}</h3>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio: ${item.variablePrice.toFixed(2)}€</p>
            </div>
        `;
        pokemonList.appendChild(pokemonElement);
        total += item.variablePrice;
    });

    cartTotal.innerHTML = `<h3>Total a pagar: ${total.toFixed(2)}€</h3>`;
}

console.log(200.308.toFixed(2))
function inicializarFormularioPago() {
    const paymentElement = document.getElementById('payment-element');
    if (!paymentElement) {
        console.error('Elemento payment-element no encontrado');
        return;
    }

    const card = elements.create('card');
    card.mount('#payment-element');

    const form = document.getElementById('payment-form');
    if (!form) {
        console.error('Formulario de pago no encontrado');
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const { token, error } = await stripe.createToken(card);

        if (error) {
            const errorElement = document.getElementById('error-message');
            if (errorElement) {
                errorElement.textContent = error.message;
            }
        } else {
            dinero.subtractTokens()
            enviarTokenAlServidor(token);
        }
    });
}

function enviarTokenAlServidor(token) {
    console.log('Token enviado al servidor:', token);
    alert('¡Pago procesado con éxito!');
    // Aquí podrías redirigir a una página de confirmación o limpiar el carrito
}