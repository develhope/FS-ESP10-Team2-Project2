//? Libreria personal de utilidades
//! Import Normal
import _ from "../../../assets/general/js/lib/utilities.js";

//! Import Node.js
// const { _ } = require("../../../assets/general/js/lib/utilities.js");

//todo:---------------------------------------------------------------------------------------------
//todo:---------------------------------------------------------------------------------------------
//todo: Clase Pokemon
//todo:---------------------------------------------------------------------------------------------
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
    inInventory: { id: undefined, alias: undefined, isEquipped: false },

    // moreInformation: {},
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
    // Convierte la primera letra a mayúsculas y las demás a minúsculas
    this.#data.properties.immutable.name = _.str.capitalize(name);
    // Convierte todos los tipos a minusculas
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
    this.inInventory = this.#data.inInventory;
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
    this.#fatigueLog(_.num.getRandomNum(1, 3), "+");
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

  //!#isRecovered
  //? Mas adelante creare un sistema de enfriamiendo de los Pokemon
  //            //
  isRecovered() {
    //* (Provisional) En desuso, seguramente usare un timeOut en vez de HP, ya que este ultimo no me convence
    return this.#getPercentOfProperty("hp") >= 90;
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
   * Muestra el resultado de la ultima batalla del Pokémon, incluyendo sus estadísticas y movimientos realizados.
   */
  lastResult() {
    const iName = this.p.i.name;
    const cHP = this.p.c.hp;
    const bHP = this.p.b.hp;

    const cDefense = this.p.c.defense;
    const bDefense = this.p.b.defense;

    const cSpecial_defense = this.p.c.special_defense;
    const bSpecial_defense = this.p.b.special_defense;

    const cFatigue = this.p.c.fatigue;

    const log = this.log;

    //? Porcentaje Copia -> HP, defense, special_defense
    const pcHP = this.#getPercentOfProperty("hp");
    const pcDefense = this.#getPercentOfProperty("defense");
    const pcSpecial_defense = this.#getPercentOfProperty("special_defense");

    console.log(`${iName}: (${this.isDefeated() ? "Derrotado" : "Ganador"})`);
    console.log(`- HP: ${cHP}/${bHP} (${pcHP}%)`);
    console.log(`- Defensa: ${cDefense}/${bDefense} (${pcDefense}%)`);
    console.log(
      `- Defensa Especial: ${cSpecial_defense}/${bSpecial_defense} (${pcSpecial_defense}%)`
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

  /**
   * Muestra las estadisticas actuales del Pokemon y su estado.
   */
  stats() {
    const iName = this.p.i.name;

    const cHP = this.p.c.hp;
    const cAttack = this.p.c.attack;
    const cSpecial_attack = this.p.c.special_attack;
    const cDefense = this.p.c.defense;
    const cSpecial_defense = this.p.c.special_defense;
    const cSpeed = this.p.c.speed;

    //1/ Ir al codigo `!#isRecovered`
    // console.log(
    //   `(${this.isRecovered() ? `Recuperado al ${pcHP}%` : "En Recuperación"})`
    // );

    const totalPower =
      cHP + cAttack + cSpecial_attack + cDefense + cSpecial_defense + cSpeed;

    console.log(`${iName}`);
    console.log(`- Poder Total: ${totalPower}`);
    console.log(`- HP: ${cHP}`);
    console.log(`- Ataque: ${cAttack} `);
    console.log(`- Ataque Especial: ${cSpecial_attack}`);
    console.log(`- Defensa: ${cDefense} `);
    console.log(`- Defensa Especial: ${cSpecial_defense}`);
    console.log(`- velocidad: ${cSpeed}`);
  }

  get alias() {
    return this.inInventory.alias ? this.inInventory.alias : "";
  }

  get nameFull() {
    return `${this.p.i.name} #${this.inInventory.id}${
      this.alias ? ` (${this.alias})` : ""
    }`;
  }
}

//todo:---------------------------------------------------------------------------------------------
//todo:---------------------------------------------------------------------------------------------
//todo: Clase PokemonBattle
//todo:---------------------------------------------------------------------------------------------
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
      return _.bool.isProbable(50) ? pokemon1 : pokemon2;
    }

    // Verificar condiciones de agotamiento
    if (pokemon1.isExhausted() && pokemon2.isExhausted()) {
      this.#pushConsoleLog(
        `Ambos Pokémon están agotados, cualquiera puede atacar.`
      );
      return _.bool.isProbable(50) ? pokemon1 : pokemon2;
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

    this.#pushConsoleLog(
      `Cualquiera puede atacar, aunque ${
        maxSpeedPokemon.p.i.name
      } tiene un ${Math.round(probability)}% más de probabilidad.`
    );

    // Para que no se pase de ventaja establecemos como mínimo 60% de probabilidad para lanzar un ataque.
    return _.bool.isProbable(probability) ? maxSpeedPokemon : minSpeedPokemon;
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
      if (_.bool.isProbable(50)) {
        const multiplier = _.num.getRandomNum(1.1, 2, true); // Rango de 1.1 a 2

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

    // Ajustar la probabilidad para que esté en el rango de 5% a 95%
    probability = Math.max(5, Math.min(95, 50 + probability / 2)); // Ajuste para equilibrar

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
    const attackType = _.bool.isProbable(30) ? "special" : "normal";
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
    if (!defender.isExhausted() && _.bool.isProbable(evasionProbability)) {
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
    this.#timeOfEvaluation();

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
    // console.log(
    //   "\n-------------------------pokemon.log.history-------------------------"
    // );
    // console.log(this.pokemon1.log.history.join("\n"));
    // console.log("-------------------------------------------------");
    // console.log(this.pokemon2.log.history.join("\n"));
    // console.log(
    //   "----------------------------------------------------------------------"
    // );
  }

  /**
   * Método para mostrar el resultado final de la batalla.
   * Muestra gráficamente por consola los datos relevantes del resultado final de cada Pokémon.
   */
  showBattleResult() {
    console.log("\n$ Resultado Final de la Batalla:\n");
    this.pokemon1.lastResult();
    console.log("");
    this.pokemon2.lastResult();
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

  // (Momento friki) Referencia a Millo jiji
  /**
   * Método privado para evaluar y comparar las estadísticas de ambos Pokémon en la batalla.
   * Compara HP, ataque, ataque especial, defensa, defensa especial y velocidad.
   * Imprime los resultados de la evaluación en la consola de una forma visual y fácil de leer.
   */
  #timeOfEvaluation() {
    const poke1 = this.pokemon1;
    const poke2 = this.pokemon2;
    const poke1Name = poke1.p.i.name;
    const poke2Name = poke2.p.i.name;

    console.log("Momento de evaluación:");

    const poke1VulnerableTo = poke1.isVulnerableTo(poke2.p.i.type);
    const poke2VulnerableTo = poke2.isVulnerableTo(poke1.p.i.type);

    if (poke1VulnerableTo) {
      console.log(
        `${poke1Name} es vulnerable a los tipos de ataque de ${poke2Name}: ${poke1VulnerableTo.join(
          ", "
        )}`
      );
    } else {
      console.log(
        `${poke1Name} no es vulnerable a los tipos de ataque de ${poke2Name}.`
      );
    }

    if (poke2VulnerableTo) {
      console.log(
        `${poke2Name} es vulnerable a los tipos de ataque de ${poke1Name}: ${poke2VulnerableTo.join(
          ", "
        )}`
      );
    } else {
      console.log(
        `${poke2Name} no es vulnerable a los tipos de ataque de ${poke1Name}.`
      );
    }

    if (poke1VulnerableTo && poke2VulnerableTo) {
      console.log(
        "Ambos tiene una ventaja sobre la vulnerabilidad de cada tipo."
      );
    } else if (poke1VulnerableTo && !poke2VulnerableTo) {
      console.log(
        `${poke2Name} tiene ventaja porque ${poke1Name} es vulnerable a sus ataques.`
      );
    } else if (poke2VulnerableTo && !poke1VulnerableTo) {
      console.log(
        `${poke1Name} tiene ventaja porque ${poke2Name} es vulnerable a sus ataques.`
      );
    } else {
      console.log(
        "Ninguno de los Pokémon tiene una ventaja clara basada en la vulnerabilidad de tipos."
      );
    }

    console.log("\nComparación de estadísticas:");

    const stats = [
      { name: "HP", key: "hp" },
      { name: "Ataque", key: "attack" },
      { name: "Ataque Especial", key: "special_attack" },
      { name: "Defensa", key: "defense" },
      { name: "Defensa Especial", key: "special_defense" },
      { name: "Velocidad", key: "speed" },
    ];

    stats.forEach((stat) => {
      const poke1Stat = poke1.p.c[stat.key];
      const poke2Stat = poke2.p.c[stat.key];
      const difference = poke1Stat - poke2Stat;

      if (difference > 0) {
        console.log(`${poke1Name} +${difference} ${stat.name}`);
      } else if (difference < 0) {
        console.log(`${poke2Name} +${-difference} ${stat.name}`);
      } else {
        console.log(
          `Ambos ${poke1Name} y ${poke2Name} tienen los mismos puntos de ${stat.name}`
        );
      }
    });
  }
}

//todo:---------------------------------------------------------------------------------------------
//todo:---------------------------------------------------------------------------------------------
//todo: Clase PokemonInventory
//todo:---------------------------------------------------------------------------------------------
//todo:---------------------------------------------------------------------------------------------
class PokemonInventory {
  #inventory = [];

  constructor(loadLocalStorage = false) {
    if (loadLocalStorage) this.loadFromLocalStorage();
  }

  /**
   * Devuelve el último ID del inventario.
   * @returns {number} El último ID del inventario o `0` si el inventario está vacío.
   */
  get lastID() {
    if (this.#inventory.length === 0) {
      return 0;
    }
    return this.#inventory[this.#inventory.length - 1].inInventory.id;
  }

  log(log, isError = false) {
    isError ? console.error(`#! ${log}`) : console.log(`# ${log}`);
  }

  /**
   * Añade uno o más Pokémon al inventario.
   * @param {Pokemon|Pokemon[]} pokemonList - Una instancia o un array de instancias de la clase Pokemon.
   * @param {string} [customAlias] - El alias personalizado para el Pokémon. Solo aplica si se añade un solo Pokémon.
   */
  addPokemon(pokemonList, customAlias) {
    if (!Array.isArray(pokemonList)) {
      pokemonList = [pokemonList];
    }

    if (pokemonList.length > 1 && customAlias) {
      this.log(
        "No se puede establecer un alias personalizado cuando se añaden múltiples Pokémon. Se usarán alias automáticos.",
        true
      );
      customAlias = null;
    }

    pokemonList.forEach((pokemon) => {
      if (pokemon instanceof Pokemon) {
        // Asignar un ID único
        pokemon.inInventory.id = this.lastID + 1;

        // let alias = customAlias || `My ${pokemon.p.i.name}`;
        let alias = customAlias || undefined;
        if (customAlias) {
          let existingAliases = this.#inventory.filter(
            (p) =>
              p.inInventory.alias && p.inInventory.alias.startsWith(customAlias)
          ).length;

          if (existingAliases > 0) {
            alias = `${customAlias}.${existingAliases + 1}`;
          }
        } else {
          // let existingAliases = this.#inventory.filter(
          //   (p) => p.inInventory.alias && p.inInventory.alias.startsWith(alias)
          // ).length;
          // if (existingAliases > 0) {
          //   alias = `${alias} ${existingAliases + 1}`;
          // }
        }

        pokemon.inInventory.alias = alias;
        this.#inventory.push(pokemon);
        if (pokemon.inInventory.alias) {
          this.log(
            `${pokemon.p.i.name} (ID: ${pokemon.inInventory.id}) ha sido añadido al inventario con el alias "${pokemon.inInventory.alias}".`
          );
        } else {
          this.log(
            `${pokemon.p.i.name} (ID: ${pokemon.inInventory.id}) ha sido añadido al inventario sin alias.`
          );
        }
      } else {
        this.log("Solo se pueden añadir instancias de la clase Pokemon.", true);
      }
    });
  }

  /**
   * Cambia el alias de un Pokémon en el inventario.
   * @param {string|number} identifier - El alias actual o ID del Pokémon.
   * @param {string} newAlias - El nuevo alias para el Pokémon.
   */
  changeAlias(identifier, newAlias) {
    const pokemon = this.getPokemon(identifier);
    if (pokemon) {
      if (
        this.#inventory.some((p) => p.inInventory.alias === newAlias) &&
        pokemon.inInventory.alias !== newAlias
      ) {
        this.log(
          `El alias "${newAlias}" ya está en uso por otro Pokémon.`,
          true
        );
        return;
      }
      const oldAlias = pokemon.inInventory.alias;
      pokemon.inInventory.alias = newAlias;
      this.log(
        `El alias del Pokémon "${oldAlias}" ha sido cambiado a "${newAlias}".`
      );
    }
  }

  /**
   * Elimina uno o más Pokémon del inventario por su nombre o ID.
   * Si no se proporciona ningún parámetro, elimina todos los Pokémon.
   * @param {string|number|(string|number)[]} [identifiers] - El alias, ID, o un array mezclado de alias e IDs de los Pokémon a eliminar. Si no se proporciona, elimina todos los Pokémon.
   */
  delPokemon(identifiers) {
    if (identifiers === undefined) {
      const allPokemon = this.#inventory.map(
        (pokemon) => `[ ${pokemon.nameFull} ]`
      );
      this.#inventory = [];
      this.log(
        `Se eliminaron todos los Pokémon del inventario: ${allPokemon.join(
          ", "
        )}.`
      );
      return;
    }

    if (!Array.isArray(identifiers)) {
      identifiers = [identifiers];
    }

    const toRemove = new Set();

    // Convertir alias a IDs
    identifiers.forEach((identifier) => {
      if (typeof identifier === "string") {
        const index = this.#inventory.findIndex(
          (pokemon) => pokemon.inInventory.alias === identifier
        );
        if (index !== -1) {
          toRemove.add(index);
        } else {
          this.log(
            `No se encontró un Pokémon con el alias "${identifier}" en el inventario.`,
            true
          );
        }
      } else if (typeof identifier === "number") {
        const index = this.#inventory.findIndex(
          (pokemon) => pokemon.inInventory.id === identifier
        );
        if (index !== -1) {
          toRemove.add(index);
        } else {
          this.log(
            `No se encontró un Pokémon con el ID "${identifier}" en el inventario.`,
            true
          );
        }
      } else {
        this.log("Identificador no válido. Debe ser un nombre o un ID.", true);
      }
    });

    // Eliminar Pokémon por índices
    const removedPokemon = [];
    [...toRemove]
      .sort((a, b) => b - a)
      .forEach((index) => {
        const removed = this.#inventory.splice(index, 1)[0];
        removedPokemon.push(`[ ${removed.nameFull} ]`);
      });

    if (removedPokemon.length) {
      this.log(
        `Se eliminaron del inventario los siguientes Pokémon: ${removedPokemon.join(
          ", "
        )}.`
      );
    }
  }

  /**
   * Equipa un Pokémon en el inventario.
   * @param {string|number} identifier - El alias o ID del Pokémon a equipar.
   */
  equipPokemon(identifier) {
    let pokemonToEquip = null;

    if (typeof identifier === "number") {
      pokemonToEquip = this.#inventory.find(
        (pokemon) => pokemon.inInventory.id === identifier
      );
    } else if (typeof identifier === "string") {
      pokemonToEquip = this.#inventory.find(
        (pokemon) => pokemon.inInventory.alias === identifier
      );
    }

    if (!pokemonToEquip) {
      this.log(
        `No se encontró un Pokémon con el ${
          typeof identifier === "number" ? "ID" : "alias"
        } "${identifier}" en el inventario.`,
        true
      );
      return;
    }

    this.#inventory.forEach((pokemon) => {
      if (pokemon.inInventory.isEquipped) {
        pokemon.inInventory.isEquipped = false;
        this.log(`${pokemon.nameFull} ha sido desequipado.`);
      }
    });

    pokemonToEquip.inInventory.isEquipped = true;
    this.log(`${pokemonToEquip.nameFull} ha sido equipado.`);
  }

  /**
   * Muestra todos los Pokémon en el inventario.
   */
  showInventory() {
    console.log("");
    if (this.#inventory.length === 0) {
      this.log("El inventario está vacío.");
    } else {
      this.log("Inventario de Pokémon:");
      this.#inventory.forEach((poke) => {
        console.log(
          `Pokemon #${poke.inInventory.id}${
            poke.inInventory.alias ? ` (${poke.inInventory.alias})` : ""
          }:`
        );
        poke.stats();
        console.log("");
      });
    }
  }

  /**
   * Obtiene uno o más Pokémon por su alias, ID, o devuelve todos los Pokémon.
   * @param {string|number} [identifier] - El alias, ID del Pokémon, "*" para todos, o undefined para el último añadido. Importante: Como los alias se pueden repetir, si el `identifier` contiene un alias repetido, solamente se devolvera el primer Pokémon que contenga ese alias
   * @returns {Pokemon|Pokemon[]|null} El Pokémon encontrado, un array de Pokémon, o null si no se encuentra.
   */
  getPokemon(identifier) {
    if (identifier === undefined) {
      if (this.#inventory.length > 0) {
        return this.#inventory[this.#inventory.length - 1];
      } else {
        this.log("El inventario está vacío.", true);
        return null;
      }
    }

    if (typeof identifier === "string") {
      if (identifier === "*") {
        return this.#inventory;
      }

      const pokemon = this.#inventory.find(
        (pokemon) => pokemon.inInventory.alias === identifier
      );
      if (pokemon) {
        return pokemon;
      } else {
        this.log(
          `No se encontró un Pokémon con el alias "${identifier}" en el inventario.`,
          true
        );
        return null;
      }
    } else if (typeof identifier === "number") {
      const pokemon = this.#inventory.find(
        (pokemon) => pokemon.inInventory.id === identifier
      );
      if (pokemon) {
        return pokemon;
      } else {
        this.log(
          `No se encontró un Pokémon con el ID "${identifier}" en el inventario.`,
          true
        );
        return null;
      }
    } else {
      this.log(
        "El identificador debe ser un nombre (string) o un ID (number).",
        true
      );
      return null;
    }
  }

  /**
   * Guarda el inventario en el local storage.
   */
  saveToLocalStorage() {
    const mappedInventory = this.#inventory.map((poke) => ({
      values: [
        poke.p.i.name,
        poke.p.i.type,
        poke.p.b.hp,
        poke.p.b.attack,
        poke.p.b.special_attack,
        poke.p.b.defense,
        poke.p.b.special_defense,
        poke.p.b.speed,
      ],
      inInventory: poke.inInventory,
    }));

    _.DOM.saveToLocalStorage("inventory", mappedInventory);

    this.log("Inventario guardado en localStorage.");
  }

  /**
   * Obtiene el inventario del local storage.
   */
  loadFromLocalStorage() {
    const parsedInventory = _.DOM.getFromLocalStorage("inventory");
    if (parsedInventory) {
      this.#inventory = parsedInventory.map((poke) => {
        const pokemon = new Pokemon(
          poke.values[0],
          poke.values[1],
          poke.values[2],
          poke.values[3],
          poke.values[4],
          poke.values[5],
          poke.values[6],
          poke.values[7]
        );
        pokemon.inInventory = poke.inInventory;
        return pokemon;
      });
      this.log("Inventario cargado desde localStorage.");
    } else {
      this.log("No se encontró un inventario en localStorage.");
    }
  }
}

// // transferir información del objeto Pokémon original
// function transferPokemon(pokemonData) {
//   const myInventory = new PokemonInventory();

//   const pokemon = new Pokemon(
//     pokemonData.name,
//     pokemonData.type,
//     pokemonData.statistics.hp,
//     pokemonData.statistics.attack,
//     pokemonData.statistics.special_attack,
//     pokemonData.statistics.defense,
//     pokemonData.statistics.special_defense,
//     pokemonData.statistics.speed
//   );

//   myInventory.addPokemon(pokemon);

//   const inventory = myInventory
//     .getPokemon("*")
//     .map((i) => [i.p.i.name, i.inInventory]);

//   return inventory;
// }

//! Export Normal
export { Pokemon, PokemonBattle, PokemonInventory };

//todo:---------------------------------------------------------------------------------------------
//todo: Ejemplo de uso
//todo:---------------------------------------------------------------------------------------------

//* wishiwashi-Solo,caterpie,squirtle,mewtwo,eternatus,dragonite,finneon,hitmontop,scyther,weedle,charmander,Beedrill,Sandslash
// const pokemonCollection = {
//   wishiwashiSolo: new Pokemon(
//     "Wishiwashi-Solo",
//     ["Water"],
//     45,
//     20,
//     25,
//     20,
//     25,
//     40
//   ),
//   caterpie: new Pokemon("Caterpie", ["Bug"], 45, 30, 20, 35, 20, 45),

//   weedle: new Pokemon("Weedle", ["Bug", "Poison"], 40, 35, 20, 30, 20, 50),

//   charmander: new Pokemon("Charmander", ["Fire"], 39, 52, 60, 43, 50, 65),
//   squirtle: new Pokemon("Squirtle", ["Water"], 44, 48, 50, 65, 64, 43),

//   finneon: new Pokemon("Finneon", ["water"], 49, 49, 49, 56, 61, 66),
//   beedrill: new Pokemon("Beedrill", ["Bug", "Poison"], 65, 90, 45, 40, 60, 75),

//   sandslash: new Pokemon("Sandslash", ["Ground"], 75, 100, 45, 110, 55, 65),
//   hitmontop: new Pokemon("Hitmontop", ["fighting"], 50, 95, 35, 95, 110, 70),

//   scyther: new Pokemon("Scyther", ["Bug", "Flying"], 70, 110, 55, 80, 80, 105),
//   dragonite: new Pokemon(
//     "Dragonite",
//     ["Dragon", "Flying"],
//     91,
//     134,
//     100,
//     95,
//     100,
//     80
//   ),

//   mewtwo: new Pokemon("Mewtwo", ["Psychic"], 106, 110, 154, 90, 90, 130),
//   eternatus: new Pokemon(
//     "Eternatus",
//     ["Poison", "Dragon"],
//     140,
//     85,
//     145,
//     95,
//     95,
//     130
//   ),

//   a: new Pokemon("Test1", ["Water"], 50, 10, 20, 15, 20, 255),
//   b: new Pokemon("Test2", ["Fire"], 255, 10, 20, 15, 20, 1),
// };

//* Test PokemonBattle
// // const battle = new PokemonBattle(pokemonCollection.a, pokemonCollection.b);

// // console.log("###INIT###");
// // battle.startBattle();
// // console.log("###END###");

// //! En desarollo (Experimental)
// // console.log("\n#Registro del resultado la ultima batalla:");
// // console.log(PokemonBattle.getBattleLog());
// // console.log(PokemonBattle.getBattleLog(1).log);

// //* Test PokemonInventory
// const myInventory = new PokemonInventory();

// console.log("###INIT###\n");

// // myInventory.addPokemon([
// //   new Pokemon("Dragonite", ["Dragon", "Flying"], 91, 134, 100, 95, 100, 80),
// //   new Pokemon("Eternatus", ["Poison", "Dragon"], 140, 85, 145, 95, 95, 130),
// //   new Pokemon("Eternatus", ["Poison", "Dragon"], 140, 85, 145, 95, 95, 130),
// //   new Pokemon("Eternatus", ["Poison", "Dragon"], 140, 85, 145, 95, 95, 130),
// // ]);

// // myInventory.showInventory();

// // myInventory.delPokemon(["My Eternatus 2", 3]);

// // myInventory.showInventory();

// // console.log(myInventory.getPokemon("My Dragonite"));

// // // Prueba de error
// // console.log(myInventory.getPokemon("Este alias no existe"));

// // //? Test PokemonBattle whit PokemonInventory
// // const battle = new PokemonBattle(
// //   myInventory.getPokemon(1),
// //   myInventory.getPokemon(4)
// // );

// // battle.startBattle();

// myInventory.addPokemon([
//   new Pokemon("Poke1", ["Dragon", "Flying"], 91, 134, 100, 95, 100, 80),
//   new Pokemon("Poke2", ["Poison", "Dragon"], 140, 85, 145, 95, 95, 130),
// ]);
// myInventory.addPokemon(
//   new Pokemon("Poke3", ["Dragon", "Flying"], 91, 134, 100, 95, 100, 80),
//   "My Poke1"
// );
// myInventory.addPokemon(
//   new Pokemon("Poke4", ["Dragon", "Flying"], 91, 134, 100, 95, 100, 80),
//   "My Poke1"
// );

// myInventory.showInventory();

// myInventory.equipPokemon(2);
// myInventory.equipPokemon(4);

// console.log(myInventory.getPokemon("*"));

// console.log("\n###END###");
