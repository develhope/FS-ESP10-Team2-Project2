# [Template Pokedex](templates/pokedex)

## Actualizaciones

- [x] **1.** Traspasar el **div** `.filter-container` del codigo HTML al JS:

  - **Más información**: Si es posible, implementar esta actualización en el módulo [`PokemonDOMHandler.js`](templates/pokedex/js/models/PokemonDataHandler.js).

  ```HTML
  <div class="filter-container">
  ```

### Ideas

- [x] **1.** Implementar un sistema automático de evaluación de precio en monedas para cada Pokémon basado en sus propiedades más relevantes.

  - [x] **1.1** Al inicializar la clase [`PokemonManager`](templates/pokedex/js/models/PokemonManager.js) mostrar ofertas aleatorias en los precios de algunos Pokémon.

  - [ ] **1.2** Actualizar el modulo [`PokemonDOMHandler.js`](templates/pokedex/js/models/PokemonDOMHandler.js) para mostrar los precios de cada Pokémon; Añadir su respectivo filtro de (Mayor/Menor) precio en el modulo [`PokemonFilter.js`](templates/pokedex/js/models/PokemonFilter.js).



  OJO CON ESTO EQUIPO!! Jugar SÓLO con las KEYS, NO CON LOS VALORES! Este código se encuentra en Carpeta JS->Models->PokemonData

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
