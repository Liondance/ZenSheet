//  var {LillyObject} = require("./lilly_objects.js");
//  var {CopyObject, copyContext} = require("./deepCopy.js");

var { copyContext } = require("./deepCopy.js");

exports.create_lambda = function (
  a_closure_fun,
  a_closure_string,
  init_context = null
) {
  let new_lambda = a_closure_fun(init_context);
  new_lambda.toString = a_closure_string(init_context);
  new_lambda.source_code = "42"; // Compilation legacy
  new_lambda.copy = function (new_context) {
    let context = copyContext(init_context, new_context);
    return exports.create_lambda(a_closure_fun, a_closure_string, context);
  };

  return new_lambda;
};
