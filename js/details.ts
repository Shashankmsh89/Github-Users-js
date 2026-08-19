import { ApiResult, ApiService, UserListItem } from "./api.js";
import {
    showDetailsLoading,
    hideDetailsLoading,
    showDetailsError,
    hideDetailsError,
    renderUserDetails,
    renderFollowers,
    renderRepositories
} from "./ui.js";

const selectedUserJson = sessionStorage.getItem("selectedUser");
if (!selectedUserJson) {
    window.location.href = "./index.html";
    throw new Error("No selected user");
}

const selectedUser = JSON.parse(selectedUserJson) as UserListItem;
const apiService = new ApiService();

document.addEventListener("DOMContentLoaded", () => {
    void initializePage();
});

async function initializePage(): Promise<void> {
    renderUserDetails(selectedUser);
    showDetailsLoading();
    hideDetailsError();

    try {
        const results = await Promise.allSettled([
            apiService.fetchFollowers(selectedUser.login),
            apiService.fetchRepositories(selectedUser.login)
        ]);
        const [followersResult, repositoriesResult] = results;
        const errors: string[] = [];

        handleResult(followersResult, renderFollowers, "Could not load followers");
        handleResult(repositoriesResult, renderRepositories, "Could not load repositories");

        if (followersResult.status === "rejected" ||
            (followersResult.status === "fulfilled" && !followersResult.value.success)) {
            errors.push("Could not load followers.");
        }
        if (repositoriesResult.status === "rejected" ||
            (repositoriesResult.status === "fulfilled" && !repositoriesResult.value.success)) {
            errors.push("Could not load repositories.");
        }
        if (errors.length > 0) {
            showDetailsError(errors.join(" "));
        }
    } catch (error: unknown) {
        console.error("Error loading user details:", error);
        showDetailsError("Could not load user details. Please try again.");
    } finally {
        hideDetailsLoading();
    }
}

function handleResult<T>(
    result: PromiseSettledResult<ApiResult<T>>,
    render: (data: T) => void,
    fallbackMessage: string
): void {
    if (result.status === "fulfilled" && result.value.success) {
        render(result.value.data);
        return;
    }

    if (result.status === "rejected") {
        console.error(fallbackMessage, result.reason);
    } else {
        const failedResult = result.value;
        if (!failedResult.success) {
            console.error(fallbackMessage, failedResult.error);
        }
    }
}

document.getElementById("back-btn")?.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    sessionStorage.removeItem("selectedUser");
    window.location.href = "./index.html";
});