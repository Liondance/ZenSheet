var predef = require('./predef.js');

///
/// Text Functions
///

exports.CHAR = function char(number) {
    if ((number < 1) || (number > 255)) {
        throw predef.Error("#VALUE!","The value introduced is not in the range allowed");
    } else {
        return String.fromCharCode(number);
    }
}

exports.CHAR_D = function char(number) {
    return ((typeof number) != "number") ?
        predef.Error("#VALUE!", "The value introduced is not allowed") :
        ((number < 1) || (number > 255)) ?
                predef.Error("#VALUE!", "The value introduced is not in the range allowed") :
                String.fromCharCode(number);
}

exports.CLEAN = function clean(string) {
    return string.replace(/[\x00-\x1F]+/g, '');
}

exports.CLEAN_D = function clean(string) {
    if (typeof(string) !== "string")
        return predef.Error("#VALUE!","Clean function expected a string.");

    return string.replace(/[\x00-\x1F]+/g, '');
}

exports.CODE = function code(string) {
    if (string.length <= 0)
        return predef.Error("#VALUE!","Empty string has no code.");

    return string.charCodeAt(0);
}

exports.CODE_D = function code(string) {
    if (typeof(string) !== "string")
        return predef.Error("#VALUE!","Code function expected a non-empty string.");

    return string.charCodeAt(0);
}

exports.CONCATENATE = function concatenate(text1) {
    var result = "";
    for (var i in arguments) {
        if (typeof arguments[i] !== "string")
            throw predef.Error("#VALUE!","Unexpected value.");

        result += arguments[i];
    }
    return result;
}

exports.CONCATENATE_D = function concatenate(text1) {

    var result = "";
    for (var i in arguments) {
        if (typeof(arguments[i]) !== "string"){
            result = predef.Error("#VALUE!","Concatenate function expected string params.");
            break;
        }
        
        result += arguments[i];
    }
    return result;
}

exports.DOLLAR = function dollar(number,decimals) {
    if (decimals === undefined)
        decimals = 2;

    if (isNaN(number) || isNaN(decimals))
        throw predef.Error("#VALUE!","Concatenate function expected string params.");

    var old_number = number;
    number = Math.abs(number);
    var add_p = function(a_string) {
        return old_number< 0 ? "("+a_string+")" : a_string;
    }


    var factor = Math.pow(10,Math.abs(decimals));
    return add_p(decimals >=0 ? "$" + number.toFixed(decimals) 
                              : "$" + Number((number / factor).toFixed(0)) * factor);
}

exports.DOLLAR_D = function dollar(number,decimals) {
    if (typeof number !== "number")
        return predef.Error("#VALUE!","The value introduced is not allowed");
    
    if (typeof decimals !== "number" || decimals !== undefined)
        return predef.Error("#VALUE!","The value introduced is not allowed");
    
    try{return exports.DOLLAR(number,decimals)}catch(err){return err};
}

exports.EXACT = function exact(string1, string2) {
    return (string1 === string2);
}
exports.EXACT_D = function exact(string1, string2) {
    if (typeof string1 !== "string" || typeof string2 !== "string")
        return predef.Error("#VALUE!","The value introduced is not allowed");
    
    return (string1 === string2);
}

exports.FIND = function find(substring, string, startnum) {
    if (typeof(startnum) != "number" || startnum < 0 )
        throw predef.Error("#VALUE!","The start number must be non-negative");
    if (startnum-1 > string.length)
        throw predef.Error("#VALUE!","The start number is greater than the length of the supplied entire text");    

    if (substring == "")
        return startnum;

    if (startnum+1 > string.length)
        throw predef.Error("#VALUE!","The start number is greater than the length of the supplied entire text");
    
    
    var result = string.indexOf(substring,(startnum-1))+1;
    if (result == 0) {
        throw predef.Error("#VALUE!","The supplied find text is nout found in the supllied entire text") ;
    }
    return result;
    
}

exports.FIND_D = function find(substring,string,startnum) {
    if (typeof(startnum) !== "number" || startnum < 0) {
        return predef.Error("#VALUE!","The start number must be non-negative");
    }

    if (startnum-1 > string.length)
        throw predef.Error("#VALUE!","The start number is greater than the length of the supplied entire text");

    if (typeof(substring) !== "string")
        return predef.Error("#VALUE!","Pattern must be a string");
    if (typeof(string) !== "string")
        return predef.Error("#VALUE!","Search expression must be a string.");

    if (substring == "")
        return startnum;

    if (startnum > string.length) {
        return predef.Error("#VALUE!","The start number is greater than the length of the supplied entire text");
    }

    var result = string.indexOf(substring,(startnum-1))+1;
    return (result == 0 ? predef.Error("#VALUE!","The supplied find text is not found in the supllied entire text") 
                        : result);
}

/* Question */
exports.FIXED = function fixed(number) {
    if (typeof number != "number") {
        throw predef.Error("#VALUE!","The value introduced is not allowed") ;
    }
    else {
        var decimal = arguments[1];
        var factor = Math.pow(10,Math.abs(decimal));
        return (decimal != undefined ? 
                    decimal >=0 ? 
                        number.toFixed(decimal) :
                            Number((number/factor).toFixed(0))*factor :
                                number.toFixed(2));
    }                               
}

/* Question */
exports.FIXED_D = function fixed(number) {
    if (typeof number != "number") {
        return predef.Error("#VALUE!","The value introduced is not allowed") ;
    }
    else {
        var decimal = arguments[1];
        var factor = Math.pow(10,Math.abs(decimal));
        return (decimal != undefined    ? decimal >=0   ? number.toFixed(decimal) 
                                                        : Number((number/factor).toFixed(0))*factor
                                        : number.toFixed(2));
    }                               
}

exports.FORMAT = function format(a_format) {

    var res = "";
    var arg = 1;

    var i = 0;
    while (i < a_format.length){
        // Handle the case where % is the last character in the string
        if (a_format[i] === "%"){

            switch(a_format[++i]) {
                case "%":
                    res += "%";
                    break;
                case "c":
                case "s":
                case "d":
                case "f":
                    res += String(arguments[arg++]);
                    break;
                case ".":
                    var precision = "";
                    while (a_format[++i] !== "f" && i < a_format.length)
                        precision += a_format[i];
                    
                    try {
                        precision = parseInt(precision,10);
                        if (isNaN(precision)) throw 42;
                    } catch(err){
                        throw predef.Error("#VALUE!","Bad precision format.")
                    }

                    res += arguments[arg++].toFixed(precision);
                    break;
                default:
                    throw predef.Error("#VALUE!","Bad format.");

            }

           i++;
        } 
        else
            res += String(a_format[i++]);

    }

    return res;
}

exports.FORMAT_D = function format(){
    if (typeof(arguments[0]) != "string")
        return predef.Error("#VALUE!","Format must have string type.");

    try {return exports.FORMAT.apply(null,arguments)} catch (err) {return err;}
}


// exports.LEFT = function(string,qty) {
    // return (qty!=undefined ? string.slice(0,qty) : string.slice(0,1));
// }
exports.LEFT = function left(str,n){
    if (!Number.isInteger(n) || n<0)
        throw predef.Error("#VALUE!","Invalid number.");

    return str.slice(0,n);
}

exports.LEFT_D = function left(str,n) {
    if (typeof(str) != "string")
        return predef.Error("#VALUE!","Wrong argument type in left.");
    if (typeof(n) != "number")
        return predef.Error("#VALUE!","Wrong argument type in left.");

    try {return exports.LEFT(str,n)} catch (err) {return err;}
}

exports.MID = function mid(str,n,m){
    if (n <= 0 || m < 0 || !Number.isInteger(n) || !Number.isInteger(m))
        return predef.Error("#VALUE!","Wrong argument type in left.");
    
    var base = n-1;
    return str.slice(base,base+m);
}

exports.MID_D = function mid(str,n,m){
    if (typeof(str)!=="string" || typeof(n)!=="number" || typeof(m)!=="number")
        return predef.Error("#VALUE!","Wrong argument type in mid.");
    
    try {return exports.MID(str,n,m)} catch (err) {return err;}
}

exports.RIGHT = function right(str,n){
    if (!Number.isInteger(n) || n < 0)
        throw predef.Error("#VALUE!","Wrong argument type in right.");

    // if (n==0) return "";
    // else if (n<0) return type.invalid_value();
    // else return str.slice(-n);

    return n===0 ? "" : str.slice(-n);
}

exports.RIGHT_D = function right(str,n){
    if (typeof(str)!=="string" || typeof(n)!=="number")
        return predef.Error("#VALUE!","Wrong argument type in right.");
    
    try {return exports.RIGHT(str,n)} catch (err) {return err;}
}


exports.LEN = function len(string) {
    return string.length;
}

exports.LEN_D = function len(string) {
    if (typeof(string) != "string")
        return predef.Error("#VALUE!","Wrong argument type in len.");

    return string.length;
}

exports.NUMBERVALUE_I = function numbervalue(dynamic,text,decimalsep,groupsep) {

    function percentages(string) {
        var n=string.length,total=0,found=false;
        for (var i=0;i<n;i++) {
            if (string.charAt(i)=="%") {
                total++;
                if (!(found)) {
                    found=true;
                }
            }
            else if ( (string.charAt(i)!="%") && (found) ) {
                total=-1;
                break;
            }
        }
        return total;
    }

    text=text.trim();
    if (decimalsep==undefined) {
        decimalsep=",";
    }
    if (groupsep==undefined) {
        groupsep=".";
    }
    decimalsep=decimalsep.charAt(0);
    groupsep=groupsep.charAt(0);
    var percentage=percentages(text);

    var tmp=text.split(decimalsep);
    for (var i=1;i<tmp.length;i++) {
        if (tmp[i].indexOf(groupsep)!=-1) {
            return predef.throwable_error(dynamic,"#VALUE!","The value introduced is not allowed");
        }
    }

    text=text.split(decimalsep).join("d");
    text=text.split(groupsep).join("");
    text=text.split("d").join(".");
    text=text.split("%")[0];

    if (percentage==-1) {
        if (dynamic) {
            return predef.Error("#VALUE!","The value introduced is not allowed");
        }
        else {
            throw predef.Error("#VALUE!","The value introduced is not allowed");
        }
    }
    else {
        var total=Number(text);
        if (isNaN(total)) {
            return predef.throwable_error(dynamic,"#VALUE!","The value introduced is not allowed");
        }
        return (total*(Math.pow(0.01,percentage)));
    }

}

exports.NUMBERVALUE = function numbervalue(text,decimalsep,groupsep) {

    return exports.NUMBERVALUE_I(false,text,decimalsep,groupsep);

}

exports.NUMBERVALUE_D = function numbervalue(text,decimalsep,groupsep) {

    return exports.NUMBERVALUE_I(true,text,decimalsep,groupsep);

}

exports.PROPER = function proper(string) {
    string = string.split(/(\s)/);
    var result="",i=0;
    while (i<string.length) {
        var j=0;
        while (j<string[i].length) {
            var tmp=string[i];
            var tmpResult=" "
            if (tmp[j].match(/[a-zA-Z]/)) {
                tmpResult=tmp.substring(0,j)+tmp[j].toUpperCase()+tmp.substring(j+1).toLowerCase();
                j=string[i].length;
            }
            j++;
        }
        result+=tmpResult;
        i++;
    }
    return result;
}

exports.PROPER_V2 = function proper_v2(string){
    return string
            .toLowerCase()
            .replace(/(\s|\-|'|\d)(.)/g,function($1) { return $1.toUpperCase();})
            .replace(/^[^(a-z)]*(.)/g,function($1) { return $1.toUpperCase();})
}


exports.PROPER_D = function proper(string) {
    if (typeof(string)!=="string")
        return predef.Error("#VALUE!","The value introduced is not allowed");

    return exports.PROPER_V2    (string);
}

exports.REPLACE = function replace(string,begin,qty,newstring) {
    if (begin<=0 || qty<=0)
        throw predef.Error("#VALUE!","The value introduced is not allowed");

    var substring=string.slice(begin-1,(begin+qty-1));
    return string.replace(substring,newstring);
}

exports.REPLACE_D = function replace(string,begin,qty,newstring) {
    if (typeof begin != "number" || typeof qty != "number" || begin<=0 || qty<=0)
        return predef.Error("#VALUE!","The value introduced is not allowed");
    
    var substring=string.slice(begin-1,(begin+qty-1));
    return string.replace(substring,newstring);
}

exports.REPT = function rept(string,number) {
    if (number < 0)
        throw predef.Error("#VALUE!","The value introduced is not allowed");

    if (string.length*number>32767)
        throw predef.Error("#VALUE!","The result is too long")
    
    return string.repeat(number);
}

exports.REPT_D = function rept(string,number) {
    if (typeof string != "string" || !Number.isInteger(number) || number < 0)
        return predef.Error("#VALUE!","The value introduced is not allowed");

    return string.length*number>32767?
                predef.Error("#VALUE!","The result is too long"):
                string.repeat(number);
}

exports.SEARCH = function search(substring,string,searchnum) {
    if (searchnum<0 || isNaN(searchnum))
        throw predef.Error("#VALUE!","The start number is less or equal than zero");

    if (searchnum-1>string.length)
        throw predef.Error("#VALUE!","The start number is greater than the length of the supplied entire text");
    
    var result = string.toLowerCase().indexOf(substring.toLowerCase(),(searchnum-1))+1
    
    if (result<=0)
        throw predef.Error("#VALUE!","The supplied find text is nout found in the supllied entire text");
    
    return result;
}

exports.SEARCH_D = function search(substring,string,searchnum) {
    if(typeof(substring)!=="string" || typeof(string)!=="string" || !Number.isInteger(searchnum))
        return predef.Error("#VALUE!","Type of parameter is not valid");

    try{ return exports.SEARCH(substring,string,searchnum); } catch(err){return err;}
}


// CHECK: SORRY STACKOVERFLOW, GONNA REPLACE THIS, REALLY
var replaceNthMatch = function (original, pattern, n, replace) {
    var parts, tempParts;

    if (pattern.constructor === RegExp) {

      // If there's no match, bail
      if (original.search(pattern) === -1) {
        return original;
      }

      // Every other item should be a matched capture group;
      // between will be non-matching portions of the substring
      parts = original.split(pattern);

      // If there was a capture group, index 1 will be
      // an item that matches the RegExp
      if (parts[1].search(pattern) !== 0) {
        throw {name: "ArgumentError", message: "RegExp must have a capture group"};
      }
    } else if (pattern.constructor === String) {
      parts = original.split(pattern);
      // Need every other item to be the matched string
      tempParts = [];

      for (var i=0; i < parts.length; i++) {
        tempParts.push(parts[i]);

        // Insert between, but don't tack one onto the end
        if (i < parts.length - 1) {
          tempParts.push(pattern);
        }
      }
      parts = tempParts;
    }  else {
      throw {name: "ArgumentError", message: "Must provide either a RegExp or String"};
    }

    // Parens are unnecessary, but explicit. :)
    indexOfNthMatch = (n * 2) - 1;

  if (parts[indexOfNthMatch] === undefined) {
    // There IS no Nth match
    return original;
  }

  if (typeof(replace) === "function") {
    // Call it. After this, we don't need it anymore.
    replace = replace(parts[indexOfNthMatch]);
  }

  // Update our parts array with the new value
  parts[indexOfNthMatch] = replace;

  // Put it back together and return
  return parts.join('');

}

exports.SUBSTITUTE = function substitute(string,oldstring,newstring,occ) {
    if (oldstring==="")
        throw predef.Error("#VALUE!","Type of parameter is not valid");
    if (occ <= 0)
        throw predef.Error("#VALUE!","Type of parameter is not valid");

    if (occ===undefined) {
        // var last_run = string;
        do {
            var last_run = string;
            string = string.replace(oldstring,newstring);
        } while (last_run!==string)

        return string;
    }

    return replaceNthMatch(string,oldstring,occ,newstring);
}

exports.SUBSTITUTE_D = function substitute(string,oldstring,newstring,times) {
    if (typeof(string)!=="string"||typeof(oldstring)!=="string"||typeof(newstring)!=="string")
        return predef.Error("#VALUE!","Type of parameter is not valid");
    if (times !==times && !Number.isInteger(times))
        return predef.Error("#VALUE!","Type of parameter is not valid");

    return exports.SUBSTITUTE(string,oldstring,newstring,times);
}

exports.T = function t(parameter) {
    return (typeof parameter=="string"? parameter : "");
}

exports.T_D = function t(parameter) {
    return (typeof parameter=="string"? parameter : "");
}

exports.TRIM = function trim(string) {
    return string.trim().replace(/\s+/g,' ');
}

exports.TRIM_D = function trim(string) {
    if (typeof string !== "string") 
        return predef.Error("#VALUE!","Value introduced is not allowed");

    return exports.TRIM(string);
}

exports.UNICHAR = function unichar(number) {
    if (typeof number != "number") { 
        throw predef.Error("#VALUE!","The number introduced is not allowed");
    }
    else if (number<=0) {
        throw predef.Error("#VALUE!","The number introduced is not allowed");
    }
    return String.fromCharCode(number) 
}

exports.UNICHAR_D = function unichar(number) {
    return (typeof number != "number")  ? predef.Error("#VALUE!","The number introduced is not allowed") 
                                        : (number<=0)   ? predef.Error("#VALUE!","The number introduced is not allowed") 
                                                        : String.fromCharCode(number);
}

exports.UNICODE = function unicode(text) {
    if (typeof text != "string") {
        throw predef.Error("#VALUE!","The value introduced is not allowed");
    }
    return text.charCodeAt(0)   ;
}

exports.UNICODE_D = function unicode(text) {
    return (typeof text != "string")    ? predef.Error("#VALUE!","The value introduced is not allowed")
                                        : text.charCodeAt(0);
}

var type  = require('./type.js');
var date  = require('./date.js');

function contains(a_string,other_string){
    return a_string.search(other_string) !== -1;
}

function mightBeDate(a_string){
    return  contains(a_string,"/") || 
                (a_string.search("-") !== -1 && 
                 a_string.search("-") !== 0);
}

exports.VALUE_D = function value (a_string) {
    if (typeof(a_string)!=="string")
        return a_string;

    if (a_string==="NaN")
        return predef.Error("#NUM!");

    if (a_string.length === 0)
        return predef.Error("#VALUE!","The value introduced is not allowed");

    if (a_string[0] === "(" &&  a_string[a_string.length-1] === ")"){
        a_string = a_string.slice(1,a_string.length-1);
        a_string = "-"+a_string;
    }

    if (a_string[0] === "$")
        a_string = a_string.slice(1,a_string.length);
    if (a_string[1] === "$")
        a_string = a_string[0]+a_string.slice(2,a_string.length);

    a_string = a_string.split(",").join("");

    var res = NaN;
    function replaceNaN(a_number){
        return isNaN(a_number)?predef.Error("#VALUE!","Could not parse string."):a_number;
    }

    // console.log("-");
    if (contains(a_string,"x"))
        res = replaceNaN(parseInt(a_string));
    else if (mightBeDate(a_string) && !contains(a_string,":"))
        res = date.DATEVALUE(a_string);
    else if (!mightBeDate(a_string) && contains(a_string,":"))
        res = date.timevalue(a_string);
    else if (mightBeDate(a_string) && contains(a_string,":"))
        res = date.DATETIME_VALUE_D(a_string);
    else if (contains(a_string,"."))
        res = replaceNaN(parseFloat(a_string));
    else
        res = replaceNaN(parseInt(a_string));
    
    if (res.hasOwnProperty("code"))
        return res;

    return res;   
}


exports.WCSCMP = function wcscmp(s1,s2){
    if      (s1===s2) return 0;
    else if (s1 < s2) return -1;
    else              return 1;

}

exports.WCSCMP_D = function wcscmp(s1,s2){
    if (typeof s1 != "string" || typeof s2 != "string")
        throw predef.Error("#VALUE!","The value introduced is not allowed");

    return exports.WCSCMP(s1,s2);
}


exports.char = function char(maybe_number){
    if (typeof(maybe_number) == "number"  &&  
        maybe_number < 256 && 
        maybe_number > 0   &&
        maybe_number%1==0 ) 
        return String.fromCharCode(maybe_number);
    else return type.invalid_value();
    
}


exports.lower = function lower(str){ return str.toLowerCase() }
exports.upper = function upper(str){ return str.toUpperCase() }
