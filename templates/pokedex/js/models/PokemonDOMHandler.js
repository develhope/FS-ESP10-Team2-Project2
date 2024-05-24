export class PokemonDOMHandler {
  /**
   * Constructor de la clase PokemonDOMHandler.
   * @param {HTMLElement} divList - El contenedor en el DOM donde se mostrarán los Pokémon.
   * @throws {Error} - Si el parámetro requerido no es proporcionado.
   */
  constructor(divList) {
    if (!divList) {
      throw new Error("Parameter 'divList' is required");
    }

    this.divList = divList;
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
    this.divList.innerHTML = "";

    pokemonDataList.forEach((poke) => {
      const div = this.#createPokemonElement(poke);
      this.divList.append(div);
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
        <img src="${poke.images.illustration.default}" alt="${poke.name}">
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
          <p class="stat">${poke.statistics.height.meters}m</p>
          <p class="stat">${poke.statistics.weight.kilograms}kg</p>
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
}
