const net = require('net');
const { spawn, execSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const port = 8081;

function isPortOpen(host, portToCheck, timeoutMs = 500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    const done = (result) => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(result);
      }
    };

    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
    socket.connect(portToCheck, host);
  });
}

async function waitForMetro(host, metroPort, maxWaitMs = 30000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < maxWaitMs) {
    // eslint-disable-next-line no-await-in-loop
    const open = await isPortOpen(host, metroPort, 500);
    if (open) {
      return true;
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function ensureMetroRunning() {
  const alreadyRunning = await isPortOpen('127.0.0.1', port);
  if (alreadyRunning) {
    console.log(`Restarting existing Metro on port ${port}...`);
    stopMetroOnPort();
  }

  console.log('Starting Metro with reset cache...');
  if (process.platform === 'win32') {
    // Open Metro in a dedicated terminal window so logs are visible.
    spawn(
      'cmd.exe',
      [
        '/d',
        '/c',
        'start',
        '',
        '/d',
        projectRoot,
        'cmd.exe',
        '/k',
        `npx react-native start --reset-cache --port ${port}`,
      ],
      {
      cwd: projectRoot,
      detached: true,
      stdio: 'ignore',
      windowsHide: false,
      }
    ).unref();
  } else {
    const metroProcess = spawn('npx', ['react-native', 'start', '--reset-cache', '--port', String(port)], {
      cwd: projectRoot,
      detached: true,
      stdio: 'ignore',
    });
    metroProcess.unref();
  }

  const ready = await waitForMetro('127.0.0.1', port, 30000);
  if (!ready) {
    throw new Error('Metro did not start within 30 seconds.');
  }

  console.log('Metro is running.');
}

function stopMetroOnPort() {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano -p tcp | findstr :${port}`, {
        stdio: ['ignore', 'pipe', 'ignore'],
      }).toString();

      const pids = Array.from(
        new Set(
          output
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => line.split(/\s+/).pop())
            .filter(Boolean)
        )
      );

      pids.forEach((pid) => {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      });
      return;
    }

    const output = execSync(`lsof -ti tcp:${port}`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    }).toString();
    output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .forEach((pid) => {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      });
  } catch {
    // Nothing to stop.
  }
}

async function runAndroid() {
  await ensureMetroRunning();

  const runAndroidProcess =
    process.platform === 'win32'
      ? spawn('npx react-native run-android --no-packager', {
          cwd: projectRoot,
          stdio: 'inherit',
          shell: true,
        })
      : spawn('npx', ['react-native', 'run-android', '--no-packager'], {
          cwd: projectRoot,
          stdio: 'inherit',
        });

  runAndroidProcess.on('exit', (code) => {
    process.exit(code ?? 1);
  });
}

runAndroid().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
