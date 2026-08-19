import { UserListItem } from "./api.js";

const USERS_PER_PAGE = 5;
let currentPage = 1;

export function getPaginatedUsers(users: UserListItem[]): UserListItem[] {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return users.slice(start, start + USERS_PER_PAGE);
}

export function getCurrentPage(): number {
    return currentPage;
}

export function getTotalPages(users: UserListItem[]): number {
    return Math.ceil(users.length / USERS_PER_PAGE);
}

export function nextPage(users: UserListItem[]): void {
    const totalPages = getTotalPages(users);
    if (currentPage < totalPages) {
        currentPage++;
    }
}

export function previousPage(): void {
    if (currentPage > 1) {
        currentPage--;
    }
}

export function resetPage(): void {
    currentPage = 1;
}

export function filterUsersByLoginLength(
    users: UserListItem[],
    minimumLength: number
): UserListItem[] {
    return users.filter((user) => user.login.length >= minimumLength);
}