import { Jetstream } from '@skyware/jetstream';
import { initDatabase, insertPost, getPostCount } from './db.js';

// Initialize database
const db = initDatabase();

console.log('🚀 Starting AT Protocol View App (Proof of Concept)');
console.log('📡 Connecting to Bluesky firehose...\n');

let postCount = 0;
let lastLogTime = Date.now();
const LOG_INTERVAL = 10000; // Log stats every 10 seconds

// Create jetstream connection
const jetstream = new Jetstream({
  wantedCollections: ['app.bsky.feed.post'],
});

jetstream.onCreate('app.bsky.feed.post', (event) => {
  try {
    const record = event.commit.record as any;
    
    // Validate it's a text post
    if (record.text && typeof record.text === 'string') {
      // Store the post
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
        postCount = 0;
        lastLogTime = now;
      }
    }
  } catch (err) {
    console.error('Error processing event:', err);
  }
});

jetstream.on('error', (err) => {
  console.error('Jetstream error:', err);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down...');
  const totalPosts = getPostCount(db);
  console.log(`📊 Final count: ${totalPosts} posts indexed`);
  jetstream.close();
  db.close();
  process.exit(0);
});

// Start the jetstream
jetstream.start();

console.log('✅ Connected! Listening for posts...');
console.log('💡 Press Ctrl+C to stop\n');
