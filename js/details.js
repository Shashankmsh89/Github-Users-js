import { fetchUserFollowers, fetchUserRepos } from "./api.js";
import {
    showDetailsLoading,
    hideDetailsLoading,
    showDetailsError,
    hideDetailsError,
    renderUserDetails,
    renderFollowers,
    renderRepositories
} from "./ui.js";

// Get the selected user from sessionStorage
const selectedUserJson = sessionStorage.getItem('selectedUser');
if (!selectedUserJson) {
    window.location.href = './index.html';
}

const selectedUser = JSON.parse(selectedUserJson);

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

async function initializePage() {
    try {
        // Render user header immediately
        renderUserDetails(selectedUser);

        // Show loading state
        showDetailsLoading();
        hideDetailsError();

        // Fetch followers and repos in parallel using Promise.all()
        const [followers, repos] = await Promise.all([
            fetchUserFollowers(selectedUser.followers_url),
            fetchUserRepos(selectedUser.repos_url)
        ]);

        // Hide loading state
        hideDetailsLoading();

        // Render followers and repositories
        renderFollowers(followers);
        renderRepositories(repos);

    } catch (error) {
        console.error('Error loading user details:', error);
        hideDetailsLoading();
        showDetailsError('Could not load user details. Please try again.');
    }
}

// Back button handler
document.getElementById('back-btn').addEventListener('click', () => {
    sessionStorage.removeItem('selectedUser');
    window.location.href = './index.html';
});
