// Demo Mode - Mock AT Protocol API for local testing without Bluesky account
// This simulates a Personal Data Server (PDS) locally using localStorage

class MockAgent {
    constructor() {
        this.session = null;
        this.initializeDemoData();
    }

    initializeDemoData() {
        // Initialize demo data if it doesn't exist
        if (!localStorage.getItem('demo-initialized')) {
            const demoData = {
                currentUser: {
                    handle: 'demo.user',
                    did: 'did:plc:demo123456789',
                    email: 'demo@example.com',
                    displayName: 'Demo User',
                    description: 'Testing AT Protocol in demo mode! This is a local simulation.',
                    followersCount: 42,
                    followsCount: 38,
                    postsCount: 0
                },
                posts: this.generateDemoPosts(),
                userPosts: [],
                likes: [],
                reposts: []
            };

            localStorage.setItem('demo-data', JSON.stringify(demoData));
            localStorage.setItem('demo-initialized', 'true');
        }
    }

    generateDemoPosts() {
        const authors = [
            { handle: 'alice.demo', displayName: 'Alice Chen', did: 'did:plc:alice123' },
            { handle: 'bob.demo', displayName: 'Bob Smith', did: 'did:plc:bob456' },
            { handle: 'carol.demo', displayName: 'Carol Martinez', did: 'did:plc:carol789' },
            { handle: 'dave.demo', displayName: 'Dave Johnson', did: 'did:plc:dave012' }
        ];

        const sampleTexts = [
            "Just learned about AT Protocol! The decentralized identity system is fascinating. 🚀",
            "Building my first app with AT Protocol. The separation of speech and reach layers makes so much sense!",
            "Love how data portability works in AT Protocol. Your data, your rules!",
            "The Lexicon schema system is brilliant. Universal data formats across all servers! 💡",
            "Personal Data Servers (PDS) give users real control. This is the future of social media.",
            "Exploring how DIDs work - portable identity that you own forever!",
            "The Big Graph Service (BGS) aggregating data from multiple PDS is genius architecture.",
            "Repositories storing user data like Git repos but for social content. Mind blown! 🤯",
            "AT Protocol's approach to moderation and content filtering is refreshingly different.",
            "Can't wait to see more apps built on AT Protocol. The possibilities are endless!"
        ];

        const posts = [];
        const now = Date.now();

        for (let i = 0; i < 10; i++) {
            const author = authors[i % authors.length];
            const createdAt = new Date(now - (i * 1000 * 60 * 30)); // 30 min intervals

            posts.push({
                uri: `at://did:plc:${author.handle}/app.bsky.feed.post/${Date.now()}-${i}`,
                cid: `bafyrei${Math.random().toString(36).substring(2, 15)}`,
                author: {
                    did: author.did,
                    handle: author.handle,
                    displayName: author.displayName
                },
                record: {
                    text: sampleTexts[i],
                    createdAt: createdAt.toISOString()
                },
                likeCount: Math.floor(Math.random() * 50),
                repostCount: Math.floor(Math.random() * 20),
                replyCount: Math.floor(Math.random() * 10),
                indexedAt: createdAt.toISOString()
            });
        }

        return posts;
    }

    async login({ identifier, password }) {
        // In demo mode, accept any credentials
        await this.simulateDelay(500);

        const demoData = JSON.parse(localStorage.getItem('demo-data'));

        this.session = {
            did: demoData.currentUser.did,
            handle: demoData.currentUser.handle,
            email: demoData.currentUser.email,
            displayName: demoData.currentUser.displayName
        };

        return {
            success: true,
            data: this.session
        };
    }

    async resumeSession(session) {
        await this.simulateDelay(200);
        this.session = session;
        return { success: true };
    }

    async post({ text, createdAt }) {
        await this.simulateDelay(300);

        const demoData = JSON.parse(localStorage.getItem('demo-data'));
        const now = createdAt || new Date().toISOString();

        const newPost = {
            uri: `at://${demoData.currentUser.did}/app.bsky.feed.post/${Date.now()}`,
            cid: `bafyrei${Math.random().toString(36).substring(2, 15)}`,
            author: {
                did: demoData.currentUser.did,
                handle: demoData.currentUser.handle,
                displayName: demoData.currentUser.displayName
            },
            record: {
                text: text,
                createdAt: now
            },
            likeCount: 0,
            repostCount: 0,
            replyCount: 0,
            indexedAt: now
        };

        demoData.userPosts.unshift(newPost);
        demoData.currentUser.postsCount++;
        localStorage.setItem('demo-data', JSON.stringify(demoData));

        return { success: true, uri: newPost.uri, cid: newPost.cid };
    }

    async getTimeline({ limit = 20 }) {
        await this.simulateDelay(400);

        const demoData = JSON.parse(localStorage.getItem('demo-data'));

        // Combine user posts with demo posts
        const allPosts = [...demoData.userPosts, ...demoData.posts];

        // Sort by date (newest first)
        allPosts.sort((a, b) =>
            new Date(b.record.createdAt) - new Date(a.record.createdAt)
        );

        const feed = allPosts.slice(0, limit).map(post => {
            // Check if user has liked or reposted
            const likeUri = demoData.likes.find(l => l.subject === post.uri);
            const repostUri = demoData.reposts.find(r => r.subject === post.uri);

            return {
                post: {
                    ...post,
                    viewer: {
                        like: likeUri?.uri,
                        repost: repostUri?.uri
                    }
                }
            };
        });

        return {
            success: true,
            data: { feed }
        };
    }

    async like(uri, cid) {
        await this.simulateDelay(200);

        const demoData = JSON.parse(localStorage.getItem('demo-data'));

        const likeUri = `at://${demoData.currentUser.did}/app.bsky.feed.like/${Date.now()}`;

        demoData.likes.push({
            uri: likeUri,
            subject: uri,
            cid: cid,
            createdAt: new Date().toISOString()
        });

        // Update like count on the post
        this.updatePostEngagement(uri, 'likeCount', 1);

        localStorage.setItem('demo-data', JSON.stringify(demoData));

        return { success: true, uri: likeUri };
    }

    async deleteLike(likeUri) {
        await this.simulateDelay(200);

        const demoData = JSON.parse(localStorage.getItem('demo-data'));

        const likeIndex = demoData.likes.findIndex(l => l.uri === likeUri);
        if (likeIndex > -1) {
            const like = demoData.likes[likeIndex];
            demoData.likes.splice(likeIndex, 1);

            // Update like count on the post
            this.updatePostEngagement(like.subject, 'likeCount', -1);

            localStorage.setItem('demo-data', JSON.stringify(demoData));
        }

        return { success: true };
    }

    async repost(uri, cid) {
        await this.simulateDelay(200);

        const demoData = JSON.parse(localStorage.getItem('demo-data'));

        const repostUri = `at://${demoData.currentUser.did}/app.bsky.feed.repost/${Date.now()}`;

        demoData.reposts.push({
            uri: repostUri,
            subject: uri,
            cid: cid,
            createdAt: new Date().toISOString()
        });

        // Update repost count on the post
        this.updatePostEngagement(uri, 'repostCount', 1);

        localStorage.setItem('demo-data', JSON.stringify(demoData));

        return { success: true, uri: repostUri };
    }

    async deleteRepost(repostUri) {
        await this.simulateDelay(200);

        const demoData = JSON.parse(localStorage.getItem('demo-data'));

        const repostIndex = demoData.reposts.findIndex(r => r.uri === repostUri);
        if (repostIndex > -1) {
            const repost = demoData.reposts[repostIndex];
            demoData.reposts.splice(repostIndex, 1);

            // Update repost count on the post
            this.updatePostEngagement(repost.subject, 'repostCount', -1);

            localStorage.setItem('demo-data', JSON.stringify(demoData));
        }

        return { success: true };
    }

    updatePostEngagement(postUri, field, delta) {
        const demoData = JSON.parse(localStorage.getItem('demo-data'));

        // Find the post in userPosts or posts
        let post = demoData.userPosts.find(p => p.uri === postUri);
        if (!post) {
            post = demoData.posts.find(p => p.uri === postUri);
        }

        if (post) {
            post[field] = Math.max(0, (post[field] || 0) + delta);
            localStorage.setItem('demo-data', JSON.stringify(demoData));
        }
    }

    async getProfile({ actor }) {
        await this.simulateDelay(300);

        const demoData = JSON.parse(localStorage.getItem('demo-data'));

        return {
            success: true,
            data: {
                did: demoData.currentUser.did,
                handle: demoData.currentUser.handle,
                displayName: demoData.currentUser.displayName,
                description: demoData.currentUser.description,
                followersCount: demoData.currentUser.followersCount,
                followsCount: demoData.currentUser.followsCount,
                postsCount: demoData.currentUser.postsCount
            }
        };
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in main app
window.MockAgent = MockAgent;
