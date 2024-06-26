//? Libreria personal de utilidades
import _ from "../../../assets/general/js/lib/utilities.js";

export default class PokemonDataHandler {
  static API_URLS = {
    POKEMON: "https://pokeapi.co/api/v2/pokemon/",
    SPECIES: "https://pokeapi.co/api/v2/pokemon-species/",
    HABITAT: "https://pokeapi.co/api/v2/pokemon-habitat/",
    EVOLUTION_SPECIES: "https://pokeapi.co/api/v2/evolution-species/",
    EVOLUTION_CHAIN: "https://pokeapi.co/api/v2/evolution-chain/",
    GENDERS: "https://pokeapi.co/api/v2/gender/",
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

    // Procesar cada lote de solicitudes
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
        .filter((id) => id <= count)
        .map((id) => this.#fetchPokemon(id));

      // Esperar a que se resuelvan todas las promesas del lote actual
      const batchResults = await Promise.allSettled(batchPromises);

      // Filtrar resultados exitosos y agregar sus valores al array results
      results = results.concat(
        batchResults
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
      );
    }

    const [femaleResponse, maleResponse, genderlessResponse] =
      await Promise.all([
        fetch(`${PokemonDataHandler.API_URLS.GENDERS}1`),
        fetch(`${PokemonDataHandler.API_URLS.GENDERS}2`),
        fetch(`${PokemonDataHandler.API_URLS.GENDERS}3`),
      ]);

    if (!femaleResponse.ok || !maleResponse.ok || !genderlessResponse.ok) {
      throw new Error(`Error al obtener los datos de los generos Pokémon}`);
    }

    const [femaleData, maleData, genderlessData] = await Promise.all([
      femaleResponse.json(),
      maleResponse.json(),
      genderlessResponse.json(),
    ]);

    this.#addGendersPokemon(results, [femaleData, maleData, genderlessData]);

    // Calcular el 5% de count y generar un número aleatorio entre 1 y ese valor
    const offerCount = _.num.getRandomNum(1, Math.floor(count * 0.05));

    // Añadir ofertas aleatorias a algunos Pokémon
    this.#addRandomOffers(results, offerCount, 60);

    // Calcula los valores máximos y mínimos para cada estadística
    const maxMinValues = this.#calculateMaxMinValues(results);

    // Calcula los porcentajes para cada estadística
    this.#calculateStatisticsPercentages(results, maxMinValues);
    return results;
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

      // Obtener la cadena evolutiva
      const evolutionChainResponse = await fetch(
        speciesData.evolution_chain.url
      );

      if (!evolutionChainResponse.ok) {
        throw new Error(
          `Error al obtener los datos de la cadena evolutiva del Pokémon con ID ${id}: ${evolutionChainResponse.statusText}`
        );
      }

      const evolutionChainData = await evolutionChainResponse.json();

      const pokemon = this.#transformPokemon(
        pokemonData,
        speciesData,
        evolutionChainData
      );

      pokemon.statistics.power =
        pokemon.statistics.hp +
        pokemon.statistics.attack +
        pokemon.statistics.defense +
        pokemon.statistics.special_attack +
        pokemon.statistics.special_defense +
        pokemon.statistics.speed;

      pokemon.market.price = this.#calculatePokemonValue(pokemon);

      // pokemon.market.discount = this.#calculatePriceDiscount(pokemon, 1);

      // pokemon.market.discount = this.#generateRandomPriceOffer(
      //   pokemon.market.price,
      //   60
      // );

      // console.log(
      //   `${pokemon.market.discount} Descuento\n${
      //     pokemon.market.price
      //   } Precio\n${pokemon.market.price - pokemon.market.discount}`
      // );

      // console.log(pokemon.evolutions);
      // console.log(pokemon.value.isFinalEvolution);

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
      name: poke.species.name,
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
        isFinalEvolution: this.#isFinalEvolution(poke.name, evolution.chain),
      },
      evolutions: this.#getEvolutions(evolution.chain),
      gender: [undefined],
      market: { price: undefined, discount: undefined },
    };
  }

  /**
   * Obtiene todos los nombres de las evoluciones de un Pokémon a partir de una cadena evolutiva.
   * @param {object} chain - La cadena evolutiva del Pokémon.
   * @returns {Array} - Una lista de nombres de todas las evoluciones a partir del Pokémon inicial.
   */
  #getEvolutions(chain) {
    // Extrae la lista de evoluciones desde la cadena evolutiva proporcionada
    const evolutions = [];
    let currentEvolution = chain;

    // Recorrer la cadena evolutiva
    do {
      const species = currentEvolution.species.name;
      evolutions.push({
        name: species,
        evolves_to: currentEvolution.evolves_to.map((evo) => evo.species.name),
      });
      // Avanzar al siguiente eslabón en la cadena evolutiva
      currentEvolution = currentEvolution.evolves_to[0];
    } while (currentEvolution && currentEvolution.evolves_to);

    // Función para obtener todos los nombres de las evoluciones
    function getAllEvolutions(startName, evolutions) {
      const evolutionNames = [];

      function findEvolutions(name) {
        const pokemon = evolutions.find((p) => p.name === name);
        if (pokemon) {
          evolutionNames.push(pokemon.name);
          pokemon.evolves_to.forEach((evoName) => findEvolutions(evoName));
        }
      }

      findEvolutions(startName);
      return evolutionNames;
    }

    // Obtener el nombre del Pokémon inicial de la cadena evolutiva
    const startName = chain.species.name;

    const out = getAllEvolutions(startName, evolutions);

    // Devolver todos los nombres de las evoluciones
    return out;
  }

  /**
   * Método privado para verificar si un Pokémon está en su última fase de evolución.
   * @param {string} pokemonName - El nombre del Pokémon.
   * @param {object} chain - La cadena de evolución del Pokémon.
   * @returns {boolean} - Verdadero si el Pokémon está en su última fase de evolución, falso en caso contrario.
   * @private
   */
  #isFinalEvolution(pokemonName, chain) {
    const findFinalEvolution = (evolutionChain) => {
      if (!evolutionChain.evolves_to.length) {
        return evolutionChain.species.name;
      }
      return findFinalEvolution(evolutionChain.evolves_to[0]);
    };

    const finalEvolution = findFinalEvolution(chain);
    return pokemonName === finalEvolution;
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
      isFinalEvolution,
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
      isFinalEvolution: 0.05,

      capture_rate_percent: 1,

      isLegendary: 3.0,
      isMythical: 2.5,
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
    if (isFinalEvolution) {
      value += value * weights.isFinalEvolution;
    }

    // Ajuste por rareza
    if (isLegendary) {
      value *= weights.isLegendary;
    }
    // Ajuste por rareza
    if (isMythical) {
      value *= weights.isMythical;
    }

    // Ajuste por capture_rate_percent
    value -= capture_rate_percent * weights.capture_rate_percent;

    value = value < 0 ? 10 : value;
    return this.#formatNumber(value);
  }

  /**
   * Añade la propiedad `gender` a cada objeto Pokémon en `results` basándose en los datos de género proporcionados.
   * @param {Array} results - La lista de objetos Pokémon a actualizar.
   * @param {Array} genderData - Una lista con tres elementos: [femaleData, maleData, genderlessData].
   * @private
   */
  #addGendersPokemon(results, genderData) {
    const [femaleData, maleData, genderlessData] = genderData;

    // Crear mapas para acceso rápido por nombre de Pokémon
    const femaleSet = new Set(
      femaleData.pokemon_species_details.map(
        (detail) => detail.pokemon_species.name
      )
    );
    const maleSet = new Set(
      maleData.pokemon_species_details.map(
        (detail) => detail.pokemon_species.name
      )
    );
    const genderlessSet = new Set(
      genderlessData.pokemon_species_details.map(
        (detail) => detail.pokemon_species.name
      )
    );

    results.forEach((pokemon) => {
      const { name } = pokemon;

      if (genderlessSet.has(name)) {
        pokemon.gender = null;
      } else {
        const genders = [];
        if (femaleSet.has(name)) genders.push("female");
        if (maleSet.has(name)) genders.push("male");
        pokemon.gender = genders.length ? genders : undefined;
      }
    });
  }

  /**
   * Método privado para añadir ofertas a una cantidad específica de Pokémon de forma aleatoria.
   * @param {object[]} pokemonArray - El array de Pokémon.
   * @param {number} quantity - La cantidad de Pokémon a los que se les añadirá una oferta.
   * @param {number} percentage - El porcentaje de descuento para las ofertas.
   * @private
   */
  #addRandomOffers(pokemonArray, quantity, percentage) {
    // Verificar que pokemonArray sea un array y no esté vacío
    if (!Array.isArray(pokemonArray) || pokemonArray.length === 0) {
      throw new Error("pokemonArray debe ser un array no vacío.");
    }

    // Verificar que la cantidad no exceda el número total de Pokémon
    if (quantity > pokemonArray.length) {
      quantity = pokemonArray.length;
    }

    // Seleccionar aleatoriamente los índices de los Pokémon que recibirán ofertas
    const selectedIndices = [];
    while (selectedIndices.length < quantity) {
      const randomIndex = Math.floor(Math.random() * pokemonArray.length);
      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex);
      }
    }

    // Asignar descuentos a los Pokémon seleccionados
    selectedIndices.forEach((index) => {
      const poke = pokemonArray[index];
      poke.market.discount = this.#generateRandomPriceOffer(
        poke.market.price,
        percentage
      );
    });

    console.log(`Pokémon en oferta: ${quantity}`);
  }

  /**
   * Genera una variacion de precio aleatoria para un Pokémon.
   * La variacion de precio estará dentro de un rango definido por el precio base y un factor de variación.
   * @param {number} basePrice - El precio base del Pokémon.
   * @param {number} variationFactor - El factor de variación que determina el rango de la oferta (en porcentaje).
   * @returns {number} - La variacion de precio generada.
   */
  #generateRandomPriceVariation(basePrice, variationFactor) {
    // Calcula el rango de variación del precio basado en el factor de variación
    const priceRange = basePrice * (variationFactor / 100);

    // Genera un precio aleatorio dentro del rango definido por el precio base y el rango de variación
    const randomVariation = basePrice + (Math.random() * 2 - 1) * priceRange;

    // Redondea el precio aleatorio a dos decimales
    const roundedVariation = Math.round(randomVariation * 100) / 100;

    return roundedVariation;
  }

  /**
   * Genera una oferta de precio aleatoria para un Pokémon.
   * La oferta de precio estará dentro de un rango definido por el precio base y un factor de variación.
   * @param {number} basePrice - El precio base del Pokémon.
   * @param {number} variationFactor - El factor de variación que determina el rango de la oferta (en porcentaje).
   * @returns {number} - La oferta de precio generada.
   */
  #generateRandomPriceOffer(basePrice, variationFactor) {
    // Calcula el rango de variación del precio basado en el factor de variación
    const priceRange = basePrice * (variationFactor / 100);

    // Genera un descuento aleatorio dentro del rango definido por el precio base y el rango de variación
    const discount = Math.random() * priceRange;

    // Calcula el precio de oferta restando el descuento al precio base
    const offerPrice = basePrice - discount;

    // Redondea el precio de oferta a dos decimales
    const roundedOffer = Math.round(offerPrice * 100) / 100;

    return roundedOffer;
  }

  /**
   * Calcula los valores máximos y mínimos para cada estadística de los Pokémon.
   * @param {object[]} results - La lista de datos de Pokémon.
   * @returns {object} - Un objeto que contiene los valores máximos y mínimos para cada estadística.
   */
  #calculateMaxMinValues(results) {
    const maxHP = Math.max(...results.map((poke) => poke.statistics.hp));
    const minHP = Math.min(...results.map((poke) => poke.statistics.hp));

    const maxAttack = Math.max(
      ...results.map((poke) => poke.statistics.attack)
    );
    const minAttack = Math.min(
      ...results.map((poke) => poke.statistics.attack)
    );

    const maxDefense = Math.max(
      ...results.map((poke) => poke.statistics.defense)
    );
    const minDefense = Math.min(
      ...results.map((poke) => poke.statistics.defense)
    );

    const maxSpecialAttack = Math.max(
      ...results.map((poke) => poke.statistics.special_attack)
    );
    const minSpecialAttack = Math.min(
      ...results.map((poke) => poke.statistics.special_attack)
    );

    const maxSpecialDefense = Math.max(
      ...results.map((poke) => poke.statistics.special_defense)
    );
    const minSpecialDefense = Math.min(
      ...results.map((poke) => poke.statistics.special_defense)
    );

    const maxSpeed = Math.max(...results.map((poke) => poke.statistics.speed));
    const minSpeed = Math.min(...results.map((poke) => poke.statistics.speed));

    const maxPower = Math.max(...results.map((poke) => poke.statistics.power));
    const minPower = Math.min(...results.map((poke) => poke.statistics.power));

    return {
      maxHP,
      minHP,
      maxAttack,
      minAttack,
      maxDefense,
      minDefense,
      maxSpecialAttack,
      minSpecialAttack,
      maxSpecialDefense,
      minSpecialDefense,
      maxSpeed,
      minSpeed,
      maxPower,
      minPower,
    };
  }

  /**
   * Calcula los porcentajes para cada estadística de los Pokémon.
   * @param {object[]} results - La lista de datos de Pokémon.
   * @param {object} maxMinValues - Un objeto que contiene los valores máximos y mínimos para cada estadística.
   */
  #calculateStatisticsPercentages(results, maxMinValues) {
    results.forEach((poke) => {
      poke.statistics.hp_percent = Math.round(
        ((poke.statistics.hp - maxMinValues.minHP) /
          (maxMinValues.maxHP - maxMinValues.minHP)) *
          100
      );
      poke.statistics.attack_percent = Math.round(
        ((poke.statistics.attack - maxMinValues.minAttack) /
          (maxMinValues.maxAttack - maxMinValues.minAttack)) *
          100
      );
      poke.statistics.defense_percent = Math.round(
        ((poke.statistics.defense - maxMinValues.minDefense) /
          (maxMinValues.maxDefense - maxMinValues.minDefense)) *
          100
      );
      poke.statistics.special_attack_percent = Math.round(
        ((poke.statistics.special_attack - maxMinValues.minSpecialAttack) /
          (maxMinValues.maxSpecialAttack - maxMinValues.minSpecialAttack)) *
          100
      );
      poke.statistics.special_defense_percent = Math.round(
        ((poke.statistics.special_defense - maxMinValues.minSpecialDefense) /
          (maxMinValues.maxSpecialDefense - maxMinValues.minSpecialDefense)) *
          100
      );
      poke.statistics.speed_percent = Math.round(
        ((poke.statistics.speed - maxMinValues.minSpeed) /
          (maxMinValues.maxSpeed - maxMinValues.minSpeed)) *
          100
      );
      poke.statistics.power_percent = Math.round(
        ((poke.statistics.power - maxMinValues.minPower) /
          (maxMinValues.maxPower - maxMinValues.minPower)) *
          100
      );
    });
  }
}
