export class PokemonFilter {
  /**
   * Método para obtener una lista de Pokémon que coincidan con los tipos especificados.
   * @param {object[]} pokemonDataList - La lista de datos de Pokémon a filtrar.
   * @param {string[]} typeFilters - Un array de tipos de Pokémon para filtrar.
   * @param {boolean} [exactMatch=false] - Si es true, solo devolverá Pokémon que coincidan exactamente con los tipos especificados.
   * @returns {object[]} - Un array de objetos de Pokémon que coinciden con los filtros especificados.
   * @throws {TypeError} - Si los parámetros no son válidos.
   */
  getPokemonByTypes(pokemonDataList, typeFilters, exactMatch = false) {
    // Validación de los parámetros
    if (!Array.isArray(pokemonDataList)) {
      throw new TypeError(
        "pokemonDataList debe ser un array de objetos Pokémon."
      );
    }
    if (
      !Array.isArray(typeFilters) ||
      typeFilters.some((type) => typeof type !== "string")
    ) {
      throw new TypeError("typeFilters debe ser un array de strings.");
    }
    if (typeof exactMatch !== "boolean") {
      throw new TypeError("exactMatch debe ser un valor booleano.");
    }

    const pokemonData = [...pokemonDataList];

    // Convertir los tipos a minúsculas para comparación insensible a mayúsculas/minúsculas
    const normalizedTypeFilters = typeFilters.map((type) => type.toLowerCase());

    // Si "all" está presente en los filtros, devolver todos los Pokémon
    if (normalizedTypeFilters.includes("all")) {
      return pokemonData;
    }

    // Filtrar los Pokémon según los tipos especificados
    return pokemonData.filter((poke) => {
      const normalizedPokeTypes = poke.type.map((type) => type.toLowerCase());

      if (exactMatch) {
        // Ordenar ambos arreglos antes de compararlos
        const sortedPokeTypes = [...normalizedPokeTypes].sort();
        const sortedTypeFilters = [...normalizedTypeFilters].sort();

        // Verificar si el Pokémon tiene exactamente los tipos especificados (sin importar el orden)
        return (
          sortedPokeTypes.length === sortedTypeFilters.length &&
          sortedPokeTypes.every(
            (type, index) => type === sortedTypeFilters[index]
          )
        );
      } else {
        // Verificar si el Pokémon contiene al menos uno de los tipos especificados
        return normalizedPokeTypes.some((type) =>
          normalizedTypeFilters.includes(type)
        );
      }
    });
  }

  /**
   * Método para obtener una lista de Pokémon ordenados por una propiedad específica.
   * @param {object[]} pokemonDataList - La lista de datos de Pokémon a ordenar.
   * @param {string} property - La propiedad por la cual ordenar. Puede ser "pokeId", "name", "type", "statistics.height", "statistics.weight".
   * @param {string} [order='asc'] - El orden de la ordenación. Puede ser "asc" para ascendente o "desc" para descendente.
   * @returns {object[]} - Un array de objetos de Pokémon ordenados según la propiedad y el orden especificados.
   * @throws {Error} - Si la propiedad de ordenación es desconocida.
   */
  getPokemonByProperty(pokemonDataList, property, order = "asc") {
    // Validación de los parámetros
    if (!Array.isArray(pokemonDataList)) {
      throw new TypeError(
        "pokemonDataList debe ser un array de objetos Pokémon."
      );
    }
    if (typeof property !== "string") {
      throw new TypeError("property debe ser una cadena de caracteres.");
    }
    if (typeof order !== "string") {
      throw new TypeError("order debe ser una cadena de caracteres.");
    }

    // Convertir los valores a minúsculas para comparación insensible a mayúsculas/minúsculas
    const normalizedProperty = property.toLowerCase();
    const normalizedOrder = order.toLowerCase();

    const sortedPokemon = [...pokemonDataList];

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
        return [a.statistics.height.decimeters, b.statistics.height.decimeters];
      case "statistics.weight":
        return [a.statistics.weight.hectograms, b.statistics.weight.hectograms];
      default:
        throw new Error(`Propiedad de ordenación desconocida: ${property}`);
    }
  }
}
