export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    name?: string | null;
    public_repos?: number;
}

export interface GitHubFollower {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}

export interface GitHubRepository {
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
}

export type UserListItem = Pick<GitHubUser, "login" | "id"> & {
    avatar: string;
};

export interface FollowerItem {
    login: string;
    id: number;
    avatar: string;
    url: string;
}

export interface RepositoryItem {
    name: string;
    description: string;
    url: string;
    stars: number;
    language: string;
}

export type ApiResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export async function apiRequest<T>(url: string): Promise<ApiResult<T>> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return { success: false, error: `HTTP ${response.status}` };
        }

        return { success: true, data: await response.json() as T };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Network request failed";
        return { success: false, error: message };
    }
}

export class ApiService {
    async fetchUsers(): Promise<ApiResult<UserListItem[]>> {
        const githubResult = await apiRequest<GitHubUser[]>(
            "https://api.github.com/users?per_page=30"
        );

        let usersResult = githubResult;
        if (!githubResult.success) {
            usersResult = await apiRequest<GitHubUser[]>("./data/db.json");
        }

        if (!usersResult.success) {
            return { success: false, error: "Could not load users" };
        }

        return {
            success: true,
            data: usersResult.data.map((user): UserListItem => ({
                login: user.login,
                id: user.id,
                avatar: user.avatar_url
            }))
        };
    }

    async fetchFollowers(login: string): Promise<ApiResult<FollowerItem[]>> {
        const url = new URL(`https://api.github.com/users/${login}/followers`);
        url.searchParams.set("per_page", "5");
        const result = await apiRequest<GitHubFollower[]>(url.toString());

        if (!result.success) {
            return { success: false, error: "Could not load followers" };
        }

        return {
            success: true,
            data: result.data.map((follower): FollowerItem => ({
                login: follower.login,
                id: follower.id,
                avatar: follower.avatar_url,
                url: follower.html_url
            }))
        };
    }

    async fetchRepositories(login: string): Promise<ApiResult<RepositoryItem[]>> {
        const url = new URL(`https://api.github.com/users/${login}/repos`);
        url.searchParams.set("per_page", "5");
        url.searchParams.set("sort", "stars");
        url.searchParams.set("direction", "desc");
        const result = await apiRequest<GitHubRepository[]>(url.toString());

        if (!result.success) {
            return { success: false, error: "Could not load repositories" };
        }

        return {
            success: true,
            data: result.data.map((repository): RepositoryItem => ({
                name: repository.name,
                description: repository.description || "No description",
                url: repository.html_url,
                stars: repository.stargazers_count,
                language: repository.language || "Unknown"
            }))
        };
    }
}