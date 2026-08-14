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
        avatar: user.avatar_url
    }));
}

// Fetch followers for a specific user
export async function fetchUserFollowers(login) {
    const url = new URL(`https://api.github.com/users/${login}/followers`);
    url.searchParams.set('per_page', '5');

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Could not fetch followers`);
    }

    const followers = await response.json();
    return followers.map(follower => ({
        login: follower.login,
        id: follower.id,
        avatar: follower.avatar_url,
        url: follower.html_url
    }));
}

// Fetch repositories for a specific user
export async function fetchUserRepos(login) {
    const url = new URL(`https://api.github.com/users/${login}/repos`);
    url.searchParams.set('per_page', '5');
    url.searchParams.set('sort', 'stars');
    url.searchParams.set('direction', 'desc');

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Could not fetch repositories`);
    }

    const repos = await response.json();
    return repos.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description',
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language || 'Unknown'
    }));
}