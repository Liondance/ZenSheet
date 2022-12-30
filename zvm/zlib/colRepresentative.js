const Representative = require('./representative.js').Representative;

function colCodeToArray(code){
  return code.split("").map( x => x.charCodeAt() - 65);
}

function arrayToColCode(an_array){
  return an_array.map( x => String.fromCharCode(x+65)).join("")
}

function advanceArray(an_array){
  // console.log(`At start ${an_array}`)
  function add_on_pos(pos){
    if (an_array[pos]===25){
      an_array[pos] = 0;
      return true;
    }
    an_array[pos]++;
    return false;
  }

  let has_carriage = false;
  for (var i = an_array.length - 1; i >= 0; i--) {
    has_carriage = add_on_pos(i);
    if (!has_carriage)
      break;
  }

  if (has_carriage)
    an_array.push(0);

  return an_array;
}

// Cool obfuscation
// f=_=>_<0?'':f(_/26-1)+String.fromCharCode(_%26+65)
// Thanks to Kevin Cruijssen's solution in Java 
// https://codegolf.stackexchange.com/questions/3971/generate-excel-column-name-from-index
get_letter = function(n) {
  if (n==0) return "@";
  n -= 1;
  let res = "";
  for (;n >= 0; n=Math.floor(n/26-1))
    res = String.fromCharCode(n%26+65) + res;
  return res;
}

class ColRepresentative extends Representative {
  static generator(initial){
    let index = initial ? initial : 0 ;
    let letter_state = 
      initial!=undefined && initial > 0 ? colCodeToArray(get_letter(initial)) : [0] ;
    // console.log(`Letter state ${initial}-> ${letter_state}`)
    return {
      next: function(){
        if (index==0)
          return {value: {rep:"@",number:index++,toString: () => "@"} ,done:false};
        else {
          let result =
            {value:
              {rep: arrayToColCode(letter_state) 
              ,toString: () =>  arrayToColCode(letter_state) 
              ,number:index++} 
            ,done:false};
          advanceArray(letter_state);
          return result;
        }
      }
    }
  }
  constructor(id){
    super(id);
  }
  get_value(){
    // console.log(`[${this.id.number}]`)
    return this.id.number;
  }
  toString(){
    return this.id.rep;
  }
}
exports.ColRepresentative = ColRepresentative;