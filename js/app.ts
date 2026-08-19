import { ApiService, UserListItem } from "./api.js";
import { renderUsers, renderPagination, showLoading, hideLoading, showError } from "./ui.js";
import {
    filterUsersByLoginLength,
    resetPage,
    getPaginatedUsers,
    getCurrentPage,
    getTotalPages,
    nextPage,
    previousPage
} from "./users.js";

let allUsers: UserListItem[] = [];
let filteredUsers: UserListItem[] = [];
const apiService = new ApiService();

async function loadUsers(): Promise<void> {
    showLoading();
    try {
        const result = await apiService.fetchUsers();
        if (!result.success) {
            showError(result.error);
            getElement<HTMLParagraphElement>("user-count").textContent = result.error;
            getElement("users-container").innerHTML = "";
            return;
        }

        allUsers = result.data;
        filteredUsers = filterUsersByLoginLength(allUsers, 4);
        getElement<HTMLParagraphElement>("user-count").textContent = `Users fetched: ${allUsers.length}`;
        getElement<HTMLParagraphElement>("filtered-count").textContent = `Users remaining: ${filteredUsers.length}`;
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
    renderUsers(getPaginatedUsers(filteredUsers), handleUserClick);
    renderPagination(getCurrentPage(), getTotalPages(filteredUsers));
}

function handleUserClick(user: UserListItem): void {
    sessionStorage.setItem("selectedUser", JSON.stringify(user));
    window.location.href = "./details.html";
}

getElement<HTMLButtonElement>("next-btn").addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    nextPage(filteredUsers);
    renderPage();
});

getElement<HTMLButtonElement>("previous-btn").addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    previousPage();
    renderPage();
});

getElement<HTMLButtonElement>("apply-filter").addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();
    const minimumLength = Number(getElement<HTMLInputElement>("login-length").value);
    filteredUsers = filterUsersByLoginLength(allUsers, minimumLength);
    resetPage();
    getElement<HTMLParagraphElement>("filtered-count").textContent = `Users remaining: ${filteredUsers.length}`;
    renderPage();
});

loadUsers();