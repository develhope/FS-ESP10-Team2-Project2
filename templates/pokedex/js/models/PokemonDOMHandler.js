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

    let market;

    const basePrice = poke.market.price;

    // Si hay un descuento, calcular el precio de oferta y el porcentaje de descuento
    if (poke.market.discount) {
      const offerPrice = poke.market.discount;

      // Calcular el porcentaje de descuento
      const offerPercentage = this.#calculateOfferPercentage(
        basePrice,
        offerPrice
      );

      // Crear el HTML para el precio con descuento
      market = `
      <p class="price">${offerPrice}€</p>
      <p class="offer">${basePrice}€</p>
      <p class="offerPercentage">${offerPercentage}%</p>
    `;
    } else {
      // Crear el HTML para el precio sin descuento
      market = `<p class="price">${basePrice}€</p>`;
    }

    let quality;
    if (poke.value.isMythical) {
      quality = "pokemon-name-mythical";
    } else if (poke.value.isLegendary) {
      quality = "pokemon-name-lejendary";
    }

    // Crear el elemento div para el Pokémon
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
        <h2 class="pokemon-name" id="${quality}">${name}</h2>
        <!-- <img class="pokemon-img_maxEvo" src="assets/images/pokeballMaxEvo.png" alt="pokeballMaxEvo}"> -->
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
    filterContainer.classList.add("filter-container");

    filterContainer.innerHTML = `
        <label class="filter-label" for="pokemon-filter">Filtrar Pokémon por:</label>
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

    // Devuelve el control deslizante y los elementos de valor para adjuntar detectores de eventos más adelante
    return { filterSlider, sliderValue };
  }

  /**
   * Método para cambiar el valor del filtro del control deslizante.
   * @param {number} newValue - El nuevo valor que se debe seleccionar.
   * @param {number} newMin - El nuevo valor mínimo del control deslizante.
   * @param {number} newMax - El nuevo valor máximo del control deslizante.
   * @param {number} newStep - El nuevo valor de paso del slider.
   */
  setFilterSliderValue(newValue, newMin = null, newMax = null, newStep = null) {
    const filterSlider = document.querySelector("#price-filter-slider");
    const sliderValue = filterSlider.nextElementSibling; // obtener el siguiente elemento hermano (el span)

    if (!filterSlider || !sliderValue) {
      throw new Error(
        "Error: No se encontró el elemento del control deslizante o su valor."
      );
    }

    if (newMin !== null) {
      filterSlider.min = newMin + 1;
    }
    if (newMax !== null) {
      filterSlider.max = newMax + 1;
    }
    if (newStep !== null) {
      filterSlider.step = newStep;
    }
    newValue++;
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
