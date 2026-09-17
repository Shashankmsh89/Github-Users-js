export const USERS_PER_PAGE = 10;
let currentPage = 1;

export function getCurrentPage(): number {
    return currentPage;
}

export function nextPage(hasNextPage: boolean): void {
    if (hasNextPage) {
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