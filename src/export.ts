import { initDatabase, getRecentPosts } from './db.js';
import { writeFileSync } from 'fs';

const db = initDatabase();

// Get all posts (or specify a limit)
const limit = process.argv[2] ? parseInt(process.argv[2]) : 1000;

console.log(`📤 Exporting up to ${limit} posts to JSON...\n`);

const posts = getRecentPosts(db, limit);

// Export to JSON file
const jsonData = JSON.stringify(posts, null, 2);
const filename = `posts-export-${new Date().toISOString().split('T')[0]}.json`;

writeFileSync(filename, jsonData, 'utf-8');

console.log(`✅ Exported ${posts.length} posts to: ${filename}`);
console.log(`📊 File size: ${(jsonData.length / 1024).toFixed(2)} KB\n`);

db.close();
