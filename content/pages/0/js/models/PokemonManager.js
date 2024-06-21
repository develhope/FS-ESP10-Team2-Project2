//? Manejador de datos Pokemon (Pokemon Data Handler)
import P_DH from "./PokemonDataHandler.js";

//? Manejador de DOM Pokemon (Pokemon DOM Handler)
import P_DOM_H from "./PokemonDOMHandler.js";

//? Filtros de Pokemon (Pokemon Filter)
import P_F from "./PokemonFilter.js";

/**
 * Espera a que un elemento esté disponible en el DOM.
 * @param {string} selector - El selector del elemento a esperar.
 * @param {number} timeout - El tiempo máximo de espera en milisegundos.
 * @returns {Promise<Element>} - Una promesa que se resuelve con el elemento DOM.
 */
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;
    const checkInterval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(checkInterval);
        resolve(element);
      } else if (elapsed >= timeout) {
        clearInterval(checkInterval);
        reject(
          new Error(`El elemento '${selector}' no se encontró en el DOM.`)
        );
      }
      elapsed += interval;
    }, interval);
  });
}

export default class PokemonManager {
  /**
   * Constructor de la clase PokemonManager.
   * @throws {Error} - Si ocurre algún error durante la inicialización.
   */
  constructor() {
    // Inicializar las instancias de las clases manejadoras
    this.PokemonDataHandler = new P_DH();
    this.PokemonFilter = new P_F();

    // Obtener referencias a elementos del DOM
    this.#getDOMElements();
    this.#listenerAutoSavedSessionStorage();
  }

  /**
   * Añade event listeners a los elementos especificados una vez que estén disponibles en el DOM.
   */
  async #listenerAutoSavedSessionStorage() {
    // Espera hasta que el documento esté completamente cargado
    document.addEventListener("DOMContentLoaded", async () => {
      // Elementos a los que se les añadirá un event listener
      const elements = [".logo-navbar img", ".home-nav-btn", "#carritoButton"];

      // Itera sobre cada elemento y espera hasta que esté disponible en el DOM
      for (const element of elements) {
        try {
          const domElement = await waitForElement(element);
          domElement.addEventListener(
            "click",
            () => {
              this.#handleSessionStorage();
            },
            { capture: true } // Usa el modo de captura para dar prioridad
          );
        } catch (error) {
          console.error(error.message);
        }
      }
    });

    // Añadir el event listener
    window.addEventListener("beforeunload", this.#clearSessionStorage);

    // window.addEventListener("beforeunload", (e) => {
    //   this.#handleSessionStorage();
    // });
  }

  // Datos y configuraciones internas del Pokémon Manager
  #data = {
    dom: {
      elements: {},
      filters: {
        byTypes: [["all"], false],
        byProperty: ["pokeId", "asc"],
        byMaxPrice: "max",
        byNameOrId: undefined,
        isInventory: false,
      },
      pokemonDivDataList: [],
    },
    pokemonDataList: [],
    pokemonDataListInventory: [],
  };

  /**
   * Obtiene la lista completa de Pokémon cargada en el manager.
   * @returns {object[]} - Una copia profunda (deep copy) de la lista de datos de Pokémon.
   * @example
   * const allPokemon = pokemonManager.pokemon;
   */
  get pokemon() {
    return JSON.parse(JSON.stringify(this.#data.pokemonDataList));
  }

  /**
   * Obtiene la lista de Pokémon filtrada que se muestra actualmente en el DOM.
   * @returns {object[]} - Una copia profunda (deep copy) de la lista de datos de Pokémon filtrados.
   * @example
   * const filteredPokemon = pokemonManager.pokemonFiltered;
   */
  get pokemonFiltered() {
    return JSON.parse(JSON.stringify(this.#data.dom.pokemonDivDataList));
  }

  /**
   ** Método para depurar y mostrar el objeto #data en la consola.
   */
  logDataDebug() {
    console.log(
      `#data:
- dom:
  - elements:
    - pokemonDivList: ${
      this.#data.dom.elements.pokemonDivList ? "Present" : "Not Found"
    }
    - filterContainer: ${
      this.#data.dom.elements.filterContainer ? "Present" : "Not Found"
    }
    - filterSliderContainer: ${
      this.#data.dom.elements.filterSliderContainer ? "Present" : "Not Found"
    }
    - fittedButtonsType: ${
      this.#data.dom.elements.fittedButtonsType
        ? `${this.#data.dom.elements.fittedButtonsType.length} items`
        : "Not Found"
    }
    - fittedSelectProperty: ${
      this.#data.dom.elements.fittedSelectProperty ? "Present" : "Not Found"
    }
    - filterSlider: ${
      this.#data.dom.elements.filterSlider ? "Present" : "Not Found"
    }
    - sliderValue: ${
      this.#data.dom.elements.sliderValue ? "Present" : "Not Found"
    }
    - searchInput: ${
      this.#data.dom.elements.searchInput ? "Present" : "Not Found"
    }
  - filters:
    - type: ${this.#data.dom.filters.byTypes[0][0]}
    - exactMatch: ${this.#data.dom.filters.byTypes[1]}
    - property: ${this.#data.dom.filters.byProperty[0]}
    - order: ${this.#data.dom.filters.byProperty[1]}
    - maxPrice: ${this.#data.dom.filters.byMaxPrice}
    - nameOrId: ${this.#data.dom.filters.byNameOrId}
    - inventory: ${this.#data.dom.filters.isInventory}
  - pokemonDivDataList length: ${this.#data.dom.pokemonDivDataList.length}
- pokemonDataList length: ${this.#data.pokemonDataList.length}
- pokemonDataListInventory length: ${this.#data.pokemonDataListInventory.length}
`
    );
  }

  /**
   * Maneja el evento 'beforeunload' para limpiar el sessionStorage.
   * @param {Event} event - El evento 'beforeunload'.
   */
  #clearSessionStorage(event = null) {
    //! detectar la recarga de la pagina, (Solo la RECARGA), soy consciente de que no funciona muy bien, pero es lo unico que he encontrado para que funcione solo al recargar la pagina.
    if (window.performance.navigation.type == 1) {
      if (event) event.preventDefault();

      console.log("Clear Session Storage\npokemonManager_data, pokemonPreview");
      sessionStorage.removeItem("pokemonManager_data");
      sessionStorage.removeItem("pokemonPreview");
    }
  }

  /**
   * Maneja el evento de clic en un elemento Pokémon.
   * @param {object} poke - El objeto Pokémon seleccionado.
   */
  #handleSessionStorage(poke = null) {
    // Eliminar el event listener antes de salir de la página
    window.removeEventListener("beforeunload", this.#clearSessionStorage);

    // Guardar el estado completo de los datos en sessionStorage
    this.#saveToSessionStorage("pokemonManager_data", this.#data);

    // Obtener y almacenar el objeto Pokémon seleccionado en sessionStorage
    if (poke) this.#saveToSessionStorage("pokemonPreview", poke);
  }

  /**
   * Método para guardar datos en sessionStorage.
   * @param {string} key - La clave bajo la cual se almacenarán los datos.
   * @param {object} value - El valor a almacenar.
   */
  #saveToSessionStorage(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
    console.log(`${key} Guardado en el SessionStorage`);
  }

  /**
   * Método para guardar datos en localStorage.
   * @param {string} key - La clave bajo la cual se almacenarán los datos.
   * @param {object} value - El valor a almacenar.
   */
  #saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`${key} Guardado en el LocalStorage`);
  }

  /**
   * Inicializa la lista de Pokémon cargando datos desde la API o restaurando desde sessionStorage.
   * @param {number} count - La cantidad de Pokémon a cargar.
   * @param {boolean} reload - Indica si se deben recargar los datos.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando los datos están cargados y la vista actualizada.
   * @throws {Error} - Si ocurre un error durante la carga de los datos.
   */
  async init(count, reload = false) {
    // Muestra el div de carga mientras se procesan los datos
    this.PokemonDOMHandler.toggleLoading(true);

    if (reload) {
      // Eliminar los datos almacenados en sessionStorage
      this.#clearSessionStorage();
    }

    try {
      // Intentar obtener los datos del sessionStorage
      let pokemonManager_data_JSON = sessionStorage.getItem(
        "pokemonManager_data"
      );
      if (pokemonManager_data_JSON) {
        const pokemonManager_data = JSON.parse(pokemonManager_data_JSON);
        console.log("Restaurando datos...");

        this.#data = pokemonManager_data;
        this.#getDOMElements(true);
      } else {
        // Cargar la lista de Pokémon utilizando el manejador de datos
        this.#data.pokemonDataList =
          await this.PokemonDataHandler.loadPokemonList(count);

        // Clonar la lista de Pokémon cargados para su manipulación en el DOM
        this.#data.dom.pokemonDivDataList = [...this.#data.pokemonDataList];

        // Guardar la lista en sessionStorage
        sessionStorage.setItem(
          "pokemonManager_data",
          JSON.stringify(this.#data)
        );
      }

      // Configurar el slider del filtro de precios
      this.PokemonDOMHandler.setFilterSliderValue(
        this.#data.pokemonDataList,
        this.#data.dom.filters.byMaxPrice,
        "min",
        "max",
        1
      );

      // Obtiene las configuraciones del filtro de propiedades desde el estado interno
      const propertyFilterSettings = [
        this.#data.dom.filters.byProperty[0],
        this.#data.dom.filters.byProperty[1],
      ];

      // Si el valor del filtro existe, lo establece en el select
      this.PokemonDOMHandler.setFilterSelectValue(
        propertyFilterSettings.join("-")
      );

      // Aplica los filtros a los Pokémon cargados según las configuraciones predeterminadas
      this.filtersByProperty(
        propertyFilterSettings[0],
        propertyFilterSettings[1]
      );

      this.PokemonDOMHandler.setFilterSearchInput(
        this.#data.dom.filters.byNameOrId
      );

      this.PokemonDOMHandler.setSwitchInventoryValue(
        this.#data.dom.filters.isInventory
      );

      if (!pokemonManager_data_JSON)
        this.#saveToSessionStorage("pokemonManager_data", this.#data);

      // Añadir los event listeners
      this.#addEventListeners();
    } catch (error) {
      // Lanza un error si ocurre algún problema durante la carga de los datos
      console.error("Error al inicializar la lista de Pokémon:", error);
      throw new Error("Error al inicializar la lista de Pokémon.");
    } finally {
      // Oculta el div de carga después de que los datos han sido procesados
      this.PokemonDOMHandler.toggleLoading(false);
    }
  }

  /**
   * Método para obtener referencias a los elementos del DOM
   * @param {boolean} reload - Indica si es necesario re-inicializar el PokemonDOMHandler.
   * @private
   */
  #getDOMElements(reload = false) {
    this.#data.dom.elements.filterSliderContainer = document.querySelector(
      ".main-filter-slider-container"
    );

    this.#data.dom.elements.pokemonDivList =
      document.querySelector("#pokemon-div-list");
    this.#data.dom.elements.filterContainer = document.querySelector(
      ".main-filter-container"
    );

    if (!reload) {
      this.PokemonDOMHandler = new P_DOM_H({
        filterContainer: this.#data.dom.elements.filterContainer,
        pokemonDivList: this.#data.dom.elements.pokemonDivList,
      });

      // Crear el slider de filtro de precio y obtener los elementos
      this.PokemonDOMHandler.createPriceFilterSlider(
        this.#data.dom.elements.filterSliderContainer
      );
    }

    this.#data.dom.elements.fittedButtonsType =
      document.querySelectorAll(".btn-header");
    this.#data.dom.elements.fittedSelectProperty =
      document.querySelector("#pokemon-filter");
    this.#data.dom.elements.filterSlider =
      document.querySelector(".filter-slider");
    this.#data.dom.elements.sliderValue =
      document.querySelector(".slider-value");
    this.#data.dom.elements.searchInput =
      document.querySelector(".search-input");
  }

  /**
   * Obtiene los datos de un Pokémon por su ID.
   * @param {number} id - El ID del Pokémon.
   * @returns {object|null} - Los datos del Pokémon si se encuentra, o null si no se encuentra.
   * @throws {Error} - Si los datos de los Pokémon no han sido cargados.
   */
  getPokemon(id) {
    this.#checkDataLoaded();
    // Buscar el Pokémon por ID
    const pokemon = this.#data.pokemonDataList.find(
      (poke) => poke.pokeId === id
    );
    if (!pokemon) {
      throw new Error(`No se encontró el Pokémon con ID ${id}`);
    }
    return pokemon;
  }

  /**
   * Verifica si los datos de los Pokémon han sido cargados.
   * @throws {Error} - Si los datos de los Pokémon no han sido cargados aún.
   * @private
   */
  #checkDataLoaded() {
    if (!this.#data.pokemonDataList.length) {
      throw new Error("Los datos de los Pokémon no han sido cargados aún.");
    }
  }

  /**
   * Filtra la lista de Pokémon por tipos.
   * @param {string[]} typeFilters - Los tipos de Pokémon por los cuales filtrar.
   * @param {boolean} exactMatch - Indica si el filtro debe ser una coincidencia exacta.
   * @throws {Error} - Si ocurre un error al filtrar los Pokémon.
   */
  filtersByTypes(typeFilters, exactMatch) {
    this.#data.dom.filters.byTypes = [typeFilters, exactMatch];
    this.#updateViewPokemon();
  }

  /**
   * Filtra la lista de Pokémon por propiedades.
   * @param {string} property - La propiedad por la cual filtrar los Pokémon (por ejemplo, "name" o "height").
   * @param {string} order - El orden en que se deben filtrar los Pokémon (por ejemplo, "asc" para ascendente o "desc" para descendente).
   * @throws {Error} - Si ocurre un error al filtrar los Pokémon.
   */
  filtersByProperty(property, order) {
    this.#data.dom.filters.byProperty = [property, order];
    this.#updateViewPokemon();
  }

  /**
   * Método para aplicar filtros a la lista de Pokémon.
   * @param {string|number} maxPrice - El precio máximo para filtrar los Pokémon.
   * @returns {void}
   */
  filtersByMaxPrice(maxPrice) {
    this.#data.dom.filters.byMaxPrice = maxPrice;
    this.#updateViewPokemon();
  }

  /**
   * Filtra la lista de Pokémon por nombre o ID.
   * @param {string|number} query - El nombre o ID del Pokémon a buscar.
   * @returns {void}
   */
  filtersByNameOrId(query) {
    if (query) {
      this.#data.dom.filters.byNameOrId = String(query);
    } else {
      this.#data.dom.filters.byNameOrId = undefined;
    }
    this.#updateViewPokemon();
  }

  /**
   * Filtra la lista de Pokémon que se encuentren en el inventario.
   * @param {boolean} isInventory -
   * @returns {void}
   */
  filtersByIsInventory(isInventory) {
    this.#data.dom.filters.isInventory = isInventory;
    this.#updateViewPokemon();
  }

  /**
   * Actualiza y muestra la lista de Pokémon en el DOM.
   * @throws {Error} - Si ocurre un error al actualizar y mostrar los datos de los Pokémon.
   * @private
   */
  #updateViewPokemon() {
    this.#checkDataLoaded();

    let pokemonData;
    if (this.#data.dom.filters.isInventory) {
      // pokemonData = this.#data.pokemonDataListInventory;
      pokemonData = [];

      // //! Prueba con el carrito
      // const cart = JSON.parse(localStorage.getItem("carrito"));
      // pokemonData = cart ? cart : [];
    } else {
      pokemonData = this.#data.pokemonDataList;
    }

    // Iterar sobre los filtros y aplicarlos secuencialmente
    for (let [filterType, filterValue] of Object.entries(
      this.#data.dom.filters
    )) {
      // Construir el nombre del método correspondiente en PokemonFilter
      const methodName = `getPokemon${
        filterType.charAt(0).toUpperCase() + filterType.slice(1)
      }`;

      // Verificar si hay un método correspondiente en PokemonFilter
      if (typeof this.PokemonFilter[methodName] === "function") {
        // Llamar al método con filterValue directamente si es una cadena o número
        if (Array.isArray(filterValue)) {
          pokemonData = this.PokemonFilter[methodName](
            pokemonData,
            ...filterValue
          );
        } else {
          pokemonData = this.PokemonFilter[methodName](
            pokemonData,
            filterValue
          );
          if (filterType === "byMaxPrice") {
            //! Intento de arreglar el filtro para que filtre por "discount" cuando no sea "undefined"
            // Ordenar la lista de Pokémon filtrados por precio efectivo
            // console.log("XXXXXXXXX");
            // pokemonData.sort(
            //   (a, b) =>
            //     (a.market.discount ?? a.market.price) -
            //     (b.market.discount ?? b.market.price)
            // );
          }
        }
      }
    }

    // Actualizar la lista temporal de Pokémon en el DOM
    this.#data.dom.pokemonDivDataList = [...pokemonData];

    // Mostrar los Pokémon en el DOM usando el manejador de datos de Pokémon
    this.PokemonDOMHandler.displayPokemon(this.#data.dom.pokemonDivDataList);

    this.#addEventListenersPokemonCards(this.#data.dom.pokemonDivDataList);

    // Log para depuración
    // console.clear();
    this.logDataDebug();
  }

  /**
   * Añade event listeners a los botones del header, el filtro de propiedades y el input de búsqueda.
   * @private
   */
  #addEventListeners() {
    // Definir la variable holdTimeout fuera de los listeners para evitar errores de referencia
    let holdTimeout;
    let selectedButton = null;

    const currentFilter = this.#data.dom.filters.byTypes[0][0];
    const typeFilters = currentFilter === "all" ? "see-all" : currentFilter;
    this.#data.dom.elements.fittedButtonsType.forEach((button) => {
      if (button.classList.contains(typeFilters)) {
        selectedButton = button;
        button.classList.add("btn-select");
      } else {
        button.classList.remove("btn-select");
      }

      let holdActivated = false;

      const handleButtonClick = async (event) => {
        if (!holdActivated) {
          const buttonId = event.currentTarget.id;
          const newTypeFilters = buttonId === "see-all" ? ["all"] : [buttonId];
          this.filtersByTypes(newTypeFilters, false);

          // Actualizar clases de botones
          if (selectedButton) {
            selectedButton.classList.remove("btn-select");
          }
          event.currentTarget.classList.add("btn-select");
          selectedButton = event.currentTarget;
        }
        holdActivated = false;
      };

      const handleButtonHold = (event) => {
        const button = event.currentTarget;
        return setTimeout(() => {
          const buttonId = button.id;
          const newTypeFilters = buttonId === "see-all" ? ["all"] : [buttonId];
          this.filtersByTypes(newTypeFilters, true);
          holdActivated = true;

          // Actualizar clases de botones
          if (selectedButton) {
            selectedButton.classList.remove("btn-select");
          }
          button.classList.add("btn-select");
          selectedButton = button;
        }, 500);
      };

      button.addEventListener("click", handleButtonClick);
      button.addEventListener("mousedown", (event) => {
        holdTimeout = handleButtonHold(event);
      });
      button.addEventListener("mouseup", () => clearTimeout(holdTimeout));
      button.addEventListener("mouseleave", () => clearTimeout(holdTimeout));
    });

    this.#data.dom.elements.fittedSelectProperty.addEventListener(
      "change",
      (event) => {
        const [property, order] = event.target.value.split("-");
        this.filtersByProperty(property, order);
      }
    );

    // Añadir event listener al slider de precio y al input de búsqueda con debounce
    const formatPrice = (value) => `${Math.floor(value)}€`;

    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };

    // Ajusta el tiempo de espera según sea necesario
    const debounceTimeFilterByMaxPrice = 300;
    const debounceTimeFilterByNameOrId = 500;

    const debouncedFilterByMaxPrice = debounce((value) => {
      this.filtersByMaxPrice(value);
    }, debounceTimeFilterByMaxPrice);

    this.#data.dom.elements.filterSlider.addEventListener("input", (event) => {
      const value = event.target.value;
      this.#data.dom.elements.sliderValue.innerText = formatPrice(value);
      debouncedFilterByMaxPrice(value);
    });

    const debouncedFilterByNameOrId = debounce((query) => {
      this.filtersByNameOrId(query);
    }, debounceTimeFilterByNameOrId);

    this.#data.dom.elements.searchInput.addEventListener("input", (event) => {
      debouncedFilterByNameOrId(event.target.value);
    });

    const switchButton = document.querySelector("#inventorySwitch");

    switchButton.addEventListener("click", () => {
      this.filtersByIsInventory(switchButton.checked);
    });
  }

  // /**
  //  * Añade event listeners a los elementos de la lista de Pokémon.
  //  * @param {Array} pokemonDivDataList - Lista de objetos Pokémon para los que se añadirán event listeners.
  //  */
  // #__addEventListenersPokemonCards(pokemonDivDataList) {
  //   // Itera sobre cada objeto Pokémon en la lista proporcionada
  //   pokemonDivDataList.forEach((poke) => {
  //     // Selecciona el elemento del DOM correspondiente al Pokémon actual
  //     const pokemonElement = document.querySelector(`#pokemon-${poke.pokeId}`);

  //     // Añade un event listener de tipo 'click' al elemento seleccionado
  //     pokemonElement.addEventListener("click", () => {
  //       // Eliminar el event listener
  //       window.removeEventListener("beforeunload", this.#clearSessionStorage);

  //       // Guarda el estado completo de los datos en sessionStorage
  //       sessionStorage.setItem(
  //         "pokemonManager_data",
  //         JSON.stringify(this.#data)
  //       );
  //       // console.log(poke);
  //       console.log(this.#data.dom.elements);

  //       // Almacena el objeto Pokémon seleccionado en sessionStorage
  //       sessionStorage.setItem("pokemonPreview", JSON.stringify(poke));

  //       // Redirige a la página de detalles del Pokémon
  //       window.location.href = `../1/pokemonDetail.html`;
  //     });
  //   });
  // }

  /**
   * Añade event listeners a los elementos de la lista de Pokémon.
   * @param {Array} pokemonDivDataList - Lista de objetos Pokémon para los que se añadirán event listeners.
   */
  #addEventListenersPokemonCards(pokemonDivDataList) {
    // Itera sobre cada objeto Pokémon en la lista proporcionada
    pokemonDivDataList.forEach((poke) => {
      // Selecciona el elemento del DOM correspondiente al Pokémon actual
      const pokemonElement = document.querySelector(`#pokemon-${poke.pokeId}`);

      // Añade un event listener de tipo 'click' al elemento seleccionado
      pokemonElement.addEventListener("click", () => {
        this.#handleSessionStorage(poke);
        // Redirigir a la página de detalles del Pokémon
        window.location.href = `../1/pokemonDetail.html`;
      });
    });
  }
}
