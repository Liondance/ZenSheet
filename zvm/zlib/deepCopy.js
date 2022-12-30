const { has } = require("./utils.js");

exports.CopyObject = function CopyObject(object, context = null) {
  if (object instanceof Array) {
    let temp = [];

    for (let i = 0; i < object.length; ++i) {
      temp[i] = CopyObject(object[i], context);
    }
    return temp;
  } else if (has(object, "copy")) {
    return object.copy(context);
  } else {
    return object;
  }
};

exports.copyContext = function (old_context, new_context) {
  // New context with all properties (formulas)
  let context = Object.assign({}, old_context);

  if (has(new_context, "cell")) context.cell = new_context.cell;

  // Perform a copy of the rest of elements
  for (let key in context) {
    if (key != "cell") context[key] = context[key].copy(new_context);
  }

  return context;
};
