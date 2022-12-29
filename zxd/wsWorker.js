///
/// wsWorker.js
///
/// websocket worker thread
///
/// Notes:
/// Web Workers don't have a window object, functions like alert are not allowed
/// This file should be placed in the same folder as index.html
///
/// LRQS 7
///

const module = "wsWorker";

function startWS(url) {
  const wsc = new WebSocket(url);

  wsc.onopen = function () {
    const message = `0[0]\tWSW: "ACK: connected to ${url}"`;
    self.postMessage(message);
  };

  wsc.onclose = function (event) {
    const message = `0[0]\tWSW: "ERROR: connection closed: ${event.toString()}"`;
    self.postMessage(message);
  };

  wsc.onerror = function (event) {
    const message = `0[0]\tWSW: "ERROR: connection error: ${event.toString()}"`;
    self.postMessage(message);
  };

  let buffer = "";

  wsc.onmessage = event => {
    const message = event.data.toString();
    const packets = message.split("\x17");

    let packet = buffer + packets[0];
    for (let i = 0; i < packets.length - 1; ) {
      self.postMessage(packet);
      packet = packets[++i];
    }
    buffer = packet;
  };

  const THRESHOLD = 1024;

  function _waitForConnection(send, interval) {
    if (wsc.readyState === 1) {
      send();
    } else {
      // Formula reminder: sum[i = 0:n-1](2^i) = 2^n - 1
      interval = 2 * interval;
      if (THRESHOLD < interval) {
        const total = interval - 1;
        const message = `0[0]\tWSW: "ERROR: connection not ready after ${total} ms"`;
        self.postMessage(message);
      }
      setTimeout(function () {
        _waitForConnection(send, interval);
      }, interval);
    }
  }

  const worker = {
    send: function (message) {
      _waitForConnection(function () {
        wsc.send(message);
      }, 1);
    },
  };

  return worker;
}

let worker = null;

// messages sent to the worker thread (from Main.js)
self.onmessage = function (event) {
  const request = event.data;

  if (typeof request !== "string") {
    const message = `0[0]\tWSW: "ERROR: bad request: ${request.toString()}"`;
    self.postMessage(message);
    return;
  }

  if (request.startsWith("ws://")) {
    worker = startWS(request);
    return;
  }

  if (worker) {
    worker.send(request);
  }
};
