var predef = require("./predef.js");

///
/// Math Functions
///

exports.ABS = function abs(number) {
  var res = Math.abs(number);

  if (isNaN(res)) throw predef.Error("#NUM!", "Not a number");

  return res;
};

exports.ABS_D = function abs(number) {
  return typeof number != "number"
    ? predef.Error("#VALUE!", "The value introduced is not allowed")
    : isNaN(number)
    ? predef.Error("#NUM!", "Not a number")
    : Math.abs(number);
};

function verifyNaN(a_value) {
  if (isNaN(a_value)) throw predef.Error("#NUM!", "Not a number");
  return a_value;
}

exports.verifyNaN = verifyNaN;

exports.ACOS = function acos(number) {
  if (number < -1 || number > 1)
    throw predef.Error("#NUM!", "The number must be between -1 and 1");

  return verifyNaN(Math.acos(number));
};

exports.ACOS_D = function acos(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");

  try {
    return exports.ACOS(number);
  } catch (error) {
    return error;
  }
};

exports.ACOSH = function acosh(number) {
  if (number < 1) throw predef.Error("#NUM!", "The number must be less than 1");

  return verifyNaN(Math.acosh(number));
};

exports.ACOSH_D = function acosh(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");

  try {
    return exports.ACOSH(number);
  } catch (error) {
    return error;
  }
};

exports.ACOT = function acot(number) {
  return Math.PI / 2 - Math.atan(number);
};

exports.ACOT_D = function acot(number) {
  return typeof number != "number"
    ? predef.Error("#VALUE!", "The value introduced is not allowed")
    : Math.PI / 2 - Math.atan(number);
};

exports.ACOTH = function acoth(number) {
  if (number >= -1 && number <= 1) {
    predef.Error(
      "#NUM!",
      "The number should not be between -1 and 1 (inclusive)"
    );
  }
  return 0.5 * Math.log((number + 1) / (number - 1));
};

exports.ACOTH_D = function acoth(number) {
  return typeof number != "number"
    ? predef.Error("#VALUE!", "The value introduced is not allowed")
    : number >= -1 && number <= 1
    ? predef.Error(
        "#NUM!",
        "The number should not be between -1 and 1 (inclusive)"
      )
    : 0.5 * Math.log((number + 1) / (number - 1));
};

exports.AGGREGATE = function aggregate() {};

exports.ARABIC_I = function arabic_i(dynamic, stringNumber) {
  function processDecimal(decimal, lastNumber, lastDecimal) {
    if (lastNumber > decimal) {
      return lastDecimal - decimal;
    } else {
      return lastDecimal + decimal;
    }
  }

  var decimal = 0,
    lastNumber = 0;
  stringNumber = stringNumber.toUpperCase();
  for (var x = stringNumber.length - 1; x >= 0; x--) {
    var lastLetter = stringNumber.charAt(x);
    switch (lastLetter) {
      case "M":
        decimal = processDecimal(1000, lastNumber, decimal);
        lastNumber = 1000;
        break;

      case "D":
        decimal = processDecimal(500, lastNumber, decimal);
        lastNumber = 500;
        break;

      case "C":
        decimal = processDecimal(100, lastNumber, decimal);
        lastNumber = 100;
        break;

      case "L":
        decimal = processDecimal(50, lastNumber, decimal);
        lastNumber = 50;
        break;

      case "X":
        decimal = processDecimal(10, lastNumber, decimal);
        lastNumber = 10;
        break;

      case "V":
        decimal = processDecimal(5, lastNumber, decimal);
        lastNumber = 5;
        break;

      case "I":
        decimal = processDecimal(1, lastNumber, decimal);
        lastNumber = 1;
        break;

      case "":
        decimal = 0;

      default:
        return predef.throwable_error(
          dynamic,
          "#VALUE!",
          "The value introduced is not allowed"
        );
    }
  }
  return decimal;
};

exports.ARABIC = function arabic(stringNumber) {
  return exports.ARABIC_I(false, stringNumber);
};

exports.ARABIC_D = function arabic(stringNumber) {
  return exports.ARABIC_I(true, stringNumber);
};

exports.COS = function cos(number) {
  return verifyNaN(Math.cos(number));
};

exports.COS_D = function cos(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.COS(number);
  } catch (error) {
    return error;
  }
};

exports.TAN = function tan(number) {
  return verifyNaN(Math.tan(number));
};

exports.TAN_D = function tan(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.TAN(number);
  } catch (error) {
    return error;
  }
};

exports.TANH = function tanh(number) {
  return verifyNaN(Math.tanh(number));
};

exports.TANH_D = function tanh(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.TANH(number);
  } catch (error) {
    return error;
  }
};

exports.SIN = function sin(number) {
  return verifyNaN(Math.sin(number));
};

exports.SIN_D = function sin(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.SIN(number);
  } catch (error) {
    return error;
  }
};

exports.ASIN = function asin(number) {
  if (number < -1 || number > 1)
    throw predef.Error("#NUM!", "The number must be between -1 and 1");

  return verifyNaN(Math.asin(number));
};

exports.ASIN_D = function asin(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");

  try {
    return exports.ASIN(number);
  } catch (error) {
    return error;
  }
};

exports.ASINH = function asinh(number) {
  return verifyNaN(Math.asinh(number));
};

exports.ASINH_D = function asinh(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");

  try {
    return exports.ASINH(number);
  } catch (error) {
    return error;
  }
};

exports.ATAN = function atan(number) {
  return verifyNaN(Math.atan(number));
};

exports.ATAN_D = function atan(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.ATAN(number);
  } catch (error) {
    return error;
  }
};

exports.ATAN2 = function atan2(x, y) {
  // if (x==0 || y==0)
  // throw predef.Error("#DIV/0!", "One of the args must be different to zero");

  return verifyNaN(Math.atan2(y, x));
};

exports.ATAN2_D = function atan2(x, y) {
  if (typeof x != "number" || typeof y != "number")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.ATAN2(x, y);
  } catch (error) {
    return error;
  }
};

exports.ATANH = function atanh(number) {
  if (number <= -1 || number >= 1)
    predef.Error("#NUM!", "The number must be between -1 and 1 (exclusive)");

  return verifyNaN(Math.atanh(number));
};

exports.ATANH_D = function atanh(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.ATAN2(number);
  } catch (error) {
    return error;
  }
};

exports.BASE = function base(number, radix, numberlength) {
  if (number < 0 || number >= Math.pow(2, 53)) {
    throw predef.Error("#NUM!", "The number is not allowed");
  } else if (radix < 2 || radix > 36) {
    throw predef.Error("#NUM!", "The radix is not allowed");
  } else if (numberlength < 0 || numberlength >= 256) {
    throw predef.Error("#NUM!", "The number's length is not allowed");
  } else {
    var num = number.toString(radix).toUpperCase();
    return "0".repeat(numberlength - num.length) + num;
  }
};

exports.BASE_D = function base(number, radix, numberlength) {
  if (
    typeof number != "number" ||
    typeof radix != "number" ||
    (typeof numberlength != "undefined" && typeof numberlength != "number")
  ) {
    return predef.Error(
      "#VALUE!",
      "The type of values introduced is not allowed"
    );
  } else if (number < 0 || number >= Math.pow(2, 53)) {
    return predef.Error("#NUM!", "The number is not allowed");
  } else if (radix < 2 || radix > 36) {
    return predef.Error("#NUM!", "The radix is not allowed");
  } else if (numberlength < 0 || numberlength >= 256) {
    return predef.Error("#NUM!", "The number's length is not allowed");
  } else {
    var num = number.toString(radix).toUpperCase();
    return "0".repeat(numberlength - num.length) + num;
  }
};

exports.CEIL = function ceil(number) {
  return verifyNaN(Math.ceil(number));
};

exports.CEIL_D = function ceil(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.CEIL(number);
  } catch (error) {
    return error;
  }
};

exports.CEILING = function ceiling(number, significance) {
  if (significance === 0 || number === 0) return 0;

  if (
    isNaN(number) ||
    isNaN(significance) ||
    Math.sign(number) !== Math.sign(significance)
  )
    throw predef.Error("#NUM!", "Not a number.");

  return verifyNaN(Math.ceil(number / significance) * significance);
};

exports.CEILING_D = function ceiling(number, significance) {
  if (typeof number != "number" || typeof number != "significance")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.CEILING(number, significance);
  } catch (error) {
    return error;
  }
};

exports.EVEN = function even(number) {
  if (isNaN(number)) throw predef.Error("#NUM!", "Not a number.");

  return verifyNaN(exports.CEILING(number, Math.sign(number) * 2));
};

exports.EVEN_D = function even(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.EVEN(number);
  } catch (error) {
    return error;
  }
};

exports.ODD = function odd(number) {
  if (isNaN(number)) throw predef.Error("#NUM!", "Not a number.");
  var res = verifyNaN(exports.EVEN(number));
  return res > 0 ? res - 1 : res + 1;
};

exports.ODD_D = function odd(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.ODD(number);
  } catch (error) {
    return error;
  }
};

exports.COMBIN = function combin(n, k) {
  if (n < 0 || k < 0 || k > n || isNaN(n) || isNaN(k))
    throw predef.Error("#NUM!", "The numbers must be in a valid range");

  var res = 1;

  // Since C(n, k) = C(n, n-k)
  if (k > n - k) k = n - k;

  // Calculate value of [n * (n-1) *---* (n-k+1)] / [k * (k-1) *----* 1]
  for (var i = 0; i < k; ++i) {
    res *= n - i;
    res /= i + 1;
  }

  return res;
};

exports.COMBIN_D = function combin(n, x) {
  if (typeof n != "number" || typeof x != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.COMBIN(n, x);
  } catch (error) {
    return error;
  }
};

exports.COMBINA = function combina(n, x) {
  if (n < 0 || x < 0) {
    throw predef.Error("#NUM!", "The numbers must be in a valid range");
  }
  return exports.COMBIN(n + x - 1, n - 1);
};

exports.COMBINA_D = function combina(n, x) {
  return typeof n != "number" || typeof x != "number"
    ? predef.Error("#VALUE!", "The value introduced is not allowed")
    : n < 0 || x < 0
    ? predef.Error("#NUM!", "The numbers must be in a valid range")
    : exports.COMBIN(n + x - 1, n - 1);
};

exports.COSH = function cosh(number) {
  return verifyNaN(Math.cosh(number));
};

exports.COSH_D = function cosh(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.COSH(n, x);
  } catch (error) {
    return error;
  }
};

exports.COT = function cot(number) {
  if (number == 0) {
    throw predef.Error("DIV/0!", "The number must be different to zero");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    throw predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return Math.cos(number) / Math.sin(number);
  }
};

exports.COT_D = function cot(number) {
  if (typeof number != "number") {
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  } else if (number == 0) {
    return predef.Error("DIV/0!", "The number must be different to zero");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    return predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return Math.cos(number) / Math.sin(number);
  }
};

exports.COTH = function coth(number) {
  if (number == 0) {
    throw predef.Error("DIV/0!", "The number must be different to zero");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    throw predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return Math.cosh(number) / Math.sinh(number);
  }
};

exports.COTH_D = function coth(number) {
  if (typeof number != "number") {
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  } else if (number == 0) {
    return predef.Error("DIV/0!", "The number must be different to zero");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    return predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return Math.cosh(number) / Math.sinh(number);
  }
};

exports.CSC = function csc(number) {
  if (number == 0) {
    throw predef.Error("DIV/0!", "The number must be different to zero");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    throw predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return 1 / Math.sin(number);
  }
};

exports.CSC_D = function csc(number) {
  if (typeof number != "number") {
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  } else if (number == 0) {
    return predef.Error("DIV/0!", "The number must be different to zero");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    return predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return 1 / Math.sin(number);
  }
};

exports.CSCH = function csch(number) {
  if (number == 0) {
    throw predef.Error("DIV/0!", "The number must be different to zero");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    throw predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return 1 / Math.sinh(number);
  }
};

exports.CSCH_D = function csch(number) {
  if (typeof number != "number") {
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  } else if (number == 0) {
    return predef.Error("DIV/0!", "The number must be different to zero");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    return predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return 1 / Math.sinh(number);
  }
};

exports.DECIMAL = function decimal(number, radix) {
  if (radix < 2 || radix > 36) {
    throw predef.Error("#NUM!", "The radix must be in a valid range");
  } else if (number.length > 255) {
    throw predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return parseInt(number, radix);
  }
};

exports.DECIMAL_D = function decimal(number, radix) {
  if (typeof radix != "number") {
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  }
  if (radix < 2 || radix > 36) {
    return predef.Error("#NUM!", "The radix must be in a valid range");
  } else if (number.length > 255) {
    return predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return parseInt(number, radix);
  }
};

exports.DEGREES = function degrees(number) {
  return verifyNaN((number * 180) / Math.PI);
};

exports.DEGREES_D = function degrees(number) {
  if (typeof n != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.DEGREES(number);
  } catch (error) {
    return error;
  }
};

exports.FACT = function fact(number) {
  if (number < 0 || isNaN(number))
    throw predef.Error("#NUM!", "The number must be less than 0");
  var result = 1;
  for (var i = Math.floor(number); i > 1; i--) result *= i;
  return verifyNaN(result);
};

exports.FACT_D = function fact(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.FACT(number);
  } catch (error) {
    return error;
  }
};

exports.FACTDOUBLE = function factdouble(number) {
  if (number < 0) {
    throw predef.Error("#NUM!", "The number must be less than 0");
  } else {
    var result = 1;
    for (var i = number; i > 1; i -= 2) {
      result *= i;
    }
    return result;
  }
};

exports.FACTDOUBLE_D = function factdouble(number) {
  if (typeof number != "number") {
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  } else if (number < 0) {
    return predef.Error("#NUM!", "The number must be less than 0");
  } else {
    var result = 1;
    for (var i = number; i > 1; i -= 2) {
      result *= i;
    }
    return result;
  }
};

exports.FLOOR = function floor(number, s) {
  if (s === 0) throw predef.Error("#DIV/0!", "Significance must not be zero.");
  if (number === 0) return 0;
  return verifyNaN(exports.CEILING(number, s) - s);
};

exports.FLOOR_D = function floor(number, s) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.FLOOR(number, s);
  } catch (error) {
    return error;
  }
};

exports.GCD = function gcd(an_arr) {
  var gcd_res = an_arr.length > 0 ? an_arr[0] : 1;
  if (gcd_res < 0)
    throw predef.Error("#NUM!", "The numbers must be non-negative");

  for (var i = 1; i < an_arr.length; i++) {
    if (an_arr[i] < 0)
      throw predef.Error("#NUM!", "The numbers must be non-negative");

    var a = gcd_res;
    var b = an_arr[i];

    if (a === 0) {
      var temp = a;
      a = b;
      b = temp;
    }

    while (true) {
      if (b === 0) {
        gcd_res = a;
        break;
      }
      if (a === b) {
        gcd_res = a;
        break;
      }
      if (a > b) {
        a = a - b;
      } else {
        b = b - a;
      }
    }
  }
  return gcd_res;
};

exports.GCD_D = function gcd(num1) {
  if (typeof num1 != "number") {
    return predef.Error("#VALUE!", "The values introduced are not allowed");
  } else if (num1 < 0) {
    return predef.Error("#NUM!", "The numbers must be less than 0");
  }
  var gcd = num1,
    i = 1;
  while (arguments[i] != undefined) {
    if (typeof arguments[i] != "number") {
      return predef.Error("#VALUE!", "The values introduced are not allowed");
    } else if (arguments[i] < 0) {
      return predef.Error("#NUM!", "The numbers must be less than 0");
    }
    var a = gcd,
      b = arguments[i++];
    while (b != 0) {
      tmp = a;
      a = b;
      b = tmp % b;
    }
    gcd = a;
  }
  return gcd;
};

exports.LOG_B = function log_b(number, base) {
  if (base == undefined) base = 10;

  if (number <= 0 || isNaN(number))
    throw predef.Error("#NUM!", "The number must be positive");

  if (base == 1) throw predef.Error("#DIV/0!", "The base must not be 1");
  if (base == 0) throw predef.Error("#NUM!", "The base must not zero.");

  return Math.log(number) / Math.log(base);
};

exports.LOG_BD = function log_bd(number, base) {
  if (base == undefined) base = 10;
  if (typeof number != "number" || typeof base != "number")
    return predef.Error("#VALUE!", "The values introduced are not allowed");
  try {
    return exports.LOG_B(number, base);
  } catch (error) {
    return error;
  }
};

exports.LOGB_D = function logb(number, base) {
  if (base == undefined) {
    base = 10;
  }
  if (number <= 0) {
    throw predef.Error("#NUM!", "The number must be positive");
  } else if (base == 1) {
    throw predef.Error("#DIV/0!", "The base must not be 1");
  } else {
    return Math.log(number) / Math.log(base);
  }
};

exports.LOG = function log(number) {
  var base = 10;

  if (number <= 0) throw predef.Error("#NUM!", "The number must be positive");

  if (base == 1) throw predef.Error("#DIV/0!", "The base must not be 1");

  return verifyNaN(Math.log(number) / Math.log(base));
};

exports.LOG_D = function log(number) {
  var base = 10;

  if (typeof number != "number")
    return predef.Error("#VALUE!", "The values introduced are not allowed");
  try {
    return exports.LOG(number, base);
  } catch (error) {
    return error;
  }
};

exports.LN_D = function ln(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced are not allowed");

  if (number <= 0) return predef.Error("#NUM!", "The number must be positive");

  return Math.log(number);
};

exports.LN = function ln(number) {
  if (typeof number != "number")
    throw predef.Error("#VALUE!", "The value introduced are not allowed");

  if (number <= 0) throw predef.Error("#NUM!", "The number must be positive");

  return Math.log(number);
};

exports.LCM = function lcm(an_arr) {
  if (an_arr.length === 0)
    throw predef.Error("#NUM!", "Array must be non-empty");

  var lcm = an_arr[0],
    i = 1;
  if (an_arr[0] < 0)
    throw predef.Error("#NUM!", "The numbers must be non-negative");

  while (an_arr[i] != undefined) {
    if (an_arr[i] < 0)
      throw predef.Error("#NUM!", "The numbers must be non-negative");

    var a = lcm,
      b = an_arr[i++];
    lcm = (a * b) / exports.GCD([a, b]);
  }
  return lcm;
};

exports.LCM_D = function lcm(num1) {
  var lcm = num1,
    i = 1;
  if (typeof num1 != "number") {
    return predef.Error("#VALUE!", "The values introduced are not allowed");
  } else if (num1 <= 0) {
    return predef.Error("#NUM!", "The numbers must be greater than 0");
  }
  while (arguments[i] != undefined) {
    if (typeof arguments[i] != "number") {
      return predef.Error("#VALUE!", "The values introduced are not allowed");
    } else if (arguments[i] <= 0) {
      return predef.Error("#NUM!", "The numbers must be greater than 0");
    }
    var a = lcm,
      b = arguments[i++];
    lcm = (a * b) / exports.GCD([a, b]);
  }
  return lcm;
};

exports.LOG10 = function log10(number) {
  if (number <= 0) {
    throw predef.Error("#NUM!", "The number must be positive");
  }
  return Math.log(number) / Math.log(10);
};

exports.LOG10_D = function log10(number) {
  return typeof number != "number"
    ? predef.Error("#VALUE!", "The value introduced is not allowed")
    : number <= 0
    ? predef.Error("#NUM!", "The number must be positive")
    : Math.log(number) / Math.log(10);
};

exports.MDETERM_I = function mdeterm_i(dynamic, matrix) {
  function MSQUARE(matrix) {
    var rows = matrix.length;
    for (var i = 0; i < rows; i++) {
      if (rows != matrix[i].length) {
        return false;
      }
    }
    return true;
  }
  function INDETERM(matrix) {
    if (matrix.length == 1) {
      return matrix[0][0];
    } else {
      var tmp = 0,
        rows = matrix.length,
        columns = rows;
      for (var k = 0; k < rows; k++) {
        var tmpMatrix = new Array();
        for (var i = 1; i < rows; i++) {
          var tmpRow = new Array();
          for (var j = 0; j < columns; j++) {
            if (j == k) {
              continue;
            }
            tmpRow.push(matrix[i][j]);
          }
          tmpMatrix.push(tmpRow);
        }
        tmp += Math.pow(-1, k) * matrix[0][k] * INDETERM(tmpMatrix);
      }
      return tmp;
    }
  }

  if (!MSQUARE(matrix)) {
    if (dynamic) {
      return predef.Error("#VALUE!", "The matrix must be square");
    } else {
      throw predef.Error("#VALUE!", "The matrix must be square");
    }
  }

  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      if (typeof matrix[i][j] != "number") {
        if (dynamic) {
          return predef.Error("#VALUE!", "The values must be numbers");
        } else {
          throw predef.Error("#VALUE!", "The values must be numbers");
        }
      }
    }
  }
  return INDETERM(matrix);
};

exports.MDETERM = function mdeterm(matrix) {
  return exports.MDETERM_I(false, matrix);
};

exports.MDETERM_D = function mdeterm(matrix) {
  return exports.MDETERM_I(true, matrix);
};

exports.MINVERSE_I = function minverse_i(dynamic, matrix) {
  var determinant = exports.MDETERM_I(dynamic, matrix);
  if (typeof determinant != "number") {
    return determinant;
  }
  var cofact = new Array(),
    rows = matrix.length,
    columns = rows;
  for (var i = 0; i < rows; i++) {
    var cofactRow = new Array();
    for (var j = 0; j < columns; j++) {
      var subArray = new Array();
      for (var p = 0; p < rows; p++) {
        if (p == i) {
          continue;
        }
        var subArrayRow = new Array();
        for (var q = 0; q < columns; q++) {
          if (q == j) {
            continue;
          }
          subArrayRow.push(matrix[p][q]);
        }
        subArray.push(subArrayRow);
      }
      cofactRow.push(Math.pow(-1, i + j) * exports.MDETERM(subArray));
    }
    cofact.push(cofactRow);
  }
  var transpose = cofact[0].map(function (column, i) {
    return cofact.map(function (row) {
      return row[i];
    });
  });
  return transpose.map(function (row, i) {
    return transpose[i].map(function (column) {
      return column / determinant;
    });
  });
};

exports.MINVERSE = function minverse(matrix) {
  return exports.MINVERSE_I(false, matrix);
};

exports.MINVERSE_D = function minverse(matrix) {
  return exports.MINVERSE_I(true, matrix);
};

exports.MMULT_I = function mmult_i(dynamic, matrix1, matrix2) {
  var columns1 = matrix1[0].length;
  var columns2 = matrix2[0].length;
  var rows1 = matrix1.length;
  var rows2 = matrix2.length;

  for (var i = 1; i < rows1; i++)
    if (matrix1[i].length !== rows2) {
      var error = predef.Error(
        "#VALUE!",
        "The number of columns in matrix 1 must be equal to the number of rows in matrix 2"
      );
      if (dynamic) return error;
      else throw error;
    }

  matrixResult = new Array(rows1);

  for (var i = 0; i < rows1; i++) matrixResult[i] = new Array(columns2).fill(0);

  for (var i = 0; i < rows1; i++)
    for (var j = 0; j < matrix2[0].length; j++)
      for (var k = 0; k < columns1; k++)
        matrixResult[i][j] += matrix1[i][k] * matrix2[k][j];

  return matrixResult;
};

exports.MMULT = function mmult(matrix1, matrix2) {
  return exports.MMULT_I(false, matrix1, matrix2);
};

exports.MMULT_D = function mmult(matrix1, matrix2) {
  return exports.MMULT_I(true, matrix1, matrix2);
};

exports.MOD = function mod(number, divisor) {
  if (divisor == 0)
    throw predef.Error("#DIV/0!", "The divisor must be different to zero");
  return number - divisor * Math.floor(number / divisor);
  // return ((number%divisor)+divisor)%divisor;
};

exports.MOD_D = function mod(number, divisor) {
  return typeof number != "number" || typeof divisor != "number"
    ? predef.Error("#VALUE!", "The values introduced are not allowed")
    : divisor == 0
    ? predef.Error("#DIV/0!", "The divisor must be different to zero")
    : number - divisor * Math.floor(number / divisor);
  // : ((number%divisor)+divisor)%divisor;
};

exports.MROUND = function mround(number, multiple) {
  if (multiple === 0) return 0;

  if (exports.SIGN(number) != exports.SIGN(multiple))
    throw predef.Error("#NUM!", "The values must have the same sign");

  var multiplier = 1 / multiple;
  return Math.round(number * multiplier) / multiplier;
};

exports.MROUND_D = function mround(number, multiple) {
  if (typeof number != "number" || typeof multiple != "number") {
    return predef.Error("#VALUE!", "The values must be numbers");
  }
  if (exports.SIGN(number) != exports.SIGN(multiple)) {
    return predef.Error("#NUM!", "The values must have the same sign");
  }
  var tmp = number / multiple,
    step = 1;
  if (multiple < 1) {
    step = multiple;
  }
  var i = Math.ceil(number);
  while (i < number + multiple) {
    if (i % multiple == 0) {
      return i;
    }
    tmp - Math.floor(tmp) >= 0.5 ? i++ : i--;
  }
};

exports.MULTINOMIAL = function multinomial(an_arr) {
  if (an_arr.length === 0)
    throw predef.Error("#NUM!", "Non-empty list expected");

  var i = 0,
    num = 0,
    den = 1;
  for (var i = 0; i < an_arr.length; i++) {
    if (an_arr[i] < 0)
      throw predef.Error("#NUM!", "The number must be greater than 0");

    num += an_arr[i];
    den *= exports.FACT(an_arr[i]);
  }
  return exports.FACT(num) / den;
};

exports.MULTINOMIAL_D = function multinomial(number) {
  var i = 0,
    num = 0,
    den = 1;
  while (arguments[i] != undefined) {
    if (typeof arguments[i] != "number") {
      return predef.Error("#VALUE!", "The value must be a number");
    }
    if (arguments[i] <= 0) {
      return predef.Error("#NUM!", "The number must be greater than 0");
    }
    num += arguments[i];
    den *= exports.FACT(arguments[i]);
    i++;
  }
  return exports.FACT(num) / den;
};

exports.MUNIT = function munit(dimension) {
  var matrixResult = new Array(dimension);
  for (var i = 0; i < dimension; i++) {
    matrixResult[i] = new Array(dimension).fill(0);
    matrixResult[i][i] = 1;
  }
  return matrixResult;
};

exports.POWER = function power(number, power) {
  return verifyNaN(Math.pow(number, power));
};

exports.POWER_D = function power(number, power) {
  if (typeof number != "number" || typeof power != "number")
    return predef.Error("#VALUE!", "The values introduced are not allowed");

  try {
    return exports.POWER(number, base);
  } catch (error) {
    return error;
  }
};

/*Pending*/
exports.PRODUCT = function product(number) {
  if (
    typeof number != "undefined" &&
    number != null &&
    number.length != null &&
    number.length > 0
  )
    return 1;

  var result = number,
    i = 1;
  while (arguments[i] != undefined) {
    if (arguments[i] instanceof Array)
      result *= exports.PRODUCT(arguments[i++]);
    else result *= arguments[i++];
  }
  return result;
};

exports.PRODUCT_D = function product(number) {
  if (
    typeof number != "undefined" &&
    number != null &&
    number.length != null &&
    number.length === 0
  )
    return 1;

  var result = number,
    i = 1;
  while (arguments[i] != undefined) {
    if (typeof arguments[i] != "number")
      // return predef.Error("#VALUE!", "The values introduced are not allowed");
      i++;
    else if (arguments[i] instanceof Array)
      result *= exports.PRODUCT_D(arguments[i++]);
    else result *= arguments[i++];
  }
  return result;
};

exports.QUOTIENT = function quotient(dividend, divisor) {
  if (divisor === 0) {
    throw predef.Error("#DIV/0!", "The divisor must be different to zero");
  }

  let sign =
    (0 <= dividend && 0 < divisor) || (dividend < 0 && divisor < 0) ? 1 : -1;

  return sign * Math.floor(Math.abs(dividend) / Math.abs(divisor));
};

exports.QUOTIENT_D = function quotient(dividend, divisor) {
  if (typeof dividend != "number" || typeof divisor != "number") {
    return predef.Error("#VALUE!", "The values introduced are not allowed");
  }

  if (divisor === 0) {
    return predef.Error("#DIV/0!", "The divisor must be different to zero");
  }

  return sign * Math.floor(Math.abs(dividend) / Math.abs(divisor));
};

exports.RADIANS = function radians(number) {
  return verifyNaN((number * Math.PI) / 180);
};

exports.RADIANS_D = function radians(number) {
  if (typeof n != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  try {
    return exports.RADIANS(number);
  } catch (error) {
    return error;
  }
};

exports.RAND = function rand() {
  return Math.random();
};

exports.RAND_D = function rand() {
  return Math.random();
};

exports.RANDBETWEEN = function randbetween(bottom, top) {
  if (bottom > top) {
    throw predef.Error("NUM!", "The bottom must be less than top");
  }
  return Math.floor(Math.random() * top) + bottom;
};

exports.RANDOM = function random(bottom, top) {
  if (bottom >= top) {
    throw predef.Error("NUM!", "The bottom must be less than top");
  }
  return Math.random() * (top - bottom) + bottom;
};

exports.RANDBETWEEN_D = function randbetween(bottom, top) {
  return typeof bottom != "number" || typeof top != "number"
    ? predef.Error("#VALUE!", "The values introduced are not allowed")
    : bottom > top
    ? predef.Error("NUM!", "The bottom must be less than top")
    : Math.floor(Math.random() * top) + bottom;
};

exports.ROMAN = function roman() {};

exports.ROUND = function round(number, digits) {
  var factor = Math.pow(10, digits);
  return verifyNaN(Math.round(number * factor) / factor);
};

exports.ROUND_D = function round(number, digits) {
  if (typeof number != "number" || typeof digits != "number")
    return predef.Error("#VALUE!", "The values introduced are not allowed");
  try {
    return exports.ROUND(number, digits);
  } catch (error) {
    return error;
  }
};

exports.ROUNDDOWN = function rounddown(number, digits) {
  var factor = Math.pow(10, Math.abs(digits));
  return verifyNaN(Math.floor(number * factor) / factor);
};

exports.ROUNDDOWN_D = function rounddown(number, digits) {
  if (typeof number != "number" || typeof digits != "number")
    return predef.Error("#VALUE!", "The values introduced are not allowed");
  try {
    return exports.ROUNDDOWN(number, digits);
  } catch (error) {
    return error;
  }
};

exports.ROUNDUP = function roundup(number, digits) {
  var factor = Math.pow(10, Math.abs(digits));
  return verifyNaN(Math.ceil(number * factor) / factor);
};

exports.ROUNDUP_D = function roundup(number, digits) {
  if (typeof number != "number" || typeof digits != "number")
    return predef.Error("#VALUE!", "The values introduced are not allowed");
  try {
    return exports.ROUNDUP(number, digits);
  } catch (error) {
    return error;
  }
};

exports.SEC = function sec(number) {
  if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    throw predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return 1 / Math.cos(number);
  }
};

exports.SEC_D = function sec(number) {
  if (typeof number != "number") {
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    return predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return 1 / Math.cos(number);
  }
};

exports.SECH = function sech(number) {
  if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    throw predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return 1 / Math.cosh(number);
  }
};

exports.SECH_D = function sech(number) {
  if (typeof number != "number") {
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  } else if (number < -Math.pow(2, 27) || number > Math.pow(2, 27)) {
    return predef.Error("#NUM!", "The number must be in a valid range");
  } else {
    return 1 / Math.cosh(number);
  }
};

exports.SERIESSUM = function seriessum(x, n, m, v) {
  if (v.length === 0) throw predef.Error("#NUM!", "Non-empty list expected");
  var value = v[0] * Math.pow(x, n);

  for (var i = 1; i < v.length; i++) value += v[i] * Math.pow(x, n + i * m);

  return value;
};

exports.SIGN = function sign(number) {
  return verifyNaN(Math.sign(number));
};

exports.SIGN_D = function sign(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");

  try {
    return exports.SIGN(number);
  } catch (error) {
    return error;
  }
};

exports.SINH = function sinh(number) {
  return verifyNaN(Math.sinh(number));
};

exports.SINH_D = function sinh(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  return exports.SINH(number);
};

exports.SQRT = function sqrt(number) {
  if (number < 0) throw predef.Error("#NUM!", "The number must be positive");
  return verifyNaN(Math.pow(number, 0.5));
};

exports.SQRT_D = function sqrt(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "The value introduced is not allowed");
  return exports.SQRT(number);
};

exports.SQRTPI = function sqrtpi(number) {
  if (number < 0) {
    throw predef.Error("#NUM!", "The number must be positive");
  }
  return Math.pow(number * Math.PI, 0.5);
};

exports.SQRTPI_D = function sqrtpi(number) {
  return typeof number != "number"
    ? predef.Error("#VALUE!", "The value introduced is not allowed")
    : number < 0
    ? predef.Error("#NUM!", "The number must be positive")
    : Math.pow(number * Math.PI, 0.5);
};

exports.SUBTOTAL = function subtotal() {};

exports.SUM = function sum(number) {
  var result = 0,
    i = 0;

  while (arguments[i] != undefined) {
    var partial_result = 0;
    if (arguments[i] instanceof Array) {
      for (var j = 0; j < arguments[i].length; j++)
        partial_result += exports.SUM(arguments[i][j]);

      i++;
    } else if (typeof arguments[i] == "number") partial_result = arguments[i++];
    else throw predef.Error("#VALUE!", "The values introduced are not allowed");

    result += partial_result;
  }

  return result;
};

predef.make_multiarg(exports.SUM);

exports.SUM_D = function sum(number) {
  var result = 0,
    i = 0;

  while (arguments[i] != undefined) {
    var partial_result = 0;
    if (arguments[i] instanceof Array) {
      for (var j = 0; j < arguments[i].length; j++)
        partial_result += exports.SUM_D(arguments[i][j]);

      i++;
    } else if (typeof arguments[i] == "number") partial_result = arguments[i++];
    else i++;
    // return predef.Error("#VALUE!", "The values introduced are not allowed");

    result += partial_result;
  }

  return result;
};

predef.make_multiarg(exports.SUM_D);

exports.SUMIF = function sumif(arrayEval, condition, arraySum) {
  var sum = 0;

  if (
    condition.search(">") === -1 &&
    condition.search("<") === -1 &&
    condition.search("=") === -1
  )
    condition = "===" + condition;

  for (var i = 0; i < arrayEval.length; i++) {
    try {
      if (eval(arrayEval[i] + condition)) {
        sum += arraySum[i];
      }
    } catch (err) {
      continue;
    }
  }
  return sum;
};

exports.SUMIF_D = function sumif(arrayEval, condition, arraySum) {
  if (!(arrayEval instanceof Array) && !(arraySum instanceof Array)) {
    arrayEval = [arrayEval];
    arraySum = [arraySum];
  }
  if (!(arrayEval instanceof Array) && !(arraySum instanceof Array))
    return predef.Error("VALUE!", "");

  if (
    condition.search(">") === -1 &&
    condition.search("<") === -1 &&
    condition.search("=") === -1
  )
    condition = "===" + condition;

  var sum = 0;
  for (var i = 0; i < arrayEval.length; i++) {
    try {
      if (eval(arrayEval[i] + condition)) {
        sum += arraySum[i];
      }
    } catch (err) {
      continue;
    }
  }
  return sum;
};

exports.SUMIFS = function sumifs() {};

exports.SUMPRODUCT = function sumproduct(array) {
  var result = 0;
  for (var i = 0; i < array.length; i++) {
    var j = 1;
    tmp = array[i];
    while (arguments[j] != undefined) {
      tmp *= arguments[j][i];
      j++;
    }
    result += tmp;
  }
  return result;
};
predef.make_multiarg(exports.SUMPRODUCT);

exports.SUMPRODUCT_D = function sumproduct(array) {
  var result = 0;
  for (var i = 0; i < array.length; i++) {
    var j = 1;
    tmp = array[i];
    while (arguments[j] != undefined) {
      tmp *= arguments[j][i];
      j++;
    }
    result += tmp;
  }
  return result;
};
predef.make_multiarg(exports.SUMPRODUCT_D);

exports.SUMSQ = function sumsq(number1) {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    result += arguments[i] * arguments[i];
  }
  return result;
};
predef.make_multiarg(exports.SUMSQ);

exports.SUMSQ_D = function sumsq(number1) {
  var result = 0;
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == "number") result += arguments[i] * arguments[i];
    else if (arguments[i] instanceof Array)
      for (var j = 0; j < arguments[i].length; j++)
        result += exports.SUMSQ_D(arguments[i][j]);
  }
  return result;
};
predef.make_multiarg(exports.SUMSQ_D);

exports.SUMX2MY2 = function sumx2my2(array1, array2) {
  if (array1.length !== array2.length)
    throw predef.Error("#VALUE!", "Expecting arrays of same length.");

  var sq1 = array1.map(square_num);
  var sq2 = array2.map(square_num);
  var res1 = 0,
    res2 = 0;

  for (var i in sq1) res1 += sq1[i];
  for (var j in sq2) res2 += sq2[j];

  return res1 - res2;
};

function square_num(tmp) {
  return typeof tmp === "number" ? tmp * tmp : 0;
}

exports.SUMX2MY2_D = function sumx2my2(array1, array2) {
  if (
    !(array1 instanceof Array) ||
    !(array2 instanceof Array) ||
    array1.length !== array2.length
  )
    return predef.Error("#VALUE!", "Expecting arrays of same length.");

  var sq1 = array1.map(square_num);
  var sq2 = array2.map(square_num);
  var res1 = 0,
    res2 = 0;

  for (var i in sq1) res1 += sq1[i];
  for (var j in sq2) res2 += sq2[j];

  return res1 - res2;
};

exports.SUMX2PY2 = function sumx2py2(array1, array2) {
  if (array1.length !== array2.length)
    throw predef.Error("#VALUE!", "Expecting arrays of same length.");

  var sq1 = array1.map(square_num);
  var sq2 = array2.map(square_num);
  var res1 = 0,
    res2 = 0;

  for (var i in sq1) res1 += sq1[i];
  for (var j in sq2) res2 += sq2[j];

  return res1 + res2;
};

exports.SUMX2PY2_D = function sumx2py2(array1, array2) {
  if (
    !(array1 instanceof Array) ||
    !(array2 instanceof Array) ||
    array1.length !== array2.length
  )
    return predef.Error("#VALUE!", "Expecting arrays of same length.");

  var sq1 = array1.map(square_num);
  var sq2 = array2.map(square_num);
  var res1 = 0,
    res2 = 0;

  for (var i in sq1) res1 += sq1[i];
  for (var j in sq2) res2 += sq2[j];

  return res1 + res2;
};

exports.SUMXMY2 = function sumxmy2(array1, array2) {
  if (array1.length !== array2.length)
    throw predef.Error("#VALUE!", "Expecting arrays of same length.");
  var result = 0;
  for (var i = 0; i < array1.length; i++) {
    result += Math.pow(array2[i] - array1[i], 2);
  }
  return result;
};

exports.SUMXMY2_D = function sumxmy2(array1, array2) {
  if (
    !(array1 instanceof Array) ||
    !(array2 instanceof Array) ||
    array1.length !== array2.length
  )
    return predef.Error("#VALUE!", "Expecting arrays of same length.");

  var result = 0;
  for (var i = 0; i < array1.length; i++) {
    result += Math.pow(array2[i] - array1[i], 2);
  }
  return result;
};

exports.TRUNC = function trunc(number, digits) {
  if (digits == undefined) digits = 0;

  var numberStr = number.toString().split(".");
  var factor = Math.pow(10, Math.abs(digits));
  return digits >= 0
    ? Number(
        numberStr[0] +
          (digits > 0 ? "." + numberStr[1].substring(0, digits) : "")
      )
    : Number((number / factor).toFixed(0)) * factor;
};

exports.TRUNC_D = function trunc(number, digits) {
  if (digits == undefined) digits = 0;

  var numberStr = number.toString().split(".");
  var factor = Math.pow(10, Math.abs(digits));
  return digits >= 0
    ? Number(
        numberStr[0] +
          (digits > 0 ? "." + numberStr[1].substring(0, digits) : "")
      )
    : Number((number / factor).toFixed(0)) * factor;
};

exports.EXP = function exp(number) {
  return verifyNaN(Math.exp(number));
};

exports.EXP_D = function exp(number) {
  if (typeof number != "number")
    return predef.Error("#VALUE!", "Wrong type of value");
  try {
    return exports.EXP(number);
  } catch (error) {
    return error;
  }
};

exports.PI = function pi() {
  return Math.PI;
};
