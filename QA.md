# AT Protocol Q&A

---

## 2025-11-05

**Question:** If I want to make an application based on AT Protocol, is it the same as making a new App View?

**Answer:**

Not necessarily - it depends on what type of application you want to build. An **App View** is just one type of application in the AT Protocol ecosystem.

### Types of Applications You Can Build:

#### 1. App View (Full Social Platform)
**What it is:** A comprehensive social media platform that aggregates data from across the entire network.

**Examples:**
- Bluesky (the main social media app)
- A Twitter-like clone
- A Foursquare clone on AT Protocol
- Any full-featured social platform

**When to build one:**
- You want to create a complete social media experience
- You need network-wide aggregation (likes, reposts, followers)
- You want content discovery and user search features
- You're building a platform that competes with/complements Bluesky

**What it requires:**
- Consuming data from Relays (the firehose)
- Processing and aggregating network-wide information
- Providing an XRPC API for clients
- Significant infrastructure for indexing

#### 2. Client Application (User Interface)
**What it is:** A mobile app, desktop app, or web interface that connects to existing App Views/PDS.

**Examples:**
- Alternative mobile clients for Bluesky
- Desktop applications
- Web interfaces with different UX

**When to build one:**
- You want a different user experience for existing data
- You're focusing on UI/UX improvements
- You don't need to run your own infrastructure

#### 3. Feed Generator (Custom Algorithm)
**What it is:** A service that provides custom content algorithms.

**How it works:**
- Receives requests from users' PDS
- Returns a list of post URIs based on your algorithm
- Users can subscribe to your custom feed

**Examples:**
- Specialized interest feeds (tech news, art, etc.)
- Algorithmic ranking different from Bluesky's default
- Curated content feeds

#### 4. Bot (Automated Account)
**What it is:** An automated account that posts or responds to content.

**Examples:**
- News bots that post updates
- Reminder bots
- Interactive bots that respond to mentions

**Tools available:**
- ProtoRune (Elixir framework)
- Various bot SDKs and frameworks

#### 5. Labeler (Content Moderation)
**What it is:** A service that labels content for moderation purposes.

**Purpose:**
- Apply content warnings
- Flag inappropriate content
- Custom moderation rules

#### 6. Personal Data Server (PDS) Implementation
**What it is:** Running your own server to host user repositories.

**When to build one:**
- You want to provide hosting services
- You need complete control over data storage
- You're building infrastructure for others

### Building Your Application: Key Steps

According to AT Protocol guides, when building an application:

1. **Design Lexicon schemas** - Define the data structures for your records
2. **Create a database** - For aggregating records into useful views
3. **Build your application** - Write records to users' repositories
4. **Listen to the firehose** - Aggregate data across the network (if needed)

### So, Is It the Same as Making an App View?

**Short answer:** Only if you're building a full social platform that needs network-wide data aggregation.

**If you're building:**
- A simple bot → No App View needed
- A custom feed → You're making a Feed Generator, not an App View
- A mobile client → You're making a Client, not an App View
- A complete social platform → Yes, you're making an App View

**References:**
- [AT Protocol Applications Guide](https://atproto.com/guides/applications)
- [GitHub: AT Protocol Ecosystem](https://github.com/bluesky-social/atproto-ecosystem)
- [TechCrunch: Apps Building on AT Protocol](https://techcrunch.com/2025/06/13/beyond-bluesky-these-are-the-apps-building-social-experiences-on-the-at-protocol/)

**Tags:** #development #appview #architecture #applications #feed-generator #bot #client

---

## 2025-11-05

**Question:** Can you clarify terms (PDS, relays, AppViews, etc.)?

**Answer:**

AT Protocol has several key components that work together. Here's a breakdown of the main terms:

### Personal Data Server (PDS)
A server that **hosts and manages user repositories** (your personal data storage).

**Think of it like:** Choosing an email provider (Gmail, Outlook, etc.) - you can choose which PDS hosts your data.

**Key features:**
- Stores your repository containing all your posts, likes, follows, etc.
- You can switch to a different PDS without losing your identity (DID) or data
- You have complete control over your repository
- Each user has exactly ONE repository hosted on a PDS

### Relay (formerly called "Big Graph Service" or "BGS")
A server that **collects data from many PDS servers and aggregates them into a unified stream**.

**Think of it like:** A search engine that crawls many websites to provide search functionality across the entire network.

**What it does:**
- Crawls repositories from multiple PDS servers
- Outputs a unified event "firehose" (stream of all activity)
- Enables cross-server features like search, discovery, and recommendations
- Multiple relays can exist in the network

**Naming note:** "BGS" was renamed to "Relay" in December 2023 for clarity. They're the same thing - Relay is the current official term.

### App View
The **user-facing application or interface** - what you actually see and interact with.

**Examples:**
- The Bluesky mobile app
- A web client for AT Protocol
- Any third-party app built on AT Protocol

**Key point:** The App View displays data but doesn't store your personal data (that's the PDS's job). Apps consume data from PDS and Relays.

### How They Work Together

```
[Your Data] → [PDS] → [Relay] → [App View] → [You see it on screen]
    ↓
(Repository)   (Hosts it)  (Aggregates  (Displays it)
                           from many PDS)
```

**The flow:**
1. Your data lives in a repository on your PDS
2. Relays crawl your PDS (and many others) to create an aggregated view
3. App Views query Relays and PDS to show you content
4. You interact with the App View, which updates your PDS

### Other Important Terms

**DID (Decentralized Identifier):** Your unique, permanent ID that stays with you even if you switch PDS. Like a digital passport.

**Repository (Repo):** Your personal database containing all your social data (posts, likes, follows). Like a Git repo but for social data instead of code.

**Lexicon:** A standardized schema that defines all data types (what a "post" is, what a "like" is, etc.) so all servers understand data the same way.

**Blob:** Binary data like images/videos, stored separately from your repository text data.

**References:**
- [AT Protocol Overview](https://atproto.com/guides/overview)
- [GitHub Discussion: BGS Naming](https://github.com/bluesky-social/atproto/discussions/1847)
- TERMINOLOGY.md in this repository

**Tags:** #terminology #pds #relay #bgs #appview #architecture

---

## 2025-11-05

**Question:** What happens when Bluesky is down? Do all the apps that use AT Protocol become obsolete?

**Answer:**

No, apps using AT Protocol don't become obsolete when Bluesky is down - this is a key feature of the protocol's decentralized design. However, the impact depends on which infrastructure goes down and where users store their data:

### Current Reality (Short-term)
- **Most users would be affected** because the majority of AT Protocol users currently rely on Bluesky-operated infrastructure (PDS, relays, AppViews)
- When Bluesky experienced an outage in April 2025, it was attributed to "Major PDS Networking Problems" that affected users on Bluesky's infrastructure
- However, **users running their own independent PDS were not impacted** by the outage

### How Decentralization Protects Users

The AT Protocol architecture consists of several independent components:

1. **Personal Data Servers (PDS)**: Store individual user data
   - Users can run their own PDS or choose different providers
   - If you run your own PDS, Bluesky downtime doesn't affect your data

2. **Big Graph Services/Relays**: Aggregate data from multiple PDS
   - Multiple relays can exist
   - Apps can connect to different relays

3. **App Views**: The applications users interact with
   - Any app using AT Protocol can connect to any PDS
   - Multiple competing apps can exist (Bluesky is just one)

### "Credible Exit" Philosophy

AT Protocol is designed with **credible exit** in mind:
- If Bluesky Social PBC goes out of business or loses users' trust, other providers can step in
- Users can switch providers with minimal friction (without changing username or losing content/social graph)
- Since repositories are public, anyone can crawl and index them using the same protocols

### Long-term Goal: "Hard Decentralization"

The protocol aims for **hard decentralization** - a resilient, multi-stakeholder ecosystem that relies less on Bluesky PBC's existence. This means:
- Multiple competing providers for each component (PDS, relays, AppViews)
- Users distributed across many providers
- No single point of failure

**Bottom line:** AT Protocol apps won't become obsolete if Bluesky goes down because the protocol is designed for multiple providers. However, in practice (as of 2025), most users are still on Bluesky's infrastructure, so they would be impacted until the ecosystem matures with more independent providers.

**References:**
- [TechCrunch: Wait, how did a decentralized service like Bluesky go down?](https://techcrunch.com/2025/04/24/wait-how-did-a-decentralized-service-like-bluesky-go-down/)
- [Bluesky and the AT Protocol: Usable Decentralized Social Media](https://arxiv.org/html/2402.03239v2)

**Tags:** #architecture #decentralization #pds #resilience #credible-exit

---
