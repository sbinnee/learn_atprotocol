# AT Protocol View App - Proof of Concept

A minimal AT Protocol view app for learning purposes. This app demonstrates the core concepts of building on AT Protocol:

- 🔥 **Firehose listening** - Subscribes to the network's real-time event stream
- 💾 **Data aggregation** - Stores posts in a local SQLite database
- 🔍 **Querying** - Views the aggregated data

## What This Does

This app connects to the Bluesky/AT Protocol firehose and listens for new posts being created across the entire network. It stores these posts in a local SQLite database, demonstrating how "view apps" work in AT Protocol.

## Tech Stack

- **Node.js + TypeScript** - Runtime and language
- **@skyware/jetstream** - Simple firehose client
- **@atproto/api** - AT Protocol SDK
- **better-sqlite3** - Lightweight embedded database

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Build the TypeScript code

```bash
npm run build
```

### 3. Start the firehose listener

```bash
npm start
```

You'll see posts being indexed in real-time. Let it run for a minute or two to collect some data.

Press `Ctrl+C` to stop.

### 4. Query the collected data

In another terminal (or after stopping the indexer):

```bash
npm run query
```

This will show you the latest posts that were indexed.

## How It Works

### Architecture

```
AT Protocol Network (Firehose)
         ↓
    Firehose Listener (src/index.ts)
         ↓
    SQLite Database (data.db)
         ↓
    Query Tool (src/query.ts)
```

### Key Concepts Demonstrated

1. **Firehose Subscription**: The app subscribes to `app.bsky.feed.post` events from the network
2. **Data Filtering**: Only processes post creation events with valid text
3. **Local Aggregation**: Stores posts in SQLite for later querying
4. **View Layer**: The query script demonstrates how to build views on top of aggregated data

### Files

- `src/index.ts` - Main firehose listener
- `src/db.ts` - Database setup and queries
- `src/query.ts` - CLI tool to view collected data
- `data.db` - SQLite database (created automatically)

## What You Can Learn

This PoC demonstrates:

- ✅ Anyone can listen to the AT Protocol firehose (no permission needed!)
- ✅ How to filter events by collection type
- ✅ How to store and aggregate data from across the network
- ✅ The separation between data storage (user repos) and views (your database)

## Extending This

Ideas for learning more:

- Add more fields to track (likes, reposts, replies)
- Filter posts by language or keywords
- Track specific users
- Add a simple web interface
- Create custom analytics or metrics
- Listen to other record types (follows, likes, profiles)

## Notes

- This is for **learning purposes only**, not production use
- The database will grow as you collect more posts
- No OAuth is needed - the firehose is publicly accessible
- You're not publishing any data, just reading from the network
