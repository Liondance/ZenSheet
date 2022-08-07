let lilly = require("./lilly_objects.js");

// Private variable
let compute_cycle = 0;
exports.getComputeCycle = function () {
  return compute_cycle;
};
exports.incComputeCycle = function () {
  return compute_cycle++;
};
exports.resetComputeCycle = function () {
  compute_cycle = 0;
};

// Class for lazy objects
let serializeWQuotes = false;
exports.serializeWQuotesToggle = function (new_val) {
  serializeWQuotes = new_val;
};

class LazyObject extends lilly.LillyObject {
  constructor(
    compiledExpr,
    toStringMethod,
    code_rep,
    a_context,
    cache = null,
    last_compute_cycle = -1
  ) {
    super();

    let self = this;
    this.context = a_context;
    // to String representation
    this.toString = function () {
      return serializeWQuotes
        ? `'${toStringMethod(self.context)}'`
        : toStringMethod(self.context);
    };

    this.last_compute_cycle = last_compute_cycle; // Compute cycle to check if cache is up to date

    this.code = compiledExpr; // Expression to evaluate every time cache has been invalidated
    this.cache = cache; // Cached value
    // this.type   = type;
    this.rep = code_rep; // Compiled code for comparation only
    this.initial_string_method = toStringMethod;
  }

  isLazy() {
    return true;
  }

  copy(new_context) {
    const { CopyObject, copyContext } = require("./deepCopy.js");

    const new_cache = CopyObject(this.cache);
    // console.log(`I'm a lazy and I'm getting copied, context before ${this.context.cell}`)
    const context = copyContext(this.context, new_context);
    // console.log(`After ${this.context.cell}`)

    let new_lazy = new LazyObject(
      this.code,
      this.initial_string_method,
      this.rep,
      context,
      new_cache,
      this.last_compute_cycle
    );
    return new_lazy;
  }

  // Get the lazy evaluation
  evaluate() {
    if (this.last_compute_cycle < compute_cycle) {
      this.cache = this.code(this.context);
      this.last_compute_cycle = compute_cycle;
    }

    return this.cache;
  }
}

exports.LazyObject = LazyObject;
