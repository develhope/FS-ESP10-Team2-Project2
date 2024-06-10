# Lista de tareas

## Actualizaciones Home

- [x] **1.** Traspasar el **div** `.filter-container` del codigo HTML al JS:

  - **Más información**: Si es posible, implementar esta actualización en el módulo [`PokemonDOMHandler.js`](content/pages/0/js/models/PokemonDOMHandler.js).

  ```HTML
  <div class="filter-container">
  ```

- [x] **2.** Implementar un filtro de búsqueda por nombre/id.

- [ ] **3.** Implementar un sistema automático de paginación para la lista de todos los Pokémon.

### Ideas

- [x] **1.** Implementar un sistema automático de evaluación de precio en monedas para cada Pokémon basado en sus propiedades más relevantes.

  - [x] **1.1** Al inicializar la clase [`PokemonManager`](content/pages/0/js/models/PokemonManager.js) mostrar ofertas aleatorias en los precios de algunos Pokémon.

  - [x] **1.2** Actualizar el modulo [`PokemonDOMHandler.js`](content/pages/0/js/models/PokemonDOMHandler.js) para mostrar los precios de cada Pokémon; Añadir su respectivo filtro de (Mayor/Menor) precio en el modulo [`PokemonFilter.js`](content/pages/0/js/models/PokemonFilter.js).

- [ ] **2.** Más detalles a implementar en las tarjetas Pokémon.

  - [ ] **2.1** Implementar insignias especiales por cada Pokémon por ejemplo -> Evolución máxima (MaxEvo), Legendario (Legendary), Mítico (Mythical) o/y Una insignia de evolución que muestre su número de evolución actual y cambie su estilo CSS según el progreso del Pokémon; Ejem: (50% de progreso = 2/4 evoluciones alcanzadas).

  - [x] **2.2** Crear un elemento PopUp de más información importante como (hp, attack, …), la información adicional se mostrara al pasar el cursor por encima de este.

- [ ] **?.1** Crear un módulo de batalla básica para poder enfrentar a dos Pokémon (en principio solo se podrán enfrentar Pokémon que existan en el carrito de compra).

  - Más información: El sistema de batalla se ejecutará de la siguiente manera, utilizando estas propiedades de cada Pokémon: Propiedades normales (`HP`, `attack`, `special_attack`, `defense`, `special_defense`, `speed`) y Propiedades en combate (`fatigue`).

    - **Primer ataque**: El Pokémon con más velocidad (`speed`) será el primero en lanzar un ataque. Si ambos tienen los mismos puntos de velocidad, el primer ataque se decidirá aleatoriamente.

    - **Ataque**: Los ataques se turnarán, con un ataque por cada Pokémon en cada turno. Hay dos tipos de ataques: _ataque normal_ (`attack`) y _ataque especial_ (`special_attack`).

      - **Ataque Normal** (`attack`): Tiene una posibilidad del 80% de lanzarse, cuando la fatiga no supere un máximo de puntos establecido.

      - **Ataque Especial** (`special_attack`): Tiene una posibilidad del 20% de lanzarse, cuando la fatiga no supere un máximo de puntos establecido (necesita menos fatiga que el ataque normal para ejecutarse).

    - **Defensa**: Las defensas se ejecutarán cada vez que el Pokémon rival lance un ataque. Hay dos tipos de defensa: _defensa normal_ (`defense`) y _defensa especial_ (`special_defense`).

      - **Defensa Normal** (`defense`): Se ejecutará cada vez que reciba un _ataque normal_, siempre y cuando la fatiga no supere un máximo de puntos establecido (en principio, el mismo que para el _ataque normal_ o similar).

      - **Defensa Especial** (`special_defense`): Se ejecutará cada vez que reciba un _ataque especial_:, siempre y cuando la fatiga no supere un máximo de puntos establecido (en principio, el mismo que para el _ataque especial_: o similar).

  - **Puntos de Salud** (`HP`): El proceso de cálculo es el siguiente: `HP = HP - (attack - defense)` o `HP = HP - (special_attack - special_defense)`. Cuando los `HP` sean 0 o menores, el Pokémon estará fuera de combate.
