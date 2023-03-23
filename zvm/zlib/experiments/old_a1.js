
// Old representation of A1

class A1Accessor {
  constructor(array,row,column){
    this.row    = row; 
    this.column = column;
    if (!(global_accessors[array] instanceof Array) || 
          global_accessors[array].length === 0)
      global_accessors[array] = [this];
    else
      global_accessors[array].push(this);
    this.array = array;
    this.invalid = false;
  }

  update_delete(type,position,qty){
    switch (type) {
      case "column":
        if ( position  < this.column)
          this.column -= qty;
        else if ( position <= this.column  && this.column <= position + qty )
          this.invalid = true;
        break;
      case "row":
        if ( position < this.row)
          this.row -= qty;
        else if ( position <= this.row  && this.row < position + qty )
          this.invalid = true;
        break;
      default:
        break;
    return this;
    }
  }

  update_insert(type,position,qty){
    switch (type) {
      case "column":
        if ( position <= this.column)
          this.column += qty;
        break;
      case "row":
        if ( position <= this.row )
          this.row += qty;
        break;
      default:
        break;
    return this;
    }
  }

  toString(){
    if (this.invalid)
      return "#REF!"
    else
      return `${this.array}!${get_letter(this.column)}${this.row}`;
  }

}

module.exports.A1Accessor = A1Accessor

update_on = function(operation,name,target_dim,pos,qty) {
  // console.log(`Calling update_on ${operation} ${name} ${target_dim} ${pos} ${qty}`)
  let accessors = global_accessors[name];
  const type = target_dim === 0 ? "row" : "column";
  // console.log(`Accessors: ${accessors}`)

  if (accessors)
    accessors.map(
      x =>
        operation == "delete"? x.update_delete(type,pos,qty):x.update_insert(type,pos,qty)
    );

}

exports.clean_a1 = function(){
  Object.keys(global_accessors).forEach(function(key) { delete global_accessors[key]; });
  accessors_list = [];
}

exports.create_a1_access = function (id_num,name,row,column){
  // Ensuring that the access identified by id_num is created only one
  // console.log(`Getting called with ${id_num}/${name}/${row}/${column}`)
  let a1_accessor = accessors_list[id_num];
  if (!a1_accessor) {
    accessors_list[id_num] = new A1Accessor(name,row,column)
    a1_accessor = accessors_list[id_num];
  }

  return {
    get_row:  () => a1_accessor.row,
    get_column:  () => a1_accessor.column,
    get_ws: () => name,
    is_invalid: () => a1_accessor.invalid,
    toString: function(a_context){
      return `${a1_accessor.toString()}`; },
  }
}