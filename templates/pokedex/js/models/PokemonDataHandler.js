export class PokemonDataHandler {
  static API_URLS = {
    POKEMON: "https://pokeapi.co/api/v2/pokemon/",
    SPECIES: "https://pokeapi.co/api/v2/pokemon-species/",
    HABITAT: "https://pokeapi.co/api/v2/pokemon-habitat/",
    EVOLUTION: "https://pokeapi.co/api/v2/evolution-chain//",
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
      const [pokemonResponse, speciesResponse, evolutionResponse] =
        await Promise.all([
          fetch(`${PokemonDataHandler.API_URLS.POKEMON}${id}`),
          fetch(`${PokemonDataHandler.API_URLS.SPECIES}${id}`),
          // fetch(`${PokemonDataHandler.API_URLS.EVOLUTION}${id}`),
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

      // if (!evolutionResponse.ok) {
      //   throw new Error(
      //     `Error al obtener los datos de la especie del Pokémon con ID ${id}: ${speciesResponse.statusText}`
      //   );
      // }

      const [pokemonData, speciesData, evolutionData] = await Promise.all([
        pokemonResponse.json(),
        speciesResponse.json(),
        // evolutionResponse.json(),
      ]);

      const pokemon = this.#transformPokemon(
        pokemonData,
        speciesData
        // evolutionData
      );
      pokemon.price = this.#calculatePokemonValue(pokemon);

      return pokemon;
    } catch (error) {
      console.error(`Error al obtener datos con ID de Pokémon ${id}:`, error);
      throw error;
    }
  }

  /**
   * Método privado para transformar los datos del Pokémon en el formato deseado.
   * @param {object} poke - Los datos originales del Pokémon.
   * @param {object} species - Los datos de la especie del Pokémon.
   * @returns {object} - Los datos transformados del Pokémon.
   * @private
   */
  #transformPokemon(poke, species, evolution) {
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
          centimeter: this.#formatNumber(poke.height * 10),
          decimeters: poke.height,
          meters: this.#formatNumber(poke.height / 10),
        },
        weight: {
          gram: this.#formatNumber(poke.weight * 100),
          hectograms: poke.weight,
          kilograms: this.#formatNumber(poke.weight / 10),
          tons: this.#formatNumber(poke.weight / 10000),
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

  /**
   * Formatea un número asegurándose de tener exactamente dos decimales, eliminando los ceros adicionales si son dos o más.
   * @param {number} number - El número a formatear.
   * @returns {number} - El número formateado.
   */
  #formatNumber(number) {
    const formattedNumber = parseFloat(number).toFixed(2); // Asegura que siempre tenga dos decimales
    const decimalPart = formattedNumber.split(".")[1]; // Obtiene la parte decimal

    if (/^0+$/.test(decimalPart)) {
      // Si la parte decimal son dos ceros o más, se elimina
      return parseInt(number);
    } else {
      // Si no, se mantiene tal cual
      return parseFloat(formattedNumber);
    }
  }

  /**
   * Calcula el valor de un Pokémon basado en sus estadísticas y propiedades.
   * @param {object} pokemon - El objeto Pokémon con las estadísticas y propiedades.
   * @returns {number} - El valor calculado del Pokémon.
   */
  #calculatePokemonValue(pokemon) {
    const {
      hp,
      attack,
      defense,
      special_attack,
      special_defense,
      speed,
      height,
      weight,
    } = pokemon.statistics;

    const {
      base_experience,
      movements,
      capture_rate_percent,
      isLegendary,
      isMythical,
    } = pokemon.value;

    // Definición de ponderaciones para cada propiedad
    const weights = {
      height: 0.05,
      weight: 0.1,
      hp: 0.1,
      attack: 0.1,
      defense: 0.1,
      special_attack: 0.2,
      special_defense: 0.2,
      speed: 0.1,
      base_experience: 3,
      movements: 0.05,

      capture_rate_percent: 1,

      isLegendary: 3.0,
      isMythical: 2.0,
    };

    // Cálculo del valor base basado en estadísticas
    let value =
      height.decimeters * weights.height +
      weight.hectograms * weights.weight +
      hp * weights.hp +
      attack * weights.attack +
      defense * weights.defense +
      special_attack * weights.special_attack +
      special_defense * weights.special_defense +
      speed * weights.speed +
      base_experience * weights.base_experience +
      movements * weights.movements;

    // Ajuste por rareza
    if (isLegendary) {
      value *= weights.isLegendary;
    }

    if (isMythical) {
      value *= weights.isMythical;
    }

    // Ajuste por capture_rate_percent
    value -= capture_rate_percent * weights.capture_rate_percent;

    value = value < 0 ? 1 : value;
    return this.#formatNumber(value);
  }
}
