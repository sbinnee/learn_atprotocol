import { Jetstream } from '@skyware/jetstream';
import { initDatabase, insertPost, getPostCount } from './db.js';

/**
 * Backfill Script - Fetch posts from the past
 * 
 * This script allows you to "rewind" the firehose and collect posts from a specific time in the past.
 * 
 * Usage:
 *   npm run backfill               # Fill from 1 hour ago
 *   npm run backfill -- --hours 6  # Fill from 6 hours ago
 *   npm run backfill -- --days 1   # Fill from 1 day ago
 *   npm run backfill -- --minutes 30  # Fill from 30 minutes ago
 *   npm run backfill -- --cursor 1234567890123456  # Fill from specific unix microseconds
 */

// Parse command line arguments
const args = process.argv.slice(2);
let cursorMs = Date.now() - 3600000; // Default: 1 hour ago

if (args.length > 0) {
  if (args[0] === '--hours' && args[1]) {
    cursorMs = Date.now() - parseInt(args[1]) * 3600000;
  } else if (args[0] === '--days' && args[1]) {
    cursorMs = Date.now() - parseInt(args[1]) * 86400000;
  } else if (args[0] === '--minutes' && args[1]) {
    cursorMs = Date.now() - parseInt(args[1]) * 60000;
  } else if (args[0] === '--cursor' && args[1]) {
    cursorMs = parseInt(args[1]) / 1000; // Convert from microseconds
  } else {
    console.log('Invalid arguments');
    console.log('Usage: npm run backfill -- [--hours|--days|--minutes|--cursor] <value>');
    process.exit(1);
  }
}

// Convert milliseconds to microseconds (what Jetstream expects)
const cursorUs = Math.floor(cursorMs * 1000);
const cursorDate = new Date(cursorMs).toISOString();

// Initialize database
const db = initDatabase();

console.log('🚀 Backfill Mode - Fetching posts from the past');
console.log(`📡 Starting from: ${cursorDate}`);
console.log(`   (Unix microseconds: ${cursorUs})\n`);

let postCount = 0;
let lastLogTime = Date.now();
const LOG_INTERVAL = 10000; // Log stats every 10 seconds
let isConnected = false;

// Create jetstream connection with cursor
const jetstream = new Jetstream({
  wantedCollections: ['app.bsky.feed.post'],
  cursor: cursorUs,  // Start from the specified time
});

jetstream.onCreate('app.bsky.feed.post', (event) => {
  try {
    const record = event.commit.record as any;
    
    if (record.text && typeof record.text === 'string') {
      insertPost(db, {
        uri: `at://${event.did}/${event.commit.collection}/${event.commit.rkey}`,
        authorDid: event.did,
        text: record.text,
        createdAt: record.createdAt || new Date().toISOString(),
        indexedAt: new Date().toISOString(),
      });
      
      postCount++;
      
      // Log progress every 10 seconds
      const now = Date.now();
      if (now - lastLogTime >= LOG_INTERVAL) {
        const totalPosts = getPostCount(db);
        console.log(`📊 Stats: ${totalPosts} total posts indexed (${postCount} in last 10s)`);
        console.log(`   Current event time: ${new Date(event.time_us / 1000).toISOString()}`);
        postCount = 0;
        lastLogTime = now;
      }
    }
  } catch (err) {
    console.error('Error processing event:', err);
  }
});

jetstream.on('open', () => {
  isConnected = true;
  console.log('✅ Connected to Jetstream!\n');
});

jetstream.on('error', (err) => {
  console.error('Jetstream error:', err);
});

jetstream.on('close', () => {
  console.log('\n\nConnection closed');
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down backfill...');
  const totalPosts = getPostCount(db);
  console.log(`📊 Final count: ${totalPosts} posts indexed`);
  
  // Show how to resume from this point
  const lastEvent = Math.floor(Date.now() * 1000);
  console.log(`\n💡 To continue from here next time, run:`);
  console.log(`   npm run backfill -- --cursor ${lastEvent}`);
  
  jetstream.close();
  db.close();
  process.exit(0);
});

// Start the jetstream
jetstream.start();

console.log('⏪ Replaying posts from the past...');
console.log('💡 Press Ctrl+C to stop\n');
