import { PlexusRpcClient } from '../lib/transport.js';
import { createClaudecodeClient } from '../lib/claudecode/client.js';

async function main() {
  const client = new PlexusRpcClient({ backend: 'substrate', url: 'ws://127.0.0.1:4444' });
  await client.connect();

  const cc = createClaudecodeClient(client);

  console.log('🔧 Creating test session...');
  const sessionName = `test-m5-${Date.now()}`;
  const created = await cc.create('sonnet', sessionName, '/tmp', false, null);

  if (created.type === 'error') {
    console.error('❌ Failed to create session:', created.message);
    process.exit(1);
  }
  console.log('✅ Session created');

  // Chat with a prompt that will use tools
  console.log('💬 Sending chat message...');
  for await (const event of cc.chat(
    sessionName,
    'List the files in /tmp directory using the Bash tool, then write a summary to /tmp/summary.txt',
    false
  )) {
    if (event.type === 'output') {
      process.stdout.write('.');
    }
    if (event.type === 'complete') {
      console.log(' Complete!');
      break;
    }
  }

  // Now test render_context
  console.log('\n🎨 Testing render_context()...');

  // Call the claudecode.render_context RPC method directly
  const renderStream = client.call('claudecode.render_context', {
    name: sessionName,
    start: null,
    end: null,
  });

  let messages: any[] = [];
  for await (const event of renderStream) {
    if (event.type === 'data' && event.content) {
      const result = event.content as any;
      if (result.type === 'ok' && result.messages) {
        messages = result.messages;
      } else if (result.type === 'error') {
        console.error('❌ render_context error:', result.message);
        process.exit(1);
      }
    }
  }

  console.log(`✅ Rendered ${messages.length} messages from arbor tree\n`);

  // Verify message structure
  if (messages.length === 0) {
    console.error('❌ No messages rendered!');
    process.exit(1);
  }

  // Display message summary
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    console.log(`[${i}] ${msg.role}:`);
    console.log(`    Content blocks: ${msg.content.length}`);

    for (let j = 0; j < Math.min(msg.content.length, 3); j++) {
      const block = msg.content[j];
      if (block.type === 'text') {
        console.log(`      - text: ${block.text?.slice(0, 60)}...`);
      } else if (block.type === 'tool_use') {
        console.log(`      - tool_use: ${block.name}`);
      } else if (block.type === 'tool_result') {
        console.log(`      - tool_result: ${block.content?.slice(0, 60)}...`);
      }
    }
    if (msg.content.length > 3) {
      console.log(`      ... and ${msg.content.length - 3} more blocks`);
    }
    console.log('');
  }

  // Verify we have at least user + assistant messages
  const roles = messages.map(m => m.role);
  if (!roles.includes('user')) {
    console.error('❌ Missing user message');
    process.exit(1);
  }
  if (!roles.includes('assistant')) {
    console.error('❌ Missing assistant message');
    process.exit(1);
  }

  // Verify assistant message has content blocks
  const assistantMsg = messages.find(m => m.role === 'assistant');
  if (!assistantMsg || !assistantMsg.content || assistantMsg.content.length === 0) {
    console.error('❌ Assistant message has no content blocks');
    process.exit(1);
  }

  console.log('✅ M5 VERIFIED: render_context() successfully reconstructs conversation from arbor!');

  await client.disconnect();
}

main().then(() => process.exit(0)).catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
