# Data Export Guide

Your SQLite database (`data.db`) can be exported to JSON in multiple ways:

## Method 1: Use the Export Script (Easiest)

```bash
# Export all posts (default: 1000 most recent)
npm run export

# Export specific number of posts
npm run export 100      # Export 100 most recent posts
npm run export 5000     # Export 5000 most recent posts
```

This creates a file like `posts-export-2026-01-04.json` in the current directory.

## Method 2: SQLite CLI with JSON Output

If you have `sqlite3` installed:

```bash
# Export all posts to JSON file
sqlite3 data.db -json "SELECT * FROM posts" > posts.json

# Export with pretty formatting
sqlite3 data.db -json "SELECT * FROM posts" | jq . > posts-pretty.json

# Export specific number of posts
sqlite3 data.db -json "SELECT * FROM posts ORDER BY indexedAt DESC LIMIT 100" > latest-100.json

# Export posts from a specific author
sqlite3 data.db -json "SELECT * FROM posts WHERE authorDid = 'did:plc:xyz...'" > author-posts.json

# Export posts containing specific text
sqlite3 data.db -json "SELECT * FROM posts WHERE text LIKE '%keyword%'" > keyword-posts.json
```

## Method 3: SQLite CLI with CSV

```bash
# Export as CSV
sqlite3 data.db -csv "SELECT * FROM posts" > posts.csv

# With headers
sqlite3 data.db -header -csv "SELECT * FROM posts" > posts.csv
```

## Method 4: Interactive SQLite Shell

```bash
# Open SQLite shell
sqlite3 data.db

# Then run commands:
.mode json
.output posts.json
SELECT * FROM posts;
.exit
```

## Common Export Queries

### Export posts by date
```bash
sqlite3 data.db -json "SELECT * FROM posts WHERE date(createdAt) = '2026-01-04'" > today-posts.json
```

### Export with statistics
```bash
sqlite3 data.db -json "SELECT authorDid, COUNT(*) as post_count FROM posts GROUP BY authorDid ORDER BY post_count DESC LIMIT 10" > top-authors.json
```

### Export post count per hour
```bash
sqlite3 data.db -json "SELECT strftime('%Y-%m-%d %H:00', indexedAt) as hour, COUNT(*) as count FROM posts GROUP BY hour" > posts-per-hour.json
```

## Exported JSON Format

The exported JSON is an array of post objects:

```json
[
  {
    "uri": "at://did:plc:xyz.../app.bsky.feed.post/abc123",
    "authorDid": "did:plc:xyz...",
    "text": "Hello world!",
    "createdAt": "2026-01-04T07:25:28.197Z",
    "indexedAt": "2026-01-04T07:25:28.970Z"
  },
  ...
]
```

## Tips

- The export script automatically includes the date in the filename
- Use `jq` for advanced JSON processing: `cat posts.json | jq '.[] | select(.text | contains("atproto"))'`
- You can import the JSON into other databases or analysis tools
- For large exports, consider using streaming or pagination

## Database Schema

Your `posts` table has these columns:
- `uri` (TEXT, PRIMARY KEY) - Unique identifier for the post
- `authorDid` (TEXT) - DID of the author
- `text` (TEXT) - Post content
- `createdAt` (TEXT) - When the post was created
- `indexedAt` (TEXT) - When we indexed it
