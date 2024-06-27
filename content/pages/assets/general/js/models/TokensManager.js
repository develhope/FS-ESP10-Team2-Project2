/**
 * Clase para administrar los Tokens del usuario.
 */
class TokensManager {
  // Variable privada local para almacenar todos los tokens del usuario
  #tokens = 0;

  /**
   * Constructor de la clase Tokens.
   * @param {number} initialAmount - La cantidad inicial de tokens a añadir.
   */
  constructor(initialAmount = 0) {
    this.#loadTokens();
    if (this.#tokens === 0) {
      this.#tokens = initialAmount;
      this.#saveTokens();
    }
  }

  /**
   * Obtiene la cantidad actual de tokens.
   * @returns {number} La cantidad actual de tokens.
   */
  get tokens() {
    return this.#tokens;
  }

  /**
   * Establece una nueva cantidad de tokens.
   * @param {number} amount - La nueva cantidad de tokens.
   */
  set tokens(amount) {
    if (amount < 0) {
      console.warn("La cantidad de tokens no puede ser negativa.");
      return;
    }
    this.#tokens = amount;
    this.#saveTokens();
  }

  /**
   * Suma una cantidad de tokens.
   * @param {number} amount - La cantidad de tokens a añadir.
   */
  addTokens(amount) {
    this.#tokens += amount;
    this.#saveTokens();
  }

  /**
   * Resta una cantidad de tokens.
   * @param {number} amount - La cantidad de tokens a restar.
   * @returns {boolean} Retorna true si la operación fue exitosa, false si no.
   */
  subtractTokens(amount) {
    if (amount > this.#tokens) {
      console.warn("No se pueden restar más tokens de los que se tienen.");
      return false;
    }
    this.#tokens -= amount;
    this.#saveTokens();
    return true;
  }

  /**
   * Guarda los tokens en el localStorage.
   */
  #saveTokens() {
    localStorage.setItem("UserTokens", JSON.stringify(this.#tokens));
  }

  /**
   * Carga los tokens del localStorage.
   */
  #loadTokens() {
    const savedTokens = localStorage.getItem("UserTokens");
    if (savedTokens) {
      this.#tokens = JSON.parse(savedTokens);
    }
  }
}

//! Export Normal
export default TokensManager;

//! Export Node.js
// module.exports = { Tokens };

// //? Ejemplo de uso
// console.log(Tokens.tokens); // 100
// Tokens.addTokens(50);
// console.log(Tokens.tokens); // 150
// const result1 = Tokens.subtractTokens(30);
// console.log(Tokens.tokens); // 120
// console.log(result1); // true
// const result2 = Tokens.subtractTokens(200); // Aviso: No se pueden restar más tokens de los que se tienen.
// console.log(result2); // false
