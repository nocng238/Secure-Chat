/* Hill encription & decription */
let math = require('mathjs');
let string = require('./string');

module.exports = {
  alphabet:
    ' 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~áàạảãâấầậẩẫăắằặẵẳúụùũủưựữừửứđéèẹẻẽêếềệễểóòọỏõôốồộỗổơớờợỡởíìịỉĩÁÀẠẢÃẤẦẬẨẪĂẮẰẶẴẲÚỤÙŨỦƯỰỮỪỬỨĐÉÈẸẺẼÊẾỀỆỄỂÓÒỌỎÕÔỐỒỘỖỔƠỚỜỢỠỞýỳỷỹỵ',
  /**
   * Finds the inverse of matrix (x) with formula: m * x (mod n) = I
   * where I = Identity matrix
   * @param {Array} matrix - a 3x3 matrix
   * @param {Number} n - the modulo
   * @returns {Array} - Inverse of matrix
   */
  toAlphabetHill: function (input) {
    let out = '';
    for (let i = 0; i < input.length; i++) {
      out += this.alphabet.charAt(input[i]);
    }

    return out;
  },
  toNumbersHill: function (input) {
    let out = [];

    for (let i = 0; i < input.length; i++) {
      out.push(this.alphabet.lastIndexOf(input.charAt(i)));
    }

    return out;
  },
  modMatrixInverse: function (matrix, n) {
    let determinant = math.det(matrix);

    determinant = Math.round(determinant);

    let invDet = string.modInverse(determinant, n);
    let invMat = math.inv(matrix);

    invMat = math.multiply(determinant, invMat);
    invMat = math.round(invMat);
    invMat = math.multiply(invDet, invMat);
    invMat = math.mod(invMat, n);

    return invMat;
  },

  /**
   * Encrypts with formula : mC = mK * mP (mod 26)
   * with mC and mP is a 1x3 matrix and mK is 3x3 matrix
   * @param {String} plaintext
   * @param {String} key - with format "%d %d %d %d %d %d %d %d %d"
   * @returns {String} - Ciphertext
   */
  encrypt: function (plaintext, key) {
    // Convert string key to matrix
    let mK = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    // let keyDigits = key.split(' ');
    let i = 0,
      j = 0,
      k = 0;

    while (i < 3 && k < key.length) {
      mK[i][j] = this.alphabet.lastIndexOf(key.charAt(k));
      j++;

      if (j > 2) {
        j = 0;
        i++;
      }

      k++;
    }

    // Convert plaintext to numbers
    plaintext = this.toNumbersHill(plaintext);

    let mC,
      mP = [0, 0, 0];
    let out = '';

    // Multiply mK to plaintext
    i = 0;

    while (i < plaintext.length) {
      mP = plaintext.slice(i, i + 3);
      while (mP.length < 3) mP.push(0);

      mC = math.multiply(mK, mP);
      mC = math.round(mC);
      // mC = math.mod(mC, 28);

      mC = math.mod(mC, 218);
      out += this.toAlphabetHill(mC);
      i += 3;
    }

    return out;
  },

  /**
   * Decrypts with formula : mP = mKinv * mP (mod 26)
   * with mC and mP is a 1x3 matrix and mKinv is 3x3 matrix inverse of key
   * @param {String} ciphertext
   * @param {String} key - with format "%d %d %d %d %d %d %d %d %d"
   * @returns {String} - Plaintext
   */
  decrypt: function (ciphertext, key) {
    // Convert string key to matrix
    let mK = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    let i = 0,
      j = 0,
      k = 0;

    while (i < 3 && k < key.length) {
      mK[i][j] = this.alphabet.lastIndexOf(key.charAt(k));
      j++;

      if (j > 2) {
        j = 0;
        i++;
      }

      k++;
    }

    // Find key inverse
    let mKinv = this.modMatrixInverse(mK, 218);

    if (!isNaN(mKinv[0][0])) {
      // Convert ciphertext to numbers
      ciphertext = this.toNumbersHill(ciphertext);

      let mC,
        mP = [0, 0, 0];
      let out = '';

      // Multiply mK to plaintext
      i = 0;

      while (i < ciphertext.length) {
        mC = ciphertext.slice(i, i + 3);
        // console.log(mC);
        while (mC.length < 3) mC.push(0);

        mP = math.multiply(mKinv, mC);
        mP = math.round(mP);
        mP = math.mod(mP, 218);

        out += this.toAlphabetHill(mP);
        i += 3;
      }

      return out.trim();
    } else {
      return 'NO MODULAR INVERSE FOUND !!!';
    }
  },
  keyGenerate: function () {
    while (true) {
      let key = '';
      let mK = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      let i = 0,
        j = 0,
        k = 0;
      while (i < 3 && k < 9) {
        mK[i][j] = math.randomInt(0, 218);
        key += this.alphabet[mK[i][j]];
        j++;

        if (j > 2) {
          j = 0;
          i++;
        }

        k++;
      }
      let mKinv = this.modMatrixInverse(mK, 218);
      if (!isNaN(mKinv[0][0])) {
        return key;
      }
    }
  },
};
