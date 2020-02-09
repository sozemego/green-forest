/**
 * This function will override classic console.log, console.warn and console.err functions
 * so that they are printed to the console, but also sent to a remote server.
 */
export function enableDevConsole() {
  console.log("Enabling dev console!");
  let log = console.log;
  console.log = function(...args) {
    send("info", ...args);
    log(...args);
  };
  let warn = console.warn;
  console.warn = function(...args) {
    send("warn", ...args);
    warn(...args);
  };

  let err = console.err;
  console.err = function(...args) {
    send("error", ...args);
    err(...args);
  };
}

async function send(type, ...args) {
  let str = "";
  for (let arg of args) {
    if (typeof arg !== "object") {
      str = `${str} ${arg}`;
    } else if (typeof arg === "object") {
      str = `${str} ${JSON.stringify(arg)}`;
    }
  }
  await fetch(`http://localhost:2500/log-${type}`, {
    method: "post",
    body: str,
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}
