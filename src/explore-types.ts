import { Jetstream } from '@skyware/jetstream';

/**
 * Explore Record Types Script
 * 
 * This script listens to ALL record types on the firehose and shows you
 * what's being created, updated, and deleted across the network.
 * 
 * Run with: npm run build && node dist/explore-types.js
 */

console.log('🔍 Exploring AT Protocol Record Types');
console.log('📡 Connecting to firehose (listening to ALL record types)...\n');

// Create jetstream with NO filters = get everything
const jetstream = new Jetstream({
  // No wantedCollections = all collections
});

// Track counts by collection
const counts: Record<string, { create: number; update: number; delete: number }> = {};

// Listen to all commits
jetstream.on('commit', (event) => {
  const collection = event.commit.collection;
  
  // Initialize counters for this collection if needed
  if (!counts[collection]) {
    counts[collection] = { create: 0, update: 0, delete: 0 };
  }
  
  // Count by operation
  const op = event.commit.operation;
  counts[collection][op]++;
  
  // Log each event
  const emoji = 
    op === 'create' ? '✨' :
    op === 'update' ? '🔄' :
    '🗑️';
  
  console.log(`${emoji} ${collection} (${op})`);
});

// Every 10 seconds, show summary
let lastSummaryTime = Date.now();
setInterval(() => {
  const now = Date.now();
  if (now - lastSummaryTime >= 10000) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY - Record Types Seen (in last 10 seconds)');
    console.log('='.repeat(60));
    
    // Sort by total count
    const sortedCollections = Object.entries(counts).sort((a, b) => {
      const totalA = a[1].create + a[1].update + a[1].delete;
      const totalB = b[1].create + b[1].update + b[1].delete;
      return totalB - totalA;
    });
    
    let totalRecords = 0;
    sortedCollections.forEach(([collection, ops]) => {
      const total = ops.create + ops.update + ops.delete;
      totalRecords += total;
      console.log(
        `${collection.padEnd(30)} | ` +
        `✨ ${ops.create.toString().padStart(4)} | ` +
        `🔄 ${ops.update.toString().padStart(4)} | ` +
        `🗑️  ${ops.delete.toString().padStart(4)} | ` +
        `Total: ${total}`
      );
    });
    
    console.log('='.repeat(60));
    console.log(`📈 Total records seen: ${totalRecords}\n`);
    
    // Reset counters
    Object.keys(counts).forEach(key => {
      counts[key] = { create: 0, update: 0, delete: 0 };
    });
    
    lastSummaryTime = now;
  }
}, 1000);

// Handle identity events
jetstream.on('identity', (event) => {
  console.log(`🔐 Identity update: ${event.identity.handle}`);
});

// Handle account events
jetstream.on('account', (event) => {
  console.log(`👤 Account status: ${event.account.active ? 'active' : 'inactive'}`);
});

// Handle errors
jetstream.on('error', (err) => {
  console.error('Jetstream error:', err);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...\n');
  
  console.log('📊 FINAL SUMMARY - All Record Types Seen');
  console.log('='.repeat(60));
  
  const sortedCollections = Object.entries(counts).sort((a, b) => {
    const totalA = a[1].create + a[1].update + a[1].delete;
    const totalB = b[1].create + b[1].update + b[1].delete;
    return totalB - totalA;
  });
  
  sortedCollections.forEach(([collection, ops]) => {
    const total = ops.create + ops.update + ops.delete;
    if (total > 0) {
      console.log(
        `${collection.padEnd(30)} | ` +
        `✨ ${ops.create.toString().padStart(4)} | ` +
        `🔄 ${ops.update.toString().padStart(4)} | ` +
        `🗑️  ${ops.delete.toString().padStart(4)} | ` +
        `Total: ${total}`
      );
    }
  });
  
  console.log('='.repeat(60));
  
  jetstream.close();
  process.exit(0);
});

console.log('✅ Connected! Exploring all record types...');
console.log('💡 Press Ctrl+C to stop and see summary\n');

jetstream.start();
