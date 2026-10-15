import { spawn }         from "node:child_process";
import { createServer }  from "node:net";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));
const serveEntry  = fileURLToPath(new URL("../../node_modules/@react-router/serve/bin.cjs", import.meta.url));

async function getAvailablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return port;
}

export async function startApplication({ dataSource, apiBaseUrl, sessionSecret }) {
  const port  = await getAvailablePort();
  const child = spawn(process.execPath, [serveEntry, "build/server/index.js"], {
    cwd        : projectRoot,
    windowsHide: true,
    stdio      : ["ignore", "pipe", "pipe"],
    env        : {
      ...process.env,
      NODE_ENV      : "production",
      HOST          : "127.0.0.1",
      PORT          : String(port),
      DATA_SOURCE   : dataSource,
      API_BASE_URL  : apiBaseUrl,
      SESSION_SECRET: sessionSecret,
    },
  });
  let output = "";

  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Application startup timed out.")), 15000);
      function finish(error) {
        clearTimeout(timeout);
        child.off("error", finish);
        child.off("exit", onExit);
        child.stdout.off("data", onData);
        error ? reject(error): resolve();
      }
      function onExit(code) {
        finish(new Error(`Application exited with code ${code}. Build it first with npm run build.\n${output}`));
      }
      function onData(chunk) {
        output += chunk.toString();
        if (output.includes("[react-router-serve]")) finish();
      }
      child.stderr.on("data", (chunk) => { output += chunk.toString(); });
      child.once("error", finish);
      child.once("exit", onExit);
      child.stdout.on("data", onData);
    });
  } catch (error) {
    child.kill();
    throw error;
  }

    // Drain request logs so the child never blocks on a full stdout pipe.
  child.stdout.resume();
  return {
    url: `http://127.0.0.1:${port}`,
    async stop() {
      if (child.exitCode !== null || child.signalCode !== null) return;
      await new Promise((resolve) => { child.once("exit", resolve); child.kill(); });
    },
  };
}
