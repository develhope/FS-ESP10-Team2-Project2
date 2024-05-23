export class PokemonDataHandler {
  static addresses = {
    pokemon: "https://pokeapi.co/api/v2/pokemon/",
    species: "https://pokeapi.co/api/v2/pokemon-species/",
    habitat: "https://pokeapi.co/api/v2/pokemon-habitat/",
  };

  /**
   * Método privado para cargar la lista de Pokémon desde la API.
   * @param {number} count - La cantidad de Pokémon a cargar.
   * @returns {Promise<void>}
   */
  async loadPokemonList(count) {
    const promises = Array.from({ length: count }, (_, index) =>
      this.#fetchPokemon(index + 1)
    );

    const results = await Promise.allSettled(promises);

    return results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  }

  /**
   * Método privado para obtener los datos de un Pokémon desde la API.
   * @param {number} id - El ID del Pokémon.
   * @returns {Promise<object>} - Los datos del Pokémon.
   * @throws {Error} - Si ocurre un error al obtener los datos del Pokémon.
   * @private
   */
  async #fetchPokemon(id) {
    const pokemonResponse = await fetch(
      `${PokemonDataHandler.addresses.pokemon}${id}`
    );
    if (!pokemonResponse.ok) {
      throw new Error(
        `Error al obtener los datos del Pokémon con ID ${id}: ${pokemonResponse.statusText}`
      );
    }

    const pokemonData = await pokemonResponse.json();

    const speciesResponse = await fetch(
      `${PokemonDataHandler.addresses.species}${id}`
    );
    if (!speciesResponse.ok) {
      throw new Error(
        `Error al obtener los datos de la especie del Pokémon con ID ${id}: ${speciesResponse.statusText}`
      );
    }
    const speciesData = await speciesResponse.json();

    return this.#transformPokemon(pokemonData, speciesData);
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
          unitOfMeasure: {
            decimeters: poke.height,
            meters: (poke.height / 10).toFixed(2),
          },
        },
        weight: {
          unitOfMeasure: {
            hectograms: poke.weight,
            kilograms: (poke.weight / 10).toFixed(2),
          },
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
