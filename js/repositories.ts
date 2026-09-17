import { ApiService, RepositoryDisplayItem } from "./api.js";
import {
    hideRepositoryLoading,
    renderRepositoryPagination,
    renderRepositorySearchResults,
    renderRepositoryStatus,
    showRepositoryLoading
} from "./ui.js";

const REPOSITORIES_PER_PAGE = 10;
let currentPage = 1;
let currentQuery = "";
let totalPages = 1;
const apiService = new ApiService();

const searchForm = document.getElementById("repository-search-form");
const queryInput = document.getElementById("repository-query") as HTMLInputElement | null;
const previousButton = document.getElementById("repository-previous-btn") as HTMLButtonElement | null;
const nextButton = document.getElementById("repository-next-btn") as HTMLButtonElement | null;

if (!searchForm || !queryInput || !previousButton || !nextButton) {
    throw new Error("Missing repository search elements");
}

const repositoryQueryInput: HTMLInputElement = queryInput;

async function searchRepositories(page: number): Promise<void> {
    showRepositoryLoading();
    renderRepositoryStatus("");
    document.getElementById("repository-results")!.innerHTML = "";

    try {
        const result = await apiService.searchRepositories(currentQuery, page);
        if (!result.success) {
            renderRepositoryStatus(`Could not search repositories: ${result.error}`);
            renderRepositoryPagination(1, 1);
            return;
        }

        const repositories: RepositoryDisplayItem[] = result.data.items.map((repository) => ({
            name: repository.name,
            description: repository.description,
            ownerLogin: repository.owner.login,
            stars: repository.stargazers_count,
            language: repository.language,
            url: repository.html_url
        }));

        totalPages = Math.max(1, Math.ceil(result.data.total_count / REPOSITORIES_PER_PAGE));
        renderRepositorySearchResults(repositories);
        renderRepositoryPagination(currentPage, totalPages);
    } catch (error: unknown) {
        console.error(error);
        renderRepositoryStatus("Could not search repositories. Please try again.");
        renderRepositoryPagination(1, 1);
    } finally {
        hideRepositoryLoading();
    }
}

function handleSearchSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const query = repositoryQueryInput.value.trim();
    if (!query) {
        renderRepositoryStatus("Enter a repository search term.");
        document.getElementById("repository-results")!.innerHTML = "";
        renderRepositoryPagination(1, 1);
        return;
    }

    currentQuery = query;
    currentPage = 1;
    void searchRepositories(currentPage);
}

function handlePreviousPage(event: MouseEvent): void {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        void searchRepositories(currentPage);
    }
}

function handleNextPage(event: MouseEvent): void {
    event.preventDefault();
    if (currentPage < totalPages) {
        currentPage++;
        void searchRepositories(currentPage);
    }
}

searchForm.addEventListener("submit", handleSearchSubmit as EventListener);
previousButton.addEventListener("click", handlePreviousPage);
nextButton.addEventListener("click", handleNextPage);