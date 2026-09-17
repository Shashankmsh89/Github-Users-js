import { ApiService, UserListItem } from "./api.js";
import { renderUsers, renderPagination, showLoading, hideLoading, showError } from "./ui.js";
import {
    resetPage,
    getCurrentPage,
    nextPage,
    previousPage,
    USERS_PER_PAGE
} from "./users.js";

type SortDirection = "asc" | "desc";

let currentUsers: UserListItem[] = [];
let searchText = "";
let sortDirection: SortDirection = "asc";
const apiService = new ApiService();

async function loadUsers(page: number): Promise<void> {
    showLoading();
    try {
        const result = await apiService.fetchUsers(page);
        if (!result.success) {
            showError(result.error);
            getElement<HTMLParagraphElement>("user-count").textContent = result.error;
            getElement("users-container").innerHTML = "";
            return;
        }

        currentUsers = result.data;
        getElement<HTMLParagraphElement>("user-count").textContent = `Users fetched: ${currentUsers.length}`;
        renderPage();
    } catch (error: unknown) {
        console.error(error);
        showError("Could not load users");
        getElement<HTMLParagraphElement>("user-count").textContent = "Could not load users";
        getElement("users-container").innerHTML = "";
    } finally {
        hideLoading();
    }
}

function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Missing required element: ${id}`);
    }
    return element as T;
}

function renderPage(): void {
    const visibleUsers = currentUsers
        .filter((user) => user.login.toLowerCase().includes(searchText.toLowerCase()))
        .slice()
        .sort((first, second) => {
            const comparison = first.login.localeCompare(second.login);
            return sortDirection === "asc" ? comparison : -comparison;
        });

    getElement<HTMLParagraphElement>("filtered-count").textContent = `Users shown: ${visibleUsers.length}`;
    renderUsers(visibleUsers, handleUserClick);
    renderPagination(getCurrentPage(), currentUsers.length === USERS_PER_PAGE);
}

function handleUserClick(user: UserListItem): void {
    sessionStorage.setItem("selectedUser", JSON.stringify(user));
    window.location.href = "./details.html";
}

getElement<HTMLButtonElement>("next-btn").addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    if (currentUsers.length === USERS_PER_PAGE) {
        nextPage(true);
        void loadUsers(getCurrentPage());
    }
});

getElement<HTMLButtonElement>("previous-btn").addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    previousPage();
    void loadUsers(getCurrentPage());
});

function handleSearchInput(event: InputEvent): void {
    searchText = (event.target as HTMLInputElement).value;
    renderPage();
}

getElement<HTMLInputElement>("user-search").addEventListener("input", handleSearchInput as EventListener);

getElement<HTMLSelectElement>("sort-direction").addEventListener("change", (event: Event) => {
    sortDirection = (event.target as HTMLSelectElement).value as SortDirection;
    renderPage();
});

resetPage();
void loadUsers(getCurrentPage());