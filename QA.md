# AT Protocol Q&A

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
