/**
 * Clase que agrupa diversas utilidades.
 */
class _ {
  //todo: Funciones de tipo (DOM)
  static DOM = {
    /**
     ** Espera a que un elemento esté disponible en el DOM.
     * @param {string} selector - El selector del elemento a esperar.
     * @param {number} [timeout=5000] - El tiempo máximo de espera en milisegundos.
     * @returns {Promise<Element>} - Una promesa que se resuelve con el elemento DOM.
     * @example
     * // Espera a que un elemento con id 'myElement' esté disponible en el DOM.
     * _.DOM.waitForElement('#myElement', 3000)
     *   .then(element => console.log('Elemento encontrado:', element))
     *   .catch(error => console.error(error));
     */
    waitForElement(selector, timeout = 5000) {
      return new Promise((resolve, reject) => {
        const interval = 100;
        let elapsed = 0;
        const checkInterval = setInterval(() => {
          const element = document.querySelector(selector);
          if (element) {
            clearInterval(checkInterval);
            resolve(element);
          } else if (elapsed >= timeout) {
            clearInterval(checkInterval);
            reject(
              new Error(`El elemento '${selector}' no se encontró en el DOM.`)
            );
          }
          elapsed += interval;
        }, interval);
      });
    },

    /**
     ** Guarda los datos en sessionStorage.
     * @param {string} key - La clave bajo la cual se almacenarán los datos.
     * @param {object} value - El valor a almacenar.
     * @example
     * // Guarda un objeto en sessionStorage.
     * _.DOM.saveToSessionStorage('user', { name: 'Juan', age: 30 });
     */
    saveToSessionStorage(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
      console.log(`'${key}' Guardado en el SessionStorage`);
    },

    /**
     ** Guarda los datos en localStorage.
     * @param {string} key - La clave bajo la cual se almacenarán los datos.
     * @param {object} value - El valor a almacenar.
     * @example
     * // Guarda un objeto en localStorage.
     * _.DOM.saveToLocalStorage('settings', { theme: 'dark', language: 'es' });
     */
    saveToLocalStorage(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`'${key}' Guardado en el LocalStorage`);
    },
  };

  //todo: Funciones de tipo cadenas de texto (String)
  static str = {
    /**
     ** Capitaliza la primera letra de una cadena.
     * @param {string} string - La cadena a capitalizar.
     * @returns {string} - La cadena con la primera letra en mayúscula.
     * @example
     * // Capitaliza la primera letra de la cadena.
     * const capitalized = _.str.capitalize('hola mundo');
     * console.log(capitalized); // 'Hola mundo'
     */
    capitalize(string) {
      if (typeof string !== "string" || string.length === 0) {
        return "";
      }
      // Convertimos toda la cadena a minúsculas
      string = string.toLowerCase();
      // Convertimos la primera letra a mayúscula y la concatenamos con el resto de la cadena
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
  };

  //todo: Funciones de tipo Numéricas (Number)
  static num = {
    /**
     ** Genera un número aleatorio entre un rango dado.
     * @param {number} min - El valor mínimo del rango.
     * @param {number} max - El valor máximo del rango.
     * @param {boolean} [isDecimal=false] - Indica si se debe devolver un número decimal.
     * @returns {number} - El número aleatorio generado.
     * @example
     * // Genera un número entero aleatorio entre 1 y 10.
     * const randomInt = _.num.getRandomNum(1, 10);
     * console.log(randomInt); // Un número entre 1 y 10
     *
     * // Genera un número decimal aleatorio entre 1 y 10.
     * const randomDecimal = _.num.getRandomNum(1, 10, true);
     * console.log(randomDecimal); // Un número decimal entre 1 y 10
     */
    getRandomNum(min, max, isDecimal = false) {
      if (isDecimal) {
        return Math.random() * (max - min) + min;
      } else {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
    },
  };

  //todo: Funciones de tipo Booleano (Boolean)
  static bool = {
    /**
     ** Función para calcular una probabilidad y devolver un resultado booleano.
     * @param {number} probabilityPercentage - El porcentaje de probabilidad de que el resultado sea true (de 0 a 100).
     * @returns {boolean} - true si el resultado está dentro del rango de probabilidad, de lo contrario, false.
     * @example
     * // Calcula la probabilidad de 70% de que el resultado sea true.
     * const result = _.bool.isProbable(70);
     * console.log(result); // true o false
     */
    isProbable(probabilityPercentage) {
      if (probabilityPercentage < 0 || probabilityPercentage > 100) {
        throw new Error(
          "El porcentaje de probabilidad debe estar entre 0 y 100."
        );
      }
      // Generar un número aleatorio entre 0 y 100
      const randomNumber = Math.random() * 100;
      // Verificar si el número aleatorio está dentro del rango de probabilidad
      return randomNumber <= probabilityPercentage;
    },
  };
}

export default _;
