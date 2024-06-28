//import { getCarritoStorage } from './carrito.js';
//import Stripe from "stripe";

import TokensManager from "../../assets/general/js/models/TokensManager.js";
import { addListPokemonToInventory } from "../../0/js/models/PokemonManager.js";
import { deleteCart } from "../../2/js/carrito.js";

// Crear una instancia de TokensManager para manejar el saldo de tokens

const dinero = new TokensManager();
let totalToPay = undefined;

// Obtener el carrito de compras desde el localStorage, si no existe, inicializarlo como un array vacío

const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Inicializar Stripe con la clave pública de prueba

const stripe = Stripe(
  "pk_test_51PWJAjKkZigXo74zEaZF9NVcLF7Fxks1wH2hoT9tQW7MJy2IlSCZhvIpRq9twM2wmauQKFLaOOtIcG2xB0LL9TxQ00G5kA3Nao"
);

// Crear elementos de Stripe

const elements = stripe.elements();

// Añadir un listener para ejecutar el código cuando el DOM esté completamente cargado

document.addEventListener("DOMContentLoaded", () => {
  console.log("Carrito cargado:", carrito);
  mostrarPokemonCarrito(carrito);
  inicializarFormularioPago();

  const listPokemon = carrito.flatMap((item) =>
    Array(item.quantity).fill(item.name)
  );
  console.log("Nombres de Pokémon en el carrito:", listPokemon);
});

// Función para mostrar los Pokémon del carrito en la página

function mostrarPokemonCarrito(carrito) {
  const pokemonList = document.getElementById("pokemon-list");
  const cartTotal = document.getElementById("cart-total");

  if (!pokemonList || !cartTotal) {
    console.error("Elementos del DOM no encontrados");
    return;
  }

  totalToPay = 0;

  // Limpiar la lista antes de añadir nuevos elementos

  pokemonList.innerHTML = ""; // Limpiar la lista antes de añadir nuevos elementos

  if (carrito.length === 0) {
    pokemonList.innerHTML = "<p>No hay Pokémon en el carrito</p>";
    cartTotal.innerHTML = "<h3>Total a pagar: 0.00€</h3>";
    return;
  }

  carrito.forEach((item) => {
    const pokemonElement = document.createElement("div");
    pokemonElement.className = "pokemon-item";
    pokemonElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="pokemon-image">
            <div class="pokemon-details">
                <h3>${item.name}</h3>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio: ${item.variablePrice.toFixed(2)}€</p>
            </div>
        `;
    pokemonList.appendChild(pokemonElement);
    totalToPay += item.variablePrice; // Calcular el total a pagar
  });

  cartTotal.innerHTML = `<h3>Total a pagar: ${totalToPay.toFixed(2)}€</h3>`;
}

// Función para inicializar el formulario de pago

function inicializarFormularioPago() {
  const paymentElement = document.getElementById("payment-element");
  if (!paymentElement) {
    console.error("Elemento payment-element no encontrado");
    return;
  }
  // Crear y montar el elemento de tarjeta de Stripe

  const card = elements.create("card");
  card.mount("#payment-element");

  const form = document.getElementById("payment-form");
  if (!form) {
    console.error("Formulario de pago no encontrado");
    return;
  }
  // Añadir un listener para manejar el envío del formulario de pago

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { token, error } = await stripe.createToken(card);

    if (error) {
      const errorElement = document.getElementById("error-message");
      if (errorElement) {
        errorElement.textContent = error.message; // Mostrar mensaje de error
      }
    } else {
      // Restar tokens y verificar si la transacción es exitosa
      const isExito = dinero.subtractTokens(totalToPay);
      if (isExito) {
        enviarTokenAlServidor(token); // Enviar el token al servidor si hay éxito
      } else {
        refusePaymen(); // Rechazar el pago si no hay suficiente saldo
      }
    }
  });
}

// Función para enviar el token al servidor

function enviarTokenAlServidor(token) {
  console.log("Token enviado al servidor:", token);
  alert("¡Pago procesado con éxito!");
  const listPokemon = carrito.flatMap((item) =>
    Array(item.quantity).fill(item.name)
  );
  console.log("Nombres de Pokémon en el carrito:", listPokemon);
  addListPokemonToInventory(listPokemon);
  deleteCart();
  window.location.href = "../0/home.html";
}

// Función para rechazar el pago si no hay suficiente saldo

function refusePaymen() {
  console.warn(
    "El usuario no tiene el dinero suficiente para realizar el pago"
  );
  alert("No tiene saldo suficiente");
}
