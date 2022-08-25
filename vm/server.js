///
/// server.js
///

const fs = require("fs");
const net = require("net");
const path = require("path");

// ZenSheet Library
const ZLIB = "./ZLIB/";

const Varlib = require(ZLIB + "varlib.js");
const Arraylib = require(ZLIB + "arraylib.js");

const logical = require(ZLIB + "logical.js");
const date = require(ZLIB + "date.js");
const financial = require(ZLIB + "financial.js");
const eng = require(ZLIB + "engineering.js");
const math = require(ZLIB + "math.js");
const stat = require(ZLIB + "stat.js");
const text = require(ZLIB + "text.js");
const type = require(ZLIB + "type.js");
const sys_view = require(ZLIB + "sys_view.js");
const sys_sym = require(ZLIB + "sys_symbols.js");
const lazy = require(ZLIB + "lazy.js");
const lambda = require(ZLIB + "lambda2.js");
const rand_dist = require(ZLIB + "rand_dist.js");

const { CopyObject } = require(ZLIB + "deepCopy.js");
const { IntRange } = require(ZLIB + "int_range.js");

// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

const ZVM = "./vm/";

// @@ WARNING: zst_dir and zst_dir_absolute are shared!
zst_dir = process.argv[2];
zst_dir_absolute = path.isAbsolute(zst_dir) ? zst_dir : path.resolve(zst_dir);

const HOST = "localhost";
const PORT = process.argv[3];

// const zda = path.isAbsolute(zst_dir) ? zst_dir : path.resolve(zst_dir);
// zst_dir_absolute = zda.replace(/\\/g, "/")
// console.log(`The zst dir is ${zst_dir} and the absolute is ${zst_dir_absolute}`);

// Binding
echo = true;
actual_model = "";
context = "";

const _LOAD_PREDEFS = 1;
const _ECHO_OFF = 2;
const _ECHO_ON = 3;
const _CLOSE_SOCKET = 4;
const _CLEAN_VIEW = 5;
const _SHUTDOWN = 6;
const _STORE_DESCR = 7;
const _UPDATE_MODEL = 8;

const filedata = fs.readFileSync(ZVM + "predefined.js", "utf8");
eval(filedata);
Arraylib.set_compute_cycle_function(_sys_tick);

buffer = "";
g_sock = null;
_my_context = null;

last_command_time = 0;
command_invocation_time = new Date();

client = net.createServer(function (sock) {
  g_sock = sock;
  // Add a 'data' event handler to this instance of socket
  sock.on("data", function (data) {
    try {
      buffer += data.toString();
      instructions = JSON.parse(buffer);
      buffer = "";
    } catch (err) {
      // console.log("Incomplete package, waiting for another one");
      return;
    }

    last_command_time = command_invocation_time;
    command_invocation_time = new Date();

    for (let i = instructions.length - 1; 0 <= i; i--) {
      if (instructions[i]["type"] == "command") {
        switch (instructions[i]["instruction"]) {
          case _LOAD_PREDEFS:
            const filedata = fs.readFileSync(ZVM + "predefined.js", "utf8");
            eval(filedata);
            // Here we can safetly pass _sys_tick without getting a
            // sock not defined error
            Arraylib.set_compute_cycle_function(_sys_tick);
            sock.write("OK\n");
            return;
          case _ECHO_OFF:
            echo = false;
            sock.write("OK\n");
            return;
          case _ECHO_ON:
            echo = true;
            sock.write("OK\n");
            return;
          case _CLOSE_SOCKET:
            sock.write("OK\n");
            return;
          case _CLEAN_VIEW:
            sys_view.remove_connection(instructions[i]["argument"]);
            sock.write("OK\n");
            return;
          case _SHUTDOWN:
            sock.write("OK\n");
            process.exit();
          case _STORE_DESCR:
            // console.log("WHAT I GOT")
            // console.log(instructions[i]["argument"].replace(/\\\\\\\\/g,"\\\""));
            // CHECK THIS IS BUG PATCH BC OF NESTED STRINGS on the initializer of a variable
            // THE ERROR CAN BE SEEN ON test/test-2D
            global_symbols.store_describer(
              eval(instructions[i]["argument"].replace(/\\\\\\\\/g, "\\"))
            );
            sock.write("OK\n");
            return;
          case _UPDATE_MODEL:
            actual_model = instructions[i]["argument"];
            sock.write("OK\n");
            return;
          default:
            console.log("got unexpected command " + instructions);
            sock.write("OK\n");

            console.log("Shutting VM down");
            sock.destroy();
            client.close();
            process.exit();
            return;
        }
      }

      try {
        if (echo)
          console.log(
            'VM: Processing -> "' + instructions[i]["instruction"] + '"'
          );

        aux = eval(instructions[i]["instruction"]);
        // console.log(type.toStringLilly(aux));
        if (echo) console.log("VM: Solved as  -> " + aux + "\n");

        res = type.toStringLilly(aux);

        answer = JSON.stringify({
          type: instructions[i]["type"],
          answer: res,
        });
      } catch (err) {
        if (
          err.name === "ReferenceError" ||
          err.name === "RangeError" ||
          err.name === "TypeError"
        ) {
          if (echo) console.log("VMError: reference?");
          console.log(err);
          // console.log(err.message);
          // console.log(err.fileName);
          // console.log(err.lineNumber);
          // console.log(err.columnNumber);
          // console.log(err.stack);

          answer = JSON.stringify({
            type: instructions[i]["type"],
            answer: "#REF!",
          });
          sock.write(answer + "\n");
          return;
          break;
        } else if (err == "done") {
          return;
          break;
        } else if (err == "undefine_sym") {
          return;
          break;
        } else if (type.isinvalid(err)) {
          answer = JSON.stringify({
            type: instructions[i]["type"],
            answer: err.toString(),
          });

          // console.log(err.message)

          sock.write(answer + "\n");
          return;
          break;
        } else {
          errstr = err.message;
        }

        if (echo) console.log("VMError:" + err.message);

        answer = JSON.stringify({
          type: "error",
          answer: errstr,
        });
        break;
      }
    }

    sock.write(answer + "\n");
  });

  // Add a 'close' event handler to this instance of socket
  sock.on("close", function (data) {
    //console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    console.log("Closing VM socket");
    sock.destroy();
    client.close();
    process.exit();
  });

  sock.on("error", function () {
    console.log("App error");
    sock.destroy();
    client.close();
    process.exit();
  });
});

client.listen(PORT, HOST);
