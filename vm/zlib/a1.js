const {RowRepresentative} = require('./rowRepresentative.js');
const {ColRepresentative} = require('./colRepresentative.js');
const {A1Accessor,A1Range,RelationType,set_copy_function} = require('./a1_accessor.js');
const {CopyObject} = require('./deepCopy.js');
const {has} = require('./utils.js');

// This module depends on the state of the two variables below.
// So, it should be imported ONLY ONCE
exports.A1Range = A1Range;
// Dictionary with global variable names as keys and RepresentativePool as values
global_accessors = { }

// Lack of curry
copy_a1 = function(a1){
  return function(new_context=null){
    // console.log(`I'm the formula ${a1.toString()} and I'm being copied with the context ${context.toString()}`)
    // console.log(`Gettin called from within a1 copy`)

    if (new_context == null || ! (new_context.cell)){
      let context = {cell:a1.initial_context}
      let new_a1 =
        exports.create_a1_access(a1.name,true,a1.get_row(),a1.abs_row,a1.get_column(),a1.abs_col,context)
      // Without context we translate the worksheet to explicit
      return new_a1;
    }

    const [rel_type,relative] = a1.get_relation();

    

    switch(rel_type){
      case RelationType.NO_CONTEXT:
        return a1;
        break;

      case RelationType.TO_DEFINE:
        // console.log("It had no prior context")
        // Set all fields again
        {
          let new_a1 =
            exports.create_a1_access(
              a1.name,a1.abs_name,
              a1.get_row(),a1.abs_row,
              a1.get_column(),a1.abs_col,
              new_context
            );

          return new_a1;
        }
        break;

      default:
      case RelationType.DEFINED:
        {
          // Make a copy
          const name = a1.abs_name ? a1.name : new_context.cell.name;
          const row = a1.abs_row || a1.initial_context == null ? a1.get_row() : new_context.cell.get_row() + relative.row;
          const col = a1.abs_col || a1.initial_context == null ? a1.get_column() : new_context.cell.get_column() + relative.col;
          // console.log(`Context before was ${String(a1.initial_context)} but now ${new_context.cell.toString()}`)
          // console.log(`Creating with ${name} ${row} ${col}. The context was ${a1.initial_context} `)
          // console.log(`A1 was ${a1.toString()}`)
          let new_a1 =
            exports.create_a1_access(
              name,a1.abs_name,
              row,a1.abs_row,
              col,a1.abs_col,
              new_context
            );
            // console.log(`Now is ${new_a1.toString()}`)

          return new_a1;
        }
        break;

    }
  }
}

set_copy_function(copy_a1);

// Class to hold A1 notation for a worksheet
class RepresentativePool {
  constructor(rows,columns,array,name){
    this.rows = []; // Array holding row representatives [0,1,..]
    this.cols = []; // Array holding Col representatives [A,B,..,AA,AB,..]

    this.array = array; // Place where the worksheet lives. eval(this.array) retrieves the actual value

    this.name = name;   // Global name of the array, useful for serialization

    for (var i = 0; i < rows; i++)
      this.rows.push(new RowRepresentative(i));

    let col_spawner = ColRepresentative.generator();

    for (var i = 0; i < columns; i++)
      this.cols.push(new ColRepresentative(col_spawner.next().value));

  }

  // Method to call upon row or col insertion. It update representatives
  update_insert(type,position,qty){
    // Be very careful
    const array = type == "row" ? this.rows : this.cols;
    const Representative = type == "row"? RowRepresentative : ColRepresentative;
    const generator = Representative.generator(position);

    // Insert on positions
    for (var j = 0; j < qty; j++){
      let next_value = generator.next().value;
      array.splice(position+j,0,new Representative(next_value));
    }

    // Keep using the generator untill the end of the array
    for (var i = position+qty; i < array.length; i++) {      
      let next_value = generator.next().value;
      array[i].replace(next_value);
    }
  }

  // Method to call upon row or col deletion
  update_delete(type,position,qty){
    const array = type == "row" ? this.rows : this.cols;
    const last_chunk = array.slice(position,array.length-qty).map( x => x.id );

    for (var i = 0; i < last_chunk.length; i++)
      array[i+position+qty].replace(last_chunk[i]);

    // Invalidate positions
    for (var j = position; j < position+qty; j++)
      array[j].remove();

    array.splice(position,qty);    
  }

  // Create a A1 accessor
  get_accessor(name,abs_name,row,abs_row,col,abs_col,context_getter){
    // Representatives
    let a1_row = this.rows[row];
    let a1_col = this.cols[col];
    let self = this;

    // console.log(`Getting asked to call ${name} `)
    // console.log(`this.rows[${row}] = ${a1_row}/${this.rows.length}`)
    // console.log(`this.cols[${col}] = ${a1_col}/${this.cols.length}`)

    return new A1Accessor(name,abs_name,a1_row,abs_row,a1_col,abs_col,self,context_getter);
  }

  // Method to call upon worsheet creation or re-assignment 
  update_dimensions(rows,cols){
    function remove_excess(array,final_len){
      for (var i = array.length - 1; i >= final_len; i--) {
        array[i].remove();
        array.pop()
      }
    }

    // Update rows
    if (rows > this.rows.length)
      for (var i = this.rows.length; i <= rows; i++)
        this.rows.push(new RowRepresentative(i));
    else if (rows < this.rows.length)
      remove_excess(this.rows,rows);

    // Update columns
    if (cols > this.cols.length){
      let col_spawner = ColRepresentative.generator(this.rows.length);
      for (var i = this.rows.length; i <= rows; i++)
        this.rows.push(new ColRepresentative(col_spawner.next()));
    }
    else if (cols < this.cols.length)
      remove_excess(this.cols,cols);
  }

  delete(){
    for (var i = 0; i < this.rows.length; i++)
      this.rows[i].remove();

    for (var i = 0; i < this.cols.length; i++)
      this.cols[i].remove();

    // delete this.array;
    delete this.name;
    delete this.rows;
  }

  get_array(){
    try {
      return eval(this.array);
    }catch(err){
      return null;
    }
  }

  // Inner representation for debugging purposes
  toString(){
    const rows = this.rows.map(x=>x.toString()).join(",");
    const cols = this.cols.map(x=>x.toString()).join(",");
    return `{rows:[${rows}],cols:[${cols}]}`;
  }
}
exports.RepresentativePool = RepresentativePool;

exports.create_ws_representatives = function(name,variable){
  try {
    var array = eval(variable);
    if (!array.length || ! array[0] || !array[0].length)
      throw "err";
  } catch(err){
    return;
  }
  
  let rows = array.length;
  let cols = array[0].length;
  
  const representatives_existed =
    typeof(global_accessors[name]) != "undefined"|| global_accessors[name] != null;


  if ( representatives_existed )
    global_accessors[name].update_dimensions(rows,cols);
  else 
    global_accessors[name] = new RepresentativePool(rows,cols,variable,name);
  // console.log(`Setting copy for ${rows} ${cols}`)
  let base_context = {cell: name};
  // Setting context to cells for first time
  try {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        // array[i][j]
        // console.log(`Setting array [${i}][${j}]`)

        let context ={cell: exports.create_a1_access(
                name,true,
                i,true,
                j,true,
                base_context
              )};
        // console.log(`Copy with context ${context.cell.toString()}`)
        let temp = CopyObject(array[i][j],context);
        array[i][j] = temp;
        // console.log(`array[${i}][${j}]`)
        // console.log(has(array[i][j],"constructor")? array[i][j].constructor  :"NOCONTEXT")
      }
    }
  }catch(err){
    console.log(err);
    throw err 
  }

}

exports.create_a1_access = function (name,abs_name,row,abs_row,column,abs_col,context_getter){
  return global_accessors[name].get_accessor(name,abs_name,row,abs_row,column,abs_col,context_getter);
}


update_on = function(operation,name,target_dim,pos,qty) {
  let representatives = global_accessors[name];
  const type = target_dim === 0 ? "row" : "column";
  if(representatives)
    operation == "delete"?
      representatives.update_delete(type,pos,qty):
      representatives.update_insert(type,pos,qty);
}

exports.update_on_delete = function(name,target_dim,pos,element_n) {
  update_on("delete",name,target_dim,pos,element_n);
}

exports.update_on_insert = function(name,target_dim,pos,element_n) {
  update_on("insert",name,target_dim,pos,element_n);
}

exports.clean_a1 = function(){
  Object.keys(global_accessors).forEach(function(key) { delete global_accessors[key]; });
}

exports.clean_worksheet = function(global_name){
  if(global_accessors[global_name]) {
    global_accessors[global_name].delete();
    delete global_accessors[global_name];
  }
  return null;
}