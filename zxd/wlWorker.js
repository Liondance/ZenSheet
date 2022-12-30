///
/// const module = "wlWorker";
///
/// web local worker thread
///
/// Notes:
/// Web Workers don't have a window object, functions like alert are not allowed
/// This file should be placed in the same folder as index.html
///
/// LRQS 7
///

/* eslint-disable no-restricted-globals */ // allow use of "self"

// https://stackoverflow.com/questions/44118600/web-workers-how-to-import-modules
// https://stackoverflow.com/questions/73126309/how-to-use-import-in-the-web-worker
const WWT = import("./wwt.js");

const debug = true;

const ETB = "\x17";

function startWS(url) {
  function parse(packet) {
    // eslint-disable-next-line no-control-regex
    const regex = /([0-9]+)\[([0-9]+)\]\t(.*)/;
    const matches = packet.match(regex);
    if (matches === null) {
      return null;
    }
    return { channel: matches[1], sequence: matches[2], command: matches[3] };
  }

  const worker = {
    send: function (request) {
      const packet = parse(request.replace(ETB, ""));
      const { channel, sequence, command } = packet;
      const JS = channel === "12"; // future CHANNEL.JS === 13
      if (JS) {
        // eslint-disable-next-line no-eval
        const result = eval(command);
        const response = `OK: ${command} ==> ${result}`;
        const message = `${channel}[${sequence}]\t${response}`;
        self.postMessage(message);
      } else {
        self.postMessage(`worker::send: '${request}' ignored`);
      }
    },
  };

  console.log(`startWS 51: WWT is ${WWT}`);

  return worker;
}

let worker = null;

// messages sent to the worker thread from the Web client
self.onmessage = async function (event) {
  const request = event.data;

  if (debug) console.log(`request = ${request}`);

  if (typeof request !== "string") {
    const message = `0[0]\tWSW: ERROR: bad request: ${request.toString()}`;
    self.postMessage(message);
    return;
  }

  if (debug && !worker) {
    console.log(`self.onmessage: type of WTT is ${typeof WWT}`);
    console.log(`self.onmessage: WTT is ${WWT}`);
    const WMX = await WWT;
    console.log(`self.onmessage: WTT is ${WMX}`);
    console.log(`self.onmessage: WTT is ${WMX}`);
  }

  if (request.startsWith("ws://")) {
    worker = startWS(request);
    const channel = 0; // CHANNEL.ASY
    const sequence = 0;
    const response = "ACK: worker started";
    const message = `${channel}[${sequence}]\t${response}`;
    self.postMessage(message);
    return;
  }

  if (worker) {
    worker.send(request);
  } else {
    const message = `0[0]\tWSW: ERROR: worker is null: '${request}' ignored`;
    self.postMessage(message);
  }
};
