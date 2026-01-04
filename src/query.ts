import { initDatabase, getRecentPosts, getPostCount } from './db.js';

const db = initDatabase();

console.log('📊 AT Protocol View - Database Query\n');
console.log('='.repeat(80));

// Get total count
const totalPosts = getPostCount(db);
console.log(`\n📈 Total posts indexed: ${totalPosts}\n`);

if (totalPosts === 0) {
  console.log('No posts yet! Run the indexer first with: npm run dev\n');
  db.close();
  process.exit(0);
}

// Get recent posts
const recentPosts = getRecentPosts(db, 10);

console.log('🔥 Latest 10 posts:\n');
console.log('='.repeat(80));

recentPosts.forEach((post, index) => {
  // Truncate long posts
  const text = post.text.length > 100 
    ? post.text.substring(0, 100) + '...' 
    : post.text;
  
  console.log(`\n${index + 1}. ${new Date(post.indexedAt).toLocaleString()}`);
  console.log(`   Author: ${post.authorDid.substring(0, 40)}...`);
  console.log(`   Text: "${text}"`);
  console.log(`   URI: ${post.uri}`);
});

console.log('\n' + '='.repeat(80));
console.log('\n💡 Tip: Run this script anytime with: npm run query\n');

db.close();
