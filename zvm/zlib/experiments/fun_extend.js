
class ExFunc extends Function {
  constructor(a_function,a_context=null) {
    super('...args', 'return this.__call__(...args)');
    this.context = a_context;
    this.func = a_function;
    console.log(`At first lambda.fun was ${typeof this.func} and a_function ${typeof this.func}`)
    return this.bind(this);
  }

  // Example `__call__` method.
  __call__(...args) {
    // console.log
    return this.func(this.context)(...args);
  }


  static copy(anExfunc,a_context){
    console.log(`Performing copy, the type of lambda.func is ${typeof (anExfunc.get_func())}`)
    return new ExFunc(anExfunc.func,a_context);
  }
}

// Second class to add that
function create_lambda( a_function , a_context ){
  let lambda = new ExFunc( a_function, a_context );
  lamba.context = a_context;
  lambda.func = a_function;
  lambda.copy = function(context){ return create_lambda(a_function,context);};

  return lambda;
  // lambda.copy = function(a_context){ return ExFunc.copy(lambda) }
}

let closure = (function(_my_context){ return function(){return 42+_my_context.ws} });
let my_fun = new ExFunc( closure  , {ws:"first_worksheet"});
my_fun.func = closure;

console.log(my_fun(5,6,7))
console.log(my_fun(5,6,7))


my_fun = ExFunc.copy(my_fun,{ws:"second_worksheet"});
console.log(my_fun(5,6,7))

// class ExtensibleFunction extends Function {
//   constructor(f) {
//     return Object.setPrototypeOf(f, new.target.prototype);
//   }
// }

// class Smth extends ExtensibleFunction {
//   constructor(x) {
//     super(function() { return x; }); // closure
//     // console.log(this); // function() { return x; }
//     // console.log(this.prototype); // {constructor: …}
//   }
// }
// class Anth extends ExtensibleFunction {
//   constructor(x) {
//     super(() => { return this.x; }); // arrow function, no prototype object created
//     this.x = x;
//   }
// }
// class Evth extends ExtensibleFunction {
//   constructor(x) {
//     super(function f() { return f.x; }); // named function
//     this.x = x;
//   }
// }

// End

// class LambdaGenerator {
//   constructor( a_fun , a_context=null){
//     this.context = a_context;
//     this.inner_fun = a_fun;
//   }

//   copy(a_context=null){
//     new LambdaGenerator(,a_context?this.context:)
//   }

//   call(...args){
//     // Build closure first
//     const closure = this.inner_fun(this.context);
//     return closure.call(undefined,args.slice(1));
//   }
// }

// a = new LambdaGenerator( (_my_context) => () => _my_context.col + 3 , {col: 39} )
// console.log(a.call(undefined))
