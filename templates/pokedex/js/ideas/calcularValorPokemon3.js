// Definir una función para calcular el valor de un Pokémon
function calcularValorPokemon(pokemon) {
  // Ponderaciones para cada propiedad (pueden ser ajustadas según su importancia relativa)
  const ponderacionEstadisticas = 0.2;
  const ponderacionTipo = 0.15;
  const ponderacionMovimientos = 0.15;
  const ponderacionExperiencia = 0.05;
  const ponderacionAlturaPeso = 0.05;
  const ponderacionTasaCaptura = 0.1;
  const ponderacionFelicidad = 0.05;
  const ponderacionLegendarioMítico = 0.1;
  const ponderacionTasaCrecimiento = 0.05;
  const ponderacionGenero = 0.05;
  const ponderacionHabitatGeneracion = 0.05;

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

  // Calcular el valor de movimientos (considerando la variedad y potencia de los movimientos)
  let valorMovimientos = pokemon.movimientos.length;

  // Calcular el valor de experiencia base
  let valorExperiencia = pokemon.experienciaBase;

  // Calcular el valor de altura y peso
  let valorAlturaPeso = pokemon.altura + pokemon.peso;

  // Calcular el valor de la tasa de captura
  let valorTasaCaptura = pokemon.tasaCaptura;

  // Calcular el valor de la felicidad base
  let valorFelicidad = pokemon.felicidadBase;

  // Calcular el valor si es legendario o mítico
  let valorLegendarioMítico = pokemon.isLegendary ? 50 : 0;
  valorLegendarioMítico += pokemon.isMythical ? 50 : 0;

  // Calcular el valor de la tasa de crecimiento
  let valorTasaCrecimiento = calcularValorTasaCrecimiento(
    pokemon.tasaCrecimiento
  );

  // Calcular el valor del género y diferencias de género
  let valorGenero = pokemon.genderRate !== -1 ? 10 : 0;
  valorGenero += pokemon.hasGenderDifferences ? 5 : 0;

  // Calcular el valor del hábitat y generación
  let valorHabitatGeneracion = calcularValorHabitatGeneracion(
    pokemon.habitat,
    pokemon.generacion
  );

  // Calcular el valor total ponderado
  let valorTotal =
    valorEstadisticas * ponderacionEstadisticas +
    valorTipo * ponderacionTipo +
    valorMovimientos * ponderacionMovimientos +
    valorExperiencia * ponderacionExperiencia +
    valorAlturaPeso * ponderacionAlturaPeso +
    valorTasaCaptura * ponderacionTasaCaptura +
    valorFelicidad * ponderacionFelicidad +
    valorLegendarioMítico * ponderacionLegendarioMítico +
    valorTasaCrecimiento * ponderacionTasaCrecimiento +
    valorGenero * ponderacionGenero +
    valorHabitatGeneracion * ponderacionHabitatGeneracion;

  return valorTotal;
}

// Función para calcular el valor de tipos de Pokémon (solo como ejemplo)
function calcularValorTipo(tipos) {
  return tipos.length * 10; // Solo como ejemplo
}

// Función para calcular el valor de la tasa de crecimiento (solo como ejemplo)
function calcularValorTasaCrecimiento(tasaCrecimiento) {
  // Aquí podrías implementar lógica más compleja para determinar la influencia de la tasa de crecimiento
  return tasaCrecimiento === "fast" ? 20 : 10; // Solo como ejemplo
}

// Función para calcular el valor del hábitat y generación (solo como ejemplo)
function calcularValorHabitatGeneracion(habitat, generacion) {
  // Aquí podrías implementar lógica más compleja para determinar la influencia del hábitat y la generación
  return 10; // Solo como ejemplo
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
  tasaCaptura: 45,
  felicidadBase: 70,
  isLegendary: false,
  isMythical: false,
  tasaCrecimiento: "medium",
  genderRate: 4,
  hasGenderDifferences: true,
  habitat: "montaña",
  generacion: "I",
};

console.log(calcularValorPokemon(ejemploPokemon));
