import Database from 'better-sqlite3';

export interface Post {
  uri: string;
  authorDid: string;
  text: string;
  createdAt: string;
  indexedAt: string;
}

export function initDatabase(dbPath: string = './data.db') {
  const db = new Database(dbPath);
  
  // Create posts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      uri TEXT PRIMARY KEY,
      authorDid TEXT NOT NULL,
      text TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      indexedAt TEXT NOT NULL
    )
  `);
  
  // Create index for faster queries
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_indexedAt ON posts(indexedAt DESC)
  `);
  
  return db;
}

export function insertPost(db: Database.Database, post: Post) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO posts (uri, authorDid, text, createdAt, indexedAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(post.uri, post.authorDid, post.text, post.createdAt, post.indexedAt);
}

export function getRecentPosts(db: Database.Database, limit: number = 20): Post[] {
  const stmt = db.prepare(`
    SELECT uri, authorDid, text, createdAt, indexedAt
    FROM posts
    ORDER BY indexedAt DESC
    LIMIT ?
  `);
  
  return stmt.all(limit) as Post[];
}

export function getPostCount(db: Database.Database): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM posts');
  const result = stmt.get() as { count: number };
  return result.count;
}
