# Lista de tareas

## Actualizaciones Home

- [x] **1.** Traspasar el **div** `.filter-container` del codigo HTML al JS:

  - **Más información**: Si es posible, implementar esta actualización en el módulo [`PokemonDOMHandler.js`](content/pages/0/js/models/PokemonDOMHandler.js).

  ```HTML
  <div class="filter-container">
  ```

- [x] **2.** Implementar un filtro de búsqueda por nombre/id.

### Ideas

- [x] **1.** Implementar un sistema automático de evaluación de precio en monedas para cada Pokémon basado en sus propiedades más relevantes.

  - [x] **1.1** Al inicializar la clase [`PokemonManager`](content/pages/0/js/models/PokemonManager.js) mostrar ofertas aleatorias en los precios de algunos Pokémon.

  - [x] **1.2** Actualizar el modulo [`PokemonDOMHandler.js`](content/pages/0/js/models/PokemonDOMHandler.js) para mostrar los precios de cada Pokémon; Añadir su respectivo filtro de (Mayor/Menor) precio en el modulo [`PokemonFilter.js`](content/pages/0/js/models/PokemonFilter.js).

- [ ] **2.** Más detalles a implementar en las tarjetas Pokémon.

  - [ ] **2.1** Implementar insignias especiales por cada Pokémon por ejemplo -> Evolución máxima (MaxEvo), Legendario (Legendary), Mítico (Mythical) o/y Una insignia de evolución que muestre su número de evolución actual y cambie su estilo CSS según el progreso del Pokémon; Ejem: (50% de progreso = 2/4 evoluciones alcanzadas).

  - [X] **2.2** Crear un elemento PopUp de más información importante como (hp, attack, …), la información adicional se mostrara al pasar el cursor por encima de este.

- [ ] **3.** Implementar un sistema automático de paginación para la lista de todos los Pokémon.
