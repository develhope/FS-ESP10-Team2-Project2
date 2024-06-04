/**
 * Ruta al archivo HTML de la barra de navegación.
 * @constant {string}
 */
const navBarPath = "../assets/general/navBar/navBar.html";

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

    // Referencias a elementos del DOM
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
  } catch (error) {
    console.error("Error loading navbar: ", error);
  }
}

// Añade un event listener para cargar la barra de navegación cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", loadNavbar);
