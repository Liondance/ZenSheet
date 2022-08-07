///
/// predefined.js
///

// Sys manual binding
sys = {
    get_content : function(symbol){
        return this.content;
    }
}

global_symbols = new sys_sym.SymbolDescriber();

_sys_reset = function(labels,symbols) {
    if (labels != undefined && symbols != undefined) {
        
        labels  = labels.length  == 1 && labels[0]  == '' ? [] : labels;
        symbols = symbols.length == 1 && symbols[0] == '' ? [] : symbols;

        for (let i = 0; i < symbols.length; i++){
            global_symbols.remove_symbol(labels[i]);

            try {
                eval(`delete ${String(symbols[i])};`);
            } catch(err){
                console.log(`${symbols[i]} did not even exist.`);
            }
        }

        sys_view.stored_views = {};
        global_symbols.delete_all();
        actual_model = "";
        Arraylib.clean_a1();
        _my_context = null;

        sock.write(JSON.stringify({"type": "reset","answer":labels.join(",")})+'\n');
    	throw "done";
    }
    else {
        actual_model = "";
        Arraylib.clean_a1();
        _my_context = null;
        sock.write(JSON.stringify({"type": "bye","answer": "jibber-jabber"})+'\n');
    	process.exit(0);
    }
}

_sys_undefine  = function(a_symbol){
    // console.log(a_symbol.toString())
    if (a_symbol != null && (a_symbol instanceof lazy.LazyObject) ){
        // console.log('Deleting lazy object')
        try {
            // Check if undefine works for workshets
            // console.log('Check if undefine works for workshets')
            Arraylib.clean_worksheet(a_symbol.toString());
            global_symbols.remove_symbol(a_symbol.toString());
            sock.write(JSON.stringify({"type": "undefine","answer": a_symbol.toString()})+'\n');
        } catch(err){
            throw type.Invalid.constructor("#ERR!","Undefine was expecting a valid formula.");
        }

        throw "undefine_sym";
    }
    else if ( a_symbol != null && a_symbol.hasOwnProperty("code")){
        // Temporal patch
        // console.log('Deleting something with code?')
        // console.log("Of course it was an exception");
        const symbol_recover_attemp = a_symbol.message.split("'")[1];
        
        // console.log("I'll try to remove:" + symbol_recover_attemp);

        if (global_symbols.symbols_exists(symbol_recover_attemp)){
            global_symbols.remove_symbol(symbol_recover_attemp);
            sock.write(JSON.stringify({"type": "undefine","answer": symbol_recover_attemp})+'\n');
            throw "undefine_sym";
        }
        else
            throw type.Invalid.constructor("#ERR!","Undefine was expecting a valid formula.");
    }
    else
        throw type.Invalid.constructor("#ERR!","Undefine was expecting a valid formula.");
}

sim_error   = function(){
    sock.write(JSON.stringify({"type": "sim_err","answer":"p_pending"})+'\n');
    throw "done";
}
sim_pending = function(){
    sock.write(JSON.stringify({"type": "sim_pending","answer":"p_error"})+'\n');
    throw "done";
}

_sys_cycle = function(ms) {
    sock.write(JSON.stringify({"type": "cycle","answer":`${ms}`})+'\n');
    throw "done";
}

_sys_view = function(name,op,outs,ins){
    connection = instructions[i]["connection"];
    switch(op) {
        case "create":
            // console.log("ASKING TO CREATE");
            return sys_view.create(name,outs,connection);
            break;
        case "update":
            // console.log("ASKING TO UPDATE");
            // console.log(outs);
            // console.log(ins);
            return sys_view.update(name,outs,ins,connection);
            break;
        case "resume":
            // console.log("ASKING TO RESUME");
            return sys_view.resume(name,sock,connection);
            break;
        case "rename":
            // console.log("ASKING TO RENAME");
            return sys_view.rename(name,outs,sock,connection);
            break;
        case "suspend":
            // console.log("ASKING TO SUSPEND");
            return sys_view.suspend(name,sock,connection);
            break;
        case "elements":
            return sys_view.elements(name,connection);
            break;
        case "refresh":
            return sys_view.refresh(name,connection,sock);
            break;
    }
    return null;

}

_sys_model = function _sys_model(){
    return actual_model;
}

_sys_load      = function(str){
    const path = require('path');

    const file = path.join(zst_dir_absolute,context,str);

    if (str==="")
        throw type.Invalid.constructor("#ERR!","No file specified");

    if (!fs.existsSync(file)){
        if (!fs.existsSync(file+".sym"))
            throw type.Invalid.constructor("#ERR!","File " + str + " does not exist");
        else
            file += ".sym";
    }

    actual_model = str;

    // Check the user is not using .. to try to access parent directories
    
    sock.write(JSON.stringify({"type": "load","answer":file})+'\n');

    throw "done";
}
_sys_save = function(str){
    const path = require('path');

    if (str==="")
        throw type.Invalid.constructor("#ERR!","No file specified");

    if (str[0] === "/")
        throw type.Invalid.constructor("#ERR!","Absolute paths not allowed");

    // Check the user is not using .. to try to access parent directories

    // const file = zst_dir+str;
    // const dir  = file.split("/").slice(0,-1).join("/");

    const file = path.join(zst_dir_absolute,context,str);
    // console.log(`We should write to ${file} is a join of ${zst_dir_absolute} , ${context} and ${str}`);


    if (!fs.existsSync(path.dirname(file))){
        // console.log(`Directory ${path.dirname(file)} did not exist`);
        throw type.Invalid.constructor("#ERR!","Directory does not exist");
    }

    const model_content = global_symbols.describe_model();


    fs.writeFile(file,model_content, function(err) {
        if(err) {
            return console.log(err);
        }

        // console.log("The file was saved!");
    }); 

    actual_model = str;

    // sock.write(JSON.stringify({"type": "save","answer":file})+'\n');    
    // throw "done";
    return true;
}

_sys_flush = function _sys_flush(){
    const path = require('path');

    if (actual_model === "")
        return null;

    const new_dir = path.join(zst_dir_absolute,context,actual_model);

    // console.log(`Should flush to ${actual_model}`);
    _sys_save(actual_model)
    return null;
}


_sys_db = function _sys_db(a_context){
    const path = require('path');
    const fs   = require('fs');

    if (!fs.existsSync(path.join(zst_dir_absolute,a_context))) {
        const context_parts = a_context.split("/");
        try {
            for (let i = 0; i < context_parts.length; i++){
                // console.log(`Trying to create ${path.join(zst_dir_absolute,context_parts.slice(0,i+1).join("/"))}`)
                fs.mkdir(
                    path.join(zst_dir_absolute,context_parts.slice(0,i+1).join("/")),
                    (err) => {if (err && (err.code !== 'EEXIST')){throw err;}}                    
                )
            }
        } catch(err){
            if (err.code != 'EEXIST')
                return false;
        }

    }

    context = a_context;
    return true;
}

_sys_context = function _sys_context() {
    return context;
}



_sys_models = function models(){
    const fs   = require('fs');
    const path = require('path');

    const recursive_files = function(abs_dir){
        const dir_elements  = fs.readdirSync(abs_dir);
        const only_files = dir_elements.filter( x => fs.lstatSync(path.join(abs_dir,x)).isFile());
        const only_dirs  = dir_elements.filter( x => fs.lstatSync(path.join(abs_dir,x)).isDirectory())

        const recursive_results =
            only_dirs
            .map(x => {
                const dir_name       = path.posix.basename(x);
                const dir_to_explore = path.join(abs_dir,dir_name);
                const res            = recursive_files( dir_to_explore );
                return res.map( file => path.join(dir_name,file));
            })

        return only_files.concat([].concat.apply([],recursive_results));
    };

    const result = recursive_files(path.join(zst_dir_absolute,context));

    return result;
}

_sys_shutdown  = function(){
    sock.write(JSON.stringify({"type": "shutdown","answer":"null"})+'\n');    
    throw "done";
}

_sys_describe = function(label){
    return global_symbols.describe_symbol(label);
}

_sys_debug     = function(int){echo = int != 0; return null}
_sys_parse     = function(str){return str;}
// prefer: _sys_version   = function(){ return "0.2" }
_sys_version   = function _sys_version(){
    try {
        return require("./version.js").value;
    } catch(err){
        return "unknown"
    }
}
_sys_build     = function(){}
_sys_info      = function(){}
_sys_run       = function(str){}
_sys_compute_cycle  = lazy.getComputeCycle;
_sys_refresh   = function(){return _sys_view("noname","refresh")}

_sys_tick      = function(notify=true){
    command_invocation_time = last_command_time;
    lazy.incComputeCycle();
    // Launch update of all variables marked as spreadsheet

    if (notify)
      sys_view.notify_view(sock);
}

_sys_idle = function(){
    difference = command_invocation_time - last_command_time;
    command_invocation_time = last_command_time;
    return difference;
}

_sys_active_connections = function(){
    command_invocation_time = last_command_time;
    sock.write(JSON.stringify({"type": "active_connections","answer":"OK"})+'\n');    
    throw "done";
}
    
if (typeof(sys) == "object"){
    sys.content = {}
    sys.content.reset     = _sys_reset;
    sys.content.debug     = _sys_debug;
    sys.content.parse     = _sys_parse;
    sys.content.shutdown  = _sys_shutdown;
    sys.content.version   = _sys_version;
    sys.content.build     = _sys_build;
    sys.content.info      = _sys_info;
    sys.content.load      = _sys_load;
    sys.content.save      = _sys_save;
    sys.content.run       = _sys_run;
    sys.content.tick      = _sys_tick;
    sys.content.view      = _sys_view;
    sys.content.refresh   = _sys_refresh;
    sys.content.undefine  = _sys_undefine;
    sys.content.idle      = _sys_idle;
    sys.content.compute_cycle      = _sys_compute_cycle;
    sys.content.active_connections = _sys_active_connections;
    sys.content.describe  = _sys_describe;
    sys.content.cycle  = _sys_cycle;
    sys.content.model  = _sys_model;
    sys.content.flush  = _sys_flush;
    sys.content.db     = _sys_db;
    sys.content.context  = _sys_context;
    sys.content.models  = _sys_models;
    
}

info =  function(attribute) {
    switch (attribute){
        case "version":
            return "OPL";
        case "release":
            return "1.0";
        default:
            throw type.Invalid.constructor("#VALUE!","No such attribute");
    }
}

_is_worksheet = function (a_type){
  const worksheet = "array[,] => lazy var";
  // console.log(`Comparing [${a_type}][${worksheet}]  [${a_type.length}][${worksheet.length}]`)
  return a_type === worksheet; 
}

update_worksheet = function(a_name){
  try{
    if (!a_name) {
      const DECLARED_TP_POS = 0;
      const INFERRED_TP_POS = 1;

      global_symbols.iterate_rows(
        (key,data) => {
          const tuple = data[1].get_content();
          const is_ws = _is_worksheet(tuple[INFERRED_TP_POS]) || 
                        _is_worksheet(tuple[DECLARED_TP_POS]);
          if ( is_ws )
            Arraylib.create_ws_representatives(key,data[0]);
        }
      )
    }
    
    // WE NEED TO ADD SOMETHING THAT MAKES COPIES PER POSITION

    Arraylib.create_ws_representatives(a_name,global_symbols.get_variable(a_name));

    
  }catch(err){
    // console.log(err)
  }
}


symbols       = [];

_mc_params = function _mc_params(view,nb,lb,ub){
    connection = instructions[i]["connection"];
    sys_view.mc_params(view,nb,lb,ub,connection);
    return null;
}

_mc_run = function _mc_run(view,n,k){
    connection = instructions[i]["connection"];
    sys_view.mc_run(view,n,k,connection,_sys_tick,sock);
    return null;
}

mc = {
    get_content : function(symbol){
        return this.content;
    }
}

mc.content = {}
mc.content.params = _mc_params
mc.content.run    = _mc_run

// Function mocks
ltype       = function ltype()      { return null; }
ltype2rtype = function ltype2rtype(){ return null; }
rtype       = function rtype()      { return null; }
structural  = function structural() { return null; }
symbols     = function symbols()    { return null; }
pending     = function pending()    { return null; }
conform     = function conform()    { return null; }
tjoin       = function tjoin()      { return null; }
formula     = function formula()    { return null; }
ivl         = function ivl()        { return null; }
nvl         = function nvl()        { return null; }
