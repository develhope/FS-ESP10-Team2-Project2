export class PokemonDOMHandler {
  /**
   * Constructor de la clase PokemonDOMHandler.
   * @param {object} options - Objeto de opciones con las propiedades necesarias.
   * @param {HTMLElement} options.filterContainer - El contenedor principal en el DOM.
   * @param {HTMLElement} options.pokemonDivList - El contenedor en el DOM donde se mostrarán los Pokémon.
   */
  constructor({ pokemonDivList, filterContainer: filterContainer }) {
    this.mainContainer = filterContainer;
    this.pokemonDivList = pokemonDivList;
    this.#createFilterSearchInput(filterContainer);
    this.#createFilterSelect(filterContainer);
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
    div.appendChild(style);
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
    // Formatear el ID del Pokémon con ceros a la izquierda
    const pokeId = poke.pokeId.toString().padStart(3, "0");
    // Convertir el nombre del Pokémon a mayúsculas
    const name = poke.name.toUpperCase();

    // Generar el HTML para los tipos del Pokémon
    const types = poke.type
      .map(
        (type) =>
          `<p class="${type} type">${
            type.charAt(0).toUpperCase() + type.slice(1)
          }</p>`
      )
      .join("");

    // Determinar la altura del Pokémon en la unidad apropiada
    const height =
      poke.statistics.height.meters < 1
        ? `${poke.statistics.height.centimeter}cm`
        : `${poke.statistics.height.meters}M`;

    // Determinar el peso del Pokémon en la unidad apropiada
    const weight =
      poke.statistics.weight.kilograms < 1
        ? `${poke.statistics.weight.gram}g`
        : `${poke.statistics.weight.kilograms}kg`;

    // Calcular el precio y el porcentaje de descuento
    const basePrice = poke.market.price;
    const offerPrice = poke.market.discount;
    const offerPercentage = offerPrice
      ? this.#calculateOfferPercentage(basePrice, offerPrice)
      : null;
    const market = offerPrice
      ? `<p class="price">${offerPrice}€</p>
       <p class="offer">${basePrice}€</p>
       <p class="offerPercentage">${offerPercentage}%</p>`
      : `<p class="price">${basePrice}€</p>`;

    // Determinar la calidad del Pokémon
    const quality = poke.value.isMythical
      ? "pokemon-name-mythical"
      : poke.value.isLegendary
      ? "pokemon-name-legendary"
      : "";

    /**
     * Función para obtener el color de fondo según el porcentaje.
     * @param {number} percent - El porcentaje a evaluar.
     * @returns {string} - El color de fondo correspondiente al porcentaje.
     */
    const getColorByPercentage = (percent) => {
      // Retorna color gris oscuro si el porcentaje es 1% (Nefasto)
      if (percent <= 1) return "#666666";
      // Retorna color rojo si el porcentaje está entre 2% y 25% (Malo)
      if (percent <= 25) return "red"; // 24%
      // Retorna color amarillo si el porcentaje está entre 26% y 50% (Normal)
      if (percent <= 50) return "yellow"; // 25%
      // Retorna color verde si el porcentaje está entre 51% y 75% (Bueno)
      if (percent <= 75) return "green"; // 25%
      // Retorna color azul si el porcentaje está entre 76% y 99% (Muy bueno)
      if (percent <= 99) return "blue"; // 24%
      // Retorna color violeta oscuro si el porcentaje es 100% (Sublime)
      return "darkviolet"; // Sublime 1%
    };

    // Crear el elemento div para el Pokémon
    const div = document.createElement("div");
    div.id = `pokemon-${poke.pokeId}`; // Asigna un ID único al elemento
    div.classList.add("pokemon");
    div.style.userSelect = "none"; // Bloquear la selección del elemento
    div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-image">
      <img src="${poke.images.illustration.default}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
      <div class="name-container">
        <p class="pokemon-id">#${pokeId}</p>
        <h2 class="pokemon-name" id="${quality}">${name}</h2>
      </div>
      <div class="pokemon-types">
        ${types}
      </div>
      <div class="pokemon-stats">
        <p class="stat">${height}</p>
        <p class="stat">${weight}</p>
      </div>
      <div class="pokemon-price">
        ${market}
      </div>
    </div>
  `;

    // Crear el elemento de PopUp con información adicional
    const divPopUp = document.createElement("div");
    divPopUp.classList.add("div-pokemon-popup");
    divPopUp.style.userSelect = "none"; // Bloquear la selección del elemento

    divPopUp.innerHTML = `
    <svg class="info-icon-svg" width="30" height="30" viewBox="0 0 512 512">
      <path
          d="M256,6.234C118.059,6.234,6.234,118.059,6.234,256.001c0,137.94,111.824,249.765,249.766,249.765  s249.766-111.824,249.766-249.765C505.766,118.059,393.941,6.234,256,6.234z M489.966,258  C487.828,385.396,383.907,488.017,256,488.017c-127.907,0-231.829-102.62-233.966-230.017h-0.051c0-0.669,0.02-1.333,0.025-2  c-0.006-0.667-0.025-1.331-0.025-2h0.051C24.171,126.603,128.093,23.983,256,23.983c127.907,0,231.829,102.62,233.966,230.017h0.051  c0,0.669-0.02,1.333-0.025,2c0.006,0.667,0.025,1.331,0.025,2H489.966z" />
      <path
          d="M256,132.228  c-68.357,0-123.772,55.415-123.772,123.772S187.643,379.772,256,379.772S379.772,324.357,379.772,256S324.357,132.228,256,132.228z   M256,331.024c-41.436,0-75.024-33.59-75.024-75.024s33.589-75.024,75.024-75.024c41.435,0,75.024,33.59,75.024,75.024  S297.435,331.024,256,331.024z"
          fill="none" />
      <path
          d="M256,223.724c-17.826,0-32.276,14.451-32.276,32.276c0,17.826,14.45,32.276,32.276,32.276  s32.276-14.45,32.276-32.276C288.276,238.174,273.826,223.724,256,223.724z M256,277.951c-12.124,0-21.952-9.827-21.952-21.951  s9.828-21.952,21.952-21.952c12.124,0,21.951,9.828,21.951,21.952S268.124,277.951,256,277.951z" />
      <path
          d="M256,180.976c-41.436,0-75.024,33.59-75.024,75.024s33.589,75.024,75.024,75.024  c41.435,0,75.024-33.59,75.024-75.024S297.435,180.976,256,180.976z M256,307.025c-28.181,0-51.025-22.844-51.025-51.025  s22.845-51.025,51.025-51.025c28.182,0,51.025,22.844,51.025,51.025S284.182,307.025,256,307.025z" />
      <g>
          <path
              d="M136.784,252.489c0-17.625,3.758-34.489,10.509-49.489H14v107h137.237   C142.019,292,136.784,273.296,136.784,252.489z" />
          <path
              d="M369.264,203c6.751,15,10.509,31.863,10.509,49.489c0,20.807-5.234,39.511-14.452,57.511H498V203H369.264z" />
      </g>
    </svg>

    <div class="info-pokemon-popup">
      
      <div class="div-stat-percent">
        <div class="stat-percentage" style="background-color: ${getColorByPercentage(
          poke.statistics.hp_percent
        )}">
        </div>
        <p>HP: ${poke.statistics.hp} </p>
        <p>(${poke.statistics.hp_percent}%)</p>
      </div>

      <div class="div-stat-percent">
        <div class="stat-percentage" style="background-color: ${getColorByPercentage(
          poke.statistics.attack_percent
        )}">
        </div>
        <p>Attack: ${poke.statistics.attack} </p>
        <p>(${poke.statistics.attack_percent}%)</p>
      </div>

      <div class="div-stat-percent">
        <div class="stat-percentage" style="background-color: ${getColorByPercentage(
          poke.statistics.defense_percent
        )}">
        </div>
        <p>Defense: ${poke.statistics.defense} </p>
        <p>(${poke.statistics.defense_percent}%)</p>
      </div>

      <div class="div-stat-percent">
        <div class="stat-percentage" style="background-color: ${getColorByPercentage(
          poke.statistics.speed_percent
        )}">
        </div>
        <p>Speed: ${poke.statistics.speed} </p>
        <p>(${poke.statistics.speed_percent}%)</p>
      </div>


      <div class="div-stat-percent">
        <div class="stat-percentage" style="background-color: ${getColorByPercentage(
          poke.statistics.special_attack_percent
        )}">
        </div>
        <p>Special Attack: ${poke.statistics.special_attack} </p>
        <p>(${poke.statistics.special_attack_percent}%)</p>
      </div>

      <div class="div-stat-percent">
        <div class="stat-percentage" style="background-color: ${getColorByPercentage(
          poke.statistics.special_defense_percent
        )}">
        </div>
        <p>Special Defense: ${poke.statistics.special_defense} </p>
        <p>(${poke.statistics.special_defense_percent}%)</p>
      </div>

    </div>

    
  `;

    div.appendChild(divPopUp);

    // Añadir eventos de hover para mostrar y ocultar el PopUp
    divPopUp.addEventListener("mouseenter", () => {
      divPopUp.querySelector(".info-pokemon-popup").classList.add("show");
    });

    divPopUp.addEventListener("mouseleave", () => {
      divPopUp.querySelector(".info-pokemon-popup").classList.remove("show");
    });

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
  #createFilterSelect(container) {
    if (!container) {
      throw new Error("Parameter 'container' is required");
    }

    const filterContainer = document.createElement("div");
    filterContainer.classList.add("select-container");

    filterContainer.innerHTML = `
    <!-- <label class="filter-label" for="pokemon-filter">Filtrar Pokémon por:</label> -->
        <select class="filter-select" id="pokemon-filter">
          <optgroup label="Precio (€)" class="filter-optgroup">
            <option value="market.price-asc" class="filter-option">Precio (Menor)</option>
            <option value="market.price-desc" class="filter-option">Precio (Mayor)</option>
          </optgroup>
          <optgroup label="PokeID" class="filter-optgroup">
            <option value="pokeId-asc" class="filter-option">ID (Menor)</option>
            <option value="pokeId-desc" class="filter-option">ID (Mayor)</option>
          </optgroup>
          <optgroup label="Name" class="filter-optgroup">
            <option value="name-asc" class="filter-option">Nombre (A-Z)</option>
            <option value="name-desc" class="filter-option">Nombre (Z-A)</option>
          </optgroup>
          <!-- <optgroup label="Type" class="filter-optgroup">
            <option value="type-asc" class="filter-option">Tipo (A-Z)</option>
            <option value="type-desc" class="filter-option">Tipo (Z-A)</option> -->
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
  setFilterSelectValue(newValue) {
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

  /**
   * Método para crear el elemento de búsqueda y añadirlo al DOM.
   * @param {HTMLElement} container - El elemento donde se agregará el elemento de búsqueda.
   */
  #createFilterSearchInput(container) {
    if (!container) {
      throw new Error("Parameter 'container' is required");
    }

    const searchContainer = document.createElement("div");
    searchContainer.classList.add("search-container");
    searchContainer.spellcheck = false;
    searchContainer.innerHTML = `
    <input type="text" class="search-input" placeholder="Buscar por Nombre o ID...">
  `;

    container.prepend(searchContainer);
  }

  /**
   * Método para cambiar el valor del input de búsqueda.
   * @param {string|undefined} newValue - El nuevo valor que se debe asignar al input de búsqueda.
   */
  setFilterSearchInput(newValue) {
    const searchInput = document.querySelector(".search-input");

    if (!searchInput) {
      throw new Error("Error: No se encontró el elemento input.");
    }

    if (newValue !== undefined && newValue !== null) {
      searchInput.value = newValue;
    }
  }

  /**
   * Crea un slider para filtrar Pokémon por precio.
   * @param {HTMLElement} container - El contenedor en el cual se añadirá el slider.
   * @param {number} min - El valor mínimo del slider.
   * @param {number} max - El valor máximo del slider.
   * @param {number} step - El paso del slider.
   */
  createPriceFilterSlider(container, min = 0, max = 1000, step = 10) {
    if (!container) {
      throw new Error("Parameter 'container' is required");
    }

    const formatPrice = (value) => `${Math.floor(value)}€`;

    const filterContainer = document.createElement("div");
    filterContainer.className = "filter-container";

    const filterLabel = document.createElement("label");
    filterLabel.className = "filter-label";
    filterLabel.innerText = "Filtrar por Precio:";

    const filterSlider = document.createElement("input");
    filterSlider.type = "range";
    filterSlider.min = min;
    filterSlider.max = max;
    filterSlider.step = step;
    filterSlider.className = "filter-slider";
    filterSlider.id = "price-filter-slider"; // Agregar un id al slider

    const sliderValue = document.createElement("span");
    sliderValue.className = "slider-value";
    sliderValue.innerText = formatPrice(max);
    filterSlider.value = max; // establecer el valor inicial

    filterContainer.appendChild(filterLabel);
    filterContainer.appendChild(filterSlider);
    filterContainer.appendChild(sliderValue);

    container.appendChild(filterContainer);
  }

  /**
   * Método para cambiar el valor del filtro del control deslizante.
   * @param {Array} pokemonList - La lista de Pokémon.
   * @param {number|string} newValue - El nuevo valor que se debe seleccionar.
   * @param {number|string} [newMin=null] - El nuevo valor mínimo del control deslizante.
   * @param {number|string} [newMax=null] - El nuevo valor máximo del control deslizante.
   * @param {number} [newStep=null] - El nuevo valor de paso del slider.
   */
  setFilterSliderValue(
    pokemonList,
    newValue,
    newMin = null,
    newMax = null,
    newStep = null
  ) {
    const filterSlider = document.querySelector("#price-filter-slider");
    const sliderValue = filterSlider.nextElementSibling; // obtener el siguiente elemento hermano (el span)

    if (!filterSlider || !sliderValue) {
      throw new Error(
        "Error: No se encontró el elemento del control deslizante o su valor."
      );
    }

    // Función para calcular el valor clave basado en 'min' o 'max'
    function calculationKey(key) {
      key = key.toUpperCase();
      let price;
      switch (key) {
        case "MIN":
          price = Math.min(...pokemonList.map((poke) => poke.market.price));
          break;
        case "MAX":
          price = Math.max(...pokemonList.map((poke) => poke.market.price));
          break;
        default:
          price = key;
          break;
      }
      // console.log("price", key, price);
      return price;
    }

    // Aplicar los valores de newMin, newMax, y newStep
    if (typeof newMin === "string") {
      filterSlider.min = calculationKey(newMin) + 1;
    } else if (newMin !== null) {
      filterSlider.min = newMin + 1;
    }

    if (typeof newMax === "string") {
      filterSlider.max = calculationKey(newMax) + 1;
    } else if (newMax !== null) {
      filterSlider.max = newMax + 1;
    }

    if (newStep !== null) {
      filterSlider.step = newStep;
    }

    if (typeof newValue === "string") {
      newValue = calculationKey(newValue);
    } else {
      newValue++;
    }

    filterSlider.value = newValue;
    sliderValue.innerText = `${Math.floor(newValue)}€`;
  }

  /**
   * Calcula el porcentaje de descuento aplicado a un Pokémon.
   * @param {number} basePrice - El precio base del Pokémon.
   * @param {number} offerPrice - El precio de oferta del Pokémon.
   * @returns {number} - El porcentaje de descuento aplicado.
   */
  #calculateOfferPercentage(basePrice, offerPrice) {
    // Calcula la diferencia entre el precio base y el precio de oferta
    const discount = basePrice - offerPrice;

    // Calcula el porcentaje de descuento aplicado
    const offerPercentage = (discount / basePrice) * 100;

    // Redondea el porcentaje de descuento a dos decimales
    return Math.round(offerPercentage * 100) / 100;
  }
}
