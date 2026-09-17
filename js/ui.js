function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Missing required element: ${id}`);
    }
    return element;
}
export function showLoading() {
    getElement("loading-skeleton").classList.add("show");
    hideError();
}
export function hideLoading() {
    getElement("loading-skeleton").classList.remove("show");
}
export function showError(message) {
    hideLoading();
    const errorElement = getElement("error-message");
    errorElement.textContent = message;
    errorElement.classList.add("show");
}
export function hideError() {
    getElement("error-message").classList.remove("show");
}
export function renderUsers(users, onUserClick) {
    const container = getElement("users-container");
    container.innerHTML = "";
    if (users.length === 0) {
        container.innerHTML = '<div class="empty-message">No users found</div>';
        return;
    }
    users.forEach((user) => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.style.cursor = "pointer";
        card.innerHTML = `
            <img src="${user.avatar}" alt="${user.login}" />
            <strong>${user.login}</strong>
            <span>ID: ${user.id}</span>
            <a href="#" style="display:block; margin-top: 10px; color: #3498db; text-decoration: none; font-weight: 600;">View Details →</a>
        `;
        card.addEventListener("click", (event) => {
            event.preventDefault();
            onUserClick(user);
        });
        container.appendChild(card);
    });
}
export function renderPagination(currentPage, hasNextPage) {
    getElement("page-info").textContent = `Page ${currentPage}`;
    getElement("previous-btn").disabled = currentPage === 1;
    getElement("next-btn").disabled = !hasNextPage;
}
export function showDetailsLoading() {
    getElement("details-loading").classList.add("show");
}
export function hideDetailsLoading() {
    getElement("details-loading").classList.remove("show");
}
export function showDetailsError(message) {
    const errorElement = getElement("details-error");
    errorElement.textContent = message;
    errorElement.classList.add("show");
}
export function hideDetailsError() {
    getElement("details-error").classList.remove("show");
}
export function renderUserDetails(user) {
    const container = getElement("user-details-header");
    const githubProfileUrl = `https://github.com/${user.login}`;
    container.innerHTML = `
        <img src="${user.avatar}" alt="${user.login}" />
        <div class="details-info">
            <h1>${user.login}</h1>
            <p><strong>ID:</strong> ${user.id}</p>
            <p><a href="${githubProfileUrl}" target="_blank" style="color: #3498db; text-decoration: none;">View on GitHub →</a></p>
        </div>
    `;
}
export function renderFollowers(followers) {
    const container = getElement("followers-container");
    if (followers.length === 0) {
        container.innerHTML = '<div class="empty-message">No followers found</div>';
        return;
    }
    container.innerHTML = followers.map((follower) => `
        <div class="item-card">
            <img src="${follower.avatar}" alt="${follower.login}" />
            <h3>${follower.login}</h3>
            <p>ID: ${follower.id}</p>
            <a href="${follower.url}" target="_blank">View Profile</a>
        </div>
    `).join("");
}
export function renderRepositories(repositories) {
    const container = getElement("repos-container");
    if (repositories.length === 0) {
        container.innerHTML = '<div class="empty-message">No repositories found</div>';
        return;
    }
    container.innerHTML = repositories.map((repository) => `
        <div class="item-card">
            <h3>${repository.name}</h3>
            <p>${repository.description}</p>
            <p><strong>Language:</strong> ${repository.language}</p>
            <p><strong>⭐ Stars:</strong> ${repository.stars}</p>
            <a href="${repository.url}" target="_blank">View Repository</a>
        </div>
    `).join("");
}
export function renderRepositorySearchResults(repositories) {
    const container = getElement("repository-results");
    if (repositories.length === 0) {
        container.innerHTML = '<div class="empty-message">No repositories found.</div>';
        return;
    }
    container.innerHTML = repositories.map((repository) => `
        <div class="item-card">
            <h3>${repository.name}</h3>
            <p>${repository.description ?? "No description"}</p>
            <p><strong>Owner:</strong> ${repository.ownerLogin}</p>
            <p><strong>Language:</strong> ${repository.language ?? "Unknown"}</p>
            <p><strong>Stars:</strong> ${repository.stars}</p>
            <a href="${repository.url}" target="_blank" rel="noreferrer">View Repository</a>
        </div>
    `).join("");
}
export function showRepositoryLoading() {
    getElement("repository-loading").classList.add("show");
}
export function hideRepositoryLoading() {
    getElement("repository-loading").classList.remove("show");
}
export function renderRepositoryStatus(message) {
    getElement("repository-status").textContent = message;
}
export function renderRepositoryPagination(currentPage, totalPages) {
    getElement("repository-page-info").textContent = `Page ${currentPage} of ${totalPages}`;
    getElement("repository-previous-btn").disabled = currentPage === 1;
    getElement("repository-next-btn").disabled = currentPage >= totalPages;
}
