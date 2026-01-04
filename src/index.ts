import { Jetstream } from '@skyware/jetstream';
import { initDatabase, insertPost, getPostCount } from './db.js';

/**
 * AT Protocol View App - Firehose Listener
 * 
 * This app demonstrates how to consume the AT Protocol firehose using Jetstream.
 * See JETSTREAM_REFERENCE.md for complete documentation of all available event attributes.
 */

// Initialize database
const db = initDatabase();

console.log('🚀 Starting AT Protocol View App (Proof of Concept)');
console.log('📡 Connecting to Bluesky firehose...\n');

let postCount = 0;
let lastLogTime = Date.now();
const LOG_INTERVAL = 10000; // Log stats every 10 seconds

// Create jetstream connection
// Available options: wantedCollections, wantedDids, cursor, endpoint
// See JETSTREAM_REFERENCE.md for details on all available options
const jetstream = new Jetstream({
  wantedCollections: ['app.bsky.feed.post'],
  // You can also filter by specific DIDs:
  // wantedDids: ['did:plc:...'],
  // Or resume from a specific time:
  // cursor: 1234567890123456,
});

// Listen for new posts being created
// Event structure: { did, time_us, kind: "commit", commit: { operation, collection, rkey, record, ... } }
// See JETSTREAM_REFERENCE.md for complete event and record schemas
jetstream.onCreate('app.bsky.feed.post', (event) => {
  try {
    // event.commit.record contains the full post record
    // Available fields: text, createdAt, langs, reply, embed, facets, labels, tags
    const record = event.commit.record as any;
    
    // Validate it's a text post
    if (record.text && typeof record.text === 'string') {
      // Store the post
      insertPost(db, {
        // Construct the at:// URI from event attributes
        uri: `at://${event.did}/${event.commit.collection}/${event.commit.rkey}`,
        authorDid: event.did,              // DID of the post author
        text: record.text,                 // Post text content
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
