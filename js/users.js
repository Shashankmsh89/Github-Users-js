export const USERS_PER_PAGE = 10;
let currentPage = 1;
export function getCurrentPage() {
    return currentPage;
}
export function nextPage(hasNextPage) {
    if (hasNextPage) {
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
