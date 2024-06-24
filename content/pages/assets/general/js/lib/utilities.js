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
      if (typeof selector !== "string") {
        throw new Error("El selector debe ser una cadena de texto.");
      }
      if (typeof timeout !== "number" || timeout <= 0) {
        throw new Error("El tiempo de espera debe ser un número positivo.");
      }

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
      if (typeof key !== "string") {
        throw new Error("La clave debe ser una cadena de texto.");
      }
      if (typeof value !== "object" || value === null) {
        throw new Error("El valor debe ser un objeto.");
      }

      sessionStorage.setItem(key, JSON.stringify(value));
      console.log(`'${key}' Guardado en el SessionStorage`);
    },

    /**
     ** Obtiene los datos de sessionStorage.
     * @param {string} key - La clave bajo la cual se almacenaron los datos.
     * @returns {object|null} - El valor almacenado o null si no se encuentra.
     * @example
     * // Obtiene un objeto de sessionStorage.
     * const user = _.DOM.getFromSessionStorage('user');
     * console.log(user); // { name: 'Juan', age: 30 } o null
     */
    getFromSessionStorage(key) {
      if (typeof key !== "string") {
        throw new Error("La clave debe ser una cadena de texto.");
      }

      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
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
      if (typeof key !== "string") {
        throw new Error("La clave debe ser una cadena de texto.");
      }
      if (typeof value !== "object" || value === null) {
        throw new Error("El valor debe ser un objeto.");
      }

      localStorage.setItem(key, JSON.stringify(value));
      console.log(`'${key}' Guardado en el LocalStorage`);
    },

    /**
     ** Obtiene los datos de localStorage.
     * @param {string} key - La clave bajo la cual se almacenaron los datos.
     * @returns {object|null} - El valor almacenado o null si no se encuentra.
     * @example
     * // Obtiene un objeto de localStorage.
     * const settings = _.DOM.getFromLocalStorage('settings');
     * console.log(settings); // { theme: 'dark', language: 'es' } o null
     */
    getFromLocalStorage(key) {
      if (typeof key !== "string") {
        throw new Error("La clave debe ser una cadena de texto.");
      }

      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
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
      if (typeof string !== "string") {
        throw new Error("El argumento debe ser una cadena de texto.");
      }
      if (string.length === 0) {
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
      if (typeof min !== "number" || typeof max !== "number") {
        throw new Error("Los valores mínimo y máximo deben ser números.");
      }
      if (min >= max) {
        throw new Error("El valor mínimo debe ser menor que el valor máximo.");
      }

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
      if (typeof probabilityPercentage !== "number") {
        throw new Error("El porcentaje de probabilidad debe ser un número.");
      }
      if (probabilityPercentage < 0 || probabilityPercentage > 100) {
        throw new Error(
          "El porcentaje de probabilidad debe estar entre 0 y 100."
        );
      }

      const randomNumber = Math.random() * 100;
      // Verificar si el número aleatorio está dentro del rango de probabilidad
      return randomNumber <= probabilityPercentage;
    },
  };

  //todo: Funciones de tipo Array (Array)
  static arr = {
    /**
     ** Recorta un array eliminando un número específico de elementos del inicio o del final.
     * @param {array} array - El array a recortar.
     * @param {number} num - El número de elementos a eliminar.
     * @param {boolean} [fromStart=true] - Indica si se deben eliminar los elementos desde el inicio (true) o desde el final (false).
     * @returns {array} - El array recortado.
     * @example
     * // Elimina los primeros 2 elementos del array.
     * const result = _.arr.trimArray([1, 2, 3, 4, 5], 2);
     * console.log(result); // [3, 4, 5]
     *
     * // Elimina los últimos 3 elementos del array.
     * const result = _.arr.trimArray([1, 2, 3, 4, 5], 3, false);
     * console.log(result); // [1, 2]
     */
    trimArray(array, num, fromStart = true) {
      if (!Array.isArray(array)) {
        throw new Error("El primer argumento debe ser un array.");
      }
      if (typeof num !== "number" || num < 0) {
        throw new Error("El segundo argumento debe ser un número positivo.");
      }
      if (typeof fromStart !== "boolean") {
        throw new Error("El tercer argumento debe ser un valor booleano.");
      }

      if (fromStart) {
        return array.slice(num);
      } else {
        return array.slice(0, -num);
      }
    },

    /**
     ** Recorta un array manteniendo un número específico de elementos y eliminando los demás,
     * ya sea desde el inicio o desde el final.
     * @param {array} array - El array a recortar.
     * @param {number} num - El número de elementos a mantener.
     * @param {boolean} [keepFromStart=true] - Indica si se deben mantener los elementos desde el inicio (true) o desde el final (false).
     * @returns {array} - El array recortado.
     * @example
     * // Mantiene los primeros 2 elementos del array.
     * const result = _.arr.trimKeepArray([1, 2, 3, 4, 5], 2);
     * console.log(result); // [1, 2]
     *
     * // Mantiene los últimos 3 elementos del array.
     * const result = _.arr.trimKeepArray([1, 2, 3, 4, 5], 3, false);
     * console.log(result); // [3, 4, 5]
     */
    trimKeepArray(array, num, keepFromStart = true) {
      if (!Array.isArray(array)) {
        throw new Error("El primer argumento debe ser un array.");
      }
      if (typeof num !== "number" || num < 0) {
        throw new Error("El segundo argumento debe ser un número positivo.");
      }
      if (typeof keepFromStart !== "boolean") {
        throw new Error("El tercer argumento debe ser un valor booleano.");
      }

      if (keepFromStart) {
        return array.slice(0, num);
      } else {
        return array.slice(-num);
      }
    },
  };

  //todo: Funciones de tipo Objeto (Object)
  static obj = {
    /**
     ** Realiza una copia superficial de un objeto.
     * Una copia superficial copia las propiedades del objeto original al nuevo objeto.
     * Si alguna de las propiedades es un objeto, la referencia a este objeto se copiará, no el objeto en sí.
     * @param {object} obj - El objeto a copiar.
     * @returns {object} - La copia superficial del objeto.
     * @example
     * const original = { a: 1, b: 2 };
     * const copy = _.obj.shallowCopy(original);
     * console.log(copy); // { a: 1, b: 2 }
     * @example
     * // Cuando usar:
     * // Útil cuando se trabaja con objetos simples o cuando solo se necesitan copias de primer nivel.
     */
    shallowCopy(obj) {
      if (typeof obj !== "object" || obj === null) {
        throw new Error("El argumento debe ser un objeto.");
      }
      return [...obj];
    },

    /**
     ** Realiza una copia profunda de un objeto utilizando JSON.
     * Nota: Esto no funciona con funciones o tipos especiales de objetos (como Date, RegExp, Map, Set).
     * Una copia profunda crea una copia completa de un objeto, incluyendo todos los niveles de objetos anidados.
     * @param {object} obj - El objeto a copiar.
     * @returns {object} - La copia profunda del objeto.
     * @example
     * const original = { a: 1, b: { c: 3 } };
     * const copy = _.obj.deepCopyJSON(original);
     * console.log(copy); // { a: 1, b: { c: 3 } }
     * @example
     * // Cuando usar:
     * // Útil para objetos anidados simples y estructuras de datos que no contienen funciones o tipos especiales.
     */
    deepCopyJSON(obj) {
      if (typeof obj !== "object" || obj === null) {
        throw new Error("El argumento debe ser un objeto.");
      }
      return JSON.parse(JSON.stringify(obj));
    },

    /**
     ** Realiza una copia profunda de un objeto utilizando un método recursivo.
     * Maneja funciones y tipos especiales de objetos.
     * Una copia profunda crea una copia completa de un objeto, incluyendo todos los niveles de objetos anidados,
     * funciones y tipos especiales de objetos como Date, RegExp, Map y Set.
     * @param {object} obj - El objeto a copiar.
     * @returns {object} - La copia profunda del objeto.
     * @example
     * const original = { a: 1, b: { c: 3, d: new Date() } };
     * const copy = _.obj.deepCopyRecursive(original);
     * console.log(copy); // { a: 1, b: { c: 3, d: [Date object] } }
     * @example
     * // Cuando usar:
     * // Útil para objetos complejos que contienen funciones o tipos especiales de objetos.
     */
    deepCopyRecursive(obj) {
      if (typeof obj !== "object" || obj === null) {
        throw new Error("El argumento debe ser un objeto.");
      }

      let copy;

      if (Array.isArray(obj)) {
        copy = [];
        obj.forEach((_, i) => {
          copy[i] = this.deepCopyRecursive(obj[i]);
        });
      } else if (obj instanceof Date) {
        copy = new Date(obj.getTime());
      } else if (obj instanceof RegExp) {
        copy = new RegExp(obj);
      } else if (obj instanceof Map) {
        copy = new Map();
        obj.forEach((value, key) => {
          copy.set(key, this.deepCopyRecursive(value));
        });
      } else if (obj instanceof Set) {
        copy = new Set();
        obj.forEach((value) => {
          copy.add(this.deepCopyRecursive(value));
        });
      } else {
        copy = {};
        Object.keys(obj).forEach((key) => {
          copy[key] = this.deepCopyRecursive(obj[key]);
        });
      }

      return copy;
    },
  };
}

//! Export Normal
export default _;

//! Export Node.js
// module.exports = { _ };
