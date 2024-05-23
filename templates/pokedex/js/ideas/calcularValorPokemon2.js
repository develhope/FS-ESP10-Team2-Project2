// Definir una función para calcular el valor de un Pokémon
function calcularValorPokemon(pokemon) {
  // Ponderaciones para cada propiedad (pueden ser ajustadas según su importancia relativa)
  const ponderacionEstadisticas = 0.3;
  const ponderacionTipo = 0.2;
  const ponderacionMovimientos = 0.2;
  const ponderacionExperiencia = 0.1;
  const ponderacionAlturaPeso = 0.1;
  const ponderacionSprites = 0.05;
  const ponderacionSonidos = 0.05;

  // Calcular el valor de estadísticas base
  let valorEstadisticas =
    pokemon.hp +
    pokemon.ataque +
    pokemon.defensa +
    pokemon.ataqueEspecial +
    pokemon.defensaEspecial +
    pokemon.velocidad;

  // Calcular el valor de tipos
  let valorTipo = calcularValorTipo(pokemon.tipos);

  // Calcular el valor de movimientos (aquí se podría considerar la variedad y potencia de los movimientos)
  let valorMovimientos = pokemon.movimientos.length;

  // Calcular el valor de experiencia base
  let valorExperiencia = pokemon.experienciaBase;

  // Calcular el valor de altura y peso
  let valorAlturaPeso = pokemon.altura + pokemon.peso;

  // Calcular el valor de sprites y sonidos (aquí se podría considerar la variedad y calidad de los sprites y sonidos)
  let valorSprites = 1; // Consideramos que todos los Pokémon tienen sprites
  let valorSonidos = 1; // Consideramos que todos los Pokémon tienen sonidos

  // Calcular el valor total ponderado
  let valorTotal =
    valorEstadisticas * ponderacionEstadisticas +
    valorTipo * ponderacionTipo +
    valorMovimientos * ponderacionMovimientos +
    valorExperiencia * ponderacionExperiencia +
    valorAlturaPeso * ponderacionAlturaPeso +
    valorSprites * ponderacionSprites +
    valorSonidos * ponderacionSonidos;

  return valorTotal;
}

// Función para calcular el valor de tipos de Pokémon (solo como ejemplo)
function calcularValorTipo(tipos) {
  // Aquí podrías implementar lógica más compleja para determinar la influencia de los tipos en el valor del Pokémon
  //* Ejemplo si el Pokemon tiene un tipo mas raro (osea un tipo menos comun)
  return tipos.length * 10; // Solo como ejemplo
}

// Ejemplo de uso
const ejemploPokemon = {
  hp: 80,
  ataque: 100,
  defensa: 70,
  ataqueEspecial: 90,
  defensaEspecial: 80,
  velocidad: 95,
  tipos: ["Fuego", "Volador"],
  movimientos: ["Lanzallamas", "Tornado", "Avalancha"],
  experienciaBase: 200,
  altura: 15,
  peso: 500,
};

console.log(calcularValorPokemon(ejemploPokemon));
