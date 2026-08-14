export function showLoading() {
    const loadingEl = document.getElementById("loading-skeleton");
    if (loadingEl) {
        loadingEl.classList.add("show");
    }
    hideError();
}

export function hideLoading() {
    const loadingEl = document.getElementById("loading-skeleton");
    if (loadingEl) {
        loadingEl.classList.remove("show");
    }
}

export function showError(message) {
    hideLoading();
    const errorEl = document.getElementById("error-message");
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add("show");
    }
}

export function hideError() {
    const errorEl = document.getElementById("error-message");
    if (errorEl) {
        errorEl.classList.remove("show");
    }
}

export function renderUsers(users, onUserClick) {
    const container = document.getElementById("users-container");

    container.innerHTML = "";

    if (users.length === 0) {
        container.innerHTML = '<div class="empty-message">No users found</div>';
        return;
    }

    users.forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <img src="${user.avatar}" alt="${user.login}" />
            <strong>${user.login}</strong>
            <span>ID: ${user.id}</span>
            <a href="#" style="display:block; margin-top: 10px; color: #3498db; text-decoration: none; font-weight: 600;">View Details →</a>
        `;

        card.addEventListener("click", (e) => {
            e.preventDefault();
            if (onUserClick) {
                onUserClick(user);
            }
        });

        container.appendChild(card);
    });
}

export function renderPagination(currentPage, totalPages) {
    const pageInfo = document.getElementById("page-info");
    const previousBtn = document.getElementById("previous-btn");
    const nextBtn = document.getElementById("next-btn");

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    previousBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Details page rendering functions
export function showDetailsLoading() {
    const loadingEl = document.getElementById("details-loading");
    if (loadingEl) {
        loadingEl.classList.add("show");
    }
}

export function hideDetailsLoading() {
    const loadingEl = document.getElementById("details-loading");
    if (loadingEl) {
        loadingEl.classList.remove("show");
    }
}

export function showDetailsError(message) {
    hideDetailsLoading();
    const errorEl = document.getElementById("details-error");
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add("show");
    }
}

export function hideDetailsError() {
    const errorEl = document.getElementById("details-error");
    if (errorEl) {
        errorEl.classList.remove("show");
    }
}

export function renderUserDetails(user) {
    const container = document.getElementById("user-details-header");
    if (!container) return;

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
    const container = document.getElementById("followers-container");
    if (!container) return;

    if (!followers || followers.length === 0) {
        container.innerHTML = '<div class="empty-message">No followers found</div>';
        return;
    }

    container.innerHTML = followers.map(follower => `
        <div class="item-card">
            <img src="${follower.avatar}" alt="${follower.login}" />
            <h3>${follower.login}</h3>
            <p>ID: ${follower.id}</p>
            <a href="${follower.url || '#'}" target="_blank">View Profile</a>
        </div>
    `).join('');
}

export function renderRepositories(repos) {
    const container = document.getElementById("repos-container");
    if (!container) return;

    if (!repos || repos.length === 0) {
        container.innerHTML = '<div class="empty-message">No repositories found</div>';
        return;
    }

    container.innerHTML = repos.map(repo => `
        <div class="item-card">
            <h3>${repo.name}</h3>
            <p>${repo.description}</p>
            <p><strong>Language:</strong> ${repo.language}</p>
            <p><strong>⭐ Stars:</strong> ${repo.stars}</p>
            <a href="${repo.url || '#'}" target="_blank">View Repository</a>
        </div>
    `).join('');
}