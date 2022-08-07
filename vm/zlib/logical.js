let predef = require("./predef.js");
let type = require("./type.js");

///
/// LOGICAL
///

exports.n = function n(a_val) {
  if (typeof a_val == "number" || type.iserror(a_val)) return a_val;
  else return a_val === true ? 1 : 0;
};

exports.AND = function and(logical1) {
  let result = true;
  for (let i in arguments) {
    if (typeof arguments[i] == "string") {
      throw predef.Error("#VALUE!", "The values introduced must be non-text");
    }
    result = result && arguments[i];
  }
  if (result == 0) {
    result = false;
  }
  return result;
};
predef.make_multiarg(exports.AND);

exports.AND_D = function and(logical1) {
  let result = true;
  for (let i in arguments) {
    // if (typeof arguments[i] == "string")
    // return predef.Error("#VALUE!","The values introduced must be non-text");

    if (!result) break;

    let partial_result = true;

    if (arguments[i] instanceof Array)
      for (let j = 0; j < arguments[i].length; j++) {
        if (!partial_result) break;
        partial_result =
          partial_result !== false && exports.AND_D(arguments[i][j]);
      }
    else partial_result = arguments[i];

    result = result && partial_result !== false;
  }
  if (result == 0) result = false;

  return result;
};
predef.make_multiarg(exports.AND_D);

alternative_and = function (logical1) {
  let result = true;
  for (let i in arguments) {
    // if (typeof arguments[i] == "string")
    // return predef.Error("#VALUE!","The values introduced must be non-text");
    if (!result) break;

    let partial_result = true;

    if (arguments[i] instanceof Array)
      for (let j = 0; j < arguments[i].length; j++) {
        if (typeof arguments[i][j] != "boolean")
          throw predef.Error(
            "#TYPE!",
            "nand expected booleans but got something else."
          );

        if (!partial_result) break;
        partial_result =
          partial_result !== false && alternative_and(arguments[i][j]);
      }
    else {
      if (typeof arguments[i] != "boolean")
        throw predef.Error(
          "#TYPE!",
          "nand expected booleans but got something else."
        );
      partial_result = arguments[i];
    }

    result = result && partial_result !== false;
  }
  if (result == 0) result = false;

  return result;
};

exports.NAND_D = function NAND_D() {
  try {
    return !alternative_and.apply(null, arguments);
  } catch (err) {
    return err;
  }
};
predef.make_multiarg(exports.NAND_D);

exports.FALSE = function _false() {
  return false;
};

exports.IF = function _if(test, vTrue, vFalse) {
  if (typeof test != "boolean") {
    throw predef.Error(
      "#VALUE!",
      "the value introduced for test must be boolean"
    );
  }
  return test ? vTrue : vFalse;
};

exports.IF_D = function _if(test, vTrue, vFalse) {
  return typeof test != "boolean"
    ? predef.Error("#VALUE!", "The value introduced for test must be boolean")
    : test
    ? vTrue
    : vFalse;
};

exports.IFERROR = function iferror(value, value_error) {
  return predef.IVL(value, value_error);
};

exports.IFERROR_D = function iferror(value, value_error) {
  return predef.IVL(value, value_error);
};

exports.IFNA = function ifna(value, value_na) {
  return predef.IVL(value, value_na)["code"] == "#N/A" ? value_na : value;
};

exports.IFNA_D = function ifna(value, value_na) {
  return predef.IVL(value, value_na)["code"] == "#N/A" ? value_na : value;
};

exports.NOT = function not(logical) {
  if (typeof logical != "boolean") {
    throw Error("#VALUE!", "The value introduced must be boolean");
  }
  return !logical;
};

exports.NOT_D = function not(logical) {
  return typeof logical == "boolean"
    ? !logical
    : predef.Error("#VALUE!", "The value introduced must be boolean");
};

exports.OR = function or(logical1) {
  let result = false;
  for (let i in arguments) {
    if (typeof arguments[i] == "string") {
      throw predef.Error("#VALUE!", "The values introduced must be non-text");
    }
    result = result || arguments[i];
  }
  if (result == 0) {
    result = false;
  }
  return result;
};
predef.make_multiarg(exports.OR);

exports.OR_D = function or(logical1) {
  let result = false;
  for (let i in arguments) {
    // if (typeof arguments[i] == "string")
    // return predef.Error("#VALUE!","The values introduced must be non-text");

    if (result) break;

    let partial_result = false;

    if (arguments[i] instanceof Array)
      for (let j = 0; j < arguments[i].length; j++) {
        if (partial_result) break;

        // something === true might seem stupid, but unitype does weird things...
        partial_result =
          partial_result === true || exports.OR_D(arguments[i][j]);
      }
    else partial_result = arguments[i];

    result = result || partial_result === true;
  }

  return result;
};
predef.make_multiarg(exports.OR_D);

alternative_or = function (logical1) {
  let result = false;
  for (let i in arguments) {
    if (result) break;

    let partial_result = false;

    if (arguments[i] instanceof Array)
      for (let j = 0; j < arguments[i].length; j++) {
        if (typeof arguments[i][j] != "boolean")
          throw predef.Error(
            "#TYPE!",
            "nand expected booleans but got something else."
          );
        if (partial_result) break;

        // something === true might seem stupid, but unitype does weird things...
        partial_result =
          partial_result === true || alternative_or(arguments[i][j]);
      }
    else {
      if (typeof arguments[i] != "boolean")
        throw predef.Error(
          "#TYPE!",
          "nand expected booleans but got something else."
        );
      partial_result = arguments[i];
    }

    result = result || partial_result === true;
  }

  return result;
};

exports.NOR_D = function NOR_D() {
  try {
    return !alternative_or.apply(null, arguments);
  } catch (err) {
    return err;
  }
};
predef.make_multiarg(exports.NOR_D);

exports.TRUE = function _true() {
  return true;
};

exports.XOR = function xor(logical1) {
  if (typeof logical == "string") {
    throw predef.Error("#VALUE!", "The values introduced must be non-text");
  }
  let result = logical1,
    i = 1;
  while (arguments[i] != undefined) {
    if (typeof arguments[i] == "string") {
      throw predef.Error("#VALUE!", "The values introduced must be non-text");
    }
    result = (result || arguments[i]) && !(result && arguments[i]);
    i++;
  }
  if (result == 0) {
    result = false;
  }
  return result;
};

exports.XOR_D = function xor(logical1) {
  if (typeof logical1 == "string") {
    return predef.Error("#VALUE!", "The values introduced must be non-text");
  }
  let result = logical1,
    i = 1;
  while (arguments[i] != undefined) {
    if (typeof arguments[i] == "string") {
      return predef.Error("#VALUE!", "The values introduced must be non-text");
    }
    result = (result || arguments[i]) && !(result && arguments[i]);
    i++;
  }
  if (result == 0) {
    result = false;
  }
  return result;
};
