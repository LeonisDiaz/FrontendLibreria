import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

const envPath = resolve(process.cwd(), '.env');

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const port = process.env.FRONTEND_PORT || process.env.PORT || '4200';

const ngBin = resolve(process.cwd(), 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
const child = spawn(process.execPath, [ngBin, 'serve', '--port', port], {
  stdio: 'inherit',
  shell: false,
  env: process.env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
