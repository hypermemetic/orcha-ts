import { PlexusRpcClient } from '../lib/transport.js';
import { createClaudecodeClient } from '../lib/claudecode/client.js';
import { createArborClient } from '../lib/arbor/client.js';

async function main() {
  const client = new PlexusRpcClient({ backend: 'substrate', url: 'ws://127.0.0.1:4444' });
  await client.connect();

  const cc = createClaudecodeClient(client);
  const arbor = createArborClient(client);

  console.log('🔧 Creating test session...');
  const sessionName = `test-m2-${Date.now()}`;
  const created = await cc.create('sonnet', sessionName, '/tmp', false, null);

  if (created.type === 'error') {
    console.error('❌ Failed to create session:', created.message);
    process.exit(1);
  }
  console.log('✅ Session created');

  // Chat with a prompt that will use tools
  console.log('💬 Sending chat message (will use Write tool)...');
  let streamId: string | null = null;
  for await (const event of cc.chat(
    sessionName,
    'Write a file /tmp/m2-test.txt with the content "milestone 2 test". Use the Write tool.',
    false
  )) {
    if (event.type === 'stream_started') {
      streamId = event.streamId;
    }
    if (event.type === 'output') {
      process.stdout.write('.');
    }
    if (event.type === 'complete') {
      console.log(' Complete!');
      break;
    }
  }

  // Get session tree info
  console.log('🌳 Fetching tree info...');
  const session = await cc.get(sessionName);
  if (session.type === 'error') {
    console.error('❌ Failed to get session:', session.message);
    process.exit(1);
  }

  const { treeId, nodeId } = session.config.head;
  console.log(`   Tree ID: ${treeId}`);
  console.log(`   Head Node: ${nodeId}`);

  // Walk tree and verify nodes exist
  console.log('🔍 Walking arbor tree...');
  let pathNodes: string[] = [];
  for await (const event of arbor.nodeGetPath(nodeId, treeId)) {
    if (event.type === 'context_path') {
      pathNodes = event.path;
    }
  }

  console.log(`   Found ${pathNodes.length} nodes in path`);

  // Fetch each node and check event types
  const eventTypes: string[] = [];
  for (const nodeId of pathNodes) {
    for await (const event of arbor.nodeGet(nodeId, treeId)) {
      if (event.type === 'node_data') {
        const { data } = event.node;
        if (data && typeof data === 'object') {
          // Check for text node with content field
          const textContent = (data as any).content || (data as any).Text;
          if (textContent && typeof textContent === 'string') {
            try {
              const parsed = JSON.parse(textContent);
              if (parsed.type) {
                eventTypes.push(parsed.type);
              }
            } catch (e) {
              // Skip non-JSON nodes (like root)
            }
          }
        }
      }
    }
  }

  console.log('\n📊 Event types found:');
  const typeCounts = eventTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`   ${type}: ${count}`);
  }

  // Verify we have expected event types for a single-turn conversation
  // Note: user_tool_result only appears in multi-turn conversations
  const expectedTypes = ['assistant_start', 'content_text', 'content_tool_use', 'assistant_complete'];
  const missingTypes = expectedTypes.filter(t => !eventTypes.includes(t));

  if (missingTypes.length > 0) {
    console.error(`\n❌ Missing expected event types: ${missingTypes.join(', ')}`);
    process.exit(1);
  }

  // Verify minimum node count (root + user + assistant start + at least 1 event + assistant complete)
  if (pathNodes.length < 5) {
    console.error(`\n❌ Expected at least 5 nodes, got ${pathNodes.length}`);
    process.exit(1);
  }

  console.log('\n✅ M2 VERIFIED: All Claude events are stored as arbor nodes!');
  console.log(`   Total nodes: ${pathNodes.length}`);
  console.log(`   Event types: ${Object.keys(typeCounts).length}`);

  await client.disconnect();
}

main().then(() => process.exit(0)).catch(e => {
  console.error('❌ Error:', e);
  process.exit(1);
});
