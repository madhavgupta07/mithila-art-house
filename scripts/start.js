import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const serverEnvPath = path.join(root, 'server', '.env');
const clientEnvPath = path.join(root, '.env.local');

function readEnvValue(file, key) {
  if (!fs.existsSync(file)) return '';
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(new RegExp(`^\\s*(?:export\\s+)?${key}\\s*=\\s*(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '').trim() : '';
}

function usableMongoUri() {
  const uri = process.env.MONGODB_URI || readEnvValue(serverEnvPath, 'MONGODB_URI');
  if (!uri || /USERNAME:PASSWORD|replace-with|<[^>]+>|your[-_]/i.test(uri)) return '';
  return uri;
}

function localMongoTarget(uri) {
  try {
    const url = new URL(uri);
    const host = url.hostname;
    if (!['127.0.0.1', 'localhost', '::1'].includes(host)) return null;
    return { host: host === 'localhost' ? '127.0.0.1' : host, port: Number(url.port) || 27017 };
  } catch {
    return null;
  }
}

function portIsOpen({ host, port }) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    let done = false;
    const finish = (open) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(700);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

async function chooseMode() {
  if (process.argv.includes('--full')) {
    return { full: true, reason: 'Forced full stack with --full' };
  }
  if (process.argv.includes('--frontend')) {
    return { full: false, reason: 'Forced frontend-only with --frontend' };
  }

  const uri = usableMongoUri();
  if (!uri) {
    return { full: false, reason: 'No MONGODB_URI found in server/.env' };
  }

  const target = localMongoTarget(uri);
  if (!target) {
    return { full: true, reason: 'Remote MongoDB URI detected' };
  }

  const reachable = await portIsOpen(target);
  return reachable
    ? { full: true, reason: `Local MongoDB reachable on ${target.host}:${target.port}` }
    : { full: false, reason: `Local MongoDB is not running on ${target.host}:${target.port}` };
}

async function main() {
  const mode = await chooseMode();
  const clientApi = readEnvValue(clientEnvPath, 'VITE_API_URL');

  console.log('\nMithila Art House');
  console.log('─'.repeat(48));
  console.log(`Mode: ${mode.full ? 'full stack (Vite + Express)' : 'frontend-only storefront'}`);
  console.log(`Why:  ${mode.reason}`);

  if (mode.full) {
    console.log('\nStarting Vite on :5173 and Express on :4000.');
    console.log('Injecting VITE_API_URL=/api so forms and checkout use the API.\n');
  } else {
    console.log('\nUsing the bundled catalogue and browser-only sample flow.');
    if (clientApi) {
      console.log('Note: .env.local sets VITE_API_URL, but the API is not running.');
      console.log('      Clear VITE_API_URL to avoid /api proxy errors.');
    }
    console.log('To enable the backend later: start MongoDB, set MONGODB_URI in server/.env,');
    console.log('add VITE_API_URL=/api to .env.local, then run npm start again.\n');
  }

  if (process.argv.includes('--check')) return;

  const script = mode.full ? 'dev:full:core' : 'dev';
  // Inject the API URL into Vite so the browser actually calls the backend in
  // full mode, and clear any stale value in frontend-only mode.
  const env = {
    ...process.env,
    VITE_API_URL: mode.full ? '/api' : '',
  };
  // `shell: true` is required for npm on Windows in this environment; spawning
  // npm.cmd directly fails with EINVAL.
  const child = spawn('npm', ['run', script], {
    cwd: root,
    stdio: 'inherit',
    env,
    shell: process.platform === 'win32',
  });

  const forward = (signal) => {
    if (!child.killed) child.kill(signal);
  };
  process.on('SIGINT', () => forward('SIGINT'));
  process.on('SIGTERM', () => forward('SIGTERM'));

  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 0);
  });
  child.on('error', (error) => {
    console.error(`\nCould not start ${script}:`, error.message);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error('Startup check failed:', error.message);
  process.exit(1);
});
