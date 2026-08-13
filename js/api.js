// Utility function to fetch with fallback to local db.json
async function fetchWithFallback(url, fallbackUrl) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.warn(`Failed to fetch ${url}, using fallback: ${fallbackUrl}`);
        try {
            const fallbackResponse = await fetch(fallbackUrl);
            if (!fallbackResponse.ok) {
                throw new Error("Fallback failed");
            }
            return await fallbackResponse.json();
        } catch (fallbackError) {
            console.error("Both primary and fallback fetch failed:", error, fallbackError);
            throw new Error("Could not load users");
        }
    }
}

export async function fetchUsers() {
    const githubUrl = "https://api.github.com/users?per_page=30";
    const fallbackUrl = "./data/db.json";

    const users = await fetchWithFallback(githubUrl, fallbackUrl);

    return users.map(user => ({
        login: user.login,
        id: user.id,
        avatar: user.avatar_url,
        url: user.url,
        followers_url: user.followers_url,
        repos_url: user.repos_url
    }));
}

// Fetch followers for a specific user
export async function fetchUserFollowers(followersUrl) {
    try {
        // GitHub API returns URLs like: https://api.github.com/users/mojombo/followers
        const url = new URL(followersUrl);
        url.searchParams.set('per_page', '5');

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const followers = await response.json();
        return followers.map(follower => ({
            login: follower.login,
            id: follower.id,
            avatar: follower.avatar_url,
            url: follower.html_url
        }));
    } catch (error) {
        console.warn("Could not fetch followers from GitHub API, returning mock data");
        // Return mock data as fallback
        return getMockFollowers();
    }
}

// Fetch repositories for a specific user
export async function fetchUserRepos(reposUrl) {
    try {
        // GitHub API returns URLs like: https://api.github.com/users/mojombo/repos
        const url = new URL(reposUrl);
        url.searchParams.set('per_page', '5');
        url.searchParams.set('sort', 'stars');
        url.searchParams.set('direction', 'desc');

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const repos = await response.json();
        return repos.map(repo => ({
            name: repo.name,
            description: repo.description || 'No description',
            url: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language || 'Unknown'
        }));
    } catch (error) {
        console.warn("Could not fetch repositories from GitHub API, returning mock data");
        // Return mock data as fallback
        return getMockRepos();
    }
}

// Mock data for followers (fallback when GitHub API fails)
function getMockFollowers() {
    return [
        { login: 'octocat', id: 1, avatar: 'https://avatars.githubusercontent.com/u/1?v=4', url: 'https://github.com/octocat' },
        { login: 'defunkt', id: 2, avatar: 'https://avatars.githubusercontent.com/u/2?v=4', url: 'https://github.com/defunkt' },
        { login: 'pjhyett', id: 3, avatar: 'https://avatars.githubusercontent.com/u/3?v=4', url: 'https://github.com/pjhyett' },
        { login: 'wycats', id: 4, avatar: 'https://avatars.githubusercontent.com/u/4?v=4', url: 'https://github.com/wycats' },
        { login: 'ezmobius', id: 5, avatar: 'https://avatars.githubusercontent.com/u/5?v=4', url: 'https://github.com/ezmobius' }
    ];
}

// Mock data for repositories (fallback when GitHub API fails)
function getMockRepos() {
    return [
        {
            name: 'awesome-project',
            description: 'A collection of awesome resources for developers',
            url: 'https://github.com/octocat/awesome-project',
            stars: 1500,
            language: 'JavaScript'
        },
        {
            name: 'api-client',
            description: 'REST API client for modern applications',
            url: 'https://github.com/octocat/api-client',
            stars: 892,
            language: 'TypeScript'
        },
        {
            name: 'github-utils',
            description: 'Utility functions for GitHub integration',
            url: 'https://github.com/octocat/github-utils',
            stars: 567,
            language: 'JavaScript'
        },
        {
            name: 'data-processing',
            description: 'High-performance data processing library',
            url: 'https://github.com/octocat/data-processing',
            stars: 2100,
            language: 'Python'
        },
        {
            name: 'web-framework',
            description: 'Lightweight web framework',
            url: 'https://github.com/octocat/web-framework',
            stars: 3200,
            language: 'JavaScript'
        }
    ];
}