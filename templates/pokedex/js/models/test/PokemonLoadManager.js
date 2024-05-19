// import { PokemonLoadManager } from "../PokemonLoadManager.js";
const PokemonLoadManager = require("../PokemonLoadManager");

// Ejemplo de uso:
const pokemon = new PokemonLoadManager();
pokemon
  .initialize(10) // Numero de pokemon a cargar
  .then(() => {
    try {
      console.log(`Pokemon Totales: ${pokemon.list.length}`);
      console.log("#----------------------------#");

      // Test 1: Filtrar por tipo "bug" o "poison" (sin coincidencia exacta)
      let poke = pokemon.getPokemonByTypes(["bug", "poison"]);
      console.log(`Pokemon con tipo bug o poison Totales: ${poke.length}`);
      //   console.log(poke);

      console.log("------------------------------");

      // Test 2: Filtrar por tipo "bug" y "poison" (coincidencia exacta)
      poke = pokemon.getPokemonByTypes(["bug", "poison"], true);
      console.log(
        `Pokemon de tipo bug y poison exactamente Totales: ${poke.length}`
      );
      //   console.log(poke);

      console.log("------------------------------");

      // Test 3: Filtrar por tipo "poison" y "bug" (coincidencia exacta, orden invertido)
      poke = pokemon.getPokemonByTypes(["poison", "bug"], true);
      console.log(
        `Pokemon de tipo poison y bug exactamente Totales: ${poke.length}`
      );
      //   console.log(poke);

      console.log("------------------------------");

      // Test 4: Filtrar por tipo "BUG" y "POISON" (coincidencia exacta, insensible a mayúsculas/minúsculas)
      poke = pokemon.getPokemonByTypes(["BUG", "POISON"], true);
      console.log(
        `Pokemon de tipo BUG y POISON exactamente Totales: ${poke.length}`
      );
      //   console.log(poke);

      console.log("------------------------------");

      // Test 5: Filtrar por tipo "bug" (sin coincidencia exacta)
      poke = pokemon.getPokemonByTypes(["bug"]);
      console.log(`Pokemon con tipo bug Totales: ${poke.length}`);
      //   console.log(poke);

      console.log("------------------------------");

      // Test 6: Filtrar por tipo "flying" (sin coincidencia exacta)
      poke = pokemon.getPokemonByTypes(["flying"]);
      console.log(`Pokemon con tipo flying Totales: ${poke.length}`);
      //   console.log(poke);

      console.log("------------------------------");

      // Test 7: Filtrar por tipo "flying" y "poison" (coincidencia exacta)
      poke = pokemon.getPokemonByTypes(["flying", "poison"], true);
      console.log(
        `Pokemon de tipo flying y poison exactamente Totales: ${poke.length}`
      );
      //   console.log(poke);

      console.log("------------------------------");

      // Test 8: Filtrar por tipo "electric" (sin coincidencia exacta)
      poke = pokemon.getPokemonByTypes(["electric"]);
      console.log(`Pokemon con tipo electric Totales: ${poke.length}`);
      //   console.log(poke);

      console.log("------------------------------");

      // Test 9: Filtrar por todos los tipos ("all")
      poke = pokemon.getPokemonByTypes(["all"]);
      console.log(`Pokemon de todos los tipos Totales: ${poke.length}`);
      //   console.log(poke);

      console.log("------------------------------");
    } catch (error) {
      console.error("Error durante el uso del PokemonLoadManager:", error);
    }
  })
  .catch((error) => {
    console.error("Error al inicializar el PokemonLoadManager:", error);
  });
