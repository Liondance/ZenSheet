const type       = require('./type.js');
const Arraylib   = require("./arraylib.js");
const {IntRange} = require("./int_range.js");
const {has}      = require("./utils.js");

a1_copy = (a1) => {return (a_context=null) => null};

exports.set_copy_function = function(a_fun){ a1_copy = a_fun; }

var RelationType = Object.freeze({"NO_CONTEXT":0,"TO_DEFINE":1,"DEFINED":2})
exports.RelationType = RelationType;

class A1Accessor {
  constructor(name,abs_name,rowRepresentative,abs_row,columnRepresentative,abs_col,array_getter,context){
    // console.log(`Creating A1 with context ${context.cell}`)
    // console.log(`Getting constructed with ${rowRepresentative.toString()} , ${columnRepresentative.toString()}`)
    // console.log(String(context))
    // console.log(`With context: ${has(context,"cell") ? has(context.cell,"toString")?  context.cell.toString() : String(context.cell) : "NOCONTEXT"}`)
    this.name     = name;
    this.abs_name = abs_name;

    this.row     = rowRepresentative;
    this.abs_row = abs_row;
    
    this.col = columnRepresentative;
    this.abs_col = abs_col;

    this.get_array   = () => array_getter.get_array();

    this.initial_context = context?(context.cell?context.cell:null):null;

    this.copy = a1_copy(this);
  }

  get_row(){
    const is_undefined = 
      typeof this.row === "undefined" || this.row.is_invalid();

    return is_undefined ? -1 : this.row.get_value();
  }

  get_column(){
    const is_undefined = 
      typeof this.col === "undefined" || this.col.is_invalid();

    return is_undefined ? -1 : this.col.get_value();
  }

  toString(){
    if (this.is_invalid())
      return new type.Invalid.constructor("#REF!","Such row and column does not exist.");
    else {
      const name   = this.abs_name ? `${this.name}!` : "";
      const column = (this.abs_col ? "$" : "") + this.col.toString();
      const row    = (this.abs_row ? "$" : "") + this.row.toString();
      return `${name}${column}${row}`;
    }
  }

  get_relation(){
    if (!this.initial_context || this.is_invalid()){
      // console.log("No context")
      return [RelationType.NO_CONTEXT,null];
    }

    if (!has(this.initial_context,"get_row")){
      // console.log("To define relation") 
      return [RelationType.TO_DEFINE ,null];
    }
      // return {row:-this.get_row(),col:-this.get_column()};
    // console.log("Already defined, gotta copy")
    const row_dif = this.get_row() - this.initial_context.get_row();
    const col_dif = this.get_column() - this.initial_context.get_column();
    return [RelationType.DEFINED ,{row:row_dif,col:col_dif}];
      
  }

  is_invalid() {
    return (typeof this.row === "undefined") || this.row.is_invalid() ||
           (typeof this.col === "undefined") || this.col.is_invalid();
  }

  evaluate(){
    const array = this.get_array();
    if (array == null)
      return new type.Invalid.constructor("#REF!","A1 reference could not find such array");
   
    return type.de_lazy(Arraylib.RoutLimitsRg(array,[this.get_row(),this.get_column()]));

  }

}

class A1Range {
  constructor(lb,ub){
    this.lb = lb;
    this.ub = ub;
    this.abs_name = lb.abs_name;
    this.lb.abs_name = false;
    this.ub.abs_name = false;
  }

  evaluate(){
    if (this.lb.is_invalid() || this.ub.is_invalid())
      return new type.Invalid.constructor("#REF!","Cell does not exist. Invalid row or column of one of the boundaries");

    let array = this.lb.get_array();
    if (array == null)
      return new type.Invalid.constructor("#REF!","A1 reference could not find such array");

    let row_range = new IntRange(this.lb.get_row(),this.ub.get_row());
    let col_range = new IntRange(this.lb.get_column(),this.ub.get_column());

    return type.de_lazy( Arraylib.RoutLimitsRg(array,[row_range,col_range]) )
  }

  copy(context=null){
    // Restore if the name was absolute or not before copy
    this.lb.abs_name = this.abs_name;
    this.ub.abs_name = this.abs_name;

    try {
      var new_lb = this.lb.copy(context);
      var new_ub = this.ub.copy(context);
    }catch(err){
      throw error;
    }
    finally {
      this.lb.abs_name = false;
      this.ub.abs_name = false;
    }

    return new A1Range(new_lb,new_ub);

  }

  toString(){
    if (this.lb.is_invalid() && this.ub.is_invalid())
      return "#REF!";
    const name = this.abs_name ? this.lb.name + "!" : "";
    return `${name}${this.lb.toString()}:${this.lb.toString()}`
  }
}

exports.A1Accessor = A1Accessor
exports.A1Range    = A1Range