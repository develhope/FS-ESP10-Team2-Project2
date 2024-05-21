/**
 * Clase que maneja la lista de Pokémon y las interacciones con los botones del header.
 */
export class PokemonManager {
  /**
   * Constructor de la clase PokemonManager.
   * @param {HTMLElement} pokemonDivList - El contenedor en el DOM donde se mostrarán los Pokémon.
   * @param {NodeListOf<HTMLElement>} fittedButtonsByType - La lista de botones del header para filtrar Pokémon por tipo.
   * @throws {Error} - Si alguno de los parámetros requeridos no es proporcionado.
   */
  constructor(pokemonDivList, fittedButtonsByType, fittedSelectByProperty) {
    if (!pokemonDivList) {
      throw new Error("Parameter 'pokemonDivList' is required");
    }
    if (!fittedButtonsByType) {
      throw new Error("Parameter 'fittedButtonsByType' is required");
    }
    if (!fittedSelectByProperty) {
      throw new Error("Parameter 'fittedSelectByProperty' is required");
    }
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
        byTypes: [],
        byProperty: [],
      },

      pokemonDivDataList: [],
    },
    pokemonDataList: [],
    pokemonIsLoaded: false,
  };

  static #URL = "https://pokeapi.co/api/v2/pokemon/";

  /**
   * Método para inicializar la lista de Pokémon cargando datos desde la API.
   * @param {number} count - La cantidad de Pokémon a cargar. Debe ser un número entero entre 1 y 1025.
   * @throws {Error} - Si el parámetro `count` no es válido o si ocurre un error durante la carga de los datos.
   */
  async init(count) {
    // Validar el parámetro count
    if (!Number.isInteger(count) || count < 1 || count > 1025) {
      throw new Error(
        "La cantidad de Pokémon debe ser un número entero entre 1 y 1025."
      );
    }

    try {
      // Mostrar el bloque de carga
      this.#toggleLoading(true);

      // Cargar los datos de los Pokémon
      await this.#loadPokemonList(count);
    } catch (error) {
      // Manejar errores durante la carga de los datos
      console.error("Error al inicializar la lista de Pokémon:", error);
      throw new Error(
        "Error al inicializar la lista de Pokémon. Por favor, inténtelo de nuevo."
      );
    } finally {
      // Ocultar el bloque de carga independientemente del resultado de la carga
      this.#toggleLoading(false);
    }

    // Establecer la lista de Pokémon como lista temporal y marcar que los datos están cargados
    this.#data.dom.pokemonDivDataList = [...this.#data.pokemonDataList];
    this.#data.pokemonIsLoaded = true;

    // Actualizar la vista de los Pokémon filtrados por número de Pokédex de manera ascendente
    this.#updateViewPokemonTypeFilter(
      this.getPokemonByProperty("pokeId", "asc")
    );
  }

  /**
   * Método privado para cargar la lista de Pokémon desde la API.
   * @param {number} count - La cantidad de Pokémon a cargar.
   * @returns {Promise<void>}
   * @private
   */
  async #loadPokemonList(count) {
    const promises = Array.from({ length: count }, (_, index) =>
      this.#fetchPokemon(index + 1)
    );
    const results = await Promise.allSettled(promises);

    this.#data.pokemonDataList = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => this.#transformPokemon(result.value));
  }

  /**
   * Método privado para obtener los datos de un Pokémon desde la API.
   * @param {number} id - El ID del Pokémon.
   * @returns {Promise<object>} - Los datos del Pokémon.
   * @throws {Error} - Si ocurre un error al obtener los datos del Pokémon.
   * @private
   */
  async #fetchPokemon(id) {
    const response = await fetch(`${PokemonManager.#URL}${id}`);
    if (!response.ok) {
      throw new Error(
        `Error al obtener los datos del Pokémon con ID ${id}: ${response.statusText}`
      );
    }
    return response.json();
  }

  /**
   * Método privado para transformar los datos del Pokémon en el formato deseado.
   * Convierte la altura de decímetros a metros y el peso de hectogramos a kilogramos.
   * @param {object} poke - Los datos originales del Pokémon.
   * @returns {object} - Los datos transformados del Pokémon.
   * @private
   */
  #transformPokemon(poke) {
    return {
      pokeId: poke.id,
      name: poke.name,
      type: poke.types.map((type) => type.type.name),
      images: {
        illustration: [
          poke.sprites.other["official-artwork"].front_default,
          poke.sprites.other["official-artwork"].front_shiny,
        ],
        rendering: [
          poke.sprites.other.home.front_default,
          poke.sprites.other.home.front_shiny,
        ],
      },
      statistics: {
        height: [poke.height, (poke.height / 10).toFixed(2)], // Convertir decímetros a metros y redondear a 2 decimales
        weight: [poke.weight, (poke.weight / 10).toFixed(2)], // Convertir hectogramos a kilogramos y redondear a 2 decimales
      },
    };
  }

  /**
   * Método privado para verificar si los datos de los Pokémon han sido cargados.
   * @throws {Error} - Si los datos de los Pokémon no han sido cargados aún.
   * @private
   */
  #checkDataLoaded() {
    if (!this.#data.pokemonIsLoaded) {
      console.error(
        "Error: Los datos de los Pokémon no han sido cargados aún."
      );
      throw new Error("Los datos de los Pokémon no han sido cargados aún.");
    }
  }

  /**
   * Getter para obtener la lista de Pokémon.
   * @throws {Error} - Si los datos de Pokémon no han sido cargados.
   * @returns {object[]} - La lista de Pokémon.
   */
  get pokemon() {
    this.#checkDataLoaded();
    return this.#data.pokemonDataList;
  }

  /**
   * Getter para obtener la lista de Pokémon Temporal.
   * @throws {Error} - Si los datos de Pokémon no han sido cargados.
   * @returns {object[]} - La lista de Pokémon.
   */
  get pokemonInView() {
    this.#checkDataLoaded();
    return this.#data.dom.pokemonDivDataList;
  }

  /**
   * Método para obtener una lista de Pokémon que coincidan con los tipos especificados.
   * @param {string[]} typeFilters - Un array de tipos de Pokémon para filtrar.
   * @param {boolean} [exactMatch=false] - Si es true, solo devolverá Pokémon que coincidan exactamente con los tipos especificados.
   * @returns {object[]} - Un array de objetos de Pokémon que coinciden con los filtros especificados.
   */
  getPokemonByTypes(typeFilters, exactMatch = false) {
    this.#checkDataLoaded();

    const filteredPokemon = [];
    const pokemonData = this.#data.pokemonDataList;

    // Convertir los tipos a minúsculas para comparación insensible a mayúsculas/minúsculas
    const normalizedTypeFilters = typeFilters.map((type) => type.toLowerCase());

    // Almacenamos el nuevo filtro en la data de la clase
    this.#data.dom.filters.byTypes = [normalizedTypeFilters, exactMatch];

    // Si "all" está presente en los filtros, devolver todos los Pokémon
    if (normalizedTypeFilters.includes("all")) {
      return pokemonData;
    }

    pokemonData.forEach((poke) => {
      const normalizedPokeTypes = poke.type.map((type) => type.toLowerCase());

      if (exactMatch) {
        // Ordenar ambos arreglos antes de compararlos
        const sortedPokeTypes = [...normalizedPokeTypes].sort();
        const sortedTypeFilters = [...normalizedTypeFilters].sort();

        // Verificar si el Pokémon tiene exactamente los tipos especificados (sin importar el orden)
        if (
          sortedPokeTypes.length === sortedTypeFilters.length &&
          sortedPokeTypes.every(
            (type, index) => type === sortedTypeFilters[index]
          )
        ) {
          filteredPokemon.push(poke);
        }
      } else {
        // Verificar si el Pokémon contiene al menos uno de los tipos especificados
        if (
          normalizedPokeTypes.some((type) =>
            normalizedTypeFilters.includes(type)
          )
        ) {
          filteredPokemon.push(poke);
        }
      }
    });

    return filteredPokemon;
  }

  /**
   * Método para obtener una lista de Pokémon ordenados por una propiedad específica.
   * @param {string} property - La propiedad por la cual ordenar. Puede ser "pokeId", "name", "type", "statistics.height", "statistics.weight".
   * @param {string} [order='asc'] - El orden de la ordenación. Puede ser "asc" para ascendente o "desc" para descendente.
   * @returns {object[]} - Un array de objetos de Pokémon ordenados según la propiedad y el orden especificados.
   */
  getPokemonByProperty(property, order = "asc") {
    this.#checkDataLoaded();

    // Convertir los valores a minúsculas para comparación insensible a mayúsculas/minúsculas
    const normalizedProperty = property.toLowerCase();
    const normalizedOrder = order.toLowerCase();

    // Almacenamos el nuevo filtro en la data de la clase
    this.#data.dom.filters.byProperty = [normalizedProperty, normalizedOrder];

    const sortedPokemon = this.#data.dom.pokemonDivDataList;
    sortedPokemon.sort(
      this.#getSortFunction(normalizedProperty, normalizedOrder)
    );

    return sortedPokemon;
  }

  /**
   * Método privado para obtener la función de ordenación basada en la propiedad y el orden.
   * @param {string} property - La propiedad por la cual ordenar.
   * @param {string} order - El orden de la ordenación. Puede ser "asc" para ascendente o "desc" para descendente.
   * @returns {function} - La función de ordenación.
   * @private
   */
  #getSortFunction(property, order) {
    const isAscending = order === "asc";

    return (a, b) => {
      const [aValue, bValue] = this.#getPropertyValues(a, b, property);

      if (aValue < bValue) return isAscending ? -1 : 1;
      if (aValue > bValue) return isAscending ? 1 : -1;
      return 0;
    };
  }

  /**
   * Método privado para obtener los valores de las propiedades de los Pokémon.
   * @param {object} a - El primer objeto Pokémon.
   * @param {object} b - El segundo objeto Pokémon.
   * @param {string} property - La propiedad por la cual ordenar.
   * @returns {Array} - Un array con los valores de las propiedades de los dos Pokémon.
   * @private
   */
  #getPropertyValues(a, b, property) {
    switch (property) {
      case "pokeid":
        return [a.pokeId, b.pokeId];
      case "name":
        return [a.name.toLowerCase(), b.name.toLowerCase()];
      case "type":
        return [a.type[0].toLowerCase(), b.type[0].toLowerCase()]; // Ordenar por el primer tipo
      case "statistics.height":
        return [a.statistics.height[0], b.statistics.height[0]];
      case "statistics.weight":
        return [a.statistics.weight[0], b.statistics.weight[0]];
      default:
        throw new Error(`Propiedad de ordenación desconocida: ${property}`);
    }
  }

  /**
   * Método para obtener los datos de un Pokémon por su ID.
   * @param {number} id - El ID del Pokémon.
   * @returns {object} - Los datos del Pokémon.
   * @throws {Error} - Si no se encuentra un Pokémon con el ID especificado.
   */
  getPokemon(id) {
    this.#checkDataLoaded();
    const pokemon = this.#data.pokemonDataList.find(
      (poke) => poke.pokeId === id
    );
    if (!pokemon) {
      console.error(`No se encontró el Pokémon con ID ${id}`);
      throw new Error(`No se encontró el Pokémon con ID ${id}`);
    }
    return pokemon;
  }

  //todo|--- DOM ---|

  /**
   * Método privado para actualizar la lista temporal de Pokémon según un filtro de tipo y mostrarla en el DOM.
   * Actualiza `pokemonDivDataList` con la lista proporcionada y luego muestra los Pokémon ordenados por la propiedad seleccionada.
   * @param {object[]} pokemonData - La lista de Pokémon a mostrar, filtrada por tipo.
   * @private
   */
  #updateViewPokemonTypeFilter(pokemonData) {
    try {
      // Actualizar la lista temporal de Pokémon en el DOM
      this.#data.dom.pokemonDivDataList = [...pokemonData];

      // Mostrar los Pokémon filtrados y ordenados por la propiedad seleccionada
      this.displayPokemon(
        this.getPokemonByProperty(
          this.#data.dom.filters.byProperty[0], // Propiedad por la cual ordenar
          this.#data.dom.filters.byProperty[1] // Orden de la ordenación (asc/desc)
        )
      );

      // Log para depuración
      console.log("pokemonDataList", this.#data.pokemonDataList.length);
      console.log(
        "pokemonTempDataList",
        this.#data.dom.pokemonDivDataList.length
      );
      console.log(this.#data);
    } catch (error) {
      console.error(
        "Error updating and displaying filtered Pokémon data:",
        error
      );
    }
  }

  /**
   * Método privado para agregar o eliminar un div de carga.
   * @param {boolean} show - Booleano que indica si se debe mostrar (true) o eliminar (false) el div de carga.
   * @private
   */
  #toggleLoading(show) {
    const loadingDiv = document.querySelector(".loading");

    if (show) {
      // Si show es true y el div de carga no existe, lo creamos y lo añadimos al cuerpo del documento
      if (!loadingDiv) {
        const div = document.createElement("div");
        div.classList.add("loading");
        document.body.appendChild(div);

        // Agregar estilos CSS para el bloque de carga
        const style = document.createElement("style");
        style.textContent = `
        .loading {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3; /* Gris claro */
          border-top: 4px solid #3498db; /* Azul */
          border-radius: 50%;
          animation: spin 1s linear infinite; /* Animación de rotación */
        }
        @keyframes spin {
          0% {transform: rotate(0deg);}
          100% {transform: rotate(360deg);}
        }
      `;
        document.head.appendChild(style);
      }
    } else {
      // Si show es false y el div de carga existe, lo eliminamos
      if (loadingDiv) {
        loadingDiv.remove();
      }
    }
  }

  /**
   * Método para mostrar uno o varios Pokémon en el DOM.
   * @param {object[]} listPokemon - Un array de objetos de Pokémon.
   */
  displayPokemon(listPokemon) {
    this.#data.dom.elements.divList.innerHTML = "";
    // console.log(listPokemon.length);
    listPokemon.forEach((poke) => {
      const div = this.#createPokemonElement(poke);
      this.#data.dom.elements.divList.append(div);
      this.#addImageHoverEffect(div, poke);
    });
  }

  /**
   * Método privado para crear el elemento HTML de un Pokémon.
   * @param {object} poke - El objeto Pokémon.
   * @returns {HTMLElement} - El elemento div creado para el Pokémon.
   * @private
   */
  #createPokemonElement(poke) {
    const types = poke.type
      .map((type) => `<p class="${type} type">${type}</p>`)
      .join("");

    const pokeId = poke.pokeId.toString().padStart(3, "0");

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
      <p class="pokemon-id-back">#${pokeId}</p>
      <div class="pokemon-image">
        <img src="${poke.images.illustration[0]}" alt="${poke.name}">
      </div>
      <div class="pokemon-info">
        <div class="name-container">
          <p class="pokemon-id">#${pokeId}</p>
          <h2 class="pokemon-name">${poke.name}</h2>
        </div>
        <div class="pokemon-types">
          ${types}
        </div>
        <div class="pokemon-stats">
          <p class="stat">${poke.statistics.height[1]}m</p>
          <p class="stat">${poke.statistics.weight[1]}kg</p>
        </div>
      </div>
    `;
    return div;
  }

  /**
   * Método privado para agregar el efecto de hover a la imagen de un Pokémon.
   * @param {HTMLElement} div - El elemento div del Pokémon.
   * @param {object} poke - El objeto Pokémon.
   * @private
   */
  #addImageHoverEffect(div, poke) {
    const image = div.querySelector(".pokemon-image img");
    const originalSrc = image.src;

    div.addEventListener("mouseenter", () => {
      image.classList.add("hidden");
      setTimeout(() => {
        image.src = poke.images.illustration[1];
        image.classList.remove("hidden");
      }, 200); // Debe coincidir con la duración de la transición en el CSS
    });

    div.addEventListener("mouseleave", () => {
      image.classList.add("reverse");
      setTimeout(() => {
        image.src = originalSrc;
        image.classList.remove("reverse");
      }, 200); // Debe coincidir con la duración de la transición en el CSS
    });
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

              // Guardar temporalmente los Pokémon filtrados y mostrarlos
              this.#updateViewPokemonTypeFilter(
                this.getPokemonByTypes(typeFilters)
              );
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

                  // Guardar temporalmente los Pokémon filtrados y mostrarlos
                  this.#updateViewPokemonTypeFilter(
                    this.getPokemonByTypes(typeFilters, true)
                  );
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

            const filteredPokemon = this.getPokemonByProperty(property, order);

            // Mostrar los Pokémon filtrados
            this.displayPokemon(filteredPokemon);
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
