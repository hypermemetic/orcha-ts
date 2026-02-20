import { PlexusRpcClient } from '../lib/transport.js';
import { createClaudecodeClient } from '../lib/claudecode/client.js';
import { createLoopbackClient } from '../lib/loopback/client.js';
import { askApproval } from './approval.js';
import { extractArtifact, runTest, type ValidationArtifact } from './validate.js';

const SYSTEM_SUFFIX = `
When your task is complete, you MUST include this JSON in your final response:
{"orcha_validate": {"test_command": "<shell command>", "cwd": "<absolute path>"}}
The test command must exit 0 on success.`;

export interface RunnerConfig {
  substrateUrl: string;
  defaultRules: string;
  maxRetries: number;
  model: 'opus' | 'sonnet' | 'haiku';
}

export async function runTask(config: RunnerConfig, task: string, rules?: string): Promise<void> {
  const effectiveRules = rules ?? config.defaultRules;
  const client = new PlexusRpcClient({ backend: 'substrate', url: config.substrateUrl });
  await client.connect();

  const cc = createClaudecodeClient(client);
  const lb = createLoopbackClient(client);
  const sessionName = `orcha-${crypto.randomUUID()}`;

  const created = await cc.create(
    config.model, sessionName, process.cwd(),
    true,  // loopback_enabled
    SYSTEM_SUFFIX + (effectiveRules ? `\n\nApproval context:\n${effectiveRules}` : ''),
  );
  if (created.type === 'error') throw new Error(`Failed to create session: ${created.message}`);

  let currentPrompt = task;
  let attempt = 0;

  while (true) {
    const artifact = await runAttempt(client, cc, lb, sessionName, currentPrompt, effectiveRules);

    if (!artifact) { console.log('\n⚠ No validation artifact — treating as success'); break; }

    const result = runTest(artifact);
    if (result.success) { console.log('\n✓ Validated'); break; }

    attempt++;
    if (attempt > config.maxRetries) {
      process.stdout.write(`\nValidation failed after ${config.maxRetries} attempts. [r]etry / [q]uit: `);
      const answer = await readLine();
      if (answer.trim() === 'r') { attempt = 0; }
      else { console.log('Giving up.'); break; }
    } else {
      console.log(`\n✗ Validation failed (attempt ${attempt}/${config.maxRetries}), retrying...`);
      currentPrompt = `Validation failed:\n${result.output}\n\nPlease fix and try again.`;
    }
  }
}

async function runAttempt(
  client: PlexusRpcClient,
  cc: ReturnType<typeof createClaudecodeClient>,
  lb: ReturnType<typeof createLoopbackClient>,
  sessionName: string,
  prompt: string,
  rules: string,
): Promise<ValidationArtifact | null> {
  const started = await cc.chatAsync(sessionName, prompt);
  if (started.type === 'error') throw new Error(`chat_async failed: ${started.message}`);
  const { streamId } = started;

  let seq = 0;
  let fullText = '';
  let artifact: ValidationArtifact | null = null;

  while (true) {
    // Handle pending approvals
    const pending = await lb.pending();
    if (pending.type === 'ok') {
      for (const approval of pending.approvals) {
        const approve = await askApproval(client, approval, rules);
        await lb.respond(approval.id, approve);
        console.log(`\n  ${approve ? '✓' : '✗'} ${approval.toolName}`);
      }
    }

    // Poll stream events
    const poll = await cc.poll(streamId, seq, 50);
    if (poll.type === 'error') throw new Error(`poll failed: ${poll.message}`);

    seq = poll.readPosition;

    for (const { event } of poll.events) {
      if (event.type === 'content') {
        process.stdout.write(event.text);
        fullText += event.text;
        artifact = extractArtifact(fullText) ?? artifact;
      }
    }

    if (poll.status === 'complete' || poll.status === 'failed') break;
    await sleep(500);
  }

  console.log('');
  return artifact;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const readLine = () => new Promise<string>(resolve => {
  process.stdin.once('data', d => resolve(d.toString()));
});
