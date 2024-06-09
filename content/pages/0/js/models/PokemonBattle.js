// Lista de debilidades de Pokémon
const weaknesses = {
  Steel: ["Fighting", "Fire", "Ground"],
  Water: ["Grass", "Electric"],
  Bug: ["Flying", "Fire", "Rock"],
  Dragon: ["Fairy", "Ice", "Dragon"],
  Electric: ["Ground"],
  Ghost: ["Ghost", "Dark"],
  Fire: ["Ground", "Water", "Rock"],
  Fairy: ["Steel", "Poison"],
  Ice: ["Fighting", "Steel", "Rock", "Fire"],
  Fighting: ["Psychic", "Flying", "Fairy"],
  Normal: ["Fighting"],
  Grass: ["Flying", "Bug", "Poison", "Ice", "Fire"],
  Psychic: ["Bug", "Ghost", "Dark"],
  Rock: ["Fighting", "Ground", "Steel", "Water", "Grass"],
  Dark: ["Fighting", "Fairy", "Bug"],
  Ground: ["Water", "Grass", "Ice"],
  Poison: ["Ground", "Psychic"],
  Flying: ["Rock", "Ice", "Electric"],
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

    this.initializeHotVariables();
  }

  initializeHotVariables() {
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
  }

  //? Sumar registro de movimientos
  addNormalAttack() {
    this.log.moves.attacks.normal++;
    this.p.c.fatigue += 5;

    // console.log(`${this.p.i.name} incrementa su fatiga a ${this.p.c.fatigue}`);
  }

  addSpecialAttack() {
    this.log.moves.attacks.special++;
    this.p.c.fatigue += 10;

    // console.log(`${this.p.i.name} incrementa su fatiga a ${this.p.c.fatigue}`);
  }

  addNormalDefense() {
    this.log.moves.defenses.normal++;
    const recoveryFatigue = 5;
    this.p.c.fatigue -= recoveryFatigue;
    this.log.recovery.fatigue += recoveryFatigue;
  }

  addSpecialDefense() {
    this.log.moves.defenses.special++;
  }

  //? Métodos para atacar
  normalAttack() {
    this.addNormalAttack();
    return {
      type: "normal",
      value: this.p.c.attack,
    };
  }

  specialAttack() {
    this.addSpecialAttack();
    return {
      type: "special",
      value: this.p.c.special_attack,
    };
  }

  //? Métodos para defenderse
  normalDefense(damage) {
    this.addNormalDefense();

    damage = Math.round(damage);

    let reducedDamage = damage - this.p.c.defense;
    this.p.c.defense -= damage;

    reducedDamage = reducedDamage > 0 ? reducedDamage : 0;
    this.p.c.hp -= reducedDamage;
    console.log(
      `${this.p.i.name}: Defensa normal. Daño reducido a ${reducedDamage}. HP restante: ${this.p.c.hp}`
    );
  }

  specialDefense(damage) {
    this.addSpecialDefense();

    damage = Math.round(damage);

    let reducedDamage = damage - this.p.c.special_defense;
    this.p.c.special_defense -= damage;

    reducedDamage = reducedDamage > 0 ? reducedDamage : 0;
    this.p.c.hp -= reducedDamage;
    console.log(
      `${this.p.i.name}: Defensa especial. Daño reducido a ${reducedDamage}. HP restante: ${this.p.c.hp}`
    );
  }

  isDefeated() {
    return this.p.c.hp <= 0;
  }

  state() {
    console.log(`${this.p.i.name}:`);
    console.log(`- HP: ${this.p.c.hp}`);
    console.log(`- Defensa: ${this.p.c.defense}`);
    console.log(`- Defensa Especial: ${this.p.c.special_defense}`);
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
  determineAttacker(isFirst = false) {
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
      if (this.pokemon1.p.c.fatigue < 0) {
        return this.pokemon1;
      } else if (this.pokemon2.p.c.fatigue < 0) {
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
  applyWeaknessBonus(defender, attacker, damage) {
    for (let defenderType of defender.p.i.type) {
      for (let attackerType of attacker.p.i.type) {
        if (
          weaknesses[defenderType] &&
          weaknesses[defenderType].includes(attackerType)
        ) {
          if (Math.random() < 0.5) {
            let multiplier = 1.1 + Math.random() * 0.8; // Rango de 1.1 a 1.9
            console.log(
              `${defender.p.i.name} (Crítico * ${multiplier.toFixed(
                2
              )}): Débil contra ${attackerType}.`
            );
            return damage * multiplier;
          }
        }
      }
    }
    return damage;
  }

  // Método para ejecutar un turno de ataque
  executeTurn(attacker, defender) {
    // Determinar el tipo de ataque (normal o especial)
    let attackType = Math.random() < 0.2 ? "special" : "normal";
    let attackValue =
      attackType === "special"
        ? attacker.specialAttack().value
        : attacker.normalAttack().value;

    console.log(
      `${attacker.p.i.name}: ${
        attackType === "special" ? "Ataque especial" : "Ataque normal"
      }. Valor del ataque: ${attackValue}`
    );

    // Aplicar la debilidad
    attackValue = this.applyWeaknessBonus(defender, attacker, attackValue);

    // Aplicar la defensa correspondiente
    if (attackType === "special") {
      defender.specialDefense(attackValue);
    } else {
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
    let firstAttacker = this.determineAttacker(true);
    let secondAttacker =
      firstAttacker === this.pokemon1 ? this.pokemon2 : this.pokemon1;

    let battleOver = false;
    while (!battleOver) {
      // Primer atacante ataca
      battleOver = this.executeTurn(firstAttacker, secondAttacker);
      if (battleOver) break;

      // Determinar el siguiente atacante
      firstAttacker = this.determineAttacker();
      secondAttacker =
        firstAttacker === this.pokemon1 ? this.pokemon2 : this.pokemon1;
    }
    this.showBattleResult();
  }

  /**
   * Método para mostrar el resultado final de la batalla.
   * Muestra gráficamente por consola los datos relevantes del resultado final de cada Pokémon.
   */
  showBattleResult() {
    console.log("\nResultado Final de la Batalla:\n");
    this.pokemon1.state();
    console.log("");
    this.pokemon2.state();
  }
}

// Ejemplo de uso
let squirtle = new Pokemon("1: Squirtle", ["Water"], 44, 48, 50, 65, 64, 43);
let charmander = new Pokemon("2: Charmander", ["Fire"], 39, 52, 60, 43, 50, 65);

let battle = new PokemonBattle(squirtle, charmander);
battle.startBattle();
