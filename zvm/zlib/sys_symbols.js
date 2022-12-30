var type = require("./type.js");
var lazy = require("./lazy.js");

const DECLARED_TP_POS = 0;
const INFERRED_TP_POS = 1;
const SYM_NAME_POS = 2;
const OPERATOR_POS = 3;
const INITIALIZER_POS = 4;

exports.SymbolDescriber = class SymbolDescriber {
  constructor() {
    this.table = {};
  }

  store_describer(a_tuple) {
    var label = a_tuple[1].get_content()[SYM_NAME_POS];
    this.table[label] = a_tuple;
  }

  describe_symbol(symbol_name) {
    return this.table[symbol_name][1];
  }

  remove_symbol(symbol_name) {
    delete this.table[symbol_name];
  }

  symbols_exists(label) {
    return this.table.hasOwnProperty(label);
  }

  get_all_living() {
    return Object.keys(this.table);
  }

  get_variable(symbol_name) {
    return this.table[symbol_name][0];
  }

  iterate_rows(a_fun) {
    for (var key in this.table) a_fun(key, this.table[key]);
  }

  describe_model() {
    var model = "";
    for (var key in this.table) {
      var tuple = this.table[key][1].get_content();

      if (
        tuple[DECLARED_TP_POS] === "type" ||
        tuple[INFERRED_TP_POS] === "type"
      ) {
        model +=
          "type " + tuple[SYM_NAME_POS] + " " + tuple[OPERATOR_POS] + " ";
        model += tuple[INITIALIZER_POS];
      } else {
        var variable = eval(this.table[key][0]);

        lazy.serializeWQuotesToggle(true);

        model += tuple[INFERRED_TP_POS] + " " + tuple[SYM_NAME_POS] + " := ";
        model += type.toStringLilly(variable, true);

        lazy.serializeWQuotesToggle(false);
      }

      model += ";\n";
      // console.log(key+":"+this.table[key]);
    }
    return model;
  }

  delete_all() {
    Object.keys(this.table).forEach(function (key) {
      delete this.table[key];
    });
  }
};

notify_change_of = function (name) {
  console.log(`I should notify the change of ${name}`);
};
