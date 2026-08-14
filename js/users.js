const USERS_PER_PAGE = 5;

let currentPage = 1;

export function getPaginatedUsers(users) {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;

    return users.slice(start, end);
}

export function getCurrentPage() {
    return currentPage;
}

export function getTotalPages(users) {
    return Math.ceil(users.length / USERS_PER_PAGE);
}

export function nextPage(users) {
    const totalPages = getTotalPages(users);

    if (currentPage < totalPages) {
        currentPage++;
    }
}

export function previousPage() {
    if (currentPage > 1) {
        currentPage--;
    }
}

export function resetPage() {
    currentPage = 1;
}

export function filterUsersByLoginLength(users, minimumLength) {
    return users.filter(user => user.login.length >= minimumLength);
}