import { ApiService } from "./api.js";
import { renderUsers, renderPagination, showLoading, hideLoading, showError } from "./ui.js";
import { filterUsersByLoginLength, resetPage, getPaginatedUsers, getCurrentPage, getTotalPages, nextPage, previousPage } from "./users.js";
let allUsers = [];
let filteredUsers = [];
const apiService = new ApiService();
async function loadUsers() {
    showLoading();
    try {
        const result = await apiService.fetchUsers();
        if (!result.success) {
            showError(result.error);
            getElement("user-count").textContent = result.error;
            getElement("users-container").innerHTML = "";
            return;
        }
        allUsers = result.data;
        filteredUsers = filterUsersByLoginLength(allUsers, 4);
        getElement("user-count").textContent = `Users fetched: ${allUsers.length}`;
        getElement("filtered-count").textContent = `Users remaining: ${filteredUsers.length}`;
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
    renderUsers(getPaginatedUsers(filteredUsers), handleUserClick);
    renderPagination(getCurrentPage(), getTotalPages(filteredUsers));
}
function handleUserClick(user) {
    sessionStorage.setItem("selectedUser", JSON.stringify(user));
    window.location.href = "./details.html";
}
getElement("next-btn").addEventListener("click", (event) => {
    event.preventDefault();
    nextPage(filteredUsers);
    renderPage();
});
getElement("previous-btn").addEventListener("click", (event) => {
    event.preventDefault();
    previousPage();
    renderPage();
});
getElement("apply-filter").addEventListener("click", (event) => {
    event.preventDefault();
    const minimumLength = Number(getElement("login-length").value);
    filteredUsers = filterUsersByLoginLength(allUsers, minimumLength);
    resetPage();
    getElement("filtered-count").textContent = `Users remaining: ${filteredUsers.length}`;
    renderPage();
});
loadUsers();
