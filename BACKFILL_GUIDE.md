# Backfill Guide - Fetching Posts from the Past

The backfill feature lets you "rewind" the firehose and collect posts from specific points in time. This is useful for:

- 📊 Historical analysis
- 🎯 Testing with past data
- 💾 Building a complete archive
- 🔍 Researching network behavior over time

## How It Works

Jetstream supports a `cursor` parameter that specifies a Unix timestamp (in microseconds). When you provide a cursor:

- **Cursor in the past**: Jetstream replays events from that point forward
- **Cursor in the future**: Jetstream starts in "live mode" (only new posts)
- **No cursor**: Jetstream starts live (newest posts)

## Quick Start

### Fetch posts from 1 hour ago (default)

```bash
npm run backfill
```

This will replay all posts from the last hour and add them to your database.

### Fetch posts from different time periods

```bash
# From 6 hours ago
npm run backfill -- --hours 6

# From 1 day ago
npm run backfill -- --days 1

# From 30 minutes ago
npm run backfill -- --minutes 30

# From 3 days ago
npm run backfill -- --days 3
```

### Fetch from a specific Unix timestamp

If you have a specific point in time:

```bash
# Using Unix microseconds (what Jetstream uses internally)
npm run backfill -- --cursor 1704364800000000

# Convert a timestamp:
# JavaScript: new Date('2024-01-04T12:00:00Z').getTime() * 1000
# Python: int(datetime.fromisoformat('2024-01-04T12:00:00Z').timestamp() * 1e6)
```

## Practical Examples

### Collect a whole day of posts

```bash
npm run backfill -- --days 1
```

Let it run to completion. This will collect all posts from the last 24 hours.

### Incrementally build an archive

```bash
# Day 1: Get yesterday's posts
npm run backfill -- --days 1

# Next day: Get today's posts and the day before
npm run backfill -- --days 2

# Each run appends to your database without duplicates
```

### Resume from where you left off

When you stop a backfill (Ctrl+C), you'll see a message like:

```
💡 To continue from here next time, run:
   npm run backfill -- --cursor 1704364800000000
```

Copy that command to resume exactly where you left off:

```bash
npm run backfill -- --cursor 1704364800000000
```

## Understanding Cursors

### What is a cursor?

A **cursor** is a Unix timestamp in microseconds that tells Jetstream where to start replaying.

```
Unix microseconds = milliseconds * 1000 = seconds * 1,000,000
```

### Converting timestamps

**From JavaScript:**
```javascript
const timestamp = new Date('2024-01-04T12:00:00Z').getTime() * 1000;
console.log('Cursor:', timestamp); // 1704372000000000
```

**From Python:**
```python
from datetime import datetime
dt = datetime.fromisoformat('2024-01-04T12:00:00Z')
cursor = int(dt.timestamp() * 1e6)
print(f'Cursor: {cursor}')  # 1704372000000000
```

**From command line:**
```bash
# Get current time in microseconds
date +%s%N | awk '{print $1 * 1000}'

# Get specific time (Unix date command)
date -d "2024-01-04 12:00:00" +%s000000
```

## Monitoring Backfill Progress

The backfill script logs every 10 seconds:

```
📊 Stats: 5,432 total posts indexed (1,234 in last 10s)
   Current event time: 2024-01-04T11:45:32.123Z
```

This shows:
- **Total posts indexed** in your database
- **Posts collected in last 10s** (collection rate)
- **Current event time** (how far back/forward we are)

## Important Notes

### 1. Database Deduplication

If you run backfill multiple times with overlapping time periods, posts won't be duplicated because:
- Primary key is `uri` (unique per post)
- Database uses `INSERT OR REPLACE`

```sql
-- This is used internally:
INSERT OR REPLACE INTO posts (uri, authorDid, text, ...)
VALUES (?, ?, ?, ...);
```

### 2. Time Gaps

If you backfill with gaps, you'll have incomplete data:

```
Day 1: ├─────────────────┤
           (24 hours)

Day 2: ├─────────────────┤  (different 24 hours)
           (24 hours)

Result: Gap between Day 1 and Day 2
```

To avoid gaps, either:
- Backfill continuously without stopping
- Use overlapping time periods (lose duplicate posts but maintain continuity)

### 3. Jetstream Limitations

Jetstream may not have events older than a certain point (typically a few days). If you request very old data, it might not be available.

Try requesting recent data (last 24-72 hours) first to confirm it works:

```bash
npm run backfill -- --hours 24
```

## Combining Backfill and Live

You can switch between backfill and live modes:

```bash
# Step 1: Collect historical data from 7 days ago
npm run backfill -- --days 7

# Step 2: Collect live posts from now on
npm run start

# Your database will contain posts from both periods!
```

## Analyzing Your Backfilled Data

Once you've collected posts, you can query them:

```bash
# View all posts collected
npm run query

# Export to JSON for analysis
npm run export

# Custom SQL queries
sqlite3 data.db "SELECT COUNT(*) FROM posts WHERE date(createdAt) = '2024-01-04'"
sqlite3 data.db -json "SELECT * FROM posts WHERE text LIKE '%atproto%'"
```

## Example Workflow

### Complete 7-day archive

```bash
# Day 1: Collect last 7 days
npm run backfill -- --days 7
# Wait for completion...

# Day 2: Collect last 1 day (catches anything missed)
npm run backfill -- --days 1

# Day 3 onwards: Collect live posts
npm run start &

# Anytime: Query your archive
npm run query
npm run export 1000  # Export 1000 most recent
```

### Real-time monitoring with history

```bash
# Terminal 1: Backfill from 24 hours ago
npm run backfill -- --days 1

# Terminal 2 (after backfill starts): Collect live posts
npm run start

# Terminal 3 (anytime): Monitor database growth
watch -n 5 'sqlite3 data.db "SELECT COUNT(*) as posts FROM posts"'
```

## Troubleshooting

### "No posts collected"

The Jetstream instance might not have data that far back. Try:
- Start with `--hours 1` or `--hours 6`
- Gradually increase time period
- Check if your cursor is in the right format

### "Connection keeps closing"

This is normal! Jetstream will retry. The script handles this automatically.

### "Same posts being collected multiple times"

The database prevents duplicates (primary key is `uri`). This is intentional - allows safe re-runs.

## Technical Details

### Cursor Calculation

The backfill script calculates the cursor from the current time:

```typescript
// 1 hour ago (default)
const cursorMs = Date.now() - 3600000;
const cursorUs = Math.floor(cursorMs * 1000);  // Convert to microseconds

// 6 hours ago
const cursorMs = Date.now() - 6 * 3600000;
const cursorUs = Math.floor(cursorMs * 1000);
```

### Event Replay

When you provide a cursor:

1. Jetstream connects to the firehose
2. It searches for the first event after your cursor time
3. It starts replaying events from that point
4. Your app receives all events as if they just happened
5. You process and store them normally

This is exactly how the live listener works - the only difference is the starting point!

### Database Growth

Expect roughly:

- 1 hour of data: ~2,000 posts (~200KB)
- 1 day of data: ~50,000 posts (~5MB)
- 7 days of data: ~350,000 posts (~35MB)
- 30 days of data: ~1.5M posts (~150MB)

SQLite can easily handle gigabytes of data!

## Next Steps

1. **Try backfilling**: `npm run backfill -- --hours 1`
2. **Query your data**: `npm run query`
3. **Export for analysis**: `npm run export 5000`
4. **Experiment**: Try different time periods, then analyze patterns
