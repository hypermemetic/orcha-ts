import { PlexusRpcClient } from '../lib/transport.js';
import { createClaudecodeClient } from '../lib/claudecode/client.js';
import type { ApprovalRequest } from '../lib/loopback/types.js';

export async function askApproval(
  client: PlexusRpcClient,
  req: ApprovalRequest,
  rules: string,
): Promise<boolean> {
  const cc = createClaudecodeClient(client);
  const name = `orcha-approval-${crypto.randomUUID()}`;

  const created = await cc.create('sonnet', name, '/tmp', false, null);
  if (created.type === 'error') return false; // default deny

  const prompt = `Approval rules:\n${rules}\n\nTool: ${req.toolName}\nInput: ${JSON.stringify(req.input, null, 2)}\n\nShould this be approved? Respond with JSON: {"approve": true} or {"approve": false}`;

  let text = '';
  for await (const event of cc.chat(name, prompt)) {
    if (event.type === 'content') text += event.text;
    if (event.type === 'complete' || event.type === 'error') break;
  }

  const match = text.match(/\{[^}]*"approve"\s*:\s*(true|false)[^}]*\}/);
  if (!match) return false;
  return JSON.parse(match[0]).approve === true;
}
