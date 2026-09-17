export async function apiRequest(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}` };
        }
        return { success: true, data: await response.json() };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Network request failed";
        return { success: false, error: message };
    }
}
export class ApiService {
    async fetchUsers(page) {
        const githubResult = await apiRequest(`https://api.github.com/users?per_page=10&page=${page}`);
        let usersResult = githubResult;
        if (!githubResult.success) {
            usersResult = await apiRequest("./data/db.json");
        }
        if (!usersResult.success) {
            return { success: false, error: "Could not load users" };
        }
        return {
            success: true,
            data: usersResult.data.map((user) => ({
                login: user.login,
                id: user.id,
                avatar: user.avatar_url
            }))
        };
    }
    async searchRepositories(query, page) {
        const url = new URL("https://api.github.com/search/repositories");
        url.searchParams.set("q", query);
        url.searchParams.set("page", String(page));
        url.searchParams.set("per_page", "10");
        return apiRequest(url.toString());
    }
    async fetchFollowers(login) {
        const url = new URL(`https://api.github.com/users/${login}/followers`);
        url.searchParams.set("per_page", "5");
        const result = await apiRequest(url.toString());
        if (!result.success) {
            return { success: false, error: "Could not load followers" };
        }
        return {
            success: true,
            data: result.data.map((follower) => ({
                login: follower.login,
                id: follower.id,
                avatar: follower.avatar_url,
                url: follower.html_url
            }))
        };
    }
    async fetchRepositories(login) {
        const url = new URL(`https://api.github.com/users/${login}/repos`);
        url.searchParams.set("per_page", "5");
        url.searchParams.set("sort", "stars");
        url.searchParams.set("direction", "desc");
        const result = await apiRequest(url.toString());
        if (!result.success) {
            return { success: false, error: "Could not load repositories" };
        }
        return {
            success: true,
            data: result.data.map((repository) => ({
                name: repository.name,
                description: repository.description || "No description",
                url: repository.html_url,
                stars: repository.stargazers_count,
                language: repository.language || "Unknown"
            }))
        };
    }
}
