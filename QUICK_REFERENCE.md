# Jetstream Quick Reference Card

## Event Object Structure (What you receive)

### Commit Event (kind: "commit")
```javascript
{
  did: "did:plc:abc123...",           // Author's DID
  time_us: 1725911162329308,          // Unix microseconds (use as cursor)
  kind: "commit",                     // Event type
  commit: {
    rev: "3l3qo2vutsw2b",             // Repo revision
    operation: "create",              // "create" | "update" | "delete"
    collection: "app.bsky.feed.post", // Collection NSID
    rkey: "3l3qo2vuowo2b",            // Record key
    record: { /* ... */ },            // Record data (create/update only)
    cid: "bafyrei..."                 // Content ID (create/update only)
  }
}
```

### Identity Event (kind: "identity")
```javascript
{
  did: "did:plc:abc123...",
  time_us: 1725516665234703,
  kind: "identity",
  identity: {
    did: "did:plc:abc123...",
    handle: "alice.bsky.social",      // Current handle
    seq: 1409752997,
    time: "2024-09-05T06:11:04.870Z"
  }
}
```

### Account Event (kind: "account")
```javascript
{
  did: "did:plc:abc123...",
  time_us: 1725516665333808,
  kind: "account",
  account: {
    active: true,                     // Account status
    did: "did:plc:abc123...",
    seq: 1409753013,
    time: "2024-09-05T06:11:04.870Z",
    status?: "deactivated" | "suspended" | "takendown" | ...
  }
}
```

## Common Record Types

### Post (app.bsky.feed.post)
```javascript
event.commit.record = {
  $type: "app.bsky.feed.post",
  text: "Hello world!",               // Required
  createdAt: "2024-01-04T...",        // Required
  langs: ["en"],                      // Optional: language codes
  reply: {                            // Optional: if replying
    parent: { uri: "at://...", cid: "..." },
    root: { uri: "at://...", cid: "..." }
  },
  embed: { /* ... */ },               // Optional: images, links, etc.
  facets: [ /* ... */ ],              // Optional: mentions, links, hashtags
  tags: ["atproto"]                   // Optional: topic tags
}
```

### Like (app.bsky.feed.like)
```javascript
event.commit.record = {
  $type: "app.bsky.feed.like",
  subject: {
    uri: "at://did:plc:.../app.bsky.feed.post/...",
    cid: "bafyrei..."
  },
  createdAt: "2024-01-04T..."
}
```

### Follow (app.bsky.graph.follow)
```javascript
event.commit.record = {
  $type: "app.bsky.graph.follow",
  subject: "did:plc:abc123...",       // DID of followed user
  createdAt: "2024-01-04T..."
}
```

### Profile (app.bsky.actor.profile)
```javascript
event.commit.record = {
  $type: "app.bsky.actor.profile",
  displayName: "Alice",
  description: "Bio text here",
  avatar: { /* blob ref */ },
  banner: { /* blob ref */ }
}
```

## Accessing Event Attributes in Code

```javascript
jetstream.onCreate('app.bsky.feed.post', (event) => {
  // Top-level event attributes
  const authorDid = event.did;                    // Author's DID
  const timestamp = event.time_us;                // Microsecond timestamp
  
  // Commit attributes
  const operation = event.commit.operation;       // "create"
  const collection = event.commit.collection;     // "app.bsky.feed.post"
  const recordKey = event.commit.rkey;            // Unique key
  const contentId = event.commit.cid;             // Content ID
  
  // Record attributes (varies by collection)
  const postText = event.commit.record.text;      // Post text
  const createdAt = event.commit.record.createdAt;// Creation timestamp
  const languages = event.commit.record.langs;    // ["en", "es"]
  const isReply = !!event.commit.record.reply;    // Has reply parent?
  
  // Construct the AT URI
  const uri = `at://${event.did}/${event.commit.collection}/${event.commit.rkey}`;
  // Example: at://did:plc:abc.../app.bsky.feed.post/3l3qo...
});
```

## Filtering Options

```javascript
const jetstream = new Jetstream({
  // Filter by collections
  wantedCollections: [
    'app.bsky.feed.post',           // Only posts
    'app.bsky.feed.like',           // Only likes
    'app.bsky.graph.*',             // All graph records (wildcard)
  ],
  
  // Filter by DIDs (up to 10,000)
  wantedDids: [
    'did:plc:abc123...',
    'did:plc:xyz789...',
  ],
  
  // Start from a specific time (unix microseconds)
  cursor: 1725519626134432,         // Use time_us from previous event
  
  // Custom endpoint
  endpoint: 'wss://jetstream1.us-east.bsky.network/subscribe'
});
```

## Event Handlers

```javascript
// Specific operations
jetstream.onCreate('app.bsky.feed.post', (event) => { /* ... */ });
jetstream.onUpdate('app.bsky.actor.profile', (event) => { /* ... */ });
jetstream.onDelete('app.bsky.feed.like', (event) => { /* ... */ });

// All commits
jetstream.on('commit', (event) => {
  if (event.commit.operation === 'create') { /* ... */ }
});

// Identity updates
jetstream.on('identity', (event) => {
  console.log('Handle changed to:', event.identity.handle);
});

// Account status changes
jetstream.on('account', (event) => {
  console.log('Account active:', event.account.active);
});

// System events
jetstream.on('open', () => console.log('Connected'));
jetstream.on('close', () => console.log('Disconnected'));
jetstream.on('error', (err) => console.error(err));
```

## Common Collections (NSIDs)

| Collection | Description |
|------------|-------------|
| `app.bsky.feed.post` | Posts/skeets |
| `app.bsky.feed.like` | Likes |
| `app.bsky.feed.repost` | Reposts/reskeets |
| `app.bsky.graph.follow` | Follows |
| `app.bsky.graph.block` | Blocks |
| `app.bsky.graph.list` | Lists |
| `app.bsky.actor.profile` | User profiles |

Wildcards: `app.bsky.feed.*`, `app.bsky.graph.*`, `app.bsky.*`

## Useful Patterns

### Build AT URI
```javascript
const uri = `at://${event.did}/${event.commit.collection}/${event.commit.rkey}`;
```

### Save cursor for resume
```javascript
let lastCursor = event.time_us;
// On restart: new Jetstream({ cursor: lastCursor - 5000000 }) // -5 seconds buffer
```

### Filter by language
```javascript
if (event.commit.record.langs?.includes('en')) {
  // English post
}
```

### Detect mentions
```javascript
const hasMentions = event.commit.record.facets?.some(
  facet => facet.features.some(f => f.$type === 'app.bsky.richtext.facet#mention')
);
```

### Handle all operations
```javascript
jetstream.on('commit', (event) => {
  switch (event.commit.operation) {
    case 'create': /* new record */; break;
    case 'update': /* modified record */; break;
    case 'delete': /* deleted record */; break;
  }
});
```

---

📖 **See JETSTREAM_REFERENCE.md for complete documentation**
