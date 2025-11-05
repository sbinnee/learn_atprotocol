# Learn AT Protocol

This repository contains a simple social media web application built to learn and demonstrate AT Protocol concepts.

## What is AT Protocol?

AT Protocol is a decentralized social networking protocol that powers Bluesky and other federated social applications. It separates "speech" (content creation) from "reach" (content distribution), enabling user data portability and decentralized identity.

## Project Contents

### Documentation
- **`TERMINOLOGY.md`** - Simple explanations of AT Protocol terms
- **`AT_PROTOCOL_CONCEPTS.md`** - Key concepts and architecture overview
- **`APP_GUIDE.md`** - Complete guide for using the social media app

### Application
A working social media web app demonstrating:
- User authentication with DIDs (Decentralized Identifiers)
- Creating and publishing posts
- Viewing timeline/feed
- Social interactions (likes, reposts)
- Profile management

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   - Go to `http://localhost:3000`
   - Login with your Bluesky account credentials

For detailed instructions, see [APP_GUIDE.md](APP_GUIDE.md).

## Prerequisites

- Node.js installed
- A Bluesky account ([sign up at bsky.app](https://bsky.app))
- An app password (create in Bluesky Settings → App Passwords)

## Features Demonstrated

- ✅ Authentication using AT Protocol
- ✅ Post creation (stored in your repository)
- ✅ Timeline/feed viewing (aggregated via BGS)
- ✅ Like/unlike posts
- ✅ Repost functionality
- ✅ Profile viewing

## Learning Resources

Start with the documentation files to understand core concepts, then explore the app code to see them in practice:

1. Read `TERMINOLOGY.md` for basic terms
2. Study `AT_PROTOCOL_CONCEPTS.md` for architecture
3. Follow `APP_GUIDE.md` to run the app
4. Explore `app.js` to see AT Protocol API usage

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (ES6 modules)
- **Backend**: Node.js (simple HTTP server)
- **AT Protocol**: `@atproto/api` SDK
- **PDS**: Connects to `bsky.social`

## License

MIT - Built for learning purposes!
