# [Template Pokedex](templates/pokedex)

## Actualizaciones

- [x] **1.** Traspasar el **div** `.filter-container` del codigo HTML al JS:

  - **Más información**: Si es posible, implementar esta actualización en el módulo [`PokemonDOMHandler.js`](templates/pokedex/js/models/PokemonDataHandler.js).

  ```HTML
  <div class="filter-container">
  ```

### Ideas

- [ ] **1.** Implementar un sistema automático de evaluación de precio en monedas para cada Pokémon basado en sus propiedades más relevantes.

  - [ ] **1.1** Al inicializar la clase [`PokemonManager`](templates/pokedex/js/models/PokemonManager.js) mostrar ofertas aleatorias en los precios de algunos Pokémon.

  - [ ] **1.2** Actualizar el modulo [`PokemonDOMHandler.js`](templates/pokedex/js/models/PokemonDOMHandler.js) para mostrar los precios de cada Pokémon; Añadir su respectivo filtro de (Mayor/Menor) precio en el modulo [`PokemonFilter.js`](templates/pokedex/js/models/PokemonFilter.js).
