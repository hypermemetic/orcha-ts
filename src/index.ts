import { createInterface } from 'readline';
import { readFileSync } from 'fs';
import { runTask, type RunnerConfig } from './runner.js';

const args = process.argv.slice(2);
const opts = parseArgs(args);

const defaultRules = opts['--rules']
  ?? (opts['--rules-file'] ? readFileSync(opts['--rules-file'], 'utf8') : '');

const config: RunnerConfig = {
  substrateUrl: opts['--substrate'] ?? 'ws://localhost:4444',
  defaultRules,
  maxRetries: parseInt(opts['--max-retries'] ?? '3'),
  model: (opts['--model'] ?? 'sonnet') as RunnerConfig['model'],
};

const rl = createInterface({ input: process.stdin, output: process.stdout });
const question = (q: string) => new Promise<string>(r => rl.question(q, r));

async function repl() {
  console.log('orcha — type a task, empty line to exit');
  while (true) {
    const task = await question('\nTask> ');
    if (!task.trim()) { rl.close(); break; }

    const rulesOverride = await question('Rules [enter for default]> ');
    await runTask(config, task, rulesOverride.trim() || undefined);
  }
}

repl().catch(e => { console.error(e); process.exit(1); });

function parseArgs(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--') && args[i + 1]) result[args[i]] = args[++i];
  }
  return result;
}
