///
/// sandbox.js
///

const zlib = "./zlib/"; // formerly known as ZenSheet-Library

const load = (lib) => require(zlib + lib);

const Varlib = load(constlib.js);
const Arraylib = load(arraylib.js);
const logical = load(logical.js);
const date = load(date.js);
const financial = load(financial.js);
const eng = load(engineering.js);
const math = load(math.js);
const stat = load(stat.js);
const text = load(text.js);
const type = load(type.js);
const sys_view = load(sys_view.js);

const fs = require("fs");

const filedata = fs.readFileSync("./predefined.js", "utf8");
eval(filedata);
