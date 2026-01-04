# AT Protocol Record Types Guide

This guide explains the different record types you can fetch from Bluesky and how to track them.

## Current Configuration

Your `src/index.ts` is currently configured to listen to:

```typescript
wantedCollections: ['app.bsky.feed.post']
```

This means you're only collecting **posts** (skeets). There are many other record types available!

## All Available Record Types

### 📝 Feed Records

**Posts, likes, reposts, and feed management**

#### `app.bsky.feed.post` ⭐ (Currently tracked)
- **What:** User posts/skeets
- **Size:** ~300-500 bytes per post
- **Fields:** text, createdAt, langs, reply, embed, facets, tags
- **Volume:** ~1,800 posts/minute
- **Example:**
```json
{
  "text": "Hello Bluesky!",
  "createdAt": "2024-01-04T12:00:00.000Z",
  "langs": ["en"],
  "reply": null,
  "facets": []
}
```

#### `app.bsky.feed.like`
- **What:** When someone likes a post
- **Size:** ~100-200 bytes per like
- **Fields:** subject (uri + cid), createdAt
- **Volume:** Hundreds per minute (popular posts get more)
- **Example:**
```json
{
  "subject": {
    "uri": "at://did:plc:.../app.bsky.feed.post/...",
    "cid": "bafyrei..."
  },
  "createdAt": "2024-01-04T12:05:00.000Z"
}
```

#### `app.bsky.feed.repost`
- **What:** When someone reposts/reskeets a post
- **Size:** ~100-200 bytes per repost
- **Fields:** subject (uri + cid), createdAt
- **Volume:** Lower than likes (people like more than repost)
- **Example:**
```json
{
  "subject": {
    "uri": "at://did:plc:.../app.bsky.feed.post/...",
    "cid": "bafyrei..."
  },
  "createdAt": "2024-01-04T12:07:00.000Z"
}
```

#### `app.bsky.feed.threadgate`
- **What:** Thread reply controls (who can reply)
- **Size:** ~200-300 bytes
- **Fields:** allowURI, rules (list, mentions, etc.)
- **Volume:** Very low (advanced feature)

#### `app.bsky.feed.postgate`
- **What:** Post visibility controls
- **Size:** ~200-300 bytes
- **Fields:** detachedEmbeddingUris, embeddingRules
- **Volume:** Very low

### 🔗 Graph Records

**Follows, blocks, lists, and social graph**

#### `app.bsky.graph.follow`
- **What:** When someone follows another user
- **Size:** ~100 bytes per follow
- **Fields:** subject (did), createdAt
- **Volume:** Hundreds per minute
- **Example:**
```json
{
  "subject": "did:plc:abc123...",
  "createdAt": "2024-01-04T12:10:00.000Z"
}
```

#### `app.bsky.graph.block`
- **What:** When someone blocks another user
- **Size:** ~100 bytes per block
- **Fields:** subject (did), createdAt
- **Volume:** Tens per minute (less common than follows)
- **Example:**
```json
{
  "subject": "did:plc:xyz789...",
  "createdAt": "2024-01-04T12:12:00.000Z"
}
```

#### `app.bsky.graph.list`
- **What:** User-created lists (curated collections of users)
- **Size:** ~200-500 bytes per list
- **Fields:** name, description, purpose, avatar
- **Volume:** Low (not created frequently)
- **Example:**
```json
{
  "name": "AI Researchers",
  "description": "People working on AI",
  "purpose": "curatelist",
  "avatar": null
}
```

#### `app.bsky.graph.listitem`
- **What:** When someone adds/removes a user from a list
- **Size:** ~100 bytes per item
- **Fields:** subject (did), list (uri)
- **Volume:** Low (depends on list activity)

#### `app.bsky.graph.listblock`
- **What:** When someone blocks a list
- **Size:** ~100 bytes
- **Fields:** subject (uri of list)
- **Volume:** Very low

#### `app.bsky.graph.starterpack`
- **What:** Starter packs for onboarding new users
- **Size:** ~300-500 bytes
- **Fields:** name, description, list, feeds
- **Volume:** Low (newer feature)

### 👤 Actor Records

**User profiles and account settings**

#### `app.bsky.actor.profile`
- **What:** User profile information
- **Size:** ~200-1000 bytes (includes avatar/banner)
- **Fields:** displayName, description, avatar, banner, createdAt
- **Volume:** Tens per minute (updates from existing users)
- **Example:**
```json
{
  "displayName": "Alice",
  "description": "Software engineer interested in AT Protocol",
  "avatar": { /* blob reference */ },
  "banner": { /* blob reference */ },
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

#### `app.bsky.actor.declaration`
- **What:** Account declarations (e.g., account service type)
- **Size:** ~100-200 bytes
- **Fields:** Special fields based on declaration type
- **Volume:** Very low (infrastructure-related)

### 💬 Chat Records (Newer)

#### `chat.bsky.actor.declaration`
- **What:** Chat service declarations
- **Size:** ~100 bytes
- **Fields:** Service endpoint info
- **Volume:** Very low (chat is newer)

#### `chat.bsky.convo.defs` (partial)
- **What:** Chat conversations and messages
- **Size:** ~100-500 bytes per message
- **Fields:** Varies by message type
- **Volume:** Depends on adoption

### 🏷️ Labeler Records

#### `app.bsky.labeler.service`
- **What:** Moderation/labeling services
- **Size:** ~200-500 bytes
- **Fields:** policies, createdAt
- **Volume:** Very low (created by service operators)

## Record Type Categories

### By Volume

**High Volume (tracking recommended):**
- `app.bsky.feed.post` (~1,800/min) ✓ Currently tracked
- `app.bsky.feed.like` (~500-1000/min)
- `app.bsky.graph.follow` (~500/min)

**Medium Volume:**
- `app.bsky.feed.repost` (~100-300/min)
- `app.bsky.graph.block` (~50-100/min)
- `app.bsky.actor.profile` (~50-100/min)

**Low Volume:**
- `app.bsky.graph.list*` (lists and items)
- `app.bsky.feed.threadgate`
- `app.bsky.feed.postgate`
- `app.bsky.labeler.service`

### By Use Case

**Social Interactions:**
- `app.bsky.feed.post` - Posts
- `app.bsky.feed.like` - Likes
- `app.bsky.feed.repost` - Reposts

**Social Graph:**
- `app.bsky.graph.follow` - Follows
- `app.bsky.graph.block` - Blocks
- `app.bsky.graph.list` - Lists

**User Data:**
- `app.bsky.actor.profile` - Profiles

**Moderation & Management:**
- `app.bsky.feed.threadgate` - Reply controls
- `app.bsky.feed.postgate` - Post visibility
- `app.bsky.labeler.service` - Label services

## How to Track Different Record Types

### 1. Track a Single Type

Modify `src/index.ts`:

```typescript
const jetstream = new Jetstream({
  wantedCollections: ['app.bsky.feed.like'],  // Only likes
});

jetstream.onCreate('app.bsky.feed.like', (event) => {
  console.log('Someone liked a post:', event.commit.record);
});
```

### 2. Track Multiple Types

```typescript
const jetstream = new Jetstream({
  wantedCollections: [
    'app.bsky.feed.post',
    'app.bsky.feed.like',
    'app.bsky.feed.repost',
    'app.bsky.graph.follow',
  ],
});

jetstream.onCreate('app.bsky.feed.post', (event) => {
  console.log('New post');
});

jetstream.onCreate('app.bsky.feed.like', (event) => {
  console.log('New like');
});

jetstream.onCreate('app.bsky.feed.repost', (event) => {
  console.log('New repost');
});

jetstream.onCreate('app.bsky.graph.follow', (event) => {
  console.log('New follow');
});
```

### 3. Track Everything with Wildcards

```typescript
const jetstream = new Jetstream({
  wantedCollections: ['app.bsky.*'],  // All Bluesky records
});

jetstream.on('commit', (event) => {
  console.log(`${event.commit.collection}: ${event.commit.operation}`);
});
```

### 4. Listen to All Records

```typescript
const jetstream = new Jetstream({
  // No wantedCollections = all collections
});

jetstream.on('commit', (event) => {
  console.log(`${event.commit.collection}: ${event.commit.operation}`);
});
```

## Example: Track Likes and Follows

Create `src/social-tracker.ts`:

```typescript
import { Jetstream } from '@skyware/jetstream';

const jetstream = new Jetstream({
  wantedCollections: [
    'app.bsky.feed.like',
    'app.bsky.graph.follow',
  ],
});

jetstream.onCreate('app.bsky.feed.like', (event) => {
  const record = event.commit.record as any;
  console.log('❤️ Like from', event.did);
  console.log('   Post URI:', record.subject.uri);
  console.log('   Time:', new Date(event.time_us / 1000).toISOString());
});

jetstream.onCreate('app.bsky.graph.follow', (event) => {
  const record = event.commit.record as any;
  console.log('👥 Follow from', event.did);
  console.log('   Following:', record.subject);
  console.log('   Time:', new Date(event.time_us / 1000).toISOString());
});

jetstream.start();
```

## Understanding Operations

Each record type supports three operations:

### `create` - New record created
```typescript
{
  operation: "create",
  record: { /* full record */ },
  cid: "bafyrei..."
}
```

### `update` - Record modified
```typescript
{
  operation: "update",
  record: { /* updated record */ },
  cid: "bafyrei..."
}
```

### `delete` - Record deleted
```typescript
{
  operation: "delete"
  // No record or cid for deletes
}
```

**Note:** Not all record types support all operations:
- Posts: create, delete (no update)
- Likes: create, delete (no update)
- Follows: create, delete (no update)
- Profiles: create, update (rarely delete)

## Tracking Tips

### 1. What Happens Most?
```
1. Posts (~1,800/min)
2. Likes (~800/min)
3. Follows (~500/min)
4. Reposts (~200/min)
5. Profile updates (~100/min)
```

### 2. What's Interesting to Track?

**For Analytics:**
- Posts + Likes = Engagement metrics
- Posts + Follows = Network growth
- Posts + Reposts = Content virality

**For Social Analysis:**
- Follows + Blocks = Community relationships
- Posts + Replies = Conversation flows
- Likes + Follows = User interests

**For Research:**
- All types = Network behavior
- Posts with facets = Rich text usage
- Threads = Conversation structure

### 3. Storage Considerations

Track posts + likes + follows:
- Posts: ~1,800/min = 2.6M/day
- Likes: ~800/min = 1.15M/day  
- Follows: ~500/min = 720K/day
- **Total:** ~4.5M records/day = ~450MB/day

Your SQLite database can easily handle this!

## Next Steps

1. **Explore:** Modify code to track different types
2. **Experiment:** See what records you get
3. **Analyze:** Query your collected data
4. **Build:** Create features based on record types

## References

- [JETSTREAM_REFERENCE.md](JETSTREAM_REFERENCE.md) - Complete event structure
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick lookup
- [AT Protocol Lexicon](https://github.com/bluesky-social/atproto/tree/main/lexicons)
