# Quick Start Guide

## What You Just Built

You've created a minimal AT Protocol **view app**! This demonstrates the core concept: anyone can build applications that aggregate and present data from the AT Protocol network without needing permission.

## How to Use

### Step 1: Start the indexer

```bash
npm start
```

This connects to the Bluesky firehose and starts collecting posts in real-time. You'll see stats logged every 10 seconds.

**Let it run for at least 1-2 minutes** to collect some posts.

### Step 2: View collected posts

While the indexer is running (or after stopping it with Ctrl+C), open a new terminal and run:

```bash
npm run query
```

This shows you the latest posts that were indexed.

## What's Happening?

```
Bluesky Network
    ↓ (firehose - public event stream)
Your Computer (src/index.ts)
    ↓ (filters for posts)
SQLite Database (data.db)
    ↓ (queries)
Your Screen (src/query.ts)
```

1. **Firehose**: Your app subscribes to the public event stream
2. **Filter**: Only saves post creation events
3. **Store**: Posts go into your local SQLite database
4. **Query**: You can view the aggregated data anytime

## Key Insights

### 🔓 No Permission Needed
- The firehose is publicly accessible
- You don't need OAuth to read data
- Anyone can build a view app!

### 📊 You Control the View
- You decide what data to store
- You decide how to present it
- Your database, your rules

### 🔄 Separation of Concerns
- **Data storage**: Lives on user repos in the network
- **Data aggregation**: Lives in your database (or any app's database)
- **Views**: Created from aggregated data

## Project Structure

```
atproto_view/
├── src/
│   ├── index.ts   # Firehose listener (main app)
│   ├── db.ts      # Database setup and queries
│   └── query.ts   # CLI tool to view data
├── dist/          # Compiled JavaScript (auto-generated)
├── data.db        # SQLite database (auto-created)
└── package.json   # Dependencies and scripts
```

## Minimal Tech Stack Used

- **@skyware/jetstream** - Simple firehose client (~10KB)
- **@atproto/api** - AT Protocol SDK (~200KB)
- **better-sqlite3** - Embedded database (~1MB)
- **TypeScript** - Type safety and better DX

Total package size: Very small! No web frameworks, no complex setup.

## Next Steps for Learning

### Easy Enhancements:
1. Filter posts by keyword (e.g., only posts mentioning "atproto")
2. Count posts per author
3. Track posts in different languages
4. Add timestamps and show post rate

### Medium Challenges:
1. Listen to other record types (likes, follows, profiles)
2. Resolve DIDs to handles to show usernames
3. Add a simple web UI with Express
4. Create simple analytics (top authors, post frequency)

### Advanced Ideas:
1. Build a custom feed algorithm
2. Create content moderation tools
3. Build a search engine
4. Track relationship graphs (follows, blocks)

## Understanding AT Protocol

This PoC shows you the **view layer** of AT Protocol. Here's what we didn't need:

- ❌ OAuth (we're only reading public data)
- ❌ Publishing records (we're not writing to user repos)
- ❌ Custom schemas (we're using existing Bluesky schemas)
- ❌ Running a PDS (we're just aggregating data)

You built a **read-only view app** - the simplest type of AT Protocol application!

## Resources

- [AT Protocol Docs](https://atproto.com)
- [Bluesky API Docs](https://docs.bsky.app)
- [Example Apps](https://github.com/bluesky-social/cookbook)

Happy building! 🚀
