// varlib.js

// Take care
// http://stackoverflow.com/questions/359494/which-equals-operator-vs-should-be-used-in-javascript-comparisons

let type = require("./type.js");
let predef = require("./predef.js");
let lazy = require("./lazy.js");

function eval_if_lazy(exp) {
  if (exp instanceof Function && exp.length == 0) return exp();
  else return exp;
}

this.isFunction = function (f, args) {
  if (typeof f != "function")
    return type.Invalid.constructor(
      "#VALUE!",
      "Trying to call non-function expression"
    );

  if (f.length != args.length)
    if (!f.hasOwnProperty("multiarg")) {
      let error_message =
        "Wrong number of arguments in function call. \
                Expected " +
        f.length +
        " and got " +
        args.length +
        " .";

      return type.Invalid.constructor("#ARGS", error_message);
    }

  try {
    res = f.apply(f, args);
  } catch (err) {
    // console.log(err.message);
    // console.log(err.fileName);
    // console.log(err.lineNumber);
    // console.log(err.columnNumber);
    // console.log(err.stack);
    if (type.isinvalid(err)) return err;
    else throw err;
    // throw new Error("Run-time function error.");
  }

  return res;
};

this.enforceType = function (value, a_js_type) {
  if (typeof value !== a_js_type) {
    // console.log("Got ========");
    // console.log(value);
    // console.log("expected");
    // console.log(a_js_type);
    // console.log("end=====");
    let description =
      "Got type " + typeof f + " but " + a_js_type + " was expected.";
    throw type.Invalid.constructor("#TYPE!", description);
  }
  return value;
};

check_rectangularity = function (arr, { sub_type, dims }) {
  // Empty array is compliant with multi-dim arrays
  if (arr instanceof Array && arr.length === 0) return arr;

  // Collect info about the length of every dimension
  let expected_lengths = [];
  let arr_walker = arr;
  try {
    for (let i = 0; i < dims - 1; i++) {
      expected_lengths.push(arr_walker[0].length);
      arr_walker = arr_walker[0];
    }
  } catch (err) {
    throw type.Invalid.constructor("#TYPE!", "Missing dimensions on array");
  }

  check_rectangularity_aux = function (arr, dim) {
    // Enfonce sub-type to last level
    if (dim === 1)
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length !== expected_lengths[expected_lengths.length - 1])
          throw type.Invalid.constructor("#TYPE!", "Array is not rectangular");

        for (let j = 0; j < arr[i].length; j++)
          arr[i][j] = exports.enforce_type(sub_type, arr[i][j]);
      }
    else {
      let dim_len = expected_lengths[expected_lengths.length - dim];

      for (let i = 0; i < arr.length; i++) {
        if (dim > 1 && !(arr[i] instanceof Array))
          throw type.Invalid.constructor("#TYPE!", "Array is not rectangular");

        if (arr[i].length !== dim_len)
          throw type.Invalid.constructor("#TYPE!", "Array is not rectangular");

        check_rectangularity_aux(arr[i], dim - 1);
      }
    }
  };

  check_rectangularity_aux(arr, expected_lengths.length);

  return arr;
};

// THIS MIGHT NEED A CONTEXT
this.enforce_type = function enforce_type(a_type, a_value) {
  // console.log(`Checking ${type.toStringLilly(a_type)} and ${type.toStringLilly(a_value)}`);
  try {
    switch (a_type.self_type_rep) {
      case "array":
        if (!(a_value instanceof Array)) {
          throw type.Invalid.constructor(
            "#VALUE!",
            "Expected array but got something else"
          );
        }

        if (a_type.dims === 1) {
          for (let i = 0; i < a_value.length; i++)
            a_value[i] = enforce_type(a_type.sub_type, a_value[i]);

          return a_value;
        } else {
          return check_rectangularity(a_value, a_type);
        }

        break;
      case "lazy var":
      case "var":
        // return CopyObject(a_value,a_context);
        break;
      case "lazy":
        // Skipping lazy var
        if (
          a_type.content.self_type_rep === "var" ||
          a_type.content.self_type_rep === "lazy var"
        )
          // return CopyObject(a_value,a_context);
          break;
        else {
          if (a_value === null)
            return new lazy.LazyObject(
              () => null,
              () => "?",
              "?"
            );
          // CHECK: Right now there is no way to check what's inside
          else if (a_value instanceof lazy.LazyObject) {
            // console.log("uh HUh, it was")
            return a_value;
          } else {
            let partial_res = exports.enforce_type(a_type.content, a_value);

            let lazified = new lazy.LazyObject(
              () => partial_res,
              () => type.toStringLilly(partial_res),
              String(function () {
                return partial_res;
              })
            );
            // console.log("     >final"+lazified);
            return lazified;
          }
        }

        break;
      case "double":
        return exports.enforce_double(a_value);
        break;
      case "int":
        return exports.enforceint(a_value);
        break;
      case "range":
        if (a_value === null)
          throw type.Invalid.constructor(
            "#VALUE!",
            "Expected range but got null"
          );

        if (!a_value.fst || !a_value.snd)
          throw type.Invalid.constructor(
            "#VALUE!",
            "Expected range but got something else"
          );

        let a = exports.enforceint(a_value.fst);
        let b = exports.enforceint(a_value.snd);
        return a_value;
        break;

      case "nominal":
        if (a_value === null || !a_value.hasOwnProperty("content"))
          throw type.Invalid.constructor(
            "#VALUE!",
            "Expected expression of type " +
              a_type.name +
              " but got something else."
          );

        return exports.enforce_type(a_type.content, a_value.content);
        break;

      case "function":
        // console.log("Insufficient information to check if expression has that function type.");
        break;
      case "namedfield":
        // console.log("NAMED FIELD");
        // console.log(a_type.label)
        // console.log(a_type.type)
        return exports.enforce_type(a_type.type, a_value);
        // If both are named fields, do type conversions, and stay with the name on the left
        // If the right has name, only convert types
        // If only the left has names, convert type and keep the left name

        break;
      case "struct":
        // console.log("CHECKING STRUCT")
        if (type.is_struct(a_value)) {
          // console.log(a_type.sub_types.length)
          // console.log(a_value.type.sub_types.length)
          if (a_type.sub_types.length != a_value.type.sub_types.length) {
            let err_msg =
              "Run-time check failed, cannot convert struct, number of fields do not match.";
            throw type.Invalid.constructor("#VALUE!", err_msg);
          }

          // if (!type.equal_types(a_type,a_value.type) ){
          // console.log("FAILED NOT EQUAL TYPES")

          let verified_vals = [];
          for (let i = 0; i < a_value.type.sub_types.length; i++) {
            // console.log(`Trying to convert ${a_value.get(i)} `)
            verified_vals.push(
              exports.enforce_type(a_type.sub_types[i], a_value.get(i))
            );
          }

          return new type.StructOf.constructor(a_type, verified_vals);
          // }
          // else{
          // console.log("EQUAL TYPES, RETURNING")
          // return a_value;
          // }
        }
        // Is actually it was a tuple
        else if (type.is_tuple(a_value)) {
          // Check number of fields and fo convertion
          if (a_type.sub_types.length !== a_value.type.sub_types.length) {
            let err_msg =
              "Run-time check failed. Expected struct must have " +
              a_type.sub_types.length +
              " fields but only " +
              a_value.type.sub_types.length +
              " where provided.";

            throw type.Invalid.constructor("#VALUE!", err_msg);
          }

          let verified_vals = [];
          // This SHOULD BE A CONFORM, but I don't have on on JS, only on oCaml, sorry :(
          for (let i = 0; i < a_value.type.sub_types.length; i++)
            verified_vals.push(
              exports.enforce_type(
                a_type.sub_types[i].type,
                a_value.get_content()[i]
              )
            );

          return new type.StructOf.constructor(a_type, verified_vals);
          // return type.tuple_of_struct(a_value)
        } else
          throw type.Invalid.constructor(
            "#VALUE!",
            "Expected expression of type " +
              type.toStringLilly(a_type) +
              " but got something else."
          );

        break;
      case "tuple":
        // console.log(`${type.is_tuple(a_value)} and ${type.is_struct(a_value)}`)
        if (!type.is_tuple(a_value) && !type.is_struct(a_value))
          throw type.Invalid.constructor(
            "#VALUE!",
            "Cannot convert such value to a tuple."
          );

        if (a_type.sub_types.length != a_value.type.sub_types.length) {
          let err_msg =
            "Run-time check failed, cannot convert to tuple, number of fields do not match.";
          throw type.Invalid.constructor("#VALUE!", err_msg);
        }

        if (type.is_tuple(a_value)) {
          let verified_vals = [];
          for (let i = 0; i < a_value.type.sub_types.length; i++) {
            // console.log(`Trying to convert ${a_value.get(i)} `)
            verified_vals.push(
              exports.enforce_type(
                a_type.sub_types[i],
                a_value.get_content()[i]
              )
            );
          }

          return new type.TupleOf.constructor(a_type, verified_vals);
        } else {
          let verified_vals = [];
          for (let i = 0; i < a_value.type.sub_types.length; i++) {
            // console.log(`Trying to convert ${a_value} `)
            verified_vals.push(
              exports.enforce_type(a_type.sub_types[i], a_value.get(i))
            );
          }

          return new type.TupleOf.constructor(a_type, verified_vals);
        }

        // Is actually it was a tuple
        // Is actually a struct
        return a_value;
        break;
      default:
        let what;
        return a_value;
    }

    return a_value;
  } catch (err) {
    // console.log("IT WAS AN ERROR")
    // console.log(err);
    // if err is a Lilly exception we should throw it not catch it always
    throw type.Invalid.constructor(
      "#VALUE!",
      "Run-time exception thrown during typecheck"
    );
  }
};

this.enforceint = function (n) {
  if (typeof n !== "number" || n % 1 !== 0) {
    throw new type.Invalid.constructor(
      "#VALUE!",
      "int expected, but something else found at run-time"
    );
  }

  return n;
};

this.enforce_double = function (n) {
  if (typeof n !== "number") {
    // console.log(type.toStringLilly(n));
    throw new type.Invalid.constructor(
      "#VALUE!",
      "double expected, but something else found at run-time"
    );
  }

  return n;
};

this.enforce_string = function (n) {
  if (typeof n !== "string")
    throw new type.Invalid.constructor(
      "#VALUE!",
      "string expected, but something else found at run-time"
    );

  return n;
};

this.enforce_bool = function (n) {
  if (typeof n !== "boolean")
    throw new type.Invalid.constructor(
      "#VALUE!",
      "bool expected, but something else found at run-time"
    );

  return n;
};

this.isfunction = function (f, args) {
  if (typeof f !== "function") {
    throw new Error('"' + n + "\" isn't a function.");
  }

  if (f.length !== args.length) {
    throw new Error('"' + n + "\" isn't a function.");
  }
  try {
    res = f.apply(f, args);
  } catch (err) {
    throw new Error("Run-time function error.");
  }

  return res;
};

this.toDouble = function (n) {
  if (!this.isnumber(n)) {
    console.log("VMError: " + n + " isn't an double.");
    process.exit();
  }

  return number(n);
};

this.eq_var_var = function (x, y) {
  return type.equals(x, y);
};

this.neq_var_var = function (x, y) {
  return !type.equals(x, y);
};

this.le_var_var = function (x, y) {
  return x <= y;
};

this.ge_var_var = function (x, y) {
  return x >= y;
};

this.lt_var_var = function (x, y) {
  return x < y;
};

this.gt_var_var = function (x, y) {
  return x > y;
};

this.safeLog = function (num) {
  if (num <= 0) return type.invalid_num();
  else return Math.log(num);
};

this.safeDivision = function (a, b) {
  // CHECK: Right way to do it but it needs a catch mechanism on every step
  // if (b == 0) throw type.invalid_div0();

  if (b == 0) return type.invalid_div0();
  else return a / b;
};

this.safeDiv = function (a, b) {
  if (b == 0) return type.invalid_div0();
  else return Math.floor(a / b);
};

this.bwand_var_var = function (a, b) {
  if (typeof a == "string" && typeof b == "string") return a + b;
  else if (typeof a == "number" && typeof b == "number") return a & b;
  else return type.invalid_nop();
};

this.bwand_string_string = function (a, b) {
  return a + b;
};

this.bwand_var_string = function (a, b) {
  if (typeof a == "string") return a + b;
  else return type.invalid_nop();
};

this.bwand_string_var = function (a, b) {
  if (typeof b == "string") return a + b;
  else return type.invalid_nop();
};

this.bwand_int_int = function (a, b) {
  return a & b;
};

this.bwand_var_int = function (a, b) {
  if (typeof b == "string") return a & b;
  else return type.invalid_nop();
};

this.bwand_int_var = function (a, b) {
  if (typeof b == "string") return a & b;
  else return type.invalid_nop();
};

let date = require("./date.js");

this.plus_var_var = function (x, y) {
  if (typeof x === "number" && typeof y === "number") return x + y;
  else if (x instanceof Date && typeof y === "number")
    return date.date_add_n(x, y);
  else if (
    type.LillyType.is_a(x, type.Date) &&
    type.LillyType.is_a(y, type.Time)
  )
    return date.date_time_combine(x, y);
  else if (
    type.LillyType.is_a(x, type.Datetime) &&
    type.LillyType.is_a(y, type.Time)
  )
    return date.datetime_time_add(x, y);
  else return type.invalid_value();
};

this.mod_var_var = function (x, y) {
  if (type.isnumber(x) && type.isnumber(y)) return x % y;
  else return type.invalid_value();
};

this.minus_var_var = function (x, y) {
  if (type.isnumber(x) && type.isnumber(y)) return x - y;
  else if (x instanceof Date && typeof y == "number")
    return date.date_subs_n(x, y);
  else if (
    type.LillyType.is_a(x, type.Datetime) &&
    type.LillyType.is_a(y, type.Datetime)
  )
    return date.datetime_diff(x, y);
  else if (
    type.LillyType.is_a(x, type.Date) &&
    type.LillyType.is_a(y, type.Date)
  )
    return date.datetime_diff(x, y);
  else if (
    type.LillyType.is_a(x, type.Datetime) &&
    type.LillyType.is_a(y, type.Date)
  )
    return date.datetime_diff(x, y);
  else if (
    type.LillyType.is_a(x, type.Datetime) &&
    type.LillyType.is_a(y, type.Time)
  )
    return date.datetime_time_subs(x, y);
  else return type.invalid_value();
};

this.div_var_var = function (x, y) {
  if (type.isnumber(x) && type.isnumber(y))
    if (y == 0) return type.invalid_div0();
    else return x / y;
  else return type.invalid_value();
};

this.div_int_var = function (x, y) {
  if (type.isnumber(y)) return exports.safeDivision(x, y);
  else return type.invalid_value();
};

this.div_var_int = function (x, y) {
  if (type.isnumber(x)) return exports.safeDivision(x, y);
  else return type.invalid_value();
};

this.mult_var_var = function (x, y) {
  if (typeof x === "number" && typeof y === "number") return x * y;
  else if (y !== null && y.type == type.Time && typeof x === "number")
    return date.time_by_scalar(x, y);
  else if (x !== null && x.type == type.Time && typeof y === "number")
    return date.time_by_scalar(x, y);
  else return type.invalid_value();
};

this.powerof_var_var = function (x, y) {
  if (typeof x === "number" && typeof y === "number") return x ** y;
  else return type.invalid_value();
};

this.and_var_var = function (a, b) {
  if (typeof a != "boolean")
    return predef.Error(
      "#VALUE!",
      "the value introduced for left operand in '&&' must be boolean"
    );
  if (typeof b != "boolean")
    return predef.Error(
      "#VALUE!",
      "the value introduced for right operand in '&&' must be boolean"
    );

  return a && b;
};

this.or_var_var = function (a, b) {
  if (typeof a != "boolean")
    return predef.Error(
      "#VALUE!",
      "the value introduced for left operand in '||' must be boolean"
    );
  if (typeof b != "boolean")
    return predef.Error(
      "#VALUE!",
      "the value introduced for right operand in '||' must be boolean"
    );

  return a || b;
};

this.bwand_var_var = function (a, b) {
  if (typeof a == "number" && typeof b == "number") return a & b;
  else if (typeof a == "string" && typeof b == "string") return a + b;
  else return predef.Error("#VALUE!", "The values provided have wrong types");
};

this.milliseconds = function milliseconds(a) {
  if (a !== null && a.hasOwnProperty("getMilliseconds"))
    return a.getMilliseconds();
  else
    return predef.Error(
      "#VALUE!",
      "millisecond was expecting something of type time or datetime."
    );
};

this.utc = function utc(a) {
  if (type.LillyType.is_a(a, type.Datetime)) return date.utc(a);
  else
    return predef.Error(
      "#VALUE!",
      "utc was expecting something of type datetime."
    );
};
