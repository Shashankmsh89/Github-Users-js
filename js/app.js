import { fetchUsers } from "./api.js";
import { renderUsers, renderPagination, showLoading, hideLoading, showError } from "./ui.js";
import { filterUsersByLoginLength } from "./users.js";

import {
    getPaginatedUsers,
    getCurrentPage,
    getTotalPages,
    nextPage,
    previousPage
} from "./users.js";

let allUsers = [];
let filteredUsers = [];

allUsers = await fetchUsers();

filteredUsers = filterUsersByLoginLength(allUsers, 4);

document.getElementById("user-count").textContent =
    `Users fetched: ${allUsers.length}`;

document.getElementById("filtered-count").textContent =
    `Users remaining: ${filteredUsers.length}`;

renderPage();

async function loadUsers() {
    try {
        showLoading();

        allUsers = await fetchUsers();

        hideLoading();

        document.getElementById("user-count").textContent =
            `Users fetched: ${allUsers.length}`;

        renderPage();

    } catch (error) {
        console.error(error);

        hideLoading();

        showError("Could not load users");

        document.getElementById("user-count").textContent =
            "Could not load users";

        document.getElementById("users-container").innerHTML = "";
    }
}

function renderPage() {
    const pageUsers = getPaginatedUsers(filteredUsers);

    renderUsers(pageUsers, handleUserClick);

    renderPagination(
        getCurrentPage(),
        getTotalPages(filteredUsers)
    );
}

function handleUserClick(user) {
    // Store the selected user in sessionStorage
    sessionStorage.setItem('selectedUser', JSON.stringify(user));
    // Navigate to details page
    window.location.href = './details.html';
}

document.getElementById("next-btn").addEventListener("click", () => {
    nextPage(allUsers);
    renderPage();
});

document.getElementById("previous-btn").addEventListener("click", () => {
    previousPage();
    renderPage();
});

document.getElementById("apply-filter").addEventListener("click", () => {
    const minimumLength = Number(
        document.getElementById("login-length").value
    );

    filteredUsers = filterUsersByLoginLength(
        allUsers,
        minimumLength
    );

    document.getElementById("filtered-count").textContent =
        `Users remaining: ${filteredUsers.length}`;

    renderPage();
});

loadUsers();