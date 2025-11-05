# AT Protocol Social App - User Guide

A simple web-based social media application built with AT Protocol to demonstrate core concepts and functionality.

## What This App Does

This app demonstrates the following AT Protocol concepts in action:

1. **Authentication using DIDs** - Login with your Bluesky account using decentralized identifiers
2. **Creating Posts** - Publish content to your repository
3. **Feed/Timeline** - View posts from users you follow (aggregated through BGS)
4. **Social Interactions** - Like and repost functionality
5. **Profile Management** - View your profile information

## Features

### 1. Authentication
- Login with your Bluesky handle (e.g., `alice.bsky.social`) or email
- Uses app passwords for secure authentication
- Session persistence using localStorage

### 2. Create Posts
- Compose posts up to 300 characters
- Real-time character counter
- Posts are stored in your personal repository on your PDS

### 3. Timeline/Feed
- View posts from users you follow
- Refresh to see new posts
- Shows post metadata (author, timestamp, engagement metrics)

### 4. Interactions
- **Like** posts (❤️) - Creates a like record in your repository
- **Repost** posts (🔁) - Shares posts to your followers
- Real-time interaction counts

### 5. Profile View
- Display name and handle
- Bio/description
- Statistics: Posts, Followers, Following counts

## Getting Started

### Prerequisites

1. **Bluesky Account**: You need a Bluesky account to use this app
   - Sign up at [bsky.app](https://bsky.app) if you don't have one

2. **App Password**: For security, create an app password
   - Go to Settings → App Passwords in Bluesky
   - Create a new app password
   - **Important**: Use this app password, NOT your main account password

### Installation

1. **Clone or navigate to the repository**:
   ```bash
   cd learn_atprotocol
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   - Navigate to `http://localhost:3000`
   - You should see the login page

### Using the App

1. **Login**:
   - Enter your Bluesky handle (e.g., `yourname.bsky.social`)
   - Enter your app password (from Bluesky settings)
   - Click "Login"

2. **Navigate Tabs**:
   - **Feed**: View posts from people you follow
   - **Create Post**: Write and publish new posts
   - **Profile**: View your profile information

3. **Interact with Posts**:
   - Click the heart icon (🤍) to like a post
   - Click again to unlike (❤️)
   - Click the repost icon (🔁) to repost
   - Click again to undo repost

4. **Create Posts**:
   - Go to "Create Post" tab
   - Type your message (max 300 characters)
   - Click "Post" button
   - Your post will be published to your repository

5. **Logout**:
   - Click the "Logout" button in the top-right corner

## How It Works (AT Protocol Concepts)

### Authentication Flow
1. App creates a `BskyAgent` instance connected to `bsky.social` (a PDS)
2. User logs in with their handle and app password
3. Agent receives a session token containing the user's DID
4. Session is saved to localStorage for persistence

### Creating a Post
1. User writes text in the composer
2. App calls `agent.post()` with the text and timestamp
3. Post is stored as a record in the user's repository on their PDS
4. The record is cryptographically signed with the user's DID

### Viewing the Feed
1. App calls `agent.getTimeline()` to fetch posts
2. The BGS aggregates posts from multiple PDS servers
3. Feed is filtered based on who the user follows
4. Posts include author information, content, and engagement metrics

### Likes and Reposts
1. Likes and reposts are stored as records in your repository
2. They reference the original post's URI and CID
3. These interactions are part of the "reach layer" of AT Protocol

### Profile Information
1. Profile data is stored in the user's repository
2. Statistics are calculated across all repositories
3. Profile can be viewed by anyone with your handle or DID

## Project Structure

```
learn_atprotocol/
├── index.html          # Main HTML structure
├── style.css           # Styling and UI design
├── app.js              # Application logic and AT Protocol integration
├── server.js           # Simple Node.js HTTP server
├── package.json        # Dependencies and scripts
├── APP_GUIDE.md        # This file
├── AT_PROTOCOL_CONCEPTS.md  # AT Protocol concepts reference
└── TERMINOLOGY.md      # AT Protocol terminology guide
```

## Key AT Protocol Concepts Demonstrated

### 1. Personal Data Server (PDS)
- This app connects to `bsky.social`, which is a PDS
- Your posts are stored in your repository on this server
- You could migrate your account to a different PDS while keeping your identity

### 2. Decentralized Identifiers (DIDs)
- Your identity is tied to your DID, not the server
- DIDs enable account portability across servers

### 3. Repositories
- Each user has one repository containing their data
- Posts, likes, and reposts are all records in your repo
- Organized in a Merkle search tree for verification

### 4. Lexicon
- The app uses standardized schemas (Lexicon) for posts, likes, etc.
- `app.bsky.feed.post` - Post schema
- `app.bsky.feed.like` - Like schema
- `app.bsky.feed.repost` - Repost schema

### 5. Big Graph Service (BGS)
- When you load your timeline, the BGS aggregates data from multiple PDS
- Enables discovery and cross-server social features

### 6. Speech vs Reach
- **Speech Layer**: Creating posts (permissive, distributed)
- **Reach Layer**: Timeline algorithm, recommendations (flexible, customizable)

## Troubleshooting

### Can't Login
- Make sure you're using an **app password**, not your main password
- Check that your handle is correct (e.g., `alice.bsky.social`)
- Ensure you have an active internet connection

### Feed Not Loading
- Try clicking "Refresh Feed"
- Make sure you're following some users on Bluesky
- Check browser console for errors (F12 → Console)

### Posts Not Appearing
- New posts may take a few seconds to appear in the feed
- Try refreshing the feed manually
- The post is still created in your repository even if not immediately visible

### Browser Compatibility
- This app uses ES6 modules and modern JavaScript
- Use a recent version of Chrome, Firefox, Safari, or Edge
- Make sure JavaScript is enabled

## Technical Details

### Dependencies
- `@atproto/api` - Official AT Protocol JavaScript SDK
- Uses CDN import via Skypack for browser compatibility

### API Methods Used
- `agent.login()` - Authenticate user
- `agent.post()` - Create a new post
- `agent.getTimeline()` - Fetch timeline/feed
- `agent.like()` / `agent.deleteLike()` - Like/unlike posts
- `agent.repost()` / `agent.deleteRepost()` - Repost/unrepost posts
- `agent.getProfile()` - Get profile information

### Security Notes
- **Never commit app passwords** to version control
- App passwords can be revoked in Bluesky settings
- Session tokens are stored in localStorage (cleared on logout)

## Next Steps for Learning

1. **Explore the Code**: Read through `app.js` to see how AT Protocol methods are used
2. **Add Features**: Try adding:
   - Reply functionality
   - Follow/unfollow users
   - Search functionality
   - Image uploads (blobs)
   - Custom feeds
3. **Read the Docs**: Check `AT_PROTOCOL_CONCEPTS.md` and `TERMINOLOGY.md` for deeper understanding
4. **Official Documentation**: Visit [atproto.com](https://atproto.com) for comprehensive docs

## Resources

- [AT Protocol Documentation](https://atproto.com)
- [Bluesky](https://bsky.app)
- [AT Protocol GitHub](https://github.com/bluesky-social/atproto)
- [@atproto/api Documentation](https://github.com/bluesky-social/atproto/tree/main/packages/api)

## License

MIT - Feel free to use this for learning and experimentation!
