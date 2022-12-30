///
/// Lilly predefined functions library (Javascript version)
///

///
/// Richard: this is your test harness workhorse. You will see how to use it at the end ... for now keep reading
///
var functions = {};

functions.verify = function (assertion) {
  var ok = eval(assertion);
  console.log((ok ? "PASSED: " : "FAILED: ") + assertion);
};

///
/// Richard, you have not created the Error value constructor function
/// This is NOT entirely what it should be (*): just something quick to show later why we need our own 'Error values'
/// I think I explained 'Error values' in a former email, please let me know if you are not clear
///
/// (*) Hint: we must be able to compare error values for equality. Only the code part is relevant for comparison.
/// e.g. Error("#MERDE!", "huh?") == Error("#MERDE!", "extra merde detected in expression sheibe(error)")
///

var type = require("./type.js");

functions.Error = function (code, description) {
  // return { code: code, description: description };
  return type.Invalid.constructor(code, description);
};

functions.throwable_error = function (dynamic, code, description) {
  if (dynamic) {
    return functions.Error(code, description);
  } else {
    throw functions.Error(code, description);
  }
};

///
/// Biggest problem with your code is you did not specify which version you are implementing
///
/// The variant version (MS-Excel like) or the strict version (taking advantage of the Lilly type system)?
///
/// I am assuming you are doing the variant version, because CHAR is CHAR, not CHAR_S (or something like that for "strict")
/// Which one you really don't say, but the code is *wrong* in general, under both cases: you are not handling type errors!
/// Keep reading. You will see proof of this later ... at the very end
///

///
/// Richard: please group functions by category, with a header comment like "Text Functions"
///

function NVL(exp, alt) {
  return exp == null ? alt : exp;
}

function IVL(exp, alt) {
  try {
    if (exp.hasOwnProperty("code")) {
      return alt;
    }
    return exp;
  } catch (err) {
    return alt;
  }
}

function FMAPZ(fn, seq) {
  return seq[0] == undefined
    ? seq
    : [fn(seq[0])].concat(FMAPZ(fn, seq.slice(1)));
}

function FILTERZ(pred, seq) {
  return seq[0] == undefined
    ? seq
    : pred(seq[0])
    ? [seq[0]].concat(FILTERZ(pred, seq.slice(1)))
    : FILTERZ(pred, seq.slice(1));
}

functions.NVL = NVL;
functions.IVL = IVL;
functions.FMAPZ = FMAPZ;
functions.FILTERZ = FILTERZ;

functions.make_multiarg = function (a_fun) {
  a_fun.multiarg = true;
};

module.exports = functions;

///
/// How do we validate our functions?
///
/// 1) Basically we compare results we get back from our implementations against the 'expected' ones
///    But, what is an 'expected' result? It depends on which version (var typed, strictly typed) we are testing
///    First rule: use common sense, and ask your team leader if in doubt. No substitute for common sense!
///    Typical answers:
///        a) 'expected' is what MS-Excel says the result is! (the "just like MS-Excel" compatibility principle)
///        b) 'expected' is "just like MS-Excel", except where we can be "better than MS-Excel" (the "better than MS-Excel" principle)
///           we can be better at:
///           - returning new error values or throwing exceptions
///           - extending MS-Excel semantics in useful ways
///           - fixing MS-Excel bugs (we already have!) because we do NOT aim to be bug compatible
///
/// 2) We need to test several results, striving to cover all possible execution paths
///    Always remember to test for borderline, extreme, and pathological cases
///      Borderline: empty lists, empty strings, a zero number, base case of "inductive" definitions in general
///      Extreme: very large numbers (determine and *document* the range of the implementation with test cases!)
///      Pathological: essentially errors; type errors (where applicable), "out of domain" errors, other errors
///    We always need several cases per function ... sometimes more than you can imagine!
///    But avoid things like adding a dozen cases just to bulk-up numbers. Strive for diversity not repetition
///
/// 3) There is no three; just remember 1 and 2 and repeat this mantra https://www.youtube.com/watch?v=0hiUuL5uTKc
///

/// verify('MIRR(X,0.05,0.1)/exp < (1+eps) && MIRR(X,0.05,0.1)/exp > (1-eps)');
/// console.log(MIRR(X,0.05,0.1))

/*
var s = [0,1,2,3];
var square = function(x) {return x*x};
console.log(FMAPZ(square,s))

s = [0,1,2,3,4,5,6,7];
var fodd = function(x) {return ((x%2)==1)};
console.log(FILTERZ(fodd,s))

s = [0,1,2,3,4];
var sumz = function(x,y) {return x+y};
console.log(FOLDZ(sumz,0,s))
*/
