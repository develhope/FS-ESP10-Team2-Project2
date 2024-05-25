export class PokemonDOMHandler {
  /**
   * Constructor de la clase PokemonDOMHandler.
   * @param {object} options - Objeto de opciones con las propiedades necesarias.
   * @param {HTMLElement} options.mainContainer - El contenedor principal en el DOM.
   * @param {HTMLElement} options.pokemonDivList - El contenedor en el DOM donde se mostrarán los Pokémon.
   */
  constructor({ pokemonDivList, mainContainer }) {
    this.mainContainer = mainContainer;
    this.pokemonDivList = pokemonDivList;
    this.#createFilterContainer(mainContainer);
  }

  /**
   * Método para agregar o eliminar un div de carga.
   * @param {boolean} show - Booleano que indica si se debe mostrar (true) o eliminar (false) el div de carga.
   */
  toggleLoading(show) {
    const loadingDiv = document.querySelector(".loading");

    if (show && !loadingDiv) {
      this.#createLoadingDiv();
    } else if (!show && loadingDiv) {
      loadingDiv.remove();
    }
  }

  /**
   * Método privado para crear el div de carga y añadirlo al DOM.
   * @private
   */
  #createLoadingDiv() {
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
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Método para mostrar uno o varios Pokémon en el DOM.
   * @param {object[]} pokemonDataList - Un array de objetos de Pokémon.
   */
  displayPokemon(pokemonDataList) {
    this.pokemonDivList.innerHTML = "";

    pokemonDataList.forEach((poke) => {
      const div = this.#createPokemonElement(poke);
      this.pokemonDivList.append(div);
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
    const pokeId = poke.pokeId.toString().padStart(3, "0");
    const name = poke.name.toUpperCase();

    const types = poke.type
      .map(
        (type) =>
          `<p class="${type} type">${
            type.charAt(0).toUpperCase() + type.slice(1)
          }</p>`
      )
      .join("");

    const height =
      poke.statistics.height.meters < 1
        ? poke.statistics.height.centimeter + "cm"
        : poke.statistics.height.meters + "M";

    const weight =
      poke.statistics.weight.kilograms < 1
        ? poke.statistics.weight.gram + "g"
        : poke.statistics.weight.kilograms + "kg";

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
      <p class="pokemon-id-back">#${pokeId}</p>
      <div class="pokemon-image">
        <img src="${poke.images.illustration.default}" alt="${poke.name}">
      </div>
      <div class="pokemon-info">
        <div class="name-container">
          <p class="pokemon-id">#${pokeId}</p>
          <h2 class="pokemon-name">${name}</h2>
        </div>
        <div class="pokemon-types">
          ${types}
        </div>
        <div class="pokemon-stats">
          <p class="stat">${height}</p>
          <p class="stat">${weight}</p>
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

    //! No estoy muy convencido de las transicionnes
    div.addEventListener("mouseenter", () => {
      image.classList.add("hidden");
      // setTimeout(() => {
      image.src = poke.images.illustration.shiny;
      image.classList.remove("hidden");
      // }, 100); // Debe coincidir con la duración de la transición en el CSS
    });

    div.addEventListener("mouseleave", () => {
      image.classList.add("reverse");
      // setTimeout(() => {
      image.src = originalSrc;
      image.classList.remove("reverse");
      // }, 100); // Debe coincidir con la duración de la transición en el CSS
    });
  }

  /**
   * Método para crear el contenedor de filtros y añadirlo al DOM.
   * @param {HTMLElement} container - El elemento donde se agregará el contenedor de filtros.
   */
  #createFilterContainer(container) {
    const filterContainer = document.createElement("div");
    filterContainer.classList.add("filter-container");

    filterContainer.innerHTML = `
        <label class="filter-label" for="pokemon-filter">Filtrar Pokémon por:</label>
        <select class="filter-select" id="pokemon-filter">
          <optgroup label="PokeID" class="filter-optgroup">
            <option value="pokeId-asc" class="filter-option">ID (Menor)</option>
            <option value="pokeId-desc" class="filter-option">ID (Mayor)</option>
          </optgroup>
          <optgroup label="Name" class="filter-optgroup">
            <option value="name-asc" class="filter-option">Nombre (A-Z)</option>
            <option value="name-desc" class="filter-option">Nombre (Z-A)</option>
          </optgroup>
          <optgroup label="Type" class="filter-optgroup">
            <option value="type-asc" class="filter-option">Tipo (A-Z)</option>
            <option value="type-desc" class="filter-option">Tipo (Z-A)</option>
          </optgroup>
          <optgroup label="Height (M)" class="filter-optgroup">
            <option value="statistics.height-asc" class="filter-option">Altura (Menor)</option>
            <option value="statistics.height-desc" class="filter-option">Altura (Mayor)</option>
          </optgroup>
          <optgroup label="Weight (KG)" class="filter-optgroup">
            <option value="statistics.weight-asc" class="filter-option">Peso (Menor)</option>
            <option value="statistics.weight-desc" class="filter-option">Peso (Mayor)</option>
          </optgroup>
        </select>
      `;

    container.prepend(filterContainer);
  }

  /**
   * Método para cambiar el valor seleccionado del filtro.
   * @param {string} newValue - El nuevo valor que se debe seleccionar.
   */
  setFilterValue(newValue) {
    const filterSelect = document.querySelector("#pokemon-filter");

    if (!filterSelect) {
      throw new Error("Error: No se encontró el elemento select.");
    }

    if (filterSelect.value !== newValue) {
      if (
        [...filterSelect.options].some((option) => option.value === newValue)
      ) {
        filterSelect.value = newValue;
      } else {
        throw new Error(
          `Error: El valor ${newValue} no es válido para el select.`
        );
      }
    }
  }
}
