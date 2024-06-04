/**
 * @constant {string} navBarPath - Ruta al archivo HTML de la barra de navegación.
 * @constant {Object} pages - Rutas a las páginas del sitio web.
 */
const navBarPath = "../assets/general/navBar/navBar.html";
const pages = {
  home: "../0/home.html",
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

    // Inicializar los eventos de navegación
    initNavEvents();
  } catch (error) {
    console.error("Error loading navbar: ", error);
  }
}

/**
 * Inicializa la funcionalidad del modo oscuro.
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
 * Inicializa los eventos de navegación.
 */
function initNavEvents() {
  const logoNavbar = document.querySelector(".logo-navbar img");
  const homeNavbar = document.querySelector(".home-nav-btn");
  const carritoButton = document.querySelector("#carritoButton");

  const gotoHomePage = () => {
    // Redirige a la página de inicio
    window.location.href = pages.home;
  };

  const gotoCartPage = () => {
    // Redirige a la página del carito
    window.location.href = pages.cart;
  };

  // Añadir event listeners para navegación
  if (logoNavbar) {
    logoNavbar.addEventListener("click", gotoHomePage);
  }

  if (homeNavbar) {
    homeNavbar.addEventListener("click", gotoHomePage);
  }

  if (carritoButton) {
    carritoButton.addEventListener("click", gotoCartPage);
  }
}

//? Añade un event listener para cargar la barra de navegación cuando el DOM esté completamente cargado
// document.addEventListener("DOMContentLoaded", loadNavbar);
//? Carga más rápido la NavBar ya que no espera a que el DOM esté totalmente cargado.
loadNavbar(); //! Si hay problemas cambiar la carga. No debería haber problemas porque la navbar no depende de la carga completa del DOM.
