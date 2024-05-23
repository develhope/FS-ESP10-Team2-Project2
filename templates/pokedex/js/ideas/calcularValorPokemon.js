function calcularValorPokemon(pokemon) {
    // Definir pesos para cada propiedad
    const pesos = {
        estadisticas: 0.3,
        tipos: 0.2,
        movimientos: 0.2,
        experienciaBase: 0.1,
        formas: 0.1,
        alturaYPeso: 0.1
    };

    // Calcular puntaje de estadísticas base (sumando todas las estadísticas)
    const puntajeEstadisticas = pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);

    // Calcular puntaje de tipos (sumando la eficacia de los tipos contra otros tipos)
    const puntajeTipos = pokemon.types.reduce((total, tipo) => {
        // Aquí podrías implementar la lógica para calcular la eficacia de los tipos contra otros tipos
        return total + 1; // Por ahora, solo sumamos uno por cada tipo
    }, 0);

    // Calcular puntaje de movimientos (sumando la potencia de los movimientos)
    const puntajeMovimientos = pokemon.moves.reduce((total, movimiento) => {
        return total + movimiento.power || 0; // Si el movimiento no tiene potencia, se considera como 0
    }, 0);

    // Otros cálculos similares para las otras propiedades...

    // Calcular puntaje total sumando los puntajes ponderados por los pesos
    const puntajeTotal = 
        puntajeEstadisticas * pesos.estadisticas +
        puntajeTipos * pesos.tipos +
        puntajeMovimientos * pesos.movimientos +
        // Otros puntajes ponderados...
        // (puntajeExperienciaBase * pesos.experienciaBase) + 
        // (puntajeFormas * pesos.formas) + 
        // (puntajeAlturaYPeso * pesos.alturaYPeso);

    return puntajeTotal;
}

// Ejemplo de uso:
const ejemploPokemon = {
    stats: [
        { base_stat: 80 }, // HP
        { base_stat: 100 }, // Ataque
        { base_stat: 70 }, // Defensa
        // Otros stats...
    ],
    types: [
        { type: { name: 'fire' } },
        { type: { name: 'flying' } }
        // Otros tipos...
    ],
    moves: [
        { power: 80 },
        { power: 60 },
        // Otros movimientos...
    ],
    // Otras propiedades del Pokémon...
};

const valorPokemon = calcularValorPokemon(ejemploPokemon);
console.log("Valor del Pokémon:", valorPokemon);
