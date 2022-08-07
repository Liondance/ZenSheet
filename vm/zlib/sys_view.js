let type = require("./type.js");
let lazy = require("./lazy.js");

exports.stored_views = {};

connection_exists = function (connection) {
  return exports.stored_views.hasOwnProperty("$" + connection);
};

get_view = function (name, connection) {
  return exports.stored_views["$" + connection]["$" + name];
};

view_exists = function (name, connection) {
  return (
    connection_exists(connection) &&
    exports.stored_views["$" + connection].hasOwnProperty("$" + name)
  );
};

remove_expression = function (name, a_lazy_val, connection) {
  // Check that the lazy val really is really a lazy var
  delete exports.stored_views["$" + connection]["$" + name][
    a_lazy_val.toString()
  ];
};

add_expression = function (name, a_lazy_val, connection) {
  // Check that the lazy val really is really a lazy var
  try {
    exports.stored_views["$" + connection]["$" + name][
      a_lazy_val.toString()
    ] = a_lazy_val;
  } catch (err) {
    console.trace();
  }
};

is_reserved_name = function (name) {
  return ["$active", "$channel", "$histogram", "$histogram_bucket"].includes(
    name
  );
};

let remove_circularity = function (key, value) {
  if (type.is_lilly_subtype(value) || value instanceof type.TupleOf.constructor)
    return value.toString(true);
  else if (value == null) return "?";
  else if (value instanceof lazy.LazyObject) return value.toString();
  else return value;
};

exports.remove_connection = function (connection) {
  if (exports.stored_views["$" + connection] !== undefined)
    for (let i in exports.stored_views["$" + connection])
      delete exports.stored_views["$" + connection][i];

  delete exports.stored_views["$" + connection];
};

exports.refresh = function (name, connection, sock) {
  if (!view_exists(name, connection)) return null;

  let view_found = get_view(name, connection);

  if (!view_found["$active"]) return null;

  let new_response = [];

  for (let j in view_found)
    if (view_found[j] !== undefined && !is_reserved_name(j)) {
      new_response.push(view_found[j].toString());
      let new_val = type.de_lazy(view_found[j]);
      let str_value = type.toStringLilly(new_val);
      new_response.push(str_value);
    }

  if (new_response === []) return null;

  let answer =
    String(name).slice(1) +
    "-" +
    view_found["$channel"] +
    "-" +
    connection +
    "\x16" +
    new_response.join("\x16");

  sock.write(JSON.stringify({ type: "refresh", answer: answer }) + "\n");

  throw "done";
};

exports.notify_view = function (sock, msg_type) {
  let response = [];

  for (let conn in exports.stored_views)
    for (let i in exports.stored_views[conn]) {
      // console.log("   i=" + i);
      if (exports.stored_views[conn][i] !== undefined) {
        let new_response = [];
        // console.log("       j=" + j);
        for (let j in exports.stored_views[conn][i]) {
          if (is_reserved_name(j)) continue;

          // console.log(exports.stored_views[conn][i][j]);
          // console.log("       j=" + j);
          if (
            exports.stored_views[conn][i][j] !== undefined &&
            j != "$active" &&
            exports.stored_views[conn][i]["$active"]
          ) {
            new_response.push(exports.stored_views[conn][i][j].toString());
            let new_val = type.de_lazy(exports.stored_views[conn][i][j]);

            let str_value = type.toStringLilly(new_val);

            new_response.push(str_value);
          }
        }
        if (new_response !== []) {
          let view_name = String(i).slice(1);
          let channel = exports.stored_views[conn][i]["$channel"];
          let connection = conn.slice(1);
          let acc_responses = new_response.join("\x16");

          response.push(
            `${view_name}-${channel}-${connection}\x16${acc_responses}`
          );
        }
      }
    }

  sock.write(
    JSON.stringify({ type: "notify", answer: response.join("\x15") }) + "\n"
  );
  // console.log("sent")
  throw "done";
};

exports.create = function (name, channel, connection) {
  if (view_exists(name, connection)) return null;

  if (!connection_exists(connection))
    exports.stored_views["$" + connection] = {};

  exports.stored_views["$" + connection]["$" + name] = {
    $channel: channel,
    $active: false,
  };

  return null;
};

exports.rename = function (name, new_name, sock, connection) {
  // Do something with the channel :(
  if (!view_exists(name, connection)) return null;

  exports.stored_views["$" + connection]["$" + new_name] = get_view(
    name,
    connection
  );
  delete exports.stored_views["$" + connection]["$" + name];

  return null;
};

exports.update = function (name, outs, ins, connection) {
  // Check if name exists and if outs and ins are really arrays
  if (!view_exists(name, connection))
    return type.Invalid.constructor(
      "#ERR!",
      "'" + name + "' view does not exist."
    );

  for (let i = 0; i < outs.length; i++)
    remove_expression(name, outs[i], connection);

  for (let i = 0; i < ins.length; i++) {
    if (
      ins[i] !== null &&
      (ins[i] instanceof lazy.LazyObject || ins[i] instanceof Array)
    )
      add_expression(name, ins[i], connection);
  }

  return null;
};

exports.resume = function (name, sock) {
  if (!view_exists(name, connection)) return null;

  get_view(name, connection)["$active"] = true;

  return null;
};

exports.suspend = function (name, sock, connection) {
  if (!view_exists(name, connection)) return null;

  get_view(name, connection)["$active"] = false;

  return null;
};

exports.elements = function (name, connection) {
  if (!view_exists(name, connection)) return [];

  let response = [];

  let actual_view = get_view(name, connection);

  for (let j in actual_view) {
    if (actual_view[j] !== undefined && !is_reserved_name(j))
      response.push(actual_view[j]);
  }

  return response;
};

// Helper function, it zips two lists with given function
let zip_with = (a1, a2, a_fun) => a1.map((x, i) => a_fun(x, a2[i]));

exports.mc_params = function (name, nb, lb, ub, connection) {
  exports.stored_views["$" + connection]["$" + name]["$histogram"] = {};
  let view = get_view(name, connection);

  let bucket_size = (ub - lb) / nb;
  let limits = [...Array(nb + 1).keys()]
    .map((x) => Math.round(bucket_size * x * 100) / 100)
    .map((x) => x + lb);

  view["$histogram_bucket"] = function (a_value) {
    for (let i = 0; i < limits.length; i++) if (a_value < limits[i]) return i;
    return limits.length;
  };

  // Create hist
  for (let var_name in view) {
    if (is_reserved_name(var_name)) continue;

    let lower_bounds = [null].concat(limits);
    let upper_bounds = limits.concat([null]);
    view["$histogram"][var_name] = zip_with(
      lower_bounds,
      upper_bounds,
      (l, u) => [l, u, 0]
    );
  }
};

let _COUNT_POSTION = 2;

string_of_hist = function (an_array) {
  let result = [];

  for (let i = 0; i < an_array.length; i++) {
    let lb = an_array[i][0] === null ? "?" : an_array[i][0].toFixed(2);
    let ub = an_array[i][1] === null ? "?" : an_array[i][1].toFixed(2);
    let count = an_array[i][2];
    result.push(`(${lb}, ${ub}, ${count})`);
  }

  return `[${result.join(", ")}]`;
};

exports.mc_run = function (view_name, n, k, connection, sys_tick, sock) {
  let view = get_view(view_name, connection);
  let response = [];

  for (let i = 0; i < n; i++) {
    for (let var_name in view["$histogram"]) {
      // Store result on the
      let evaluation = type.de_lazy(view[var_name]);
      let bucket = view["$histogram_bucket"](evaluation);

      view["$histogram"][var_name][bucket][_COUNT_POSTION]++;

      if ((i + 1) % k == 0) {
        let channel = view["$channel"];
        let new_msg = `(${var_name},${i + 1})\x16${string_of_hist(
          view["$histogram"][var_name]
        )}`;
        response.push(`${view_name}-${channel}-${connection}\x16${new_msg}`);
        // sock.write(JSON.stringify({"type": "notify","answer": `${view_name}-${channel}-${connection}\x16${new_msg}` })+'\n');
      }
    }

    sys_tick(false);
  }

  sock.write(
    JSON.stringify({ type: "notify", answer: response.join("\x15") }) + "\n"
  );

  // Cleaning histograms, setting all buckets to cero
  // for (let var_name in view["$histogram"])
  // for (let i = 0; i < view["$histogram"][var_name].length; i++)
  // view["$histogram"][var_name][i][_COUNT_POSTION] = 0;

  throw "done";

  return null;
};
