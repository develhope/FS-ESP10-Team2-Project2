//? Librería personal de utilidades
import _ from "../lib/utilities.js";

/**
 * Clase para administrar los Tokens del usuario.
 */
class TokensManager {
  // Variable privada local para almacenar todos los tokens del usuario
  #tokens = null;

  // Instancia singleton
  static instance;

  /**
   * Constructor de la clase Tokens.
   * @param {number} initialAmount - La cantidad inicial de tokens a añadir.
   */
  constructor(initialAmount = 0) {
    if (TokensManager.instance) {
      return TokensManager.instance;
    }

    this.#loadTokens();
    if (this.#tokens === null) {
      this.#tokens = initialAmount;
      this.#saveTokens();
    }

    TokensManager.instance = this;
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
    if (amount < 0) {
      console.warn("La cantidad de tokens no puede ser negativa.");
      return;
    }
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
    _.DOM.saveToLocalStorage("userTokens", this.#tokens);
    this.#emitTokenChange();
  }

  /**
   * Carga los tokens del localStorage.
   */
  #loadTokens() {
    this.#tokens = _.DOM.getFromLocalStorage("userTokens");
  }

  /**
   * Crea un evento personalizado que se activa cada vez que `this.tokens` cambia de valor.
   */
  #emitTokenChange() {
    const event = new CustomEvent("tokensChanged", {
      detail: { tokens: this.tokens },
    });
    window.dispatchEvent(event); // Disparar evento global
  }
}

//! Export Normal
export default new TokensManager(300);
