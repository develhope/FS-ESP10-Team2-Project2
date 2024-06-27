//? Libreria personal de utilidades
import _ from "../js/lib/utilities.js";

//? Manejador de Tokens (Tokens Manager)
import T from "../js/models/TokensManager.js";

/**
 * @constant {string} navBarPath - Ruta al archivo HTML de la barra de navegación.
 * @constant {Object} pages - Rutas a las páginas del sitio web.
 */
const navBarPath = "../assets/general/navBar/navBar.html";
const pages = {
  home: "../0/home.html",
  cart: "../2/carritoIndex.html",
};

/**
 * Carga la barra de navegación desde un archivo HTML externo y la inserta en el DOM.
 * @async
 * @function loadNavbar
 * @returns {Promise<void>}
 */
async function loadNavbar() {
  try {
    const response = await fetch(navBarPath);

    // Verifica si la respuesta es correcta
    if (!response.ok) {
      throw new Error("No ha sido posible cargar el index de la navbar");
    }

    // Obtiene el contenido HTML de la barra de navegación
    const navbarHTML = await response.text();

    // Inserta el contenido HTML en el elemento con id "navbar-complete"
    document.getElementById("navbar-complete").innerHTML = navbarHTML;

    // Esperar a que el DOM se haya actualizado
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // Inicializar la funcionalidad del modo oscuro
    initDarkMode();

    // Inicializar los eventos relacionados con los Tokens
    initSetTokens();

    // Inicializar el elemento contador del carrito
    initCartCounter();

    // Inicializar los eventos de navegación
    initNavEvents();
  } catch (error) {
    console.error("Error loading navbar: ", error);
  }
}

/**
 ** Inicializa la funcionalidad del modo oscuro.
 */
function initDarkMode() {
  const darkModeToggle = document.querySelector("#darkModeToggle");
  const body = document.body;

  // Función para activar/desactivar el modo oscuro
  const toggleDarkMode = () => {
    const isDarkMode = body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
  };

  // Event listener para el botón de modo oscuro
  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", toggleDarkMode);
  }

  // Verificar el estado del modo oscuro en localStorage
  const darkModeStatus = localStorage.getItem("darkMode");
  if (darkModeStatus === "true") {
    body.classList.add("dark-mode");
  }
}

/**
 ** Inicializa los eventos relacionados con los Tokens y establece un observador para cambios en T.tokens.
 */
function initSetTokens() {
  const nbTokens = document.querySelector(".div-tokens p");
  if (nbTokens) {
    nbTokens.textContent = `${T.tokens}€`;

    // Escuchar el evento tokensChanged para actualizar nbTokens
    window.addEventListener("tokensChanged", () => {
      nbTokens.textContent = `${T.tokens}€`;
    });
  }
}

/**
 ** Inicializa el contador del carrito y configura el evento para actualizar el contador cuando cambie el carrito.
 */
function initCartCounter() {
  const nbCartCount = document.querySelector(".cart-count");

  if (nbCartCount) {
    updateCartCounter(nbCartCount);

    // Escuchar el evento cartChanged para actualizar el contador del carrito
    window.addEventListener("cartChanged", () => {
      updateCartCounter(nbCartCount);
    });
  }
}

/**
 * Actualiza el contador del carrito en el DOM.
 * @param {HTMLElement} nbCartCount - El elemento del DOM que muestra el contador del carrito.
 */
function updateCartCounter(nbCartCount) {
  const cart = _.DOM.getFromLocalStorage("carrito");
  const cartLeng = cart
    ? _.DOM.getFromLocalStorage("carrito").length
    : [].length;

  if (cartLeng > 0) {
    nbCartCount.style.display = "block";
    nbCartCount.textContent = cartLeng;
  } else {
    nbCartCount.style.display = "none";
    nbCartCount.textContent = 0;
  }
}

/**
 ** Inicializa los eventos de navegación.
 */
function initNavEvents() {
  const nbLogo = document.querySelector(".logo-navbar img");
  const nbHome = document.querySelector(".home-nav-btn");
  const nbCartButton = document.querySelector("#carritoButton");

  const gotoHomePage = () => {
    // Redirige a la página de inicio
    window.location.href = pages.home;
  };

  const gotoCartPage = () => {
    // Redirige a la página del carito
    window.location.href = pages.cart;
  };

  // Añadir event listeners para navegación
  if (nbLogo) {
    nbLogo.addEventListener("click", gotoHomePage);
  }

  if (nbHome) {
    nbHome.addEventListener("click", gotoHomePage);
  }

  if (nbCartButton) {
    nbCartButton.addEventListener("click", gotoCartPage);
  }
}

//? Añade un event listener para cargar la barra de navegación cuando el DOM esté completamente cargado
// document.addEventListener("DOMContentLoaded", loadNavbar);
//? Carga más rápido la NavBar ya que no espera a que el DOM esté totalmente cargado.
loadNavbar(); //! Si hay problemas cambiar la carga. No debería haber problemas porque la NavBar no depende de la carga completa del DOM.
