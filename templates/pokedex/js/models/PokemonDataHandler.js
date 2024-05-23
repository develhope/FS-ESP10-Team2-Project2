export class PokemonDataHandler {
  static API_URLS = {
    POKEMON: "https://pokeapi.co/api/v2/pokemon/",
    SPECIES: "https://pokeapi.co/api/v2/pokemon-species/",
    HABITAT: "https://pokeapi.co/api/v2/pokemon-habitat/",
  };

  /**
   * Método para cargar la lista de Pokémon desde la API.
   * @param {number} count - La cantidad de Pokémon a cargar. Debe ser un número entero entre 1 y 1025.
   * @returns {Promise<object[]>} - Una promesa que resuelve con la lista de datos de Pokémon.
   */
  async loadPokemonList(count) {
    // Validar que count es un número entero entre 1 y 1025
    if (!Number.isInteger(count) || count < 1 || count > 1025) {
      throw new Error(
        "La cantidad de Pokémon debe ser un número entero entre 1 y 1025."
      );
    }

    //! Bloque para evitar el error "ERR_INSUFFICIENT_RESOURCES"

    const batchSize = 100; // Tamaño del lote de solicitudes simultáneas
    const batches = Math.ceil(count / batchSize); // Calcular la cantidad de lotes necesarios
    let results = []; // Inicializar el array para almacenar los resultados

    // Procesar cada lote de solicitudes
    for (let i = 0; i < batches; i++) {
      // Crear las promesas para el lote actual
      const batchPromises = Array.from(
        { length: batchSize },
        (_, index) => i * batchSize + index + 1
      )
        .filter((id) => id <= count) // Filtrar IDs que estén dentro del rango de count
        .map((id) => this.#fetchPokemon(id)); // Mapear IDs a promesas de fetch

      // Esperar a que se resuelvan todas las promesas del lote actual
      const batchResults = await Promise.allSettled(batchPromises);

      // Filtrar resultados exitosos y agregar sus valores al array results
      results = results.concat(
        batchResults
          .filter((result) => result.status === "fulfilled") // Filtrar promesas cumplidas
          .map((result) => result.value) // Extraer el valor de las promesas cumplidas
      );
    }

    return results; // Devolver el array de resultados
  }

  /**
   * Método privado para obtener los datos de un Pokémon desde la API.
   * @param {number} id - El ID del Pokémon.
   * @returns {Promise<object>} - Los datos del Pokémon.
   * @throws {Error} - Si ocurre un error al obtener los datos del Pokémon.
   * @private
   */
  async #fetchPokemon(id) {
    try {
      const [pokemonResponse, speciesResponse] = await Promise.all([
        fetch(`${PokemonDataHandler.API_URLS.POKEMON}${id}`),
        fetch(`${PokemonDataHandler.API_URLS.SPECIES}${id}`),
      ]);

      if (!pokemonResponse.ok) {
        throw new Error(
          `Error al obtener los datos del Pokémon con ID ${id}: ${pokemonResponse.statusText}`
        );
      }

      if (!speciesResponse.ok) {
        throw new Error(
          `Error al obtener los datos de la especie del Pokémon con ID ${id}: ${speciesResponse.statusText}`
        );
      }

      const [pokemonData, speciesData] = await Promise.all([
        pokemonResponse.json(),
        speciesResponse.json(),
      ]);

      return this.#transformPokemon(pokemonData, speciesData);
    } catch (error) {
      console.error(`Error al obtener datos con ID de Pokémon ${id}:`, error);
      throw error;
    }
  }

  /**
   * Método privado para transformar los datos del Pokémon en el formato deseado.
   * Convierte la altura de decímetros a metros y el peso de hectogramos a kilogramos.
   * @param {object} poke - Los datos originales del Pokémon.
   * @param {object} species - Los datos de la especie del Pokémon.
   * @returns {object} - Los datos transformados del Pokémon.
   * @private
   */
  #transformPokemon(poke, species) {
    return {
      pokeId: poke.id,
      name: poke.name,
      type: poke.types.map((type) => type.type.name),
      images: {
        illustration: {
          default: poke.sprites.other["official-artwork"].front_default,
          shiny: poke.sprites.other["official-artwork"].front_shiny,
        },
        rendering: {
          default: poke.sprites.other.home.front_default,
          shiny: poke.sprites.other.home.front_shiny,
        },
        gif: {
          back_default: poke.sprites.other.showdown.back_default,
          back_shiny: poke.sprites.other.showdown.back_shiny,
          front_default: poke.sprites.other.showdown.front_default,
          front_shiny: poke.sprites.other.showdown.front_shiny,
        },
      },
      statistics: {
        height: {
          decimeters: poke.height,
          meters: (poke.height / 10).toFixed(2),
        },
        weight: {
          hectograms: poke.weight,
          kilograms: (poke.weight / 10).toFixed(2),
        },
        hp: poke.stats[0].base_stat,
        attack: poke.stats[1].base_stat,
        defense: poke.stats[2].base_stat,
        special_attack: poke.stats[3].base_stat,
        special_defense: poke.stats[4].base_stat,
        speed: poke.stats[5].base_stat,
      },
      value: {
        base_experience: poke.base_experience,
        movements: poke.moves.length,
        capture_rate_percent: Math.round((species.capture_rate * 100) / 255),
        isLegendary: species.is_legendary,
        isMythical: species.is_mythical,
      },
    };
  }
}
