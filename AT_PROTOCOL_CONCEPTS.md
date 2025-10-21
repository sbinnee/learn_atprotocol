# AT Protocol - Key Concepts Reference

## What is AT Protocol?
AT Protocol is a decentralized social media protocol that enables federated networking. Instead of relying on peer-to-peer connections, it uses a federated architecture where user data is stored on host servers (Personal Data Servers). The protocol is designed to separate "speech" (the ability to create content) from "reach" (the distribution of that content), making it more flexible and scalable.

## Core Components

### 1. Personal Data Servers (PDS)
- Host user repositories and account data
- Users have exclusive control over their repositories
- Users can move their accounts between different PDS providers

### 2. Big Graph Services (BGS)
- Aggregate and index data from multiple PDS
- Provide graph-level operations like search and discovery
- Enable cross-server social features

### 3. App Views
- User-facing applications built on top of the protocol
- Consume data from PDS and BGS
- Examples: Bluesky, other social media apps

## Key Concepts

### DIDs (Decentralized Identifiers)
- Cryptographic identifiers for users and services
- Store public keys for authentication
- Enable user identity portability across servers
- Similar to TLS certificates but for decentralized identity

### Repositories (Repos)
- Personal data storage for each user (similar to Git repos)
- Contain mutable collections of user records
- Store posts, likes, follows, blocks, and other actions
- Data is cryptographically signed
- Organized in a Merkle search tree (sorted chronologically by TID)

### Blobs
- Unstructured binary data storage (media files, images, etc.)
- Stored separately from repositories
- Include metadata about size and media type

### Lexicon
- Global schema network defining data structures
- Unifies names and behaviors across all servers
- Enables software from different organizations to understand each other's data
- Exchanges schematic and semantic information (not just documents)

### Speech and Reach Layers
- **Speech Layer**: Permissive, distributes authority, ensures everyone has a voice
- **Reach Layer**: Built on top of speech layer, provides flexible content distribution and scaling
- Two separate concerns that work together

### Data Portability
- Core goal of AT Protocol
- Users can migrate their account to a different PDS
- Migration can happen without the original server's involvement
- Users retain ownership of their identity (DID) and data
