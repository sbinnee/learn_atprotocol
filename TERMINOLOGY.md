# AT Protocol Terminology Guide

## Core Terms Explained Simply

### Protocol
A set of rules and standards that allow different computers and systems to communicate with each other. Think of it like a language that everyone agrees to use so they can understand each other.

**Example:** HTTP is a protocol used by web browsers to communicate with web servers.

---

### Decentralized / Decentralization
A system where there is no single central authority or control point. Instead of one company controlling everything, power and control are distributed among many participants.

**Contrast:**
- **Centralized:** Twitter owns all user data and controls everything
- **Decentralized:** Users can store their data on different servers they trust

---

### Federated / Federation
A system where multiple independent servers work together as equals while maintaining their own autonomy. Like a network of independent post offices that all deliver mail to each other.

**Key difference from peer-to-peer:** Servers are involved, but no single server is in charge.

---

### DID (Decentralized Identifier)
A unique, permanent ID for a person or entity that doesn't depend on any single company or server. It's like a digital passport that proves who you are.

**Real-world analogy:** Your passport is issued by your government and works everywhere, even if you travel to different countries.

**AT Protocol context:** Your DID stays with you even if you switch to a different Personal Data Server.

---

### Repository (Repo)
A personal database that stores all of a user's data. It's like a personal file cabinet that belongs only to you.

**Analogy:** Similar to a Git repository (for code), but it stores social data instead (posts, likes, follows, etc.).

**Key point:** Each user has exactly ONE repository, and they have complete control over it.

---

### Personal Data Server (PDS)
A server that hosts and manages user repositories. Think of it as a hosting provider for your personal data.

**Analogy:** Like choosing which email provider to use (Gmail, Outlook, etc.), you can choose which PDS hosts your data.

**User control:** You can move your repository to a different PDS without losing your identity (DID).

---

### Big Graph Service (BGS)
A server that collects and indexes data from many different Personal Data Servers. It helps with search, discovery, and connecting users across different servers.

**Think of it like:** A search engine that crawls data from many PDS servers to provide features like "Discover" or "Search."

---

### App View
The user-facing application or interface. It's the app you actually interact with.

**Examples:**
- The Bluesky mobile app
- A web client for AT Protocol
- Any third-party app built on AT Protocol

**Key point:** The app displays data but doesn't store your personal data (that's the PDS's job).

---

### Lexicon
A standardized dictionary/schema that defines all the data types and structures used across AT Protocol. It's like a universal language that all servers and apps understand.

**Think of it like:** A shared dictionary that defines what a "post" is, what a "like" is, etc., so everyone understands them the same way.

**Why it matters:** Allows software from different organizations to understand each other's data automatically.

---

### Blob
Unstructured binary data like images, videos, or documents. It's stored separately from the main repository.

**Think of it like:** While your repository contains the text of your post, the blob is the image file attached to that post.

---

### Merkle Tree / Merkle Search Tree
A cryptographic data structure that organizes data in a tree-like hierarchy. Each piece of data is linked to others through cryptographic hashes, creating a verifiable chain.

**Why it matters:**
- Ensures data hasn't been tampered with
- Allows efficient verification of data integrity
- Enables users to verify their data is correct

**For beginners:** Think of it like a chain of sealed envelopes where if someone opens one and changes it, everyone can tell.

---

### TID (Timestamp IDentifier)
A unique identifier for each record in your repository, based on when it was created. Records are organized chronologically using TIDs.

**Think of it like:** Each post gets a timestamp ID so they can be ordered from oldest to newest.

---

### Speech Layer
The part of AT Protocol that handles content creation. It's designed to be permissive and ensure everyone can post content.

**Key characteristics:**
- Distributed authority (no single gatekeeper)
- Everyone has a voice
- Focused on enabling content creation

---

### Reach Layer
The part of AT Protocol that handles content distribution and visibility. It sits on top of the speech layer and controls who sees what.

**Key characteristics:**
- Flexible and can be customized
- Handles algorithmic feeds, recommendations, etc.
- Separate from the speech layer so it can be changed independently

**Why separate:** Content is created at the speech layer, but visibility is controlled at the reach layer. They're intentionally decoupled.

---

### Data Portability
The ability to move your account from one service to another while keeping your identity and data intact.

**AT Protocol goal:** Users should be able to move their repository from one PDS to another without losing their DID, followers, or data.

**Real-world analogy:** Like being able to switch email providers while keeping your email address and all your messages.

---

### Cryptographic Signing
A way to prove that data came from you and hasn't been modified. It uses mathematical keys to create a unique signature.

**How it works:**
- You have a private key (secret, like a password)
- You have a public key (shared with others, like a mailbox)
- Anything you sign with your private key can be verified with your public key

**Why it matters:** Proves ownership and authenticity of data.

---

### Schema
A blueprint or definition of how data should be structured. It defines what fields exist, what data types they are, etc.

**Analogy:** Like a form with specific fields - name, email, date - that you must fill in a certain way.

**In AT Protocol:** Lexicon defines schemas so all servers understand data the same way.

---

### Mutable Data
Data that can be changed after it's created.

**Example:** Your profile information can be updated.

**Contrast:** Immutable data cannot be changed once created (like blockchain records).

---

### Migration
Moving your account from one service to another.

**In AT Protocol context:** Moving your repository from one PDS to a different PDS while keeping your DID and identity.

---

## Summary Table

| Term | Simple Definition | Key Point |
|------|-------------------|-----------|
| Protocol | Rules for communication | Everyone agrees to follow them |
| DID | Your unique permanent ID | Stays with you regardless of PDS |
| Repository | Your personal data storage | Only you control it |
| PDS | Server hosting your repo | You can switch PDS if you want |
| BGS | Search/discovery server | Helps connect across PDS |
| App View | The app you use | Displays data, doesn't store it |
| Lexicon | Universal data definitions | All servers understand them |
| Blob | Media files | Stored separately from repo |
| Speech Layer | Content creation | Permissive, for everyone |
| Reach Layer | Content distribution | Controls visibility |

