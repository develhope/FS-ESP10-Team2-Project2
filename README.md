# Home

## Actualizaciones

- [x] **1.** Traspasar el **div** `.filter-container` del codigo HTML al JS:

  - **Más información**: Si es posible, implementar esta actualización en el módulo [`PokemonDOMHandler.js`](templates/pokedex/js/models/PokemonDataHandler.js).

  ```HTML
  <div class="filter-container">
  ```

### Ideas

- [x] **1.** Implementar un sistema automático de evaluación de precio en monedas para cada Pokémon basado en sus propiedades más relevantes.

  - [x] **1.1** Al inicializar la clase [`PokemonManager`](templates/pokedex/js/models/PokemonManager.js) mostrar ofertas aleatorias en los precios de algunos Pokémon.

  - [x] **1.2** Actualizar el modulo [`PokemonDOMHandler.js`](templates/pokedex/js/models/PokemonDOMHandler.js) para mostrar los precios de cada Pokémon; Añadir su respectivo filtro de (Mayor/Menor) precio en el modulo [`PokemonFilter.js`](templates/pokedex/js/models/PokemonFilter.js).

  - [ ] **1.3** Implementar un filtro de búsqueda por nombre.

  - [ ] **1.4** Implementar insignias especiales por cada Pokémon por ejemplo -> Evolución máxima (MaxEvo), Legendario (Legendary), Mítico (Mythical).

- [ ] **2.** Implementar un sistema automático de paginación para la lista de todos los Pokémon.
