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
  constructor(pokemonDivList, fittedButtonsByType) {
    if (!pokemonDivList) {
      throw new Error("Parameter 'pokemonDivList' is required");
    }
    if (!fittedButtonsByType) {
      throw new Error("Parameter 'fittedButtonsByType' is required");
    }
    this.pokemonDivList = pokemonDivList;
    this.fittedButtonsByType = fittedButtonsByType;
    this.#addEventListeners();
  }

  #pokemonDataList = [];
  #pokemonIsLoaded = false;

  static #URL = "https://pokeapi.co/api/v2/pokemon/";

  /**
   * Método para inicializar la lista de Pokémon cargando datos desde la API.
   * @param {number} count - La cantidad de Pokémon a cargar. Debe ser un número entero entre 1 y 1025.
   * @throws {Error} - Si el parámetro `count` no es válido o si ocurre un error durante la carga de los datos.
   */
  async initialize(count) {
    if (!Number.isInteger(count) || count < 1 || count > 1025) {
      throw new Error(
        "La cantidad de Pokémon debe ser un número entero entre 1 y 1025."
      );
    }

    try {
      await this.#loadPokemonList(count);
    } catch (error) {
      console.error("Error al inicializar la lista de Pokémon:", error);
      throw new Error(
        "Error al inicializar la lista de Pokémon. Por favor, inténtelo de nuevo."
      );
    }

    this.displayPokemon(this.#pokemonDataList);
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

    this.#pokemonDataList = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => this.#transformPokemon(result.value));

    this.#pokemonIsLoaded = true;
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
        height: poke.height,
        weight: poke.weight,
      },
    };
  }

  /**
   * Método privado para verificar si los datos de los Pokémon han sido cargados.
   * @throws {Error} - Si los datos de los Pokémon no han sido cargados aún.
   * @private
   */
  #checkDataLoaded() {
    if (!this.#pokemonIsLoaded) {
      console.error(
        "Error: Los datos de los Pokémon no han sido cargados aún."
      );
      throw new Error("Los datos de los Pokémon no han sido cargados aún.");
    }
  }

  /**
   * Getter para obtener la lista de Pokémon.
   * @returns {object[]} - La lista de Pokémon.
   */
  get list() {
    this.#checkDataLoaded();
    return this.#pokemonDataList;
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

    // Convertir los tipos a minúsculas para comparación insensible a mayúsculas/minúsculas
    const normalizedTypeFilters = typeFilters.map((type) => type.toLowerCase());

    // Si "all" está presente en los filtros, devolver todos los Pokémon
    if (normalizedTypeFilters.includes("all")) {
      return this.#pokemonDataList;
    }

    this.#pokemonDataList.forEach((poke) => {
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
   * Método para obtener los datos de un Pokémon por su ID.
   * @param {number} id - El ID del Pokémon.
   * @returns {object} - Los datos del Pokémon.
   * @throws {Error} - Si no se encuentra un Pokémon con el ID especificado.
   */
  getPokemon(id) {
    this.#checkDataLoaded();
    const pokemon = this.#pokemonDataList.find((poke) => poke.pokeId === id);
    if (!pokemon) {
      console.error(`No se encontró el Pokémon con ID ${id}`);
      throw new Error(`No se encontró el Pokémon con ID ${id}`);
    }
    return pokemon;
  }

  //todo|--- DOM ---|
  /**
   * Método para mostrar uno o varios Pokémon en el DOM.
   * @param {object[]} listPokemon - Un array de objetos de Pokémon.
   */
  displayPokemon(listPokemon) {
    this.pokemonDivList.innerHTML = "";
    console.log(listPokemon.length);
    // Iteramos sobre cada objeto de Pokémon en la lista
    listPokemon.forEach((poke) => {
      // Creamos la representación HTML para los tipos del Pokémon
      let types = poke.type
        .map((type) => `<p class="${type} type">${type}</p>`)
        .join("");

      // Formateamos el ID del Pokémon con ceros a la izquierda si es necesario
      let pokeId = poke.pokeId.toString().padStart(3, "0");

      // Creamos el elemento div para mostrar el Pokémon
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
          <p class="stat">${poke.statistics.height}m</p>
          <p class="stat">${poke.statistics.weight}kg</p>
        </div>
      </div>
    `;

      // Agregamos el elemento div al contenedor de la lista de Pokémon
      this.pokemonDivList.append(div);

      // Obtén la imagen de este Pokémon
      const image = div.querySelector(".pokemon-image img");

      // Guarda el src original de la imagen
      const originalSrc = image.src;

      // Cuando el mouse entra en el div con clase "pokemon", cambia el src de la imagen y la anima
      div.addEventListener("mouseenter", () => {
        image.classList.add("hidden");
        setTimeout(() => {
          image.src = poke.images.illustration[1];
          image.classList.remove("hidden");
        }, 200); // Debe coincidir con la duración de la transición en el CSS
      });

      // Cuando el mouse sale del div con clase "pokemon", restaura el src original de la imagen y la anima
      div.addEventListener("mouseleave", () => {
        image.classList.add("reverse");
        setTimeout(() => {
          image.src = originalSrc;
          image.classList.remove("reverse");
        }, 200); // Debe coincidir con la duración de la transición en el CSS
      });
    });
  }

  /**
   * Método para agregar event listeners a los botones del header.
   * Añade eventos para 'click' y 'mousedown' en cada botón.
   * - El evento 'click' filtra y muestra Pokémon según el tipo seleccionado.
   * - El evento 'mousedown' inicia un temporizador que, si se cumple, filtra y muestra Pokémon con un filtrado exacto.
   * @private
   */
  #addEventListeners() {
    this.fittedButtonsByType.forEach((button) => {
      let typeFilters;
      let holdActivated = false; // Flag para determinar si el hold ha sido activado

      // Evento click
      button.addEventListener("click", async (event) => {
        if (!holdActivated) {
          const buttonId = event.currentTarget.id;

          if (buttonId === "see-all") {
            typeFilters = ["all"];
          } else {
            typeFilters = [buttonId];
          }
          this.displayPokemon(this.getPokemonByTypes(typeFilters));
          typeFilters = undefined;
        }
        holdActivated = false; // Resetear el flag después del click
      });

      // Variables para manejar el evento de mantener pulsado
      let holdTimeout;
      const holdDuration = 500; // Duración en ms para considerar que el botón ha sido mantenido pulsado

      // Evento mousedown para iniciar el temporizador
      button.addEventListener("mousedown", (event) => {
        if (!typeFilters) {
          const button = event.currentTarget;
          holdTimeout = setTimeout(() => {
            const buttonId = button.id;

            if (buttonId === "see-all") {
              typeFilters = ["all"];
            } else {
              typeFilters = [buttonId];
            }
            this.displayPokemon(this.getPokemonByTypes(typeFilters, true));
            holdActivated = true; // Marcar que el hold ha sido activado
          }, holdDuration);
        }
      });

      // Eventos mouseup y mouseleave para cancelar el temporizador
      const cancelHold = () => {
        clearTimeout(holdTimeout);
      };

      button.addEventListener("mouseup", cancelHold);
      button.addEventListener("mouseleave", cancelHold);
    });
  }
}
