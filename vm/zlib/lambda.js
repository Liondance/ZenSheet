var { LillyObject } = require("./lilly_objects.js");

class LambdaGenerator extends LillyObject {
  constructor(a_fun, length, a_context = null) {
    super();
    this.context = a_context;
    this.inner_fun = a_fun;
    this.length = length;
  }

  // copy(new_context=null){
  //   // New context with all
  //   console.log("Starting copy")
  //   let context = Object.assign({},this.context);

  //   if (new_context && new_context.cell)
  //     context.cell  = new_context.cell;

  //   // Perform a copy of the rest of elements
  //   for (var key in context){
  //     if (key != "cell"){
  //       // console.log(`Formula[${key}]=${context[key].toString()} (Before)`)
  //       context[key] = context[key].copy(new_context);
  //       // console.log(`Formula[${key}]=${context[key].toString()} (After)`)
  //     }
  //   }
  //   console.log("Context copied, creating lambda")
  //   // console.log(context)
  //   const new_lambda = new exports.LambdaGenerator(CopyObject(this.inner_fun,new_context),this.length,context);
  //   console.log("New lambda done")
  //   return new_lambda;
  // }

  call(f, ...args) {
    // console.log("begin--------------------")
    // Build closure first
    const closure = this.inner_fun.call(this, this.context);
    let reduced_args = [null];
    reduced_args = reduced_args.concat(args);
    // console.log(`Passing ${reduced_args}`)
    // console.log(closure)
    // console.log(closure.constructor.name)
    // console.log(closure.toString())

    try {
      const result = Function.prototype.call(closure, ...reduced_args);
      return result;
      // console.log("end----------------------")
    } catch (err) {
      // console.log('WELL GOT AN ERROR ')
      // console.log(err);

      return null;
    }

    // console.log(result)
  }

  // length(){
  //   const closure = this.inner_fun(this.context);
  //   return closure.length;
  // }

  toString() {
    const closure = this.inner_fun(this.context);
    return closure.toString();
  }
}
exports.LambdaGenerator = LambdaGenerator;
