# Jetstream Event Reference

This document provides a complete reference for all available attributes in Jetstream events.

## Official Documentation Sources

- **Jetstream GitHub**: https://github.com/bluesky-social/jetstream
- **Jetstream Blog Post**: https://docs.bsky.app/blog/jetstream
- **Skyware TypeScript Library**: https://skyware.js.org/guides/jetstream/introduction/getting-started
- **AT Protocol Docs**: https://atproto.com/guides/applications

## Event Types

Jetstream emits three main types of events:

### 1. Commit Events (`kind: "commit"`)

Represents a change to a user's repository (creating, updating, or deleting a record).

#### Event Structure

```typescript
interface CommitEvent {
  did: string;              // DID of the repo owner
  time_us: number;          // Unix timestamp in microseconds
  kind: "commit";           // Event type
  commit: Commit;           // The commit details
}
```

#### Commit Object

```typescript
interface Commit {
  rev: string;              // Revision of the repo after this commit
  operation: "create" | "update" | "delete";  // Type of operation
  collection: string;       // NSID of the collection (e.g., "app.bsky.feed.post")
  rkey: string;             // Record key (unique within the collection)
  record?: Record;          // The record data (only for create/update)
  cid?: string;             // CID of the record (only for create/update)
}
```

#### Operations

**`create`** - A new record was created
```typescript
{
  did: "did:plc:abc123...",
  time_us: 1725911162329308,
  kind: "commit",
  commit: {
    rev: "3l3qo2vutsw2b",
    operation: "create",
    collection: "app.bsky.feed.post",
    rkey: "3l3qo2vuowo2b",
    record: {
      $type: "app.bsky.feed.post",
      text: "Hello world!",
      createdAt: "2024-09-09T19:46:02.102Z",
      // ... other record fields
    },
    cid: "bafyrei..."
  }
}
```

**`update`** - An existing record was modified
```typescript
{
  did: "did:plc:abc123...",
  time_us: 1725911162329308,
  kind: "commit",
  commit: {
    rev: "3l3qo2vutsw2c",
    operation: "update",
    collection: "app.bsky.actor.profile",
    rkey: "self",
    record: {
      $type: "app.bsky.actor.profile",
      displayName: "New Name",
      // ... other updated fields
    },
    cid: "bafyrei..."
  }
}
```

**`delete`** - A record was deleted
```typescript
{
  did: "did:plc:abc123...",
  time_us: 1725516666833633,
  kind: "commit",
  commit: {
    rev: "3l3f6nzl3cv2s",
    operation: "delete",
    collection: "app.bsky.graph.follow",
    rkey: "3l3dn7tku762u"
    // Note: no 'record' or 'cid' for deletes
  }
}
```

### 2. Identity Events (`kind: "identity"`)

Represents a change to a user's identity (handle, DID document, signing keys, etc.).

#### Event Structure

```typescript
interface IdentityEvent {
  did: string;              // DID of the account
  time_us: number;          // Unix timestamp in microseconds
  kind: "identity";         // Event type
  identity: Identity;       // Identity details
}
```

#### Identity Object

```typescript
interface Identity {
  did: string;              // DID of the account
  handle: string;           // Current handle (domain name)
  seq: number;              // Sequence number from the event stream
  time: string;             // ISO 8601 timestamp
}
```

#### Example

```typescript
{
  did: "did:plc:ufbl4k27gp6kzas5glhz7fim",
  time_us: 1725516665234703,
  kind: "identity",
  identity: {
    did: "did:plc:ufbl4k27gp6kzas5glhz7fim",
    handle: "alice.bsky.social",
    seq: 1409752997,
    time: "2024-09-05T06:11:04.870Z"
  }
}
```

**When identity events occur:**
- Handle changes (e.g., alice.bsky.social → alice.com)
- DID document updates
- Signing key rotations
- PDS endpoint changes

### 3. Account Events (`kind: "account"`)

Represents a change to an account's status (activation, deactivation, suspension, etc.).

#### Event Structure

```typescript
interface AccountEvent {
  did: string;              // DID of the account
  time_us: number;          // Unix timestamp in microseconds
  kind: "account";          // Event type
  account: Account;         // Account details
}
```

#### Account Object

```typescript
interface Account {
  did: string;              // DID of the account
  seq: number;              // Sequence number from the event stream
  time: string;             // ISO 8601 timestamp
  active: boolean;          // Whether the account is active
  status?: string;          // Account status (see below)
}
```

#### Account Statuses

- `active` - Account is active and functioning normally
- `deactivated` - Account was deactivated by the user
- `suspended` - Account was suspended (temporary)
- `takendown` - Account was taken down by the PDS
- `deleted` - Account was deleted
- `throttled` - Account is throttled (rate-limited)
- `desynchronized` - Account is out of sync

#### Example

```typescript
{
  did: "did:plc:ufbl4k27gp6kzas5glhz7fim",
  time_us: 1725516665333808,
  kind: "account",
  account: {
    active: true,
    did: "did:plc:ufbl4k27gp6kzas5glhz7fim",
    seq: 1409753013,
    time: "2024-09-05T06:11:04.870Z"
  }
}
```

## Common Record Types

### app.bsky.feed.post

```typescript
{
  $type: "app.bsky.feed.post",
  text: string;                    // Post text (max 3000 graphemes)
  createdAt: string;               // ISO 8601 timestamp
  langs?: string[];                // Language codes (e.g., ["en", "es"])
  reply?: {                        // If this is a reply
    parent: { uri: string; cid: string };
    root: { uri: string; cid: string };
  };
  embed?: {                        // Embedded content (images, links, etc.)
    // Structure varies by embed type
  };
  facets?: Array<{                 // Rich text features (mentions, links, tags)
    index: { byteStart: number; byteEnd: number };
    features: Array<{
      $type: string;
      // Feature-specific fields
    }>;
  }>;
  labels?: {                       // Self-labels
    values: Array<{ val: string }>;
  };
  tags?: string[];                 // Post tags
}
```

### app.bsky.feed.like

```typescript
{
  $type: "app.bsky.feed.like",
  subject: {
    uri: string;                   // at:// URI of the liked post
    cid: string;                   // CID of the liked post
  };
  createdAt: string;               // ISO 8601 timestamp
}
```

### app.bsky.feed.repost

```typescript
{
  $type: "app.bsky.feed.repost",
  subject: {
    uri: string;                   // at:// URI of the reposted post
    cid: string;                   // CID of the reposted post
  };
  createdAt: string;               // ISO 8601 timestamp
}
```

### app.bsky.graph.follow

```typescript
{
  $type: "app.bsky.graph.follow",
  subject: string;                 // DID of the followed user
  createdAt: string;               // ISO 8601 timestamp
}
```

### app.bsky.graph.block

```typescript
{
  $type: "app.bsky.graph.block",
  subject: string;                 // DID of the blocked user
  createdAt: string;               // ISO 8601 timestamp
}
```

### app.bsky.actor.profile

```typescript
{
  $type: "app.bsky.actor.profile",
  displayName?: string;            // Display name (max 64 graphemes)
  description?: string;            // Bio (max 256 graphemes)
  avatar?: Blob;                   // Profile picture blob reference
  banner?: Blob;                   // Banner image blob reference
  createdAt?: string;              // ISO 8601 timestamp
}
```

## Filtering Events

### Query Parameters

When connecting to Jetstream, you can filter events using query parameters:

```typescript
// Connect to Jetstream with filters
const ws = new WebSocket(
  'wss://jetstream2.us-east.bsky.network/subscribe?' +
  'wantedCollections=app.bsky.feed.post' +
  '&wantedCollections=app.bsky.feed.like' +
  '&wantedDids=did:plc:abc123...' +
  '&cursor=1725519626134432' +
  '&compress=true'
);
```

**Available parameters:**

- `wantedCollections` - Array of NSIDs or wildcards (e.g., `app.bsky.feed.*`)
  - Max 100 collections
  - Can be repeated for multiple values
  
- `wantedDids` - Array of DIDs to filter by
  - Max 10,000 DIDs
  - Can be repeated for multiple values
  
- `cursor` - Unix microseconds timestamp to start from
  - Absent or future cursor = live-tail
  - Past cursor = replay from that point
  
- `compress` - Set to `true` for zstd compression
  
- `maxMessageSizeBytes` - Maximum message size (0 = no limit)

- `requireHello` - Set to `true` to pause until client sends options

### Collection Wildcards

You can use wildcards to subscribe to multiple collections:

```typescript
// All feed-related collections
wantedCollections=app.bsky.feed.*

// All graph-related collections  
wantedCollections=app.bsky.graph.*

// All Bluesky collections
wantedCollections=app.bsky.*
```

## Using in TypeScript/JavaScript

### With @skyware/jetstream

```typescript
import { Jetstream } from '@skyware/jetstream';

const jetstream = new Jetstream({
  wantedCollections: ['app.bsky.feed.post'],
});

// Listen for new posts
jetstream.onCreate('app.bsky.feed.post', (event) => {
  console.log('New post:', event.commit.record.text);
  console.log('Author DID:', event.did);
  console.log('Timestamp:', event.time_us);
});

// Listen for all commits
jetstream.on('commit', (event) => {
  console.log('Commit:', event.commit.operation, event.commit.collection);
});

// Listen for identity updates
jetstream.on('identity', (event) => {
  console.log('Handle changed:', event.identity.handle);
});

// Listen for account updates
jetstream.on('account', (event) => {
  console.log('Account status:', event.account.active);
});

jetstream.start();
```

### Raw WebSocket

```typescript
const ws = new WebSocket('wss://jetstream2.us-east.bsky.network/subscribe');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.kind === 'commit') {
    // Handle commit event
    console.log('Operation:', data.commit.operation);
    console.log('Collection:', data.commit.collection);
    if (data.commit.record) {
      console.log('Record:', data.commit.record);
    }
  } else if (data.kind === 'identity') {
    // Handle identity event
    console.log('New handle:', data.identity.handle);
  } else if (data.kind === 'account') {
    // Handle account event
    console.log('Account active:', data.account.active);
  }
};
```

## Important Notes

1. **Time Cursors**: Use `time_us` from the most recent event as your cursor for resuming
   
2. **No Authentication Data**: Unlike the full firehose, Jetstream events don't include cryptographic signatures or Merkle proofs
   
3. **Idempotent Processing**: When switching between instances, rewind your cursor by a few seconds for gapless playback
   
4. **Rate Limiting**: The firehose has no rate limits, but be prepared to handle hundreds of events per second
   
5. **Collection Types**: All collection names follow the NSID format: `{domain}.{name}.{record-type}`

## Complete Collection List

Common Bluesky collections:

- `app.bsky.feed.post` - Posts/skeets
- `app.bsky.feed.like` - Likes
- `app.bsky.feed.repost` - Reposts
- `app.bsky.feed.threadgate` - Thread reply controls
- `app.bsky.feed.postgate` - Post visibility controls
- `app.bsky.graph.follow` - Follows
- `app.bsky.graph.block` - Blocks
- `app.bsky.graph.list` - Lists
- `app.bsky.graph.listitem` - List members
- `app.bsky.graph.listblock` - List blocks
- `app.bsky.graph.starterpack` - Starter packs
- `app.bsky.actor.profile` - User profiles
- `app.bsky.labeler.service` - Labeler services
- `chat.bsky.actor.declaration` - Chat declarations

For custom applications, you can create your own collections using your own domain!
