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

    // Inicializar el PokemonDOMHandler con el HTMLElement pokemonDivList
    this.PokemonDOMHandler = new PokemonDOMHandler(pokemonDivList);

    this.#data.dom.elements.divList = pokemonDivList;
    this.#data.dom.elements.fittedButtonsType = fittedButtonsByType;
    this.#data.dom.elements.fittedSelectProperty = fittedSelectByProperty;

    // Agregar event listeners
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
   * Método para inicializar la lista de Pokémon cargando datos desde la API.
   * @param {number} count - La cantidad de Pokémon a cargar. Debe ser un número entero entre 1 y 1025.
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
    } catch (error) {
      console.error("Error al inicializar la lista de Pokémon:", error);
      throw new Error(
        "Error al inicializar la lista de Pokémon. Por favor, inténtelo de nuevo."
      );
    } finally {
      this.PokemonDOMHandler.toggleLoading(false);
    }

    this.filtersByProperty(
      this.#data.dom.filters.byProperty[0],
      this.#data.dom.filters.byProperty[1]
    );
  }

  /**
   * Método para obtener los datos de un Pokémon por su ID.
   * @param {number} id - El ID del Pokémon.
   * @returns {object|null} - Los datos del Pokémon si se encuentra, o null si no se encuentra.
   * @throws {Error} - Si los datos de los Pokémon no han sido cargados.
   */
  getPokemon(id) {
    try {
      // Verificar si los datos de los Pokémon han sido cargados
      this.#checkDataLoaded();

      // Buscar el Pokémon por ID
      const pokemon = this.#data.pokemonDataList.find(
        (poke) => poke.pokeId === id
      );

      // Si no se encuentra el Pokémon, lanzar un error
      if (!pokemon) {
        throw new Error(`No se encontró el Pokémon con ID ${id}`);
      }

      // Devolver los datos del Pokémon encontrado
      return pokemon;
    } catch (error) {
      // Manejar y registrar cualquier error que ocurra durante el proceso
      console.error("Error al obtener los datos del Pokémon:", error);
      throw error;
    }
  }

  /**
   * Método para filtrar la lista de Pokémon por tipos.
   * @param {string[]} typeFilters - Los tipos de Pokémon por los cuales filtrar.
   * @param {boolean} exactMatch - Indica si el filtro debe ser una coincidencia exacta.
   * @throws {Error} - Si ocurre un error al filtrar los Pokémon.
   */
  filtersByTypes(typeFilters, exactMatch) {
    try {
      this.#data.dom.filters.byTypes = [typeFilters, exactMatch];
      this.#updateViewPokemon();
    } catch (error) {
      // Mostrar error en la consola
      console.error("Error al filtrar por tipos de Pokémon:", error);
    }
  }

  /**
   * Método para filtrar la lista de Pokémon por propiedades.
   * @param {string} property - La propiedad por la cual filtrar los Pokémon (por ejemplo, "name" o "height").
   * @param {string} order - El orden en que se deben filtrar los Pokémon (por ejemplo, "asc" para ascendente o "desc" para descendente).
   * @throws {Error} - Si ocurre un error al filtrar los Pokémon.
   */
  filtersByProperty(property, order) {
    try {
      this.#data.dom.filters.byProperty = [property, order];
      this.#updateViewPokemon();
    } catch (error) {
      // Mostrar error en la consola
      console.error("Error al filtrar por propiedades de Pokémon:", error);
    }
  }

  /**
   * Método privado para actualizar y mostrar la lista de Pokémon en el DOM.
   * @throws {Error} - Si ocurre un error al actualizar y mostrar los datos de los Pokémon.
   * @private
   */
  #updateViewPokemon() {
    try {
      // Comprobar si los datos de Pokémon están cargados
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
    } catch (error) {
      // Manejar y registrar cualquier error que ocurra durante el proceso
      console.error("Error al actualizar y mostrar datos de Pokémon:", error);
    }
  }

  /**
   * Método privado para verificar si los datos de los Pokémon han sido cargados.
   * @throws {Error} - Si los datos de los Pokémon no han sido cargados aún.
   * @private
   */
  #checkDataLoaded() {
    if (!this.#data.pokemonDataList) {
      console.error(
        "Error: Los datos de los Pokémon no han sido cargados aún."
      );
      throw new Error("Los datos de los Pokémon no han sido cargados aún.");
    }
  }

  /**
   * Método para agregar event listeners a los botones del header.
   * Añade eventos para 'click' y 'mousedown' en cada botón.
   * - El evento 'click' filtra y muestra Pokémon según el tipo seleccionado.
   * - El evento 'mousedown' inicia un temporizador que, si se cumple, filtra y muestra Pokémon con un filtrado exacto.
   * - El evento 'change' en el filtro de propiedades filtra y muestra Pokémon según la propiedad seleccionada.
   * @private
   */
  #addEventListeners() {
    try {
      this.#data.dom.elements.fittedButtonsType.forEach((button) => {
        let typeFilters;
        let holdActivated = false; // Flag para determinar si el hold ha sido activado

        // Evento click
        button.addEventListener("click", async (event) => {
          try {
            if (!holdActivated) {
              const buttonId = event.currentTarget.id;

              if (buttonId === "see-all") {
                typeFilters = ["all"];
              } else {
                typeFilters = [buttonId];
              }

              this.filtersByTypes(typeFilters, false);

              typeFilters = undefined;
            }
            holdActivated = false; // Resetear el flag después del click
          } catch (error) {
            console.error(
              `Error handling click event on button ${button.id}:`,
              error
            );
          }
        });

        // Variables para manejar el evento de mantener pulsado
        let holdTimeout;
        const holdDuration = 500; // Duración en ms para considerar que el botón ha sido mantenido pulsado

        // Evento mousedown para iniciar el temporizador
        button.addEventListener("mousedown", (event) => {
          try {
            if (!typeFilters) {
              const button = event.currentTarget;
              holdTimeout = setTimeout(() => {
                try {
                  const buttonId = button.id;

                  if (buttonId === "see-all") {
                    typeFilters = ["all"];
                  } else {
                    typeFilters = [buttonId];
                  }
                  this.filtersByTypes(typeFilters, true);

                  holdActivated = true; // Marcar que el hold ha sido activado
                } catch (error) {
                  console.error(
                    `Error handling hold event on button ${button.id}:`,
                    error
                  );
                }
              }, holdDuration);
            }
          } catch (error) {
            console.error(
              `Error initiating hold on button ${button.id}:`,
              error
            );
          }
        });

        // Eventos mouseup y mouseleave para cancelar el temporizador
        const cancelHold = () => {
          clearTimeout(holdTimeout);
        };

        button.addEventListener("mouseup", cancelHold);
        button.addEventListener("mouseleave", cancelHold);
      });

      // Manejo del filtrado de Pokémon por propiedades
      this.#data.dom.elements.fittedSelectProperty.addEventListener(
        "change",
        (event) => {
          try {
            const selectedOption = event.target.value;
            const [property, order] = selectedOption.split("-");

            this.filtersByProperty(property, order);
          } catch (error) {
            console.error("Error al filtrar los Pokémon:", error);
          }
        }
      );
    } catch (error) {
      console.error("Error adding event listeners:", error);
    }
  }
}
