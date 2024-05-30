import { PokemonDataHandler } from "./PokemonDataHandler.js";
import { PokemonDOMHandler } from "./PokemonDOMHandler.js";
import { PokemonFilter } from "./PokemonFilter.js";

export class PokemonManager {
  /**
   * Constructor de la clase PokemonManager.
   * @throws {Error} - Si ocurre algún error durante la inicialización.
   */
  constructor() {
    // Obtener referencias a elementos del DOM
    const filterContainer = document.querySelector(".price-filter-container");
    const pokemonDivList = document.querySelector("#pokemon-div-list");
    const fittedButtonsByType = document.querySelectorAll(".btn-header");

    // Verificar que los elementos del DOM necesarios existan
    if (!filterContainer) {
      throw new Error(
        "Error: No se pudo encontrar el elemento 'filterContainer' en el DOM."
      );
    }
    if (!pokemonDivList) {
      throw new Error(
        "Error: No se pudo encontrar el elemento 'pokemonDivList' en el DOM."
      );
    }
    if (fittedButtonsByType.length === 0) {
      console.warn(
        "Advertencia: No se encontraron elementos con la clase 'btn-header' en el DOM."
      );
    }

    // Inicializar las instancias de las clases manejadoras
    this.PokemonDataHandler = new PokemonDataHandler();
    this.PokemonFilter = new PokemonFilter();
    this.PokemonDOMHandler = new PokemonDOMHandler({
      filterContainer: filterContainer,
      pokemonDivList: pokemonDivList,
    });
    const fittedSelectByProperty = document.querySelector("#pokemon-filter");

    if (!fittedSelectByProperty) {
      console.warn(
        "Advertencia: No se pudo encontrar el elemento 'pokemon-filter' en el DOM."
      );
    }

    this.#data.dom.elements.divList = pokemonDivList;
    this.#data.dom.elements.fittedButtonsType = fittedButtonsByType;
    this.#data.dom.elements.fittedSelectProperty = fittedSelectByProperty;
    this.#data.dom.elements.filterContainer = filterContainer;

    // Crear el slider de filtro de precio y obtener los elementos
    const { filterSlider, sliderValue } =
      this.PokemonDOMHandler.createPriceFilterSlider(filterContainer);
    this.#data.dom.elements.filterSlider = filterSlider;
    this.#data.dom.elements.sliderValue = sliderValue;

    // Añadir los event listeners
    this.#addEventListeners();
  }

  // Datos y configuraciones internas del Pokémon Manager
  #data = {
    dom: {
      elements: {
        divList: undefined,
        fittedButtonsType: undefined,
        fittedSelectProperty: undefined,
      },
      filters: {
        byTypes: [["all"], false],
        byProperty: ["pokeId", "asc"],
        byMaxPrice: "max",
      },
      pokemonDivDataList: [],
    },
    pokemonDataList: [],
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
   * Inicializa la lista de Pokémon cargando datos desde la API.
   * @param {number} count - La cantidad de Pokémon a cargar.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando los datos están cargados y la vista actualizada.
   * @throws {Error} - Si el parámetro `count` no es válido o si ocurre un error durante la carga de los datos.
   */
  async init(count) {
    // Muestra el div de carga mientras se procesan los datos
    this.PokemonDOMHandler.toggleLoading(true);

    try {
      // Carga la lista de Pokémon utilizando el manejador de datos
      this.#data.pokemonDataList =
        await this.PokemonDataHandler.loadPokemonList(count);

      // Clona la lista de Pokémon cargados para su manipulación en el DOM
      this.#data.dom.pokemonDivDataList = [...this.#data.pokemonDataList];

      // Obtiene las configuraciones del filtro de propiedades desde el estado interno
      const propertyFilterSettings = [
        this.#data.dom.filters.byProperty[0],
        this.#data.dom.filters.byProperty[1],
      ];

      // Aplica los filtros a los Pokémon cargados según las configuraciones predeterminadas
      this.filtersByProperty(
        propertyFilterSettings[0],
        propertyFilterSettings[1]
      );
      // Si el valor del filtro existe, lo establece en el select
      this.PokemonDOMHandler.setFilterSelectValue(
        propertyFilterSettings.join("-")
      );

      const maxPrice = this.#data.pokemonDataList.reduce((max, poke) => {
        return Math.floor(poke.market.price > max ? poke.market.price : max);
      }, 0);

      const minPrice = this.#data.pokemonDataList.reduce((min, poke) => {
        return Math.floor(poke.market.price < min ? poke.market.price : min);
      }, Infinity);

      this.PokemonDOMHandler.setFilterSliderValue(
        maxPrice,
        minPrice,
        maxPrice,
        // Math.floor((maxPrice - minPrice) / 1000)
        1
      );
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
   * @param {number} maxPrice - El precio máximo para filtrar los Pokémon.
   * @returns {void}
   */
  filtersByMaxPrice(maxPrice) {
    this.#data.dom.filters.byMaxPrice = maxPrice;
    this.#updateViewPokemon();
  }

  /**
   * Actualiza y muestra la lista de Pokémon en el DOM.
   * @throws {Error} - Si ocurre un error al actualizar y mostrar los datos de los Pokémon.
   * @private
   */
  #updateViewPokemon() {
    this.#checkDataLoaded();

    let pokemonData = this.#data.pokemonDataList;

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

    // Log para depuración
    console.log(
      "pokemonTempDataList",
      this.#data.dom.pokemonDivDataList.length
    );
  }

  /**
   * Añade event listeners a los botones del header y el filtro de propiedades.
   * @private
   */
  #addEventListeners() {
    // Definir la variable holdTimeout fuera de los listeners para evitar errores de referencia
    let holdTimeout;
    let selectedButton = null;

    this.#data.dom.elements.fittedButtonsType.forEach((button) => {
      let holdActivated = false;

      const handleButtonClick = async (event) => {
        if (!holdActivated) {
          const buttonId = event.currentTarget.id;
          const typeFilters = buttonId === "see-all" ? ["all"] : [buttonId];
          this.filtersByTypes(typeFilters, false);

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
          const typeFilters = buttonId === "see-all" ? ["all"] : [buttonId];
          this.filtersByTypes(typeFilters, true);
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

    // Añadir event listener al slider de precio con debounce
    const formatPrice = (value) => `${Math.floor(value)}€`;

    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    };

    const debouncedFilterByMaxPrice = debounce((value) => {
      this.filtersByMaxPrice(value);
    }, 300); // Ajusta el tiempo de espera según sea necesario

    this.#data.dom.elements.filterSlider.addEventListener("input", (event) => {
      const value = event.target.value;
      this.#data.dom.elements.sliderValue.innerText = formatPrice(value);
      debouncedFilterByMaxPrice(value);
    });


    
  }
}
