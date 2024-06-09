// Lista de debilidades de Pokémon
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

// Clase Pokemon
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
      copy: {
        hp: undefined,
        attack: undefined,
        special_attack: undefined,
        defense: undefined,
        special_defense: undefined,
        speed: undefined,
        fatigue: 0,
      },
    },
    battleData: {
      isFirstAttacker: undefined,
    },
    log: {
      moves: {
        attacks: { normal: 0, special: 0 },
        defenses: { normal: 0, special: 0 },
      },
      recovery: { fatigue: 0 },
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
    this.#data.properties.immutable.type = type;

    this.#data.properties.base.hp = hp;
    this.#data.properties.base.attack = attack;
    this.#data.properties.base.special_attack = special_attack;
    this.#data.properties.base.defense = defense;
    this.#data.properties.base.special_defense = special_defense;
    this.#data.properties.base.speed = speed;

    this.#data.properties.copy.hp = hp;
    this.#data.properties.copy.attack = attack;
    this.#data.properties.copy.special_attack = special_attack;
    this.#data.properties.copy.defense = defense;
    this.#data.properties.copy.special_defense = special_defense;
    this.#data.properties.copy.speed = speed;

    this.#initializeHotVariables();
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

  #isFirstAttacker() {
    if (this.battleData.isFirstAttacker) {
      this.battleData.isFirstAttacker = false;
      return true;
    } else {
      return false;
    }
  }

  #addNormalAttack() {
    this.log.moves.attacks.normal++;
    const fatigueIncrease = this.#isFirstAttacker() ? 0 : 5;
    this.p.c.fatigue += fatigueIncrease;
    this.#fatigueConsoleLog(fatigueIncrease, "+");
  }

  #addSpecialAttack() {
    this.log.moves.attacks.special++;
    const fatigueIncrease = this.#isFirstAttacker() ? 5 : 10;
    this.p.c.fatigue += fatigueIncrease;
    this.#fatigueConsoleLog(fatigueIncrease, "+");
  }

  #addNormalDefense() {
    this.log.moves.defenses.normal++;
    if (!this.isDefeated()) {
      const fatigueRecovery = 5;
      this.p.c.fatigue -= fatigueRecovery;
      this.log.recovery.fatigue += fatigueRecovery;
      this.#fatigueConsoleLog(fatigueRecovery, "-");
    }
  }

  #addSpecialDefense() {
    this.log.moves.defenses.special++;
  }

  #fatigueConsoleLog(value, operator) {
    if (value != 0)
      console.log(
        `   ${this.p.i.name}: Fatiga ${operator}${value} (${this.p.c.fatigue})`
      );
  }

  #attackConsoleLog(attackValue, attackType) {
    const attackMessage =
      attackType === "special" ? "Ataque especial" : "Ataque normal";
    console.log(
      `- ${this.p.i.name}: ${attackMessage}. Valor del ataque: ${attackValue}`
    );
  }

  /**
   * Registra el resultado de la defensa en la consola y actualiza los contadores de defensa.
   * @param {number} reducedDamage - La cantidad de daño reducida.
   * @param {string} defenseType - El tipo de defensa utilizada, puede ser "normal" o "special".
   */
  #defenseConsoleLog(reducedDamage, defenseType) {
    if (this.p.c.hp === 0) {
      console.log(`${this.p.i.name} No puedo soportar el ataque.`);
    } else {
      const defenseMessage =
        defenseType === "special" ? "Defensa especial" : "Defensa normal";
      console.log(
        `- ${this.p.i.name}: ${defenseMessage}. Daño reducido a ${reducedDamage}. HP restante: ${this.p.c.hp}/${this.p.b.hp}`
      );

      if (defenseType === "normal") {
        this.#addNormalDefense();
      } else {
        this.#addSpecialDefense();
      }
    }
  }

  //? Métodos para atacar

  normalAttack(attackValue) {
    this.#attackConsoleLog(attackValue, "normal");
    this.#addNormalAttack();
  }
  specialAttack(attackValue) {
    this.#attackConsoleLog(attackValue, "special");
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
    this.#defenseConsoleLog(reducedDamage, "normal");
    // } else if (this.p.c.special_defense > 0) {
    // this.specialDefense(reducedDamage);
    // reducedDamage = this.#reduce(damage, this.p.c.special_defense);
    // this.p.c.special_defense = this.#pcReduce("special_defense", damage);
    // this.p.c.hp = this.#pcReduce("hp", reducedDamage);
    // this.#defenseConsoleLog(reducedDamage, "special");
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
    this.#defenseConsoleLog(reducedDamage, "special");
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

  //? Oros metodos
  isDefeated() {
    return this.p.c.hp <= 0;
  }

  #getPercentOfProperty(nameProperty) {
    return Math.round((this.p.c[nameProperty] * 100) / this.p.b[nameProperty]);
  }

  state() {
    console.log(`${this.p.i.name}:`);
    console.log(`- HP: ${this.p.c.hp} (${this.#getPercentOfProperty("hp")}%)`);
    console.log(
      `- Defensa: ${this.p.c.defense} (${this.#getPercentOfProperty(
        "defense"
      )}%)`
    );
    console.log(
      `- Defensa Especial: ${
        this.p.c.special_defense
      } (${this.#getPercentOfProperty("special_defense")}%)`
    );
    console.log(`- Fatiga: ${this.p.c.fatigue}`);
    console.log(`- Recuperación de Fatiga: ${this.log.recovery.fatigue}`);
    console.log(`- Estado: ${this.isDefeated() ? "Derrotado" : "Ganador"}`);
    console.log(`- Movimientos Realizados:`);
    console.log(`  - Ataques Normales: ${this.log.moves.attacks.normal}`);
    console.log(`  - Ataques Especiales: ${this.log.moves.attacks.special}`);
    console.log(`  - Defensas Normales: ${this.log.moves.defenses.normal}`);
    console.log(`  - Defensas Especiales: ${this.log.moves.defenses.special}`);
  }
}

// Clase PokemonBattle
class PokemonBattle {
  constructor(pokemon1, pokemon2) {
    this.pokemon1 = pokemon1;
    this.pokemon2 = pokemon2;
  }

  /**
   * Método para determinar el Pokémon que atacará en este turno.
   * @param {boolean} isFirst - Indica si es la primera vez que se determina el atacante.
   * @returns {Pokemon} - El Pokémon que atacará en este turno.
   */
  #determineAttacker(isFirst = false) {
    // Diferencia de velocidad entre los Pokémon
    const speedDiff = this.pokemon1.p.c.speed - this.pokemon2.p.c.speed;

    if (isFirst) {
      // Si es la primera vez, el Pokémon más rápido ataca primero
      return speedDiff > 0
        ? this.pokemon1
        : speedDiff < 0
        ? this.pokemon2
        : Math.random() < 0.5
        ? this.pokemon1
        : this.pokemon2;
    } else {
      // Si no es la primera vez, se considera la fatiga y se introduce un factor de aleatoriedad
      if (this.pokemon1.p.c.fatigue < 0 || this.pokemon2.p.c.fatigue >= 30) {
        return this.pokemon1;
      } else if (
        this.pokemon2.p.c.fatigue < 0 ||
        this.pokemon1.p.c.fatigue >= 30
      ) {
        return this.pokemon2;
      }

      return speedDiff > 0
        ? Math.random() < 0.7
          ? this.pokemon1
          : this.pokemon2
        : speedDiff < 0
        ? Math.random() < 0.8
          ? this.pokemon2
          : this.pokemon1
        : Math.random() < 0.5
        ? this.pokemon1
        : this.pokemon2;
    }
  }

  /**
   * Método para verificar debilidades y aplicar daño adicional.
   * Si el defensor es débil contra alguno de los tipos del atacante,
   * existe un 50% de probabilidad de que el daño se multiplique por un
   * valor aleatorio entre 1.1 y 1.9.
   *
   * @param {Pokemon} defender - El Pokémon que recibe el ataque.
   * @param {Pokemon} attacker - El Pokémon que lanza el ataque.
   * @param {number} damage - La cantidad de daño del ataque.
   * @returns {number} - La cantidad de daño ajustada si hay una debilidad.
   */
  #applyWeaknessBonus(defender, attacker, damage) {
    const defenderTypes = defender.p.i.type.map((type) => type.toLowerCase());
    const attackerTypes = attacker.p.i.type.map((type) => type.toLowerCase());

    for (const defenderType of defenderTypes) {
      if (weaknesses[defenderType]) {
        for (const attackerType of attackerTypes) {
          if (weaknesses[defenderType].includes(attackerType)) {
            if (Math.random() < 0.5) {
              const multiplier = 1.1 + Math.random() * 0.8; // Rango de 1.1 a 1.9
              // console.log(
              //   `${defender.p.i.name} (Crítico * ${multiplier.toFixed(
              //     2
              //   )}): Débil contra ${attackerType}.`
              // );
              return damage * multiplier;
            }
          }
        }
      }
    }
    return damage;
  }

  // Método para ejecutar un turno de ataque
  #executeTurn(attacker, defender) {
    // Determinar el tipo de ataque (normal o especial)
    let attackType = Math.random() <= 0.3 ? "special" : "normal";
    let attackValue =
      attackType === "special"
        ? attacker.p.c.special_attack
        : attacker.p.c.attack;

    // Aplicar la debilidad
    attackValue = this.#applyWeaknessBonus(defender, attacker, attackValue);

    // Aplicar la defensa correspondiente
    if (attackType === "special") {
      attacker.specialAttack(attackValue);
      defender.specialDefense(attackValue);
    } else {
      attacker.normalAttack(attackValue);
      defender.normalDefense(attackValue);
    }

    // Comprobar si el defensor ha sido derrotado
    if (defender.isDefeated()) {
      console.log(`${defender.p.i.name} ha sido derrotado.`);
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
    console.log("\n# Iniio de la Batalla:\n");
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
      console.log("");
    }
    this.showBattleResult();
  }

  /**
   * Método para mostrar el resultado final de la batalla.
   * Muestra gráficamente por consola los datos relevantes del resultado final de cada Pokémon.
   */
  showBattleResult() {
    console.log("\n# Resultado Final de la Batalla:\n");
    this.pokemon1.state();
    console.log("");
    this.pokemon2.state();
  }
}

// Ejemplo de uso
const pokemonCollection = {
  caterpie: new Pokemon("Caterpie", ["Bug"], 45, 30, 20, 35, 20, 45),

  weedle: new Pokemon("Weedle", ["Bug", "Poison"], 40, 35, 20, 30, 20, 50),

  squirtle: new Pokemon("Squirtle", ["Water"], 44, 48, 50, 65, 64, 43),

  charmander: new Pokemon("Charmander", ["Fire"], 39, 52, 60, 43, 50, 65),

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
};

let battle = new PokemonBattle(
  pokemonCollection.squirtle,
  pokemonCollection.charmander
);
battle.startBattle();
