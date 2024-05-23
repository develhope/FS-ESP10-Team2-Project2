import { PokemonDataHandler } from "./PokemonDataHandler.js";
import { PokemonDOMHandler } from "./PokemonDOMHandler.js";
import { PokemonFilter } from "./PokemonFilter.js";

export class PokemonManager {
  /**
   * Constructor de la clase PokemonManager.
   * @param {HTMLElement} pokemonDivList - El contenedor en el DOM donde se mostrarán los Pokémon.
   * @param {NodeListOf<HTMLElement>} fittedButtonsByType - La lista de botones del header para filtrar Pokémon por tipo.
   * @param {HTMLElement} fittedSelectByProperty - El elemento select para filtrar Pokémon por propiedad.
   * @throws {Error} - Si alguno de los parámetros requeridos no es proporcionado.
   */
  constructor(pokemonDivList, fittedButtonsByType, fittedSelectByProperty) {
    if (!pokemonDivList || !fittedButtonsByType || !fittedSelectByProperty) {
      throw new Error(
        "Todos los parámetros (pokemonDivList, fittedButtonsByType, fittedSelectByProperty) son requeridos"
      );
    }

    this.PokemonDataHandler = new PokemonDataHandler();
    this.PokemonFilter = new PokemonFilter();
    this.PokemonDOMHandler = new PokemonDOMHandler(pokemonDivList);

    this.#data.dom.elements.divList = pokemonDivList;
    this.#data.dom.elements.fittedButtonsType = fittedButtonsByType;
    this.#data.dom.elements.fittedSelectProperty = fittedSelectByProperty;

    this.#addEventListeners();
  }

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
      },
      pokemonDivDataList: [],
    },
    pokemonDataList: [],
  };

  /**
   * Inicializa la lista de Pokémon cargando datos desde la API.
   * @param {number} count - La cantidad de Pokémon a cargar. Debe ser un número entero entre 1 y 1025.
   * @returns {Promise<void>} - Una promesa que se resuelve cuando los datos están cargados y la vista actualizada.
   * @throws {Error} - Si el parámetro `count` no es válido o si ocurre un error durante la carga de los datos.
   */
  async init(count) {
    if (!Number.isInteger(count) || count < 1 || count > 1025) {
      throw new Error(
        "La cantidad de Pokémon debe ser un número entero entre 1 y 1025."
      );
    }

    this.PokemonDOMHandler.toggleLoading(true);

    try {
      this.#data.pokemonDataList =
        await this.PokemonDataHandler.loadPokemonList(count);
      this.#data.dom.pokemonDivDataList = [...this.#data.pokemonDataList];
      this.filtersByProperty(
        this.#data.dom.filters.byProperty[0],
        this.#data.dom.filters.byProperty[1]
      );
    } catch (error) {
      console.error("Error al inicializar la lista de Pokémon:", error);
      throw new Error(
        "Error al inicializar la lista de Pokémon. Por favor, inténtelo de nuevo."
      );
    } finally {
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
   * Actualiza y muestra la lista de Pokémon en el DOM.
   * @throws {Error} - Si ocurre un error al actualizar y mostrar los datos de los Pokémon.
   * @private
   */
  #updateViewPokemon() {
    this.#checkDataLoaded();

    let pokemonData = this.#data.pokemonDataList;

    // Iterar sobre los filtros y aplicarlos secuencialmente
    for (const [filterType, filterValue] of Object.entries(
      this.#data.dom.filters
    )) {
      // Construir el nombre del método correspondiente en PokemonFilter
      const methodName = `getPokemon${
        filterType.charAt(0).toUpperCase() + filterType.slice(1)
      }`;

      // Verificar si hay un método correspondiente en PokemonFilter
      if (typeof this.PokemonFilter[methodName] === "function") {
        pokemonData = this.PokemonFilter[methodName](
          pokemonData,
          ...filterValue
        );
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
   * Añade event listeners a los botones del header y el filtro de propiedades.
   * @private
   */
  #addEventListeners() {
    // Definir la variable holdTimeout fuera de los listeners para evitar errores de referencia
    let holdTimeout;

    this.#data.dom.elements.fittedButtonsType.forEach((button) => {
      let holdActivated = false;

      const handleButtonClick = async (event) => {
        if (!holdActivated) {
          const buttonId = event.currentTarget.id;
          const typeFilters = buttonId === "see-all" ? ["all"] : [buttonId];
          this.filtersByTypes(typeFilters, false);
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
  }
}
