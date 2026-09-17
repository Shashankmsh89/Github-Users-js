import { ApiService } from "./api.js";
import { renderUsers, renderPagination, showLoading, hideLoading, showError } from "./ui.js";
import { resetPage, getCurrentPage, nextPage, previousPage, USERS_PER_PAGE } from "./users.js";
let currentUsers = [];
let searchText = "";
let sortDirection = "asc";
const apiService = new ApiService();
async function loadUsers(page) {
    showLoading();
    try {
        const result = await apiService.fetchUsers(page);
        if (!result.success) {
            showError(result.error);
            getElement("user-count").textContent = result.error;
            getElement("users-container").innerHTML = "";
            return;
        }
        currentUsers = result.data;
        getElement("user-count").textContent = `Users fetched: ${currentUsers.length}`;
        renderPage();
    }
    catch (error) {
        console.error(error);
        showError("Could not load users");
        getElement("user-count").textContent = "Could not load users";
        getElement("users-container").innerHTML = "";
    }
    finally {
        hideLoading();
    }
}
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Missing required element: ${id}`);
    }
    return element;
}
function renderPage() {
    const visibleUsers = currentUsers
        .filter((user) => user.login.toLowerCase().includes(searchText.toLowerCase()))
        .slice()
        .sort((first, second) => {
        const comparison = first.login.localeCompare(second.login);
        return sortDirection === "asc" ? comparison : -comparison;
    });
    getElement("filtered-count").textContent = `Users shown: ${visibleUsers.length}`;
    renderUsers(visibleUsers, handleUserClick);
    renderPagination(getCurrentPage(), currentUsers.length === USERS_PER_PAGE);
}
function handleUserClick(user) {
    sessionStorage.setItem("selectedUser", JSON.stringify(user));
    window.location.href = "./details.html";
}
getElement("next-btn").addEventListener("click", (event) => {
    event.preventDefault();
    if (currentUsers.length === USERS_PER_PAGE) {
        nextPage(true);
        void loadUsers(getCurrentPage());
    }
});
getElement("previous-btn").addEventListener("click", (event) => {
    event.preventDefault();
    previousPage();
    void loadUsers(getCurrentPage());
});
function handleSearchInput(event) {
    searchText = event.target.value;
    renderPage();
}
getElement("user-search").addEventListener("input", handleSearchInput);
getElement("sort-direction").addEventListener("change", (event) => {
    sortDirection = event.target.value;
    renderPage();
});
resetPage();
void loadUsers(getCurrentPage());
