//arraylib.js
const {CopyObject,copyContext} = require("./deepCopy.js");
const {IntRange}               = require("./int_range.js")

var type   = require('./type.js');
var Varlib = require("./varlib.js");
var lazy   = require("./lazy.js");
var a1     = require("./a1.js")

Arraylib = exports

force_compute_cycle = function(){return false;}
exports.set_compute_cycle_function = function(a_fun){ force_compute_cycle = a_fun; };

function Blank (type) {}

get_dimensions = function(arr){
	res = 0;
	aux = arr;
	while (aux instanceof Array){
		aux = aux[0];
		res++;
	}
	return res;
}

copy_structure = function(ob,default_tp){
	switch(typeof(ob)) {
		case "number": 
			return 0;
			break;
		case "boolean":
			return false;
			break;
		case "string": 
			return "";
			break;
		case "object":
			if (ob instanceof Array){
				var res = [];
				for (var i = 0; i < ob.length; i++)
					// res.push(copy_structure(default_tp));
					res.push(copy_structure(ob[0]));

				return res;
			}
			else if (ob===null)
				return null;
			else if (ob.hasOwnProperty("lazy")){
				var val=ob.evaluate();
				return copy_structure(ob);
			}
			else
				return null;

			break;

		case "null":
		default:
			return null;
			break;
	}
	
}

last_tp_default = function(arr,target_dim,d){
	aux = arr;

	for (var i = 0; i <= target_dim; i++)
		aux = aux[0];
	// console.log(aux)
	return JSON.stringify(copy_structure(aux));

}

default_generator = function default_generator(ob,default_tp){
	if (ob instanceof Array){
		var res = [];
		for (var i = 0; i < ob.length; i++)
			res.push(default_generator(ob[0],default_tp));

		return res;
		
	}
	else
		return eval(default_tp);
}


this.DIM = function dim(n_of_dims,array) {
	var result = [];
	try {
		result.length = n_of_dims;
		
		var iterator = array;
		
		for (var i = 0; i < n_of_dims; i++) {
			result[i] = iterator.length;
			iterator  = iterator[0];
		}
	} catch(err){
		// console.log(err);
		for (var i = 0; i < n_of_dims; i++)
			if(result[i]===undefined)
				result[i] = 0;
	}
	return result;
}

this.RESIZE = function resize(arr,target_dim,element_n) {
	var d  = get_dimensions(arr);
	
	if (! (0<=target_dim && target_dim <= d))
		throw type.Invalid.constructor("#ERR!","Trying to resize non-existent dimension");

	if (element_n > 0)
		var tp = last_tp_default(arr,target_dim,d);

	resize_helper = function(arr,d) {
		if (d === 0) 
			for (var i = 0; i < Math.abs(element_n); i++)
				if (element_n > 0)
					arr.push(eval(tp))
				else
					arr.pop();
		else
			for (var i = 0; i < arr.length; i++)
				arr[i] = resize_helper(arr[i],d-1);

		return arr;
	}
	
	return resize_helper(arr,target_dim);
}

string_generator = function(missing_dimensions,tp_default){

	if (missing_dimensions.length === 0)
		return tp_default;
	else {
		var base = string_generator(missing_dimensions.slice(1),tp_default);
		var actual_dim = []

		for (var i = 0; i < missing_dimensions[0]; i++) 
			actual_dim.push(base);

		return "[" + actual_dim.join(",") + "]"
	}

}

// Generate string once, eval many times
default_factory = function(missing_dimensions,tp_default){
	tp_default = tp_default.replace(new RegExp('""""','g'),'"\\\"\\\""')
	var generator = string_generator(missing_dimensions,tp_default);
	// console.log(generator)
	// console.log(missing_dimensions)
	
	return function(){return eval(generator)};
}

this.INSERT = function insert(arr,target_dim,pos,element_n,tp_default,n_dims,name) {
	var d  = get_dimensions(arr);

	if ( target_dim<0 || target_dim >= n_dims)
		throw type.Invalid.constructor("#ERR!","Trying to resize non-existent dimension");

	if (pos < 0)
		throw type.Invalid.constructor("#ERR!","Trying to add element on invalid position");

	if (element_n <= 0)
		throw type.Invalid.constructor("#ERR!","Trying cannot insert non-positive number of elements");
	
	// var tp = last_tp_default(arr,target_dim,d,tp_default);
	// console.log(tp_default);

	var aux = arr;
	for (var i = 0; i <= target_dim; i++)
		aux = aux[0];

	var array_struct_being = aux;
	var missing_dimensions = []

	// console.log("target= " + target_dim+ ". n_dims="+n_dims)
	for (var i = target_dim; i < n_dims-1; i++) {
		// console.log("I entered with " + i);
		missing_dimensions.push(array_struct_being.length)
		array_struct_being = array_struct_being[0];
	}

	var new_default = default_factory(missing_dimensions,tp_default);

	resize_helper = function(arr,d) {
		if (d === 0)
			for (var i = 0; i < element_n; i++)
				arr.splice(pos,0,new_default());
		else
			for (var i = 0; i < arr.length; i++)
				arr[i] = resize_helper(arr[i],d-1);

		return arr;
	}

  if (n_dims == 2)
    a1.update_on_insert(name,target_dim,pos,element_n);

	let result = resize_helper(arr,target_dim);
  force_compute_cycle(true);
  return result;
}

this.REMOVE = function delete_(arr,target_dim,pos,element_n,tp_default,n_dims,name) {
	if (target_dim<0 || target_dim >= n_dims)
		throw type.Invalid.constructor("#ERR!","Trying to resize non-existent dimension");

	if (pos < 0)
		throw type.Invalid.constructor("#ERR!","Trying to remove element on invalid position");

	if (element_n <= 0)
		throw type.Invalid.constructor("#ERR!","Trying cannot remove non-positive number of elements");
	

	resize_helper = function(arr,d) {
		if (d === 0)
			// We can check here if pos is in the correct range
			arr.splice(pos,element_n)
		else
			for (var i = 0; i < arr.length; i++)
				arr[i] = resize_helper(arr[i],d-1);

		return arr;
	}

  // If we have two dimension it MIGHT be a Worksheet, so we dispatch to a1 to findout
  if (n_dims == 2)
    a1.update_on_delete(name,target_dim,pos,element_n)
	
	let result = resize_helper(arr,target_dim);
  force_compute_cycle(true);
  return result;
}



this.cardinality = function cardinality(some_val){
	try {
		if (some_val instanceof Array)
			return some_val.length;
		else
			throw type.Invalid.constructor("#VALUE!","Cardinality operator expected an array.");
			
	} catch (err){
		if (type.isinvalid(some_val))
			throw err;
		else
			throw type.Invalid.constructor("#ERR!","Runtime error found");
	}
}

this.min = function min(arr) {
	var tam = arr.length;
	var res = Number.MAX_VALUE;

	for (var i = 0; i < tam; i++)
		if (typeof(arr[i]) === 'number') res = Math.min(res, arr[i]);

	return res;
}

this.min_d = function (elem1,elem2) {
	if (elem1 instanceof Array){
		var tam = elem1.length;
		var res = Number.MAX_VALUE;

		for (var i = 0; i < tam; i++)
			if (typeof(elem1[i]) === 'number') res = Math.min(res, elem1[i]);

		return res;
	}
	else
		return Math.min(elem1,elem2);
}

this.min_arr_d = function(arr){
    if (! (arr instanceof Array))
        return type.Invalid.constructor("#TYPE!","min_arr_d expected and array.");

    var tam = arr.length;
    var res = Number.MAX_VALUE;

    for (var i = 0; i < tam; i++)
        if (typeof(arr[i]) === 'number') res = Math.min(res, arr[i]);

    return res;
}


this.max = function max(arr) {

	var tam = arr.length;
	var res = -Number.MAX_VALUE;

	for (var i = 0; i < tam; i++)
		if (typeof(arr[i]) === 'number') res = Math.max(res, arr[i]);


	return res;
}

this.max_d = function max_d(arr){
  if (arr instanceof Array){
    var tam = arr.length;
    var res = -Number.MAX_VALUE;

    for (var i = 0; i < tam; i++)
      if (typeof(arr[i]) === 'number') res = Math.max(res, arr[i]);


    return res;
  }
  else
    return type.Invalid.constructor("#VALUE!","max function expected an array.")
}

this.average = function average(arr) {

	var tam = arr.length;
	var res = 0;
	var counter = 0;

	for (var i = 0; i < tam; i++) {
		if (typeof(arr[i]) === 'number') {
			res += arr[i];
			counter += 1;
		}
	}

	return res/counter;
}

this.averagea = function averagea(arr) {

	var tam = arr.length;
	var res = 0;

	for (var i = 0; i < tam; i++) {
		if (typeof(arr[i]) === 'number') res += arr[i];
	}

	return res/tam;
}

this.count = function count(arr) {

	var tam = arr.length;
	var counter = 0;

	for (var i = 0; i < tam; i++) {
		if (typeof(arr[i]) === 'number') counter +=1;
	}

	return counter;
}

this.stdev = function stdev(arr) {

	var tam = arr.length;
	var mean = exports.average(arr);
	var counter = 0;
	var res = 0;

	for (var i = 0; i < tam; i++) {
		if (typeof(arr[i]) === 'number'){ 
			res += Math.pow(arr[i]-mean, 2);
			counter +=1;
		}
	}

	return Math.sqrt(res/(counter-1));
}

this.stdeva = function stdeva(arr) {

	var tam = arr.length;
	var mean = exports.averagea(arr);
	var res = 0;

	for (var i = 0; i < tam; i++) {
		if (typeof(arr[i]) === 'number') res += Math.pow(arr[i]-mean, 2);
	}

	return Math.sqrt(res/(tam-1));
}

this.stdevp = function stdevp(arr) {

	var tam  = arr.length;
	var mean = exports.average(arr);
	var counter = 0;
	var res = 0;

	for (var i = 0; i < tam; i++) {
		if (typeof(arr[i]) === 'number'){ 
			res += Math.pow(arr[i]-mean, 2);
			counter +=1;
		}
	}

	return Math.sqrt(res/counter);
}

this.stdevpa = function stdevpa(arr) {

	var tam  = arr.length;
	var mean = exports.averagea(arr);
	var counter = 0;
	var res = 0;

	for (var i = 0; i < tam; i++) {
		if (typeof(arr[i]) === 'number') res += Math.pow(arr[i]-mean, 2);
	}

	return Math.sqrt(res/tam);
}

this.createArray = function createarray(indexl, defect) {

	var tam = (indexl[0]===-1)?0:indexl[0];
	var indextam = indexl.length;

	if (tam === 0) return [];

	if (indextam === 1){
		var final_arr = new Array(tam);

		// Fixing alias problems over arrays of arrays initialization
		for (var i = 0; i < final_arr.length; i++)
			final_arr[i] = CopyObject(defect);
		

		return final_arr;
	} else {

		var arr = new Array(tam);

		for (var i = 0; i < tam; ++i) {
			arr[i] = createarray(indexl.slice(1), CopyObject(defect));
		}
		return arr;		
	}

}


this.APPEND = function append(l1,l2) {
	var res = [];

	for (var i = 0; i < l1.length; i++)
		res.push(CopyObject(l1[i]));

	for (var i = 0; i < l2.length; i++)
		res.push(CopyObject(l2[i]));

	return res;
}

this.APPEND_D = function append(l1,l2) {
	if (!(l1 instanceof Array))
		return type.Invalid.constructor("#TYPE!","append was expecting an array.");

	if (!(l2 instanceof Array))
		return type.Invalid.constructor("#TYPE!","append was expecting an array.");

	var res = [];

	for (var i = 0; i < l1.length; i++)
		res.push(CopyObject(l1[i]));

	for (var i = 0; i < l2.length; i++)
		res.push(CopyObject(l2[i]));

	return res;
}

this.FLATTEN_D = function flatten(l1) {
	if (l1 instanceof Array) {
		var res = [];
		// console.log("l1 length is " + l1.length);

		for (var i = 0; i < l1.length; i++) {
			// console.log("	Case " + i)
			if (l1[i] instanceof Array){
				var an_array = exports.FLATTEN_D(l1[i]);
				for (var j = 0; j < an_array.length; j++)
					res.push(an_array[j]);
			}
			else
				res.push(CopyObject(l1[i]));
		}

		return res;
	}
	else
		return [CopyObject(l1)];

}

this.TAIL_D = function tail(arr) {
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#TYPE!","tail function was expecting an array.");

	// Shallow copy
	return arr.slice(1);

}

this.HEAD_D = function head(arr) {
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#TYPE!","head function was expecting an array.");

	return arr.length >= 1 ? 
			arr[0] :
			type.Invalid.constructor("#REF!","head function was expecting non-empty array.");
}

this.CONS_D = function cons(elem,arr) {
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#TYPE!","cons function was expecting an array.");

	// Shallow copy
	var temp = arr.slice();
	temp.unshift(elem);
	return temp;
}

this.EMPTY_D = function empty(arr) {
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#TYPE!","empty function was expecting an array.");

	return arr.length == 0;
}

this.SIZE = function size(arr) {
		return arr.length;
}


this.SIZE_D = function size(arr) {
	return (arr instanceof Array) ? [arr.length] : [];
}

this.LENGTH_D = function length(arr){
	if (arr instanceof Array || typeof(arr) == "string") 
		return arr.length;
	else
		return type.Invalid.constructor("#VALUE!","length function was expecting an array.");
}

this.LENGTH = function length(arr){
	if (arr instanceof Array)
		return arr.length;
	else
		throw type.Invalid.constructor("#VALUE!","length function was expecting an array.");
}


assign_range = function(arr,indexvalue,rval,context){
  // console.log("Range")
  // console.log(indexvalue.previous)
  let new_context = null;

  if (! indexvalue[0].is_multiple(rval.length))
    throw type.Invalid.constructor("#REF!","Access array beyond limits (E33)");

  for (var i = 0; i < indexvalue[0].length(); i++){
    // console.log(`Trying to get array[]`)
    if(arr[indexvalue[0].fst+i] === undefined)
      throw type.Invalid.constructor("#REF!","Access array beyond limits (E66)");
    // console.log(`All good`)

    if(arr[indexvalue[0].fst+i] !== undefined){

        if (context && context.cell && typeof context.cell == "string" && indexvalue.previous !== null){
          // console.log("It had context"0)
          let temp = 
            a1.create_a1_access(
              context.cell,true,
              indexvalue.previous,true,
              indexvalue[0].fst+i,true,
              context
            );
            // console.log(`SETTING CONNTEXT WITH ROW COL ${indexvalue.previous} ${indexvalue[0].fst+i}`)
            new_context = copyContext(context, {cell:temp} );
        }
        // Here set the column
        // Avoiding aliasing between replicated cells
        // console.log("Doing assignment")
        try {
          // console.log(`Doing assign of col${indexvalue.previous} row${indexvalue[0].fst+i}`)
          // console.log(`Before:${rval[i%rval.length].toString()}`)
          let result = CopyObject(rval[i%rval.length],new_context);
          // console.log(`After:${ result.toString() }`)
          arr[indexvalue[0].fst+i] = result;
          // arr[indexvalue[0].fst+i] = CopyObject(rval[i%rval.length],new_context); 
        }catch(err){
          console.log(err);
          throw err
        }
    }
          
  }
}

assign_index = function(arr,indexvalue,rval,context){
  // console.log("Assign index")
  if(arr[indexvalue[0]] === undefined)
    throw type.Invalid.constructor("#REF!","Access array beyond limits (E22)");

  // Get cell from context context.cell.name and create new 
  // A1s to pass as context with the right shift
  let new_context = context;
  if (context && context.cell && context.cell.name){
    let new_context =
      a1.create_a1_access(
        context.cell.name,true,
        indexvalue.previous,true,
        indexvalue[0],true,
        context
      );
    // console.log(`SETTING CONNTEXT WITH ROW COL ${indexvalue.previous} ${indexvalue[0]}`)
    context = copyContext(context,{cell:new_context});
  }
  else {
    // console.log("CONTEXT WASN'T A STRING")
  }

  let copy = CopyObject(rval,context);
  // console.log(`About to assign, the copy of ${rval.toString()} was ${copy.toString()}`)
  arr[indexvalue[0]] = copy; 
}

assign_recursively = function(arr, indexvalue, rval,context){
  if ( indexvalue[0] instanceof IntRange && 
      !indexvalue[0].is_multiple(rval.length))
    throw type.Invalid.constructor("#REF!","Access array beyond limits (E11)");

  if(indexvalue[0] instanceof IntRange)
    for (var i = 0; i < indexvalue[0].length(); i++){
      if(arr[indexvalue[0].fst+i] === undefined)
        throw type.Invalid.constructor("#REF!","Access array beyond limits (E99)");

      let next_index = indexvalue.slice(1);
      next_index.previous = indexvalue[0].fst+i;

      exports.LoutLimitsRg(arr[indexvalue[0].fst+i], next_index, rval[i%rval.length],context);
    }
  else {
    // Case of single dimension
    if(arr[indexvalue[0]] === undefined)
      throw type.Invalid.constructor("#REF!","Access array beyond limits (E77)")

    let next_index = indexvalue.slice(1);
    next_index.previous = indexvalue[0];

    exports.LoutLimitsRg(arr[indexvalue[0]], next_index, rval,context);
  }
}

this.LoutLimitsRg = function loutlimitsrg(arr, indexvalue, rval,context=null){
    // console.log(`Starting LoutLimitsRg with context ${context.cell.toString()}`)
    // console.log(`Starting LoutLimitsRg with context ${context.cell.constructor.name}`)
    // console.log(`Starting LoutLimitsRg with context ${Object.keys(context.cell)}`)
  	if (indexvalue.length === 1){
        if(indexvalue[0] instanceof IntRange)
            assign_range(arr,indexvalue,rval,context);
        else
            assign_index(arr,indexvalue,rval,context);
    }
  	else
        assign_recursively(arr,indexvalue,rval,context);
}


this.RoutLimitsRg = function routlimitsrg(arr, indexvalue){
	var res = [];

	if (!(arr instanceof  Array))
		throw type.Invalid.constructor("#TYPE!","[] operator was expeting an array");

	if (indexvalue.length!=1)
		for (var i = 0; i < arr.length; i++)
			res.push(routlimitsrg(arr[i], indexvalue.slice(1)));
	else
		res = arr;

	// For sub_slicing
	if (indexvalue[0] instanceof IntRange)
		return res.slice(indexvalue[0].fst, indexvalue[0].snd+1);
	else 
		return exports.outLimits(res[indexvalue[0]]);
	
}

this.VarElem = function varelem(arr, indexvalue,perform_evaluation) {
	try {
        var final_result = null;
		if (arr instanceof Array)
			final_result = exports.RoutLimitsRg(arr,indexvalue);
		else if (type.is_nominal(arr))
			final_result = varelem(arr.content,indexvalue);
		else if (type.is_tuple(arr))
			final_result = exports.RoutLimitsRg(arr.get_content(),indexvalue);

		else if (type.is_struct(arr)){
			if (indexvalue.length == 1)
				final_result = arr.get(indexvalue[0]);
			else
				return type.Invalid.console("ERR!","element does not support muliple indexing")
		}

		else {
            // Once we evaluate that lazy object we CANNOT evaluate anymore (in this computation at least)
			if ( (arr instanceof lazy.LazyObject) && perform_evaluation) {
                var lazy_removed = true;
                [result,lazy_removed] = exports.VarElem(arr.evaluate(),indexvalue,false);
				return lazy_removed === undefined ? [result] : [result,true]
            }
			else
				final_result = type.Invalid.constructor("#ERR!","Variant value does not have index to access.")
		}
        return [final_result,false];
	} catch(err){
    // console.log("I was here")
    return [err]
    // return type.catch_result( ()=> {throw err} )
	}
}


this.varRfetch = function(expr,access_list,perform_evaluation){
    
    var result = expr;
    for (var i = 0; i < access_list.length; i++) {
        // console.log(result);
        switch (typeof(access_list[i][0])){
            case "string":
                [result,lazy_removed] = type.attribute_of_variant(result,access_list[i],perform_evaluation);
                // if an error happened
                if (lazy_removed === undefined) return result;
                perform_evaluation = perform_evaluation && (!lazy_removed);
                break;
            case "number":
            case "object":
                [result,lazy_removed] = exports.VarElem(result,access_list[i],perform_evaluation);
                // if an error happened
                if (lazy_removed === undefined) return result;
                perform_evaluation = perform_evaluation && (!lazy_removed);
                break;
            default:
                return type.Invalid.constructor("#ERR!","Unexpected access");
        }
    }

    if (perform_evaluation)
        return type.de_lazy(result)

    return result;
}

this.outLimits = function outlimits(elem){
	if (elem === undefined)
        // throw new Error("Access array beyond limits.");
        throw type.Invalid.constructor("#REF!","Access array beyond limits");

	return elem;
}

this.FMAP_D = function fmap(func,arr) {
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#TYPE!","fmap function was expecting an array.");

	var res = arr.slice();

	for (var i = 0; i < arr.length; i++) {
		// if (typeof(arr[i]) != 'number')
			// return type.Invalid.constructor("#VALUE!","sum function was expecting a number array");
		
		try {
			res[i] = Varlib.isFunction(func,[arr[i]]);
		} catch(err) {
			// Should assign invalid error, but isFunction does not supports it yet
			res[i] = type.Invalid.constructor("#VALUE!","Function in fmap couldn't return a value");
		}
	}

	return res;
}

this.FILTER_D = function filter(func,arr) {
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#TYPE!","sum function was expecting an array.");

	// var res = CopyObject(arr);
	var res = [];

	for (var i = 0; i < arr.length; i++) {
		
		try {
			if (Varlib.isFunction(func,[arr[i]]))
				res.push(arr[i]);
			
		} catch(err) {
			// Should assign invalid error, but isFunction does not supports it yet
			// res[i] = type.Invalid.constructor("#VALUE!","Function in fmap couldn't return a value");
		}
	}

	return res;
}

this.FOLDZ = function foldz(fn,init,seq) {
	return (seq[0]==undefined) 	?	init
								: 	FOLDZ(fn,fn(init,seq[0]),seq.slice(1));
}

this.FOLD_D = function fold(fn,init,arr){
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#VALUE!","fold function was expecting an array.");

	if (!(fn instanceof Function))
		return type.Invalid.constructor("#VALUE!","fold function was expecting a function.");

	var acc = init;

	for (var i = 0; i < arr.length; i++) {
		try{
			acc = Varlib.isFunction(fn,[acc,arr[i]]);
		}
		catch (err){
			acc = type.Invalid.constructor("#ERR!","Run-time error on fold function call.")
		}
	}

	return acc;

	// return arr.reduce(fn,init);
}

this.FOLD_D = function fold(fn,init,arr){
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#VALUE!","fold function was expecting an array.");

	if (!(fn instanceof Function))
		return type.Invalid.constructor("#VALUE!","fold function was expecting a function.");

	var acc = init;

	for (var i = 0; i < arr.length; i++) {
		try{
			acc = Varlib.isFunction(fn,[acc,arr[i]]);
		}
		catch (err){
			acc = type.Invalid.constructor("#ERR!","Run-time error on fold function call.")
		}
	}

	return acc;

	// return arr.reduce(fn,init);
}

this.FINDINDEX_D = function findindex(fn,arr){
	if (!(arr instanceof Array))
		return type.Invalid.constructor("#VALUE!","fold function was expecting an array.");

	if (arr.length == 0)
		return type.Invalid.constructor("not found","findindex got an empty array.");

	if (!(fn instanceof Function))
		return type.Invalid.constructor("#VALUE!","fold function was expecting a function.");

	for (var i = 0; i < arr.length; i++) {
		try{
			if(Varlib.isFunction(fn,[arr[i]]))
				return i;
		}
		catch (err){
			
		}
	}

	return null;

}

this.MATRIX = function matrix(M,N,gen_function){
	var res = [];
	
	for (var i = 0; i < M; i++) {
		var aux_list = [];
		for (var j = 0; j < N; j++)
			aux_list.push(gen_function(i,j));
		
		res.push(aux_list);
	}
	
	return res;
}

this.VECTOR = function vector(M,gen_function){
	var res = [];
	for (var i = 0; i < M; i++)
		res.push(gen_function(i));
	
	return res;
}

this.SORT = function sort(an_array) {
	if (an_array.length === 0)
		return [];

	if (an_array.length > 0 && (["number","string"].indexOf(typeof(an_array[0]))) === -1 )
		throw type.Invalid.constructor("#REF!","wrong array type in sort function.");
	

	var res = CopyObject(an_array);
	return res.sort();
}

this.SORT_A = function sort_a() {
	if (arguments.length === 0)
		return [];

	var an_array = [];
	for (var i = 0; i < arguments.length; i++)
		an_array.push(arguments[i]);
	
	return exports.SORT(an_array);
}


this.SORT_D = function sort(an_array) {
	if (an_array === [] || an_array === undefined)
		return [];

	if (!(an_array instanceof Array))
		return type.Invalid.constructor("#REF!","sort function expected an array.");

	if (typeof(an_array[0]) === "number")
		for (var i = 1; i < an_array.length; i++)
			if (typeof(an_array[i]) !== "number")
				return ype.Invalid.constructor("#REF!","sort function expected consistent type.");

	if (typeof(an_array[0]) === "string")
		for (var i = 1; i < an_array.length; i++)
			if (typeof(an_array[i]) !== "string")
				return ype.Invalid.constructor("#REF!","sort function expected consistent type.")


	var res = CopyObject(an_array);
	return res.sort();


	try {return exports.SORT(an_array);}catch(err){return err;}
	
}

this.SINGLE = function single(list,empty,multi){
    if (list.length === 0)
        return empty;

    var candidate = list[0];
    for (var i = 1; i < list.length; i++)
        if (! type.equals(list[i],candidate))
            return multi;
    

    return CopyObject(candidate);
}


this.SINGLE_D = function single(list,empty,multi){
    if (! (list instanceof Array))
        return type.Invalid.constructor("#VALUE!","Array expected");

    if (list.length === 0)
        return empty;

    var candidate = list[0];
    for (var i = 1; i < list.length; i++)
        if (! type.equals(list[i],candidate))
            return multi;
    

    return CopyObject(candidate);
}

this.create_a1_access = a1.create_a1_access;
this.A1Range = a1.A1Range;
this.clean_a1 = a1.clean_a1;
this.create_ws_representatives = a1.create_ws_representatives;
this.clean_worksheet = a1.clean_worksheet;