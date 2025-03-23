// server/utils/executeCode.js
const ivm = require("isolated-vm");

async function executeCode(code) {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContext();
  const jail = context.global;
  await jail.set("global", jail.derefInto());

  const output = [];
  function logFn(...args) {
    output.push(args.join(" "));
  }
  await jail.set("log", new ivm.Reference(logFn), { copy: true });

  const modifiedCode = `
    function triggerEvent() {
      console.log("Event triggered!");
    }
    console = { log: (...args) => { log(...args); } };
    ${code}
  `;
  
  const script = await isolate.compileScript(modifiedCode);
  await script.run(context, { timeout: 1000 });
  return output.join("\n");
}

module.exports = { executeCode };
