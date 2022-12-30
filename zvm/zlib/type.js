const { CopyObject } = require("./deepCopy.js");
const { has } = require("./utils.js");

let lazy = require("./lazy.js");

make_string = function (an_object) {
  if (typeof an_object === "string") return '"' + String(an_object) + '"';
  else return String(an_object);
};

this.LillyType = function (string) {
  // this.type          = type ? type : "type";
  this.self_type_rep = string;
  this.toString = function () {
    return this.self_type_rep;
  };
  this.constructor = undefined;
};

// Type Type
this.Type = new this.LillyType("type");
this.Type.type = this.Type;

this.LillyType.prototype.type = this.Type;

// Horrible solution PATCH FOR SYS SAVE
this.show_quote_on_lazy = false;

this.toStringLilly = function toStringLilly(a) {
  // console.log("> printing for type " + typeof(a));
  switch (typeof a) {
    case "function":
      if (a.hasOwnProperty("source_code")) return String(a);
      else return a.name;
      break;
    case "number":
    case "boolean":
      return String(a);
      break;
    case "string":
      return '"' + a + '"';
      break;
    case "object":
      if (a == null) return "?";
      else if (a instanceof Array) {
        // console.log(">     instance_of_array");
        let inner_content = a.map((x) => exports.toStringLilly(x)).join(", ");
        return "[" + inner_content + "]";
      } else if (a instanceof Error) return "#ERR!";
      else return String(a);

      break;
  }
};

this.Int = new this.LillyType("int");
this.Double = new this.LillyType("double");
this.Invalid = new this.LillyType("invalid");
this.Bool = new this.LillyType("bool");
this.Var = new this.LillyType("lazy var");
this.String = new this.LillyType("string");
this.Date = new this.LillyType("date");
this.Time = new this.LillyType("time");
this.Datetime = new this.LillyType("datetime");
this.Null = new this.LillyType("null");
this.Undefined = new this.LillyType("undefined");
this.RangeType = new this.LillyType("range");
this.Array = new this.LillyType("array");
this.Infer = new this.LillyType("::");
// this.FunctionT = new this.LillyType("Function",this.Type)

this.NamedField = function (name, tp) {
  new_type = {};
  new_type.type = tp;
  new_type.label = name;
  new_type.self_type_rep = "namedfield";
  new_type.toString = function () {
    return this.type.toString() + " " + name;
  };
  new_type.constructor = undefined;

  return new_type;
};

this.Function = function (field_list, ret_type) {
  function_type = function () {
    this.type = exports.Type;
    this.fields = field_list;
    this.ret_type = ret_type;
    this.self_type_rep = "function";
    this.toString = function () {
      let str_acc = "";
      for (let i = 0; i < this.fields.length; i++)
        str_acc += this.fields[i].toString() + ",";

      if (str_acc != "") str_acc = str_acc.slice(0, -1);

      return "fun(" + str_acc + ") => " + this.ret_type.toString();
    };
    // function_type.constructor = undefined;
    this.constructor = function (a_fun) {
      // If function had type in it, we could do some cool runtime checks
      if (typeof a_fun === "function") return a_fun;
      else
        throw exports.Invalid.constructor(
          "#VALUE!",
          "Cannot convert value to function."
        );
    };
  };

  return new function_type();
};

this.LazyOf = function (a_type) {
  lazy_type = function () {
    this.type = exports.Type;
    this.content = a_type;
    this.self_type_rep = "lazy";
    this.toString = function () {
      // return "lazy " + this.content.toString();
      return "lazy " + this.content.toString();
    };
    lazy_type.constructor = function (a) {
      return a;
    };
  };

  if (a_type == exports.Var) return exports.Var;
  else return new lazy_type();
};

this.ArrayOf = function (lillyType, dims) {
  arr_type = function () {
    this.type = exports.Type;
    this.sub_type = lillyType;
    this.dims = dims;
    this.self_type_rep = "array";

    this.toString = function () {
      // let dim_commas = this.dims.reduce((acc,x) => acc + ",","").slice(1);
      let dim_commas = "";
      for (let i = 2; i <= this.dims; i++) dim_commas += ",";

      return "array[" + dim_commas + "] => " + this.sub_type.toString();
    };
    this.constructor = undefined;
  };

  return new arr_type();
};

has_structure = undefined;

dynamic_toString = function (object1, object2) {
  object1.toString = function () {
    if (object2.hasOwnProperty("toStringSimplified"))
      return object1.type.name + object1.content.toStringSimplified();
    // return object1.type.name + object2.toStringSimplified();
    else
      return (
        object1.type.name + "(" + exports.toStringLilly(object1.content) + ")"
      );
    // return object1.type.name+"("+object2.toString()+")"
  };
};

redirect_attribute = function (object1, object2, attribute, n_args) {
  if (object2 != null && object2.hasOwnProperty(attribute)) {
    switch (n_args) {
      case 0:
        object1[attribute] = function () {
          return object2[attribute]();
        };
        break;
      case 1:
        object1[attribute] = function (a) {
          return object2[attribute](a);
        };
        break;
      case 2:
        object1[attribute] = function (a, b) {
          return object2[attribute](a, b);
        };
        break;
      case 3:
        object1[attribute] = function (a, b, c) {
          return object2[attribute](a, b, c);
        };
        break;
    }
  }
};

with_content_getter = {
  get_content: function () {
    return this.content.get_content();
  },
};

this.Nominal = function (name, type) {
  nominal_type = function (father_type, name, type) {
    father_type.type = exports.Type;
    father_type.content = type;
    father_type.name = name;
    father_type.self_type_rep = "nominal";
    father_type.toString = function () {
      return name;
    };

    father_type.constructor = function (attributes) {
      let new_instance = Object.create(with_content_getter);

      if (!has_structure(father_type.content))
        if (typeof father_type.content.constructor == "function")
          new_instance.content = father_type.content.constructor(attributes[0]);
        else new_instance.content = attributes[0];
      else
        new_instance.content = new father_type.content.constructor(
          father_type.content,
          attributes
        );

      redirect_attribute(new_instance, new_instance.content, "get", 1);
      redirect_attribute(new_instance, new_instance.content, "set", 2);

      new_instance.type = father_type;

      if (new_instance.content.hasOwnProperty("toString"))
        new_instance.old_toString = new_instance.content.toString;

      dynamic_toString(new_instance, new_instance.content);

      if (new_instance.content.hasOwnProperty("copy"))
        new_instance.content.old_copy = new_instance.content.copy;

      new_instance.copy = function (context) {
        let new_new_instance = {};

        if (new_instance.content.hasOwnProperty("old_copy")) {
          new_new_instance.content = new_instance.content.old_copy(context);
          dynamic_toString(new_new_instance, new_new_instance.content);
          new_new_instance.get_content = new_instance.get_content;

          redirect_attribute(
            new_new_instance,
            new_new_instance.content,
            "get",
            1
          );
          redirect_attribute(
            new_new_instance,
            new_new_instance.content,
            "set",
            2
          );

          new_new_instance.old_copy = new_instance.old_copy;
          new_new_instance.copy = new_instance.copy;
          new_new_instance.type = new_instance.type;
        } else {
          // Keeping same old things on a new object
          // We could preform a copy array on the content
          new_new_instance.content = new_instance.content;
          // new_new_instance.toString  = new_instance.toString;
          dynamic_toString(new_new_instance, new_new_instance.content);
          new_new_instance.copy = new_instance.copy;
          new_new_instance.type = new_instance.type;
        }

        return new_new_instance;
      };
      return new_instance;
    };
  };

  let new_nominal = {};
  nominal_type(new_nominal, name, type);

  return new_nominal;
};

/**
 *  Generic Lilly Type functions
 */

this.is_lilly_subtype = function (a) {
  try {
    let is_basic =
      [
        exports.Type,
        exports.Int,
        exports.Double,
        exports.Invalid,
        exports.Bool,
        exports.Var,
        exports.String,
        exports.Date,
        exports.Time,
        exports.Datetime,
        exports.Null,
        exports.Undefined,
        exports.RangeType,
        exports.TupleOf,
        exports.StructOf,
      ].indexOf(a.type) != -1;

    return is_basic || (a != null && a.hasOwnProperty("type"));
  } catch (err) {
    return false;
  }
};

has_structure = function (a) {
  try {
    return (
      (a.type == exports.Type && a.self_type_rep === "struct") ||
      a.self_type_rep === "tuple"
    );
  } catch (err) {
    return false;
  }
};

this.is_nominal = function (exp) {
  return (
    exp != null && exp.type != null && exp.type.self_type_rep === "nominal"
  );
};

this.is_lilly_type = function (a) {
  try {
    let res = a instanceof exports.LillyType;
    return res;
  } catch (err) {
    return false;
  }
};

this.LillyType.typeof = function (a) {
  switch (typeof a) {
    // Not best approach
    case "number":
      if (Number.isInteger(a)) return exports.Int;
      else if (Number.isFinite(a)) return exports.Double;
      else return exports.Double;
      break;
    case "boolean":
      return exports.Bool;
    case "string":
      return exports.String;
    case "undefined":
      return exports.Var;
    case "object":
      if (a == null) return exports.Null;
      else if (exports.is_lilly_type(a)) return exports.Type;
      else if (exports.is_lilly_subtype(a)) return a.type;
      else if (a instanceof Array) return exports.Array;
      else if (a instanceof Error) {
        // console.trace();
        console.log(a);
        return exports.Invalid;
      } else {
        // console.log("VMError:Trying to get type of unexpected expresion (" + String(a) + ")");
        // return null;
        return exports.Var;
      }
      break;
  }
};

this.LillyType.is_a = function (exp, type) {
  try {
    return exports.LillyType.typeof(exp) == type || exp.type == type;
  } catch (err) {
    return false;
  }
};

this.isinvalid = function isinvalid(a) {
  return exports.LillyType.is_a(a, exports.Invalid);
};
this.isbool = function isbool(a) {
  return typeof a == "boolean";
};
this.isint = function isint(a) {
  return exports.LillyType.is_a(a, exports.Int);
};
this.isstring = function isstring(a) {
  return exports.LillyType.is_a(a, exports.String);
};
this.isnotstring = function isnotstring(a) {
  return !exports.LillyType.is_a(a, exports.String);
};
this.isdate = function isdate(a) {
  return exports.LillyType.is_a(a, exports.Date);
};
this.istime = function istime(a) {
  return exports.LillyType.is_a(a, exports.Time);
};
this.isdatetime = function isdatetime(a) {
  return exports.LillyType.is_a(a, exports.Datetime);
};
this.isnull = function isnull(n) {
  return n == null;
};
this.isblank = function isblank(n) {
  return typeof n == "undefined" || exports.isnull(n);
};
this.isnumber = function isnumber(a) {
  return typeof a == "number";
};
this.isreal = undefined;

this.enforce_number = function (a) {
  if (isnumber) return a;
  else exports.Invalid.constructor("#TYPE!");
};

/**
 *  Invalid Type functions
 */

// Invalid_class = function(code,message) {
//     this.code    = typeof(code)    == "string" ? code    : "#VALUE!";
//     this.message = typeof(message) == "string" ? message : "";
// }

class Invalid_class {
  constructor(code, message) {
    this.code = typeof code == "string" ? code : "#VALUE!";
    this.message = typeof message == "string" ? message : "";
    this.type = exports.Invalid;
  }

  toString() {
    return `invalid("${this.code}","${this.message}")`;
  }
}

// Invalid_class.prototype.type = exports.Invalid;
// Invalid_class.prototype.toString = function(){return this.code}

this.Invalid.constructor = function (code, message) {
  return new Invalid_class(code, message);
};

this.error_type = function (an_invalid) {
  switch (an_invalid.code) {
    case "#NULL!":
      return 1;
    case "#DIV/0!":
      return 2;
    case "#VALUE!":
      return 3;
    case "#REF!":
      return 4;
    case "#NAME?":
      return 5;
    case "#NUM!":
      return 6;
    case "#N/A":
      return 7;
    default:
      throw exports.Invalid.constructor("#N/A", "unexpected invalid value");
  }
};

this.iserror = function (a_value) {
  return exports.LillyType.is_a(a_value, exports.Invalid);
};

// Really excel?
this.iserr = function (a_value) {
  return exports.iserror(a_value) && a_value.code != "#N/A";
};
this.isna = function (a_value) {
  return exports.iserror(a_value) && a_value.code == "#N/A";
};

// Invalid helpers
this.invalid_nop = function () {
  return new Invalid_class("#N/OP!");
};
this.invalid_value = function () {
  return new Invalid_class("#VALUE!");
};
this.invalid_div0 = function () {
  return new Invalid_class("#DIV/0!");
};
this.invalid_num = function () {
  return new Invalid_class("#NUM!");
};
this.invalid_na = function () {
  return new Invalid_class("#N/A");
};

// Function to extract the error description out of an invalid value
this.errmsg = function (invalid) {
  if (exports.LillyType.is_a(invalid, exports.Invalid)) return invalid.message;
  else return new Invalid_class("#TYPE!", "Invalid argument was expected.");
};

/**
 *  Null Type functions
 */

this.Null.constructor = function (anything) {
  return null;
};

/**
 *  Bool Type functions
 */

this.Bool.constructor = function (a_value) {
  switch (typeof a_value) {
    // Not best approach
    case "number":
      return a_value != 0;
      break;
    case "boolean":
      return a_value;
      break;
    case "string":
      let _temp = a_value.toLowerCase();
      if (_temp == "true") return true;
      else if (_temp == "false") return false;
      else return exports.invalid_value();
      break;
    default:
      return exports.invalid_value();
  }
};

/**
 *  Int Type functions
 */

this.Int.constructor = function (maybe_number) {
  try {
    switch (typeof maybe_number) {
      case "number":
        return Math.floor(maybe_number);
      case "string":
        let res = parseFloat(maybe_number);
        return isNaN(res) ? exports.invalid_value() : Math.floor(res);
      case "boolean":
        return maybe_number ? 1 : 0;
      default:
        return exports.invalid_value();
    }
  } catch (err) {
    throw new Error('"' + maybe_number + '" could not be converted to int.');
  }
};

/**
 *  Double Type functions
 */

this.Double.constructor = function (maybe_number) {
  try {
    switch (typeof maybe_number) {
      case "number":
        return maybe_number;
      case "string":
        let res = parseFloat(maybe_number);
        return isNaN(res) ? exports.invalid_value() : res;
      case "boolean":
        return maybe_number ? 1 : 0;
      default:
        return exports.invalid_value();
    }
  } catch (err) {
    throw new Error('"' + maybe_number + '" could not be converted to int.');
  }
};

/**
 *  String/Char Type functions
 */

this.String.constructor = function (anything) {
  if (anything === null) return "";
  else if (anything instanceof Array)
    return "[" + String(anything).split(",").join(", ") + "]";
  else return String(anything);
};

/**
 *  Tuple constructor
 */

tuple_of_constructor = function (type_list, exp_list, is_var) {
  this.type = type_list;
  this.content = exp_list;

  this.is_var = is_var === undefined ? false : is_var;

  let father = this;

  this.get_content = function () {
    return this.content;
  };

  this.toString = function () {
    return (
      "(" + father.content.map((x) => exports.toStringLilly(x)).join(", ") + ")"
    );
  };

  this.toStringSimplified = function () {
    return (
      "(" + father.content.map((x) => exports.toStringLilly(x)).join(", ") + ")"
    );
  };

  this.copy = function (context = null) {
    let temp = new exports.TupleOf.constructor(
      new exports.TupleOf(CopyObject(father.type.sub_types, context)),
      CopyObject(father.content, context),
      father.is_var
    );
    return temp;
  };
};

this.TupleOf = function (lillyTypes) {
  tuple_type = function () {
    this.type = exports.Type;
    this.sub_types = lillyTypes;
    this.self_type_rep = "tuple";
    this.toString = function () {
      let inner_rep = "";

      for (let i = 0; i < this.sub_types.length; i++) {
        inner_rep += this.sub_types[i].toString();
        inner_rep += "; ";
      }

      return "struct { " + inner_rep + "}";
    };
    this.constructor = tuple_of_constructor;
  };

  return new tuple_type();
};

this.TupleOf.constructor = tuple_of_constructor;

/**
 *  Struct constructor
 */

struct_of_constructor = function (struct_type, exp_list) {
  this.type = struct_type;
  this.content = {};

  for (let i = 0; i < struct_type.sub_types.length; i++)
    this.content[struct_type.sub_types[i].label] = exp_list[i];

  let father = this;

  this.get_content = function () {
    return this.content;
  };

  this.get = function (a_number) {
    let my_fun = function () {
      return true;
    };
    if (typeof a_number == "number") {
      if (a_number >= father.type.sub_types)
        throw exports.Invalid.constructor(
          "#REF!",
          "Index does not exist in current struct"
        );

      // CHECK: acconditionate for index range
      return father.content[father.type.sub_types[a_number].label];
    }
    // Check if it's a range
    else if (a_number != null && has(a_number, "fst") && has(a_number, "snd")) {
      let upper_bound = Math.min(
        a_number.snd + 1,
        father.type.sub_types.length
      );
      let res = [];

      for (let i = a_number.fst; i < upper_bound; i++)
        res.push(father.content[father.type.sub_types[i].label]);

      return res;
    } else
      return exports.Invalid.constructor(
        "#ERR!",
        "Invalid index provided HERE"
      );
  };

  this.set = function (a_number, a_value) {
    if (a_number >= father.type.sub_types)
      throw exports.Invalid.constructor(
        "#REF!",
        "Index does not exist in current struct"
      );

    father.content[father.type.sub_types[a_number].label] = a_value;
  };

  this.toString = function () {
    return father.type.toString() + this.toStringSimplified();
  };

  this.toStringSimplified = function () {
    return (
      "(" +
      father.type.sub_types
        .map((x) => exports.toStringLilly(father.content[x.label]))
        .join(", ") +
      ")"
    );
  };

  this.copy = function (context = null) {
    let content_copy = {};

    for (let i = 0; i < father.type.sub_types.length; i++)
      content_copy[father.type.sub_types[i].label] = CopyObject(
        father.get(i),
        context
      );

    let temp = new exports.StructOf.constructor(
      new exports.StructOf(CopyObject(father.type.sub_types, context)), // CHECK, CopyObject should make copy of NamedFields?
      content_copy
    );

    temp.content = content_copy;

    return temp;
  };

  // Theres no going back after a de-lazy of structures
  // that's why I make a copy first
  this.de_lazy = function () {
    for (let i = 0; i < father.type.sub_types.length; i++) {
      let actual = father.get(i);
      if (actual != null && actual instanceof lazy.LazyObject) {
        father.content[father.type.sub_types[i].label] = actual.evaluate();
      }
    }
    // console.log(`Type before ${exports.toStringLilly(father.type)}`)
    father.type = exports.evaluate_type(father.type);
    // console.log(`Type after ${exports.toStringLilly(father.type)}`)
    return father;
  };
};

this.StructOf = function (structFields) {
  struct_type = function () {
    this.type = exports.Type;
    this.sub_types = structFields;
    this.self_type_rep = "struct";
    this.toString = function () {
      let inner_rep = "";

      for (let i = 0; i < this.sub_types.length; i++) {
        inner_rep += this.sub_types[i].toString();
        inner_rep += "; ";
      }

      return "struct { " + inner_rep + "}";
    };
    this.constructor = struct_of_constructor;
  };

  return new struct_type();
};

this.is_struct = function (a) {
  return a != null && a.type != null && a.type.self_type_rep === "struct";
};

this.StructOf.constructor = struct_of_constructor;

this.attribute_of_variant = function (exp, field, perform_evaluation) {
  let lazy_removed = false;
  if (exp instanceof lazy.LazyObject && perform_evaluation) {
    // exp = exports.Var(arr.evaluate(),indexvalue);
    exp = exp.evaluate();
    lazy_removed = true;
  }

  // Pattern matching for nominals
  if (field === "_")
    if (exp !== null && exp.hasOwnProperty("content"))
      return [exp.content, lazy_removed];
    else
      return [
        exports.Invalid.constructor(
          "#VALUE!",
          "The expected expression was a nominal, but got something else."
        ),
      ];

  if (
    exp instanceof exports.StructOf.constructor &&
    exp.content.hasOwnProperty(field)
  )
    return [exp.content[field], lazy_removed];

  if (exports.is_nominal(exp) && exp.get_content().hasOwnProperty(field))
    return [exp.get_content()[field], lazy_removed];

  return [
    exports.Invalid.constructor(
      "#REF!",
      "Expression does not have a field named " + field
    ),
  ];
};

this.tuple_of_struct = function (a_struct) {
  let value_list = [];
  for (let i = 0; i < a_struct.type.sub_types.length; i++)
    value_list.push(CopyObject(a_struct.get[i]));

  let tp_list = [];
  for (let i = 0; i < a_struct.type.sub_types.length; i++)
    tp_list.push(CopyObject(a_struct.type.sub_types[i]));

  return new type.TupleOf.constructor(tp_list, value_list);
};

/**
 *  Lazy section
 */

// CHECK this won't work if arrays have aditional properties
exports.de_lazy_array = function de_lazy_array(value) {
  if (value instanceof Array) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      let actual_de_lazy = exports.catch_result(() =>
        exports.de_lazy(value[i])
      );

      result[i] = actual_de_lazy;
    }

    return result;
  } else return exports.de_lazy(value);
};

function de_lazy_array_old(value) {
  if (value instanceof Array) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result[i] = exports.de_lazy(value[i]);
    }

    return result;
  } else return exports.de_lazy(value);
}

// OR THIS MIGHT NEED CONTEXT
exports.de_lazy = function (value) {
  if (value == null) return null;

  if (value instanceof lazy.LazyObject) return value.evaluate();
  // else if (value instanceof Array) {
  //     let temp = CopyObject(value);
  //     for (let i = 0; i < temp.length; i++)
  //         temp[i] = exports.de_lazy(temp[i]);
  //     return temp;
  // }
  else if (value instanceof Array) return exports.de_lazy_array(value);
  else if (value instanceof exports.TupleOf.constructor)
    return exports.deLazyTuple(value);
  else if (value instanceof exports.StructOf.constructor)
    return exports.deLazyStruct(value);

  return value;
};

exports.deLazyStruct = function (value) {
  // CHECK: WE SHOULD NOT COPY HERE WITHOUT CONTEXT
  let temp = value.copy();
  return temp.de_lazy();
};

exports.deLazyTuple = function (value) {
  // CHECK: WE SHOULD NOT COPY HERE WITHOUT CONTEXT
  let temp = value.copy();
  temp.content = exports.de_lazy(temp.content);
  // console.log(temp.type)
  temp.type = exports.evaluate_type(temp.type);
  // console.log(temp.type)
  return temp;
};

// exports.de_lazy_arr = function(arr,access){

//     if (access.length === 0)
//         if ((arr != null) && (arr instanceof lazy.LazyObject))
//             return arr.evaluate();
//         else
//             return exports.de_lazy(arr);

//     else {
//         let res = [];
//         for (let i = 0; i < arr.length; i++)
//             res.push(exports.de_lazy_arr(arr[i],access.slice(1)));
//         return res;
//     }

// }
exports.de_lazy_arr = exports.de_lazy_array;

// Comparations
zip_with = function (la, lb, func) {
  let res = [];
  for (let i = 0; i < la.length; i++) res[i] = func(la[i], lb[i]);

  return res;
};

is_type = function (a) {
  return a.type != null && a.type.self_type_rep == "type";
};

equal_types = function (a, b) {
  // console.log(`Checking equality between ${exports.toStringLilly(a)} and ${exports.toStringLilly(b)}`)
  // if (a.self_type_rep == "lazy" && a.content.self_type_rep == "let")
  // return equal_types(a.content,b);

  // if (b.self_type_rep == "lazy" && b.content.self_type_rep == "let")
  // return equal_types(a,b.content);

  if (a.self_type_rep != b.self_type_rep) return false;

  switch (a.self_type_rep) {
    case "nominal":
      return a.name === b.name;
    case "struct":
    case "tuple":
      return zip_with(a.sub_types, b.sub_types, equal_types).every((x) => x);
    case "namedfield":
      return equal_types(a.type, b.type);
    case "function":
      return (
        a.fields.length === b.fields.length &&
        equal_types(a.ret_type, b.ret_type) &&
        zip_with(a.fields, b.fields, equal_types).every((x) => x)
      );
    case "array":
      return a.dims == b.dims && equal_types(a.sub_type, b.sub_type);
    case "lazy":
      return equal_types(a.content, b.content);
    default:
      return true;
  }
};
exports.equal_types = equal_types;

exports.evaluate_type = function (a_type) {
  // equal_types = function(a,b){
  // console.log(`Checking equality between ${exports.toStringLilly(a)} and ${exports.toStringLilly(b)}`)
  // console.log(`Converting ${exports.toStringLilly(a_type)}`)
  switch (a_type.self_type_rep) {
    case "nominal":
      return a_type;
    case "struct":
      return exports.StructOf(
        a_type.sub_types.map((x) => exports.evaluate_type(x))
      );
    case "tuple":
      return exports.TupleOf(
        a_type.sub_types.map((x) => exports.evaluate_type(x))
      );
    case "namedfield":
      return exports.NamedField(
        a_type.label,
        exports.evaluate_type(a_type.type)
      );
    case "function":
      return a_type;
    case "array":
      return exports.ArrayOf(a_type.sub_type, a_type.dims);
    case "lazy":
      return a_type.content;
    default:
      // console.log(`What I got was ${exports.toStringLilly(a_type)}`)
      return a_type;
  }
};

this.is_tuple = function (a) {
  return a != null && a.type != null && a.type.self_type_rep == "tuple";
};

compare_tuples = function (a, b) {
  if (a.content.length !== b.content.length) return false;

  return zip_with(a.content, b.content, exports.equals).every((x) => x);
};

this.equals = function (a, b) {
  // Getting rid of nulls
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;

  // Compare two Lilly types
  if (is_type(a) && is_type(b)) return equal_types(a, b);

  // Compare two tuples
  if (exports.is_tuple(a) && exports.is_tuple(b)) return compare_tuples(a, b);

  // Old and ugly code that needs to be refactored
  // console.log("Compare of " + (a!=null ? a.toString() : "_") + " and " + (b!=null ? b.toString() : "_"))
  if (exports.is_lilly_subtype(a) && exports.is_lilly_subtype(b)) {
    // Invalid
    if (a.type == exports.Invalid && b.type == exports.Invalid)
      return a.code === b.code;
    // Sub-type
    else if (a.hasOwnProperty("sub_types") && b.hasOwnProperty("sub_types")) {
      if (a.sub_types.length !== b.sub_types.length) return false;

      for (let i = 0; i < a.sub_types.length; i++)
        if (!exports.equals(a.sub_types[i], b.sub_types[i])) return false;

      return true;
    }

    // Struct vs Struct
    else if (
      a instanceof exports.StructOf.constructor &&
      b instanceof exports.StructOf.constructor
    ) {
      if (a.type.sub_types.length !== b.type.sub_types.length) return false;

      for (let i = 0; i < a.type.sub_types.length; i++) {
        let label = a.type.sub_types[i].label;

        if (!b.content.hasOwnProperty(label)) return false;

        if (!exports.equals(a.content[label], b.content[label])) return false;
      }

      return true;
    }

    // Struct vs Tuple
    else if (
      a instanceof exports.StructOf.constructor &&
      b instanceof exports.TupleOf.constructor
    ) {
      if (a.type.sub_types.length != b.content.length) return false;

      // Check element by element in order
      for (let i = 0; i < a.type.sub_types.length; i++)
        if (!exports.equals(a.content[a.type.sub_types[i].label], b.content[i]))
          return false;

      return true;
    }

    // Tuple vs Struct
    else if (
      a instanceof exports.TupleOf.constructor &&
      b instanceof exports.StructOf.constructor
    )
      return exports.equals(b, a);
    // Nominals
    else if (a.hasOwnProperty("content") && b.hasOwnProperty("content"))
      return exports.equals(a.content, b.content);
    else if (
      exports.LillyType.is_a(a, exports.Time) &&
      exports.LillyType.is_a(b, exports.Time)
    )
      return (
        a.getHours() == b.getHours() &&
        a.getMinutes() == b.getMinutes() &&
        a.getSeconds() == b.getSeconds()
      );
    else if (
      (exports.LillyType.is_a(a, exports.Date) &&
        exports.LillyType.is_a(b, exports.Date)) ||
      (exports.LillyType.is_a(a, exports.Datetime) &&
        exports.LillyType.is_a(b, exports.Date)) ||
      (exports.LillyType.is_a(b, exports.Datetime) &&
        exports.LillyType.is_a(a, exports.Date))
    )
      return (
        a.getDay() == b.getDay() &&
        a.getMonth() == b.getMonth() &&
        a.getFullYear() == b.getFullYear()
      );
    else if (
      exports.LillyType.is_a(a, exports.Datetime) &&
      exports.LillyType.is_a(b, exports.Datetime)
    )
      return (
        a.getHours() == b.getHours() &&
        a.getMinutes() == b.getMinutes() &&
        a.getSeconds() == b.getSeconds() &&
        a.getDay() == b.getDay() &&
        a.getMonth() == b.getMonth() &&
        a.getFullYear() == b.getFullYear()
      );
    else if (
      (exports.LillyType.is_a(a, exports.Datetime) &&
        exports.LillyType.is_a(b, exports.Date)) ||
      (exports.LillyType.is_a(b, exports.Datetime) &&
        exports.LillyType.is_a(a, exports.Date))
    )
      return (
        a.getHours() == b.getHours() &&
        a.getMinutes() == b.getMinutes() &&
        a.getSeconds() == b.getSeconds()
      );
    else return a.type == b.type && a == b;
  }
  // Arrays
  else if (a instanceof Array && b instanceof Array)
    return exports.arr_equals(a, b);
  // LazyObjects
  else if (a instanceof lazy.LazyObject && b instanceof lazy.LazyObject)
    return a.rep == b.rep;
  else if (a instanceof lazy.LazyObject) {
    // console.log(`Comparing
    // ${a.toString()} and ${exports.toStringLilly(b)}`)
    // console.log("COmparing")
    // console.log(a.toString());
    // console.log(exports.toStringLilly(b));
    return a.toString() === exports.toStringLilly(b);
  } else if (b instanceof lazy.LazyObject)
    return exports.toStringLilly(a) === b.toString();
  else return a == b;
};

this.arr_equals = function (arr1, arr2) {
  if (arr1.length != arr2.length) return false;
  let arr_len = arr1.length;

  for (let i = 0; i < arr_len; i++) {
    if (arr1[i] instanceof Array && arr2[i] instanceof Array)
      if (!exports.arr_equals(arr1[i], arr2[i])) return false;

    // Removing lazyness if needed
    // What like in ['2','3'] == [2,3]
    // With 'exp' as LAZY(exp)
    // if (!exports.equals(eval_if_lazy(arr1[i]),eval_if_lazy(arr2[i])))
    if (!exports.equals(arr1[i], arr2[i])) return false;
  }
  return true;
};

// Excel things, don't ask
this.xlstype = function xlstype(a) {
  switch (typeof a) {
    case "number":
      return 1;
    case "string":
      return 2;
    case "boolean":
      return 4;
    case "object":
      if (a == null) throw exports.Invalid.constructor("#VALUE!");
      else if (a instanceof Array) return 64;
      else if (a instanceof Error || a.type == exports.Invalid) {
        return 16;
      } else throw exports.Invalid.constructor("#VALUE!");
      break;
  }
};

this.isreal = function isreal(a, b) {
  if (b === undefined || exports.equals(b, exports.Var))
    return exports.LillyType.is_a(a, exports.Double);
  else return exports.equals(b, exports.Double);
};

exports.catch_result = function (a_fun) {
  try {
    return a_fun();
  } catch (err) {
    // console.log("ERROR")
    // console.log(err)
    if (err !== null && err.hasOwnProperty("code")) return err;
    else if (err.name == "TypeError")
      return new Invalid_class("#TYPE!", "Runtime error");
    else if (err.name === "ReferenceError")
      return new Invalid_class("#REF!", "VM could not find such variable");
    else if (err.name === "RangeError") {
      return new Invalid_class(
        "#REF!",
        "Maximum call stack. Possible circular reference"
      );
    } else return new Invalid_class("#ERR!", "Runtime error");
  }
};
