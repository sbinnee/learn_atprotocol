// AT Protocol Social App
// This app demonstrates basic social media features using AT Protocol

import { BskyAgent } from 'https://cdn.skypack.dev/@atproto/api';

// App State
let agent = null;
let currentUser = null;
let isDemoMode = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Check if user is already logged in (session stored)
    const savedSession = localStorage.getItem('atproto-session');
    if (savedSession) {
        try {
            const session = JSON.parse(savedSession);
            resumeSession(session);
        } catch (error) {
            console.error('Failed to resume session:', error);
            localStorage.removeItem('atproto-session');
        }
    }

    setupEventListeners();
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Demo mode button
    document.getElementById('demo-mode-btn').addEventListener('click', handleDemoMode);

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchTab(e.target.dataset.tab);
        });
    });

    // Post creation
    const postText = document.getElementById('post-text');
    const charCount = document.getElementById('char-count');

    postText.addEventListener('input', () => {
        charCount.textContent = `${postText.value.length}/300`;
    });

    document.getElementById('create-post-btn').addEventListener('click', handleCreatePost);

    // Refresh feed
    document.getElementById('refresh-feed-btn').addEventListener('click', loadFeed);
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();

    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    errorDiv.classList.remove('show');
    errorDiv.textContent = '';

    try {
        isDemoMode = false;

        // Create a new agent instance
        agent = new BskyAgent({
            service: 'https://bsky.social'
        });

        // Login
        const response = await agent.login({
            identifier: identifier,
            password: password
        });

        currentUser = response.data;

        // Save session to localStorage
        localStorage.setItem('atproto-session', JSON.stringify(response.data));
        localStorage.setItem('atproto-demo-mode', 'false');

        // Show main app
        showMainApp();

    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = `Login failed: ${error.message}. Make sure you're using an app password, not your main password.`;
        errorDiv.classList.add('show');
    }
}

async function handleDemoMode() {
    try {
        isDemoMode = true;

        // Create mock agent instance
        agent = new window.MockAgent();

        // Login with demo credentials
        const response = await agent.login({
            identifier: 'demo.user',
            password: 'demo'
        });

        currentUser = response.data;

        // Save demo session
        localStorage.setItem('atproto-session', JSON.stringify(response.data));
        localStorage.setItem('atproto-demo-mode', 'true');

        // Show main app
        showMainApp();

    } catch (error) {
        console.error('Demo mode error:', error);
        alert('Failed to start demo mode: ' + error.message);
    }
}

async function resumeSession(session) {
    try {
        // Check if this was a demo mode session
        const wasDemoMode = localStorage.getItem('atproto-demo-mode') === 'true';

        if (wasDemoMode) {
            isDemoMode = true;
            agent = new window.MockAgent();
            await agent.resumeSession(session);
        } else {
            isDemoMode = false;
            agent = new BskyAgent({
                service: 'https://bsky.social'
            });
            await agent.resumeSession(session);
        }

        currentUser = session;
        showMainApp();
    } catch (error) {
        console.error('Session resume error:', error);
        localStorage.removeItem('atproto-session');
        localStorage.removeItem('atproto-demo-mode');
    }
}

function handleLogout() {
    // Clear session
    localStorage.removeItem('atproto-session');
    localStorage.removeItem('atproto-demo-mode');
    agent = null;
    currentUser = null;
    isDemoMode = false;

    // Show login screen
    document.getElementById('main-section').classList.remove('active');
    document.getElementById('login-section').classList.add('active');

    // Reset form
    document.getElementById('login-form').reset();
}

function showMainApp() {
    // Hide login, show main app
    document.getElementById('login-section').classList.remove('active');
    document.getElementById('main-section').classList.add('active');

    // Display user handle
    const handleText = isDemoMode ? `@${currentUser.handle} (Demo Mode)` : `@${currentUser.handle}`;
    document.getElementById('user-handle').textContent = handleText;

    // Load initial data
    loadFeed();
    loadProfile();
}

// Tab Management
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load tab-specific data if needed
    if (tabName === 'feed') {
        loadFeed();
    } else if (tabName === 'profile') {
        loadProfile();
    }
}

// Post Creation
async function handleCreatePost() {
    const postText = document.getElementById('post-text').value.trim();
    const statusDiv = document.getElementById('post-status');
    const createBtn = document.getElementById('create-post-btn');

    if (!postText) {
        showStatus(statusDiv, 'Please enter some text', 'error');
        return;
    }

    try {
        createBtn.disabled = true;
        createBtn.textContent = 'Posting...';

        await agent.post({
            text: postText,
            createdAt: new Date().toISOString()
        });

        // Clear the textarea
        document.getElementById('post-text').value = '';
        document.getElementById('char-count').textContent = '0/300';

        showStatus(statusDiv, 'Post created successfully!', 'success');

        // Switch to feed tab to see the new post
        setTimeout(() => {
            switchTab('feed');
        }, 1000);

    } catch (error) {
        console.error('Post creation error:', error);
        showStatus(statusDiv, `Failed to create post: ${error.message}`, 'error');
    } finally {
        createBtn.disabled = false;
        createBtn.textContent = 'Post';
    }
}

// Feed Functions
async function loadFeed() {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = '<p class="loading">Loading feed...</p>';

    try {
        // Get the user's timeline
        const response = await agent.getTimeline({
            limit: 20
        });

        if (response.data.feed.length === 0) {
            feedContainer.innerHTML = '<p class="loading">No posts in your feed yet. Follow some users or create a post!</p>';
            return;
        }

        // Display posts
        feedContainer.innerHTML = '';
        response.data.feed.forEach(item => {
            const postElement = createPostElement(item);
            feedContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error('Feed loading error:', error);
        feedContainer.innerHTML = `<p class="loading">Failed to load feed: ${error.message}</p>`;
    }
}

function createPostElement(feedItem) {
    const post = feedItem.post;
    const author = post.author;

    const postCard = document.createElement('div');
    postCard.className = 'post-card';

    // Format timestamp
    const postDate = new Date(post.record.createdAt);
    const timeAgo = getTimeAgo(postDate);

    // Check if user has liked or reposted
    const isLiked = feedItem.post.viewer?.like;
    const isReposted = feedItem.post.viewer?.repost;

    postCard.innerHTML = `
        <div class="post-header">
            <div>
                <div class="post-author">${author.displayName || author.handle}</div>
                <div class="post-handle">@${author.handle}</div>
            </div>
            <div class="post-time">${timeAgo}</div>
        </div>
        <div class="post-content">${post.record.text}</div>
        <div class="post-actions">
            <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" data-uri="${post.uri}" data-cid="${post.cid}">
                ${isLiked ? '❤️' : '🤍'} ${post.likeCount || 0}
            </button>
            <button class="action-btn repost-btn ${isReposted ? 'reposted' : ''}" data-uri="${post.uri}" data-cid="${post.cid}">
                🔁 ${post.repostCount || 0}
            </button>
            <button class="action-btn reply-btn" data-uri="${post.uri}">
                💬 ${post.replyCount || 0}
            </button>
        </div>
    `;

    // Add event listeners for actions
    const likeBtn = postCard.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => handleLike(post, likeBtn));

    const repostBtn = postCard.querySelector('.repost-btn');
    repostBtn.addEventListener('click', () => handleRepost(post, repostBtn));

    return postCard;
}

// Like Functionality
async function handleLike(post, button) {
    try {
        const isLiked = button.classList.contains('liked');

        if (isLiked) {
            // Unlike
            if (post.viewer?.like) {
                await agent.deleteLike(post.viewer.like);
                button.classList.remove('liked');
                button.innerHTML = `🤍 ${Math.max(0, (post.likeCount || 0) - 1)}`;
            }
        } else {
            // Like
            await agent.like(post.uri, post.cid);
            button.classList.add('liked');
            button.innerHTML = `❤️ ${(post.likeCount || 0) + 1}`;
        }

    } catch (error) {
        console.error('Like error:', error);
        alert(`Failed to ${button.classList.contains('liked') ? 'like' : 'unlike'} post: ${error.message}`);
    }
}

// Repost Functionality
async function handleRepost(post, button) {
    try {
        const isReposted = button.classList.contains('reposted');

        if (isReposted) {
            // Unrepost
            if (post.viewer?.repost) {
                await agent.deleteRepost(post.viewer.repost);
                button.classList.remove('reposted');
                button.innerHTML = `🔁 ${Math.max(0, (post.repostCount || 0) - 1)}`;
            }
        } else {
            // Repost
            await agent.repost(post.uri, post.cid);
            button.classList.add('reposted');
            button.innerHTML = `🔁 ${(post.repostCount || 0) + 1}`;
        }

    } catch (error) {
        console.error('Repost error:', error);
        alert(`Failed to ${button.classList.contains('reposted') ? 'repost' : 'unrepost'}: ${error.message}`);
    }
}

// Profile Functions
async function loadProfile() {
    const profileContainer = document.getElementById('profile-container');
    profileContainer.innerHTML = '<p class="loading">Loading profile...</p>';

    try {
        // Get profile information
        const response = await agent.getProfile({
            actor: currentUser.handle
        });

        const profile = response.data;

        profileContainer.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-name">${profile.displayName || profile.handle}</div>
                    <div class="profile-handle">@${profile.handle}</div>
                </div>
                ${profile.description ? `<div class="profile-bio">${profile.description}</div>` : ''}
                <div class="profile-stats">
                    <div class="stat">
                        <span class="stat-number">${profile.postsCount || 0}</span>
                        <span class="stat-label">Posts</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${profile.followersCount || 0}</span>
                        <span class="stat-label">Followers</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${profile.followsCount || 0}</span>
                        <span class="stat-label">Following</span>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error('Profile loading error:', error);
        profileContainer.innerHTML = `<p class="loading">Failed to load profile: ${error.message}</p>`;
    }
}

// Utility Functions
function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `status-message show ${type}`;

    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }

    return 'just now';
}
