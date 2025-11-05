# AT Protocol Q&A

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
