/* All string-related utility function is stored here */
let a = 'A';

module.exports = {
  /**
   * Check if input type is string
   * @param {String} input
   * @returns {Boolean}
   */
  isString: function (input) {
    return typeof input == 'string';
  },

  /**
   * Removes all non alphabet and capitalize each letters (including spaces & newlines)
   * @param {String} input
   * @returns {String}
   */
  removeNonAlphabet: function (input) {
    return input.replace(/[^a-zA-Z]/gi, '').toUpperCase();
  },

  /**
   * Removes all non alphabet and capitalize each letters (including spaces & newlines except '?')
   * @param {String} input
   * @returns {String}
   */
  removeNonAlphabetException: function (input) {
    return input.replace(/[^a-zA-Z?]/gi, '').toUpperCase();
  },

  /**
   * Removes all non alphabet and capitalize each letters (including spaces & newlines except '?' and '#)
   * @param {String} input
   * @returns {String}
   */
  removeNonAlphabetHill: function (input) {
    return input.replace(/[^a-zA-Z?#]/gi, '').toUpperCase();
  },

  toAlphabetHillOfMine: function (input) {
    let out = '';

    for (let i = 0; i < input.length; i++) {
      // if (input[i] === 26) {
      //   out += '?';
      // } else if (input[i] === 27) {
      //   out += '#';
      // } else {
      out += String.fromCharCode(input[i] + 32);
      // }
    }

    return out;
  },
  toNumbersHillOfMine: function (input) {
    let out = [];

    for (let i = 0; i < input.length; i++) {
      out.push(input.charCodeAt(i) - 32);
    }

    return out;
  },

  /**
   * Mod operator (eg: mod(-10, 26) = 16)
   * @param {Number} a
   * @param {Number} b
   * @returns {Number}
   */
  mod: function (a, b) {
    let res = a % b;

    return Math.floor(res >= 0 ? res : this.mod(a + b, b));
  },

  /**
   * Modular inverse (eg: modinv(7, 26) = 15)
   * @param {Number} m
   * @param {Number} n
   * @returns {Number}
   */
  modInverse: function (m, n) {
    // Find gcd
    const s = [];
    let b = n;

    while (m < 0) m += n;

    while (b) {
      [m, b] = [b, m % b];
      s.push({ m, b });
    }

    // Find inverse
    if (m !== 1) {
      return NaN;
    } else {
      let x = 1;
      let y = 0;

      for (let i = s.length - 2; i >= 0; --i) {
        [x, y] = [y, x - y * Math.floor(s[i].m / s[i].b)];
      }

      return ((y % n) + n) % n;
    }
  },
};
