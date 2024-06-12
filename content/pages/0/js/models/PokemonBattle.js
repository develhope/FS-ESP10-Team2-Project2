/**
 * Genera un número aleatorio entre un rango dado.
 * @param {number} min - El valor mínimo del rango.
 * @param {number} max - El valor máximo del rango.
 * @param {boolean} [isDecimal=false] - Indica si se debe devolver un número decimal.
 * @returns {number} - El número aleatorio generado.
 */
function getRandomNum(min, max, isDecimal = false) {
  if (isDecimal) {
    return Math.random() * (max - min) + min;
  } else {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

/**
 * Función para calcular una probabilidad y devolver un resultado booleano.
 * @param {number} probabilityPercentage - El porcentaje de probabilidad de que el resultado sea true (de 0 a 100).
 * @returns {boolean} - true si el resultado está dentro del rango de probabilidad, de lo contrario, false.
 */
function calculateProbability(probabilityPercentage) {
  // Verificar si el porcentaje de probabilidad es válido (de 0 a 100)
  if (probabilityPercentage < 0 || probabilityPercentage > 100) {
    throw new Error("El porcentaje de probabilidad debe estar entre 0 y 100.");
  }

  // Generar un número aleatorio entre 0 y 100
  const randomNumber = Math.random() * 100;

  // Verificar si el número aleatorio está dentro del rango de probabilidad
  return randomNumber <= probabilityPercentage;
}

//todo:---------------------------------------------------------------------------------------------
//todo: Clase Pokemon
//todo:---------------------------------------------------------------------------------------------
class Pokemon {
  #data = {
    properties: {
      immutable: { name: undefined, type: undefined },
      base: {
        hp: undefined,
        attack: undefined,
        special_attack: undefined,
        defense: undefined,
        special_defense: undefined,
        speed: undefined,
        fatigue: 0,
      },
      copy: {},
    },
    battleData: {
      isReady: true,
      isFirstAttacker: undefined,
      lastDamage: {
        received: { base: undefined, critic: undefined, total: undefined },
        inflicted: { base: undefined, critic: undefined, total: undefined },
      },
    },
    log: {
      moves: {
        attacks: { normal: 0, special: 0 },
        defenses: { normal: 0, special: 0 },
        evading: 0,
        critic: { received: 0, inflicted: 0 },
      },
      recovery: { fatigue: 0 },
      history: [],
    },
  };

  constructor(
    name,
    type,
    hp,
    attack,
    special_attack,
    defense,
    special_defense,
    speed
  ) {
    this.#data.properties.immutable.name = name;
    this.#data.properties.immutable.type = type.map((t) => t.toLowerCase());

    this.#data.properties.base.hp = hp;
    this.#data.properties.base.attack = attack;
    this.#data.properties.base.special_attack = special_attack;
    this.#data.properties.base.defense = defense;
    this.#data.properties.base.special_defense = special_defense;
    this.#data.properties.base.speed = speed;

    this.#initializeHotVariables();
    this.resetStats();
  }

  #initializeHotVariables() {
    this.p = {
      i: {
        name: this.#data.properties.immutable.name,
        type: this.#data.properties.immutable.type,
      },
      b: {
        hp: this.#data.properties.base.hp,
        attack: this.#data.properties.base.attack,
        special_attack: this.#data.properties.base.special_attack,
        defense: this.#data.properties.base.defense,
        special_defense: this.#data.properties.base.special_defense,
        speed: this.#data.properties.base.speed,
        fatigue: this.#data.properties.base.fatigue,
      },
      c: {
        hp: this.#data.properties.copy.hp,
        attack: this.#data.properties.copy.attack,
        special_attack: this.#data.properties.copy.special_attack,
        defense: this.#data.properties.copy.defense,
        special_defense: this.#data.properties.copy.special_defense,
        speed: this.#data.properties.copy.speed,
        fatigue: this.#data.properties.copy.fatigue,
      },
    };

    this.log = this.#data.log;
    this.battleData = this.#data.battleData;
  }

  /**
   * Método para resetear las estadísticas de un Pokémon.
   * Establece las propiedades "copy" a sus valores "base".
   */
  resetStats() {
    this.log.history = [];
    this.p.c = {
      hp: this.p.b.hp,
      attack: this.p.b.attack,
      special_attack: this.p.b.special_attack,
      defense: this.p.b.defense,
      special_defense: this.p.b.special_defense,
      speed: this.p.b.speed,
      fatigue: this.p.b.fatigue,
    };
  }

  /**
   * Método para determinar si el Pokémon es el primer atacante.
   * @private
   * @returns {boolean} - true si es el primer atacante, false en caso contrario.
   */
  #isFirstAttacker() {
    const isFirst = this.battleData.isFirstAttacker;
    this.battleData.isFirstAttacker = false;
    return isFirst;
  }

  /**
   * Método para registrar un ataque normal.
   * Incrementa el contador de ataques normales y actualiza la fatiga.
   * @private
   */
  #addNormalAttack() {
    this.log.moves.attacks.normal++;
    this.#fatigueLog(this.#isFirstAttacker() ? 0 : 5, "+");
  }

  /**
   * Método para registrar un ataque especial.
   * Incrementa el contador de ataques especiales y actualiza la fatiga.
   * @private
   */
  #addSpecialAttack() {
    this.log.moves.attacks.special++;
    this.#fatigueLog(this.#isFirstAttacker() ? 5 : 10, "+");
  }

  /**
   * Método para registrar una defensa normal.
   * Incrementa el contador de defensas normales.
   * @private
   */
  #addNormalDefense() {
    this.log.moves.defenses.normal++;
    this.#fatigueLog(5, "-");
  }

  /**
   * Método para registrar una defensa especial.
   * Incrementa el contador de defensas especiales y actualiza la fatiga.
   * @private
   */
  #addSpecialDefense() {
    this.log.moves.defenses.special++;
    this.#fatigueLog(10, "-");
  }

  /**
   * Método para registrar una defensa especial.
   * Incrementa el contador de defensas especiales y actualiza la fatiga.
   * @private
   */
  #addEvading() {
    this.log.moves.evading++;
    this.#fatigueLog(getRandomNum(1, 3), "+");
  }

  /**
   * Método para actualizar y registrar la fatiga.
   * @private
   * @param {number} value - El valor de la fatiga a modificar.
   * @param {string} operator - El operador para modificar la fatiga ('+' o '-').
   */
  #fatigueLog(value, operator) {
    if (value !== 0 && !this.isDefeated()) {
      if (operator === "+") {
        this.p.c.fatigue += value;
      } else {
        const fatigueRecovery = value;
        this.p.c.fatigue -= fatigueRecovery;
        this.log.recovery.fatigue += fatigueRecovery;
      }

      const log = `   Fatiga ${operator}${value} (${this.p.c.fatigue})`;
      this.#pushConsoleLog(log);
    }
  }

  /**
   * Método para registrar un mensaje en el log y en la consola.
   * @private
   * @param {string} log - El mensaje a registrar.
   */
  #pushConsoleLog(log) {
    console.log(log);
    this.log.history.push(log);
  }

  #attackConsoleLog(attackType) {
    const attackBase = this.battleData.lastDamage.inflicted.base;
    const attackCritic = this.battleData.lastDamage.inflicted.critic;
    const attackTotal = this.battleData.lastDamage.inflicted.total;

    const attackMessage =
      attackType === "special" ? "Ataque especial" : "Ataque normal";

    const attackCriticMessage = attackCritic
      ? ` * ${attackCritic} = ${attackTotal}`
      : "";

    let log = `- ${this.p.i.name}: ${attackMessage}. Valor del ataque: ${attackBase}${attackCriticMessage}`;

    this.#pushConsoleLog(log);
  }

  /**
   * Registra el resultado de la defensa en la consola y actualiza los contadores de defensa.
   * @param {string} defenseType - El tipo de defensa utilizada, puede ser "normal" o "special".
   */
  #defenseConsoleLog(defenseType) {
    const { critic: defenseCritic, total: defenseTotal } =
      this.battleData.lastDamage.received;
    const cHP = this.p.c.hp;

    if (cHP === 0) {
      this.#pushConsoleLog(`${this.p.i.name} No puedo soportar el ataque.`);
      return;
    }

    const defenseMessage =
      defenseType === "special" ? "Defensa especial" : "Defensa normal";
    const defenseCriticMessage = defenseCritic ? "(Crítico) " : "";
    const log = `- ${this.p.i.name}: ${defenseMessage}. ${defenseCriticMessage}Daño reducido a ${defenseTotal}.`;

    const logStats = `${this.#getStats("hp")}\n${
      defenseType === "normal"
        ? `${this.#getStats("defense")}`
        : `${this.#getStats("special_defense")}`
    }`.trimEnd();

    this.#pushConsoleLog(log);
    this.#pushConsoleLog(logStats);

    defenseType === "normal"
      ? this.#addNormalDefense()
      : this.#addSpecialDefense();
  }

  /**
   * Registra el resultado de la evasión en la consola y actualiza los contadores de evasión.
   */
  #evadingConsoleLog() {
    const evadingTotal = this.battleData.lastDamage.received.total;
    const { hp: cHP } = this.p.c.hp;

    if (cHP === 0) {
      this.#pushConsoleLog(
        `${this.p.i.name} No puedo esquivar el ataque y no lo soporto.`
      );
      return;
    }

    const evadingMessage =
      evadingTotal === 0
        ? "Esquivó el ataque y no recibió daños"
        : `No logró esquivar todo el ataque. Daño recibido: ${evadingTotal}`;

    const log = `- ${this.p.i.name}: ${evadingMessage}.`;

    this.#pushConsoleLog(log);
    this.#pushConsoleLog(this.#getStats("hp"));
    this.#addEvading();
  }

  /**
   * Optiene la estadística actual que se introduzcan formateada correctamente.
   * @param {string} nameStat - El nombre de la propiedad.
   * @returns {string} - La cadena formateada con la estadística actual.
   */
  #getStats(nameStat) {
    const nameStatsES = {
      hp: "HP",
      defense: "Defensa Normal",
      special_defense: "Defensa Especial",
      attack: "Ataque Normal",
      special_attack: "Ataque Especial", // Corregido el nombre de la propiedad
    };

    const currentValue = this.p.c[nameStat];
    const baseValue = this.p.b[nameStat];
    const percentage = this.#getPercentOfProperty(nameStat);

    return `   ${nameStatsES[nameStat]}: ${currentValue}/${baseValue} (${percentage}%)`;
  }

  //? Métodos para atacar

  normalAttack() {
    this.#attackConsoleLog("normal");
    this.#addNormalAttack();
  }
  specialAttack() {
    this.#attackConsoleLog("special");
    this.#addSpecialAttack();
  }

  //? Métodos para defender
  /**
   * Realiza la defensa normal, reduciendo el daño recibido en función de la defensa del Pokémon.
   * Si la defensa es insuficiente, intenta reducir el daño con la defensa especial.
   * @param {number} damage - La cantidad de daño recibida.
   */
  normalDefense(damage) {
    damage = Math.round(damage);

    let reducedDamage = damage;

    // if (this.p.c.defense > 0) {
    reducedDamage = this.#reduce(damage, this.p.c.defense);
    this.p.c.defense = this.#pcReduce("defense", damage);
    this.p.c.hp = this.#pcReduce("hp", reducedDamage);
    this.battleData.lastDamage.received.total = reducedDamage;
    this.#defenseConsoleLog("normal");
    // } else if (this.p.c.special_defense > 0) {
    // this.specialDefense(reducedDamage);
    // reducedDamage = this.#reduce(damage, this.p.c.special_defense);
    // this.p.c.special_defense = this.#pcReduce("special_defense", damage);
    // this.p.c.hp = this.#pcReduce("hp", reducedDamage);
    // this.#defenseConsoleLog("special");
    // }
  }

  /**
   * Realiza la defensa especial, reduciendo el daño recibido en función de la defensa especial del Pokémon.
   * @param {number} damage - La cantidad de daño recibida.
   */
  specialDefense(damage) {
    damage = Math.round(damage);

    let reducedDamage = this.#reduce(damage, this.p.c.special_defense);
    this.p.c.special_defense = this.#pcReduce("special_defense", damage);

    this.p.c.hp = this.#pcReduce("hp", reducedDamage);
    this.battleData.lastDamage.received.total = reducedDamage;
    this.#defenseConsoleLog("special");
  }

  /**
   * Realiza la evacion, reduciendo el daño recibido en función de factores que aun no e decidido del Pokémon por ahora es 0.
   * @param {number} damage - La cantidad de daño recibida.
   */
  evading(damage) {
    damage = Math.round(damage);

    let reducedDamage = 0;

    this.p.c.hp = this.#pcReduce("hp", reducedDamage);
    this.battleData.lastDamage.received.total = reducedDamage;

    this.#evadingConsoleLog();
  }

  //? Oros metodos
  isDefeated() {
    return this.p.c.hp <= 0;
  }

  isExhausted() {
    return this.p.c.fatigue >= 25;
  }

  isAngry() {
    return this.p.c.fatigue <= 10;
  }

  /**
   * Verifica si el Pokémon es vulnerable a alguno de los tipos de ataque proporcionados.
   * @param {Array<string>} attackTypes - Un array de tipos de ataque.
   * @returns {Array|null} - Un array con los tipos vulnerables, null si no existen.
   */
  isVulnerableTo(attackTypes) {
    attackTypes = attackTypes.map((v) => v.toLowerCase());
    const weaknesses = {
      steel: ["fighting", "fire", "ground"],
      water: ["grass", "electric"],
      bug: ["flying", "fire", "rock"],
      dragon: ["fairy", "ice", "dragon"],
      electric: ["ground"],
      ghost: ["ghost", "dark"],
      fire: ["ground", "water", "rock"],
      fairy: ["steel", "poison"],
      ice: ["fighting", "steel", "rock", "fire"],
      fighting: ["psychic", "flying", "fairy"],
      normal: ["fighting"],
      grass: ["flying", "bug", "poison", "ice", "fire"],
      psychic: ["bug", "ghost", "dark"],
      rock: ["fighting", "ground", "steel", "water", "grass"],
      dark: ["fighting", "fairy", "bug"],
      ground: ["water", "grass", "ice"],
      poison: ["ground", "psychic"],
      flying: ["rock", "ice", "electric"],
    };

    // Obtener los tipos del Pokémon
    const pokemonTypes = this.p.i.type;
    const vulnerableTypes = [];

    // Verificar si alguno de los tipos del Pokémon es vulnerable a los tipos de ataque proporcionados
    for (let attackType of attackTypes) {
      for (let type of pokemonTypes) {
        if (weaknesses[type] && weaknesses[type].includes(attackType)) {
          vulnerableTypes.push(attackType);
        }
      }
    }

    const out =
      vulnerableTypes.length > 0 ? [...new Set(vulnerableTypes)] : null; // Eliminar duplicados
    return out;
  }

  /**
   * Reduce el valor de una propiedad del Pokémon asegurando que no sea negativo.
   * @param {string} nameProperty - El nombre de la propiedad a reducir.
   * @param {number} value - El valor a restar de la propiedad.
   * @returns {number} - El nuevo valor de la propiedad.
   */
  #pcReduce(nameProperty, value) {
    return Math.max(0, this.p.c[nameProperty] - value);
  }

  /**
   * Reduce dos valores asegurando que el resultado no sea negativo.
   * @param {number} minuend - El valor inicial.
   * @param {number} subtrahend - El valor a restar.
   * @returns {number} - El resultado de la resta, asegurando que no sea negativo.
   */
  #reduce(minuend, subtrahend) {
    return Math.max(0, minuend - subtrahend);
  }

  /**
   * Obtiene el porcentaje de una propiedad en relación a su valor base.
   * @param {string} nameProperty - El nombre de la propiedad.
   * @returns {number} - El porcentaje de la propiedad en relación a su valor base.
   */
  #getPercentOfProperty(nameProperty) {
    return Math.round((this.p.c[nameProperty] * 100) / this.p.b[nameProperty]);
  }

  /**
   * Muestra el estado actual del Pokémon, incluyendo sus estadísticas y movimientos realizados.
   */
  state() {
    const iName = this.p.i.name;
    const cHP = this.p.c.hp;
    const bHP = this.p.b.hp;

    const cDefense = this.p.c.defense;
    const bDefense = this.p.b.defense;

    const cSpecial_defense = this.p.c.special_defense;
    const bSpecial_defense = this.p.b.special_defense;

    const cFatigue = this.p.c.fatigue;

    const log = this.log;

    console.log(`${iName}: (${this.isDefeated() ? "Derrotado" : "Ganador"})`);
    console.log(`- HP: ${cHP}/${bHP} (${this.#getPercentOfProperty("hp")}%)`);
    console.log(
      `- Defensa: ${cDefense}/${bDefense} (${this.#getPercentOfProperty(
        "defense"
      )}%)`
    );
    console.log(
      `- Defensa Especial: ${cSpecial_defense}/${bSpecial_defense} (${this.#getPercentOfProperty(
        "special_defense"
      )}%)`
    );
    console.log(`- Fatiga: ${cFatigue}`);
    console.log(`- Recuperación de Fatiga: ${log.recovery.fatigue}`);

    console.log(`- Movimientos Realizados:`);

    // Verificar si hay ataques realizados y contar los que tienen valores mayores a 0
    let attackValues = Object.values(log.moves.attacks);
    let attackCount = attackValues.reduce((acc, curr) => acc + curr, 0);

    if (attackCount > 0) {
      console.log(`  - Ataques: (${attackCount})`);
      if (log.moves.attacks.normal > 0) {
        console.log(`    - Normales: ${log.moves.attacks.normal}`);
      }
      if (log.moves.attacks.special > 0) {
        console.log(`    - Especiales: ${log.moves.attacks.special}`);
      }
      if (log.moves.critic.inflicted > 0) {
        console.log(`    - Críticos: ${log.moves.critic.inflicted}`);
      }
    }

    // Verificar si hay defensas realizadas y contar los que tienen valores mayores a 0
    let defenseValues = Object.values(log.moves.defenses);
    let defenseCount = defenseValues.reduce((acc, curr) => acc + curr, 0);

    if (defenseCount > 0) {
      console.log(`  - Defensas: (${defenseCount})`);
      if (log.moves.defenses.normal > 0) {
        console.log(`    - Normales: ${log.moves.defenses.normal}`);
      }
      if (log.moves.defenses.special > 0) {
        console.log(`    - Especiales: ${log.moves.defenses.special}`);
      }
      if (log.moves.critic.received > 0) {
        console.log(`    - Críticas: ${log.moves.critic.received}`);
      }
    }

    if (log.moves.evading > 0) {
      console.log(`  - Evacion: ${log.moves.evading}`);
    }
  }
}

//todo:---------------------------------------------------------------------------------------------
//todo: Clase PokemonBattle
//todo:---------------------------------------------------------------------------------------------
class PokemonBattle {
  static #data = { battleHistory: [] };

  constructor(pokemon1, pokemon2) {
    this.pokemon1 = pokemon1;
    this.pokemon2 = pokemon2;
  }

  /**
   * Método estático para obtener el historial de batallas.
   * @returns {Array} - El historial de batallas.
   */
  static get #battleHistory() {
    return PokemonBattle.#data.battleHistory;
  }

  /**
   * Método estático para obtener una batalla específica del historial por su número.
   * Si no se proporciona un número, devuelve la última batalla del historial.
   *
   * @param {number} [battleNumber] - El número de la batalla a obtener (opcional).
   * @returns {Object|null} - La batalla especificada o la última batalla, o null si no hay batallas en el historial.
   */
  static getBattleLog(battleNumber = null) {
    if (PokemonBattle.#battleHistory.length === 0) {
      return null;
    }

    if (battleNumber === null) {
      return PokemonBattle.#battleHistory[
        PokemonBattle.#battleHistory.length - 1
      ];
    }

    if (
      battleNumber < 1 ||
      battleNumber > PokemonBattle.#battleHistory.length
    ) {
      return null; // Fuera de rango
    }

    return PokemonBattle.#battleHistory[battleNumber - 1];
  }

  /**
   * Método para registrar un mensaje en el log y en la consola.
   * @private
   * @param {string} log - El mensaje a registrar.
   */
  #pushConsoleLog(log) {
    const prefix = "\n#-> ";
    const subfix = " <-#";
    console.log(prefix + log + subfix);
    // this.log.history.push(log);
  }

  /**
   * Método para determinar el Pokémon que atacará en este turno.
   * @param {boolean} isFirst - Indica si es la primera vez que se determina el atacante.
   * @returns {Pokemon} - El Pokémon que atacará en este turno.
   */
  #determineAttacker(isFirst = false) {
    const pokemon1 = this.pokemon1;
    const pokemon2 = this.pokemon2;
    const speed1 = pokemon1.p.c.speed;
    const speed2 = pokemon2.p.c.speed;
    const fatigue1 = pokemon1.p.c.fatigue;
    const fatigue2 = pokemon2.p.c.fatigue;

    // Determinar el Pokémon con mayor y menor velocidad
    const [maxSpeedPokemon, minSpeedPokemon] =
      speed1 > speed2 ? [pokemon1, pokemon2] : [pokemon2, pokemon1];
    // Determinar el Pokémon con mayor y menor fatiga
    const [maxFatigePokemon, minFatigePokemon] =
      fatigue1 > fatigue2 ? [pokemon1, pokemon2] : [pokemon2, pokemon1];

    if (isFirst) {
      // Si es la primera vez, el Pokémon más rápido ataca primero
      if (speed1 !== speed2) {
        this.#pushConsoleLog(
          `${maxSpeedPokemon.p.i.name} ataca primero por su mayor velocidad.`
        );
        return maxSpeedPokemon;
      }
      this.#pushConsoleLog(
        `No hay diferencia de velocidad, cualquiera puede atacar primero.`
      );
      // Si tienen la misma velocidad, se elige aleatoriamente
      return calculateProbability(50) ? pokemon1 : pokemon2;
    }

    // Verificar condiciones de agotamiento
    if (pokemon1.isExhausted() && pokemon2.isExhausted()) {
      this.#pushConsoleLog(
        `Ambos Pokémon están agotados, cualquiera puede atacar.`
      );
      return calculateProbability(50) ? pokemon1 : pokemon2;
    }

    if (pokemon1.isExhausted()) {
      this.#pushConsoleLog(
        `${pokemon1.p.i.name} está agotado, no puede atacar.`
      );
      return pokemon2;
    }

    if (pokemon2.isExhausted()) {
      this.#pushConsoleLog(
        `${pokemon2.p.i.name} está agotado, no puede atacar.`
      );
      return pokemon1;
    }

    // Verificar condiciones de fatiga, si ambos estan descansados
    if (fatigue1 < 0 && fatigue2 < 0) {
      if (fatigue1 !== fatigue2) {
        this.#pushConsoleLog(
          `${minFatigePokemon.p.i.name} ataca por menor fatiga.`
        );
        return minFatigePokemon;
      } else if (fatigue1 === fatigue2) {
        this.#pushConsoleLog(
          `${maxSpeedPokemon.p.i.name} ataca por su mayor velocidad.`
        );
        return maxSpeedPokemon;
      }
    }

    if (fatigue1 < 0) {
      this.#pushConsoleLog(
        `${pokemon1.p.i.name} está descansado, puede atacar.`
      );
      return pokemon1;
    }

    if (fatigue2 < 0) {
      this.#pushConsoleLog(
        `${pokemon2.p.i.name} está descansado, puede atacar.`
      );
      return pokemon2;
    }

    // Aplicar probabilidad basada en la diferencia de velocidad utilizando #balancedProbabilitySystem
    const probability = this.#balancedProbabilitySystem(
      maxSpeedPokemon.p.c.speed,
      minSpeedPokemon.p.c.speed
    );
    const clearProbability = Math.min(60, probability);

    this.#pushConsoleLog(
      `Cualquiera puede atacar, aunque ${
        maxSpeedPokemon.p.i.name
      } tiene un ${Math.round(clearProbability)}% más de probabilidad.`
    );

    // Para que no se pase de ventaja establecemos como mínimo 60% de probabilidad para lanzar un ataque.
    return calculateProbability(clearProbability)
      ? maxSpeedPokemon
      : minSpeedPokemon;
  }

  /**
   * Método para verificar debilidades y aplicar daño adicional.
   * Si el defensor es débil contra alguno de los tipos del atacante,
   * existe un 50% de probabilidad de que el daño se multiplique por un
   * valor aleatorio entre 1.1 y 2.
   *
   * @param {Pokemon} defender - El Pokémon que recibe el ataque.
   * @param {Pokemon} attacker - El Pokémon que lanza el ataque.
   * @param {number} damage - La cantidad de daño del ataque.
   * @returns {number} - La cantidad de daño ajustada si hay una debilidad.
   */
  #applyWeaknessBonus(defender, attacker, damage) {
    const attackerTypes = attacker.p.i.type.map((type) => type.toLowerCase());

    const vulnerabilityInfo = defender.isVulnerableTo(attackerTypes);

    if (vulnerabilityInfo) {
      if (calculateProbability(50)) {
        const multiplier = getRandomNum(1.1, 2, true); // Rango de 1.1 a 2

        const totalDamage = Math.round(damage * multiplier);
        const multiplierFixed = multiplier.toFixed(2);

        attacker.battleData.lastDamage.inflicted.base = damage;
        attacker.battleData.lastDamage.inflicted.critic = multiplierFixed;
        attacker.battleData.lastDamage.inflicted.total = totalDamage;
        attacker.log.moves.critic.inflicted++;

        defender.battleData.lastDamage.received.base = damage;
        defender.battleData.lastDamage.received.critic = multiplierFixed;
        defender.battleData.lastDamage.received.total = totalDamage;
        defender.log.moves.critic.received++;

        return totalDamage;
      }
    }

    attacker.battleData.lastDamage.inflicted.base = damage;
    attacker.battleData.lastDamage.inflicted.critic = false;
    attacker.battleData.lastDamage.inflicted.total = damage;

    defender.battleData.lastDamage.received.base = damage;
    defender.battleData.lastDamage.received.critic = false;
    defender.battleData.lastDamage.received.total = damage;

    return damage;
  }

  /**
   * Sistema de probabilidad equilibrado según la diferencia de una propiedad de cada Pokémon.
   * @param {number} value1 - El valor de la propiedad del primer Pokémon.
   * @param {number} value2 - El valor de la propiedad del segundo Pokémon.
   * @param {number} maxValue - Máximo valor posible para cualquier propiedad (por defecto es 255).
   * @returns {number} - La probabilidad calculada en un rango del 30% al 75%.
   */
  #balancedProbabilitySystem(value1, value2, maxValue = 255) {
    if (value2 === value1) return 50;

    // Calcular los porcentajes relativos al valor máximo
    const valuePercent2 = (value2 / maxValue) * 100;
    const valuePercent1 = (value1 / maxValue) * 100;

    // Calcular la probabilidad basada en la diferencia de porcentajes
    let probability = valuePercent1 - valuePercent2;

    // Ajustar la probabilidad para que esté en el rango de 30% a 75%
    probability = Math.max(30, Math.min(75, 50 + probability / 2)); // Ajuste para equilibrar

    return probability;
  }

  /**
   * Método para ejecutar un turno de ataque.
   * @param {Pokemon} attacker - El Pokémon que ataca.
   * @param {Pokemon} defender - El Pokémon que defiende.
   * @returns {boolean} - Indica si el defensor ha sido derrotado.
   */
  #executeTurn(attacker, defender) {
    // Determinar el tipo de ataque (normal o especial)
    const attackType = calculateProbability(30) ? "special" : "normal";
    const attackValue =
      attackType === "special"
        ? attacker.p.c.special_attack
        : attacker.p.c.attack;

    // Aplicar la debilidad
    let modifiedAttackValue = this.#applyWeaknessBonus(
      defender,
      attacker,
      attackValue
    );

    // Realizar el ataque
    if (attackType === "special") {
      attacker.specialAttack(modifiedAttackValue);
    } else {
      attacker.normalAttack(modifiedAttackValue);
    }

    // Optenemos la probabilidad de evasion.
    const evasionProbability = this.#balancedProbabilitySystem(
      defender.p.c.speed,
      attacker.p.c.speed
    );

    // console.error(defender.p.i.name, evasionProbability);

    // Verificar si el defensor NO está agotado y calcular la probabilidad de evasión
    if (!defender.isExhausted() && calculateProbability(evasionProbability)) {
      defender.evading(modifiedAttackValue);
    } else {
      // Aplicar la defensa correspondiente después de verificar la evasión
      if (attackType === "special") {
        defender.specialDefense(modifiedAttackValue);
      } else {
        defender.normalDefense(modifiedAttackValue);
      }
    }

    // Comprobar si el defensor ha sido derrotado
    if (defender.isDefeated()) {
      this.#pushConsoleLog(`${defender.p.i.name} ha sido derrotado`);
      return true;
    }

    return false;
  }

  /**
   * Método para iniciar la batalla.
   * Determina el primer atacante en función de la velocidad y continúa
   * alternando ataques hasta que uno de los Pokémon sea derrotado.
   */
  startBattle() {
    if (!this.pokemon1.battleData.isReady) this.pokemon1.resetStats();
    if (!this.pokemon2.battleData.isReady) this.pokemon2.resetStats();
    this.pokemon1.battleData.isReady = false;
    this.pokemon2.battleData.isReady = false;

    console.log("\n$ Inicio de la Batalla:\n");
    let firstAttacker = this.#determineAttacker(true);
    firstAttacker.battleData.isFirstAttacker = true;

    let secondAttacker =
      firstAttacker === this.pokemon1 ? this.pokemon2 : this.pokemon1;

    let battleOver = false;
    while (!battleOver) {
      // Primer atacante ataca
      battleOver = this.#executeTurn(firstAttacker, secondAttacker);
      if (battleOver) break;

      // Determinar el siguiente atacante
      firstAttacker = this.#determineAttacker();
      secondAttacker =
        firstAttacker === this.pokemon1 ? this.pokemon2 : this.pokemon1;
      // console.log("");
    }
    this.#saveBattleResult();
    this.showBattleResult();
    console.log(
      "\n-------------------------pokemon.log.history-------------------------"
    );
    console.log(this.pokemon1.log.history.join("\n"));
    console.log("-------------------------------------------------");
    console.log(this.pokemon2.log.history.join("\n"));
    console.log(
      "----------------------------------------------------------------------"
    );
  }

  /**
   * Método para mostrar el resultado final de la batalla.
   * Muestra gráficamente por consola los datos relevantes del resultado final de cada Pokémon.
   */
  showBattleResult() {
    console.log("\n$ Resultado Final de la Batalla:\n");
    this.pokemon1.state();
    console.log("");
    this.pokemon2.state();
  }

  #saveBattleResult() {
    // // Combinar los logs alternando los movimientos de cada Pokémon
    // const pokemon1Log = this.pokemon1.log.history;
    // const pokemon2Log = this.pokemon2.log.history;
    // const combinedLog = [];
    // const maxLength = Math.max(pokemon1Log.length, pokemon2Log.length);

    // for (let i = 0; i < maxLength; i++) {
    //   if (i < pokemon1Log.length) {
    //     combinedLog.push(pokemon1Log[i]);
    //   }
    //   if (i < pokemon2Log.length) {
    //     combinedLog.push(pokemon2Log[i]);
    //   }
    // }

    const battleResult = {
      // log: combinedLog.join("\n"),
      pokemon1: {
        name: this.pokemon1.p.i.name,
        type: this.pokemon1.p.i.type,
        stats: {
          hp: this.pokemon1.p.c.hp,
          attack: this.pokemon1.p.c.attack,
          special_attack: this.pokemon1.p.c.special_attack,
          defense: this.pokemon1.p.c.defense,
          special_defense: this.pokemon1.p.c.special_defense,
          speed: this.pokemon1.p.c.speed,
          fatigue: this.pokemon1.p.c.fatigue,
        },
      },
      pokemon2: {
        name: this.pokemon2.p.i.name,
        type: this.pokemon2.p.i.type,
        stats: {
          hp: this.pokemon2.p.c.hp,
          attack: this.pokemon2.p.c.attack,
          special_attack: this.pokemon2.p.c.special_attack,
          defense: this.pokemon2.p.c.defense,
          special_defense: this.pokemon2.p.c.special_defense,
          speed: this.pokemon2.p.c.speed,
          fatigue: this.pokemon2.p.c.fatigue,
        },
      },
      timestamp: new Date().toISOString(),
    };

    PokemonBattle.#data.battleHistory.push(battleResult);
  }
}

//todo:---------------------------------------------------------------------------------------------
//todo: Ejemplo de uso
//todo:---------------------------------------------------------------------------------------------

//* wishiwashi-Solo,caterpie,squirtle,mewtwo,eternatus,dragonite,finneon,hitmontop,scyther,weedle,charmander,Beedrill,Sandslash
const pokemonCollection = {
  wishiwashiSolo: new Pokemon(
    "Wishiwashi-Solo",
    ["Water"],
    45,
    20,
    25,
    20,
    25,
    40
  ),
  caterpie: new Pokemon("Caterpie", ["Bug"], 45, 30, 20, 35, 20, 45),

  weedle: new Pokemon("Weedle", ["Bug", "Poison"], 40, 35, 20, 30, 20, 50),

  charmander: new Pokemon("Charmander", ["Fire"], 39, 52, 60, 43, 50, 65),
  squirtle: new Pokemon("Squirtle", ["Water"], 44, 48, 50, 65, 64, 43),

  finneon: new Pokemon("Finneon", ["water"], 49, 49, 49, 56, 61, 66),
  beedrill: new Pokemon("Beedrill", ["Bug", "Poison"], 65, 90, 45, 40, 60, 75),

  sandslash: new Pokemon("Sandslash", ["Ground"], 75, 100, 45, 110, 55, 65),
  hitmontop: new Pokemon("Hitmontop", ["fighting"], 50, 95, 35, 95, 110, 70),

  scyther: new Pokemon("Scyther", ["Bug", "Flying"], 70, 110, 55, 80, 80, 105),
  dragonite: new Pokemon(
    "Dragonite",
    ["Dragon", "Flying"],
    91,
    134,
    100,
    95,
    100,
    80
  ),

  mewtwo: new Pokemon("Mewtwo", ["Psychic"], 106, 110, 154, 90, 90, 130),
  eternatus: new Pokemon(
    "Eternatus",
    ["Poison", "Dragon"],
    140,
    85,
    145,
    95,
    95,
    130
  ),

  a: new Pokemon("Test1", ["Water"], 30, 10, 20, 15, 20, 10),
  b: new Pokemon("Test2", ["Fire"], 30, 10, 20, 15, 20, 20),
};

let battle = new PokemonBattle(
  pokemonCollection.beedrill,
  pokemonCollection.sandslash
);

console.log("###INIT###");
battle.startBattle();
console.log("###END###");
// battle.startBattle();
// console.log("########");

// console.log("\n#Registro del resultado la ultima batalla:");
// console.log(PokemonBattle.getBattleLog(1).log);
// console.log("");
// console.log(PokemonBattle.getBattleLog(2).log);

// console.log(
//   pokemonCollection.charmander.isVulnerableTo(["water", "bug", "water"])
// );
