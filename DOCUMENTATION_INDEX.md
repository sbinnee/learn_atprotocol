# Documentation Index

Welcome! This project has comprehensive documentation to help you learn and build with the AT Protocol.

## 📖 Getting Started

**Start here if you're new:**

1. **[README.md](README.md)** - Project overview and installation
2. **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide with key concepts

## 🔍 Reference Documentation

**Look things up here:**

### Jetstream Events & Attributes

- **[JETSTREAM_REFERENCE.md](JETSTREAM_REFERENCE.md)** ⭐ **Answer to your question!**
  - Complete reference for all event and record attributes
  - Event types: commit, identity, account
  - Record schemas for posts, likes, follows, profiles, etc.
  - Where I found this info: Official Jetstream docs, Skyware library, AT Protocol specs
  - ~400 lines of detailed documentation

- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Cheat sheet format
  - Quick lookup for common attributes
  - Copy-paste code snippets
  - Common patterns and recipes

### Data Collection & Export

- **[BACKFILL_GUIDE.md](BACKFILL_GUIDE.md)** - How to fetch posts from the past
  - Replay historical data using cursor parameter
  - Build archives of past posts
  - Resume from specific timestamps
  - Complete workflow examples

- **[EXPORT_GUIDE.md](EXPORT_GUIDE.md)** - How to export SQLite to JSON/CSV
  - Multiple export methods
  - SQLite CLI commands
  - Query examples

## 💻 Code Files

### Source Code (TypeScript)

- **[src/index.ts](src/index.ts)** - Main firehose listener (with detailed comments)
- **[src/backfill.ts](src/backfill.ts)** - Historical data collection (with cursor)
- **[src/db.ts](src/db.ts)** - Database setup and queries
- **[src/query.ts](src/query.ts)** - CLI tool to view data
- **[src/export.ts](src/export.ts)** - Export data to JSON

### Generated Code (JavaScript)

- **dist/** - Compiled JavaScript (auto-generated from TypeScript)

## 🎯 Quick Navigation

### I want to...

**Understand Jetstream events**
→ Read [JETSTREAM_REFERENCE.md](JETSTREAM_REFERENCE.md) sections:
  - Event Types
  - Common Record Types
  - Filtering Events

**Find specific attributes**
→ Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md):
  - Event Object Structure
  - Accessing Event Attributes in Code

**Collect posts from the past**
→ See [BACKFILL_GUIDE.md](BACKFILL_GUIDE.md):
  - Fetch historical data with cursor
  - Build archives
  - Workflow examples

**Export my data**
→ See [EXPORT_GUIDE.md](EXPORT_GUIDE.md)

**Learn the basics**
→ Start with [QUICKSTART.md](QUICKSTART.md)

**Modify the code**
→ Check [src/index.ts](src/index.ts) comments
→ Reference [JETSTREAM_REFERENCE.md](JETSTREAM_REFERENCE.md)

## 📚 External Resources

Official documentation referenced in this project:

- [Jetstream GitHub](https://github.com/bluesky-social/jetstream)
- [Jetstream Blog Post](https://docs.bsky.app/blog/jetstream)
- [Skyware TypeScript Library](https://skyware.js.org/guides/jetstream/introduction/getting-started)
- [AT Protocol Docs](https://atproto.com/guides/applications)
- [Bluesky API Docs](https://docs.bsky.app)

## 🗂️ File Summary

| File | Purpose | Size |
|------|---------|------|
| **JETSTREAM_REFERENCE.md** | Complete event/record reference | 12K |
| **QUICK_REFERENCE.md** | Cheat sheet & code snippets | 6.5K |
| **QUICKSTART.md** | Quick start guide | 3.5K |
| **EXPORT_GUIDE.md** | Data export instructions | 2.9K |
| **README.md** | Project overview | 2.9K |
| **DOCUMENTATION_INDEX.md** | This file | - |

## 💡 Tips

1. **Use CTRL+F** to search within documentation files
2. **Start with QUICK_REFERENCE.md** for fast lookups
3. **Dive into JETSTREAM_REFERENCE.md** for detailed explanations
4. **Check src/index.ts** for real working examples with comments
5. **All docs are in Markdown** - readable in any text editor or on GitHub

---

Happy coding! 🚀
