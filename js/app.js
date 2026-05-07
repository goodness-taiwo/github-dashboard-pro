const searchForm = document.getElementById('searchForm');
const usernameInput = document.getElementById('usernameInput');
const resultsContainer = document.getElementById('resultsContainer');
const heroSection = document.getElementById('heroSection');

// Exaple chip buttons
const exampleChips = document.querySelectorAll('.example-chip');


// Event listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    if (username) {
        fetchGitHubData(username);
    } 
})

// Listen for example chip clicks
exampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const username = chip.textContent.trim();
        usernameInput.value = username;
        fetchGitHubData(username);
    });
});

// Fetch GitHub data
async function fetchGitHubData(username) {
    showLoading();
    try {
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        if (!userResponse.ok) {
            if (userResponse.status === 404) {
                showError('User not found! Try a different username.');
                return;
            }
            throw new Error('Failed to fetch user data')
        }
        const userData = await userResponse.json();

        // Fetch user repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        const reposData = await reposResponse.json();

        // Display the results
        displayResults(userData, reposData);
    } catch (error) {
        console.error('Error:', error)
        showError('An error occurred while fetching data. Please try again.');
    }
}





// ============================================
// DISPLAY RESULTS
// ============================================

function displayResults(userData, reposData) {
    heroSection.style.display = 'none';
    resultsContainer.style.display = 'block';

    // calculate total stars from all repositories
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

    // calculate total forks from all repositories
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    
    // build the html
    resultsContainer.innerHTML = `
    <!-- Back Button -->
    <div class="back-button-container">
        <button class="back-button" onclick="resetSearch()">
            <span class="material-symbols-outlined">arrow_back</span>
            <span>New Search</span>
        </button>
    </div>

    <!-- Profile Section -->
    <div class="profile-section">
        <div class="profile-header">
            <img src="${user.avatar_url}" alt="${user.name}" class="profile-avatar">
            <div class="profile-info">
                <h1 class="profile-name">${user.name || user.login}</h1>
                <a href="${user.html_url}" target="_blank" class="profile-username">@${user.login}</a>
                ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
                
                <div class="profile-meta">
                    ${user.location ? `
                        <span class="meta-item">
                            <span class="material-symbols-outlined">location_on</span>
                            ${user.location}
                        </span>
                    ` : ''}
                    ${user.company ? `
                        <span class="meta-item">
                            <span class="material-symbols-outlined">business</span>
                            ${user.company}
                        </span>
                    ` : ''}
                    ${user.blog ? `
                        <a href="${user.blog}" target="_blank" class="meta-item">
                            <span class="material-symbols-outlined">link</span>
                            ${user.blog}
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <span class="material-symbols-outlined stat-icon">folder</span>
                <div class="stat-value">${user.public_repos}</div>
                <div class="stat-label">Repositories</div>
            </div>
            <div class="stat-card">
                <span class="material-symbols-outlined stat-icon">star</span>
                <div class="stat-value">${totalStars}</div>
                <div class="stat-label">Total Stars</div>
            </div>
            <div class="stat-card">
                <span class="material-symbols-outlined stat-icon">group</span>
                <div class="stat-value">${user.followers.toLocaleString()}</div>
                <div class="stat-label">Followers</div>
            </div>
            <div class="stat-card">
                <span class="material-symbols-outlined stat-icon">fork_right</span>
                <div class="stat-value">${totalForks}</div>
                <div class="stat-label">Total Forks</div>
            </div>
        </div>
    </div>

    <!-- Repositories Section -->
    <div class="repositories-section">
        <h2 class="section-title">
            <span class="material-symbols-outlined">folder_open</span>
            Recent Repositories
        </h2>
        <div class="repos-grid">
            ${repos.map(repo => `
                <div class="repo-card">
                    <div class="repo-header">
                        <h3 class="repo-name">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                        </h3>
                        ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                    </div>
                    ${repo.description ? `<p class="repo-description">${repo.description}</p>` : '<p class="repo-description">No description provided</p>'}
                    <div class="repo-stats">
                        <span class="repo-stat">
                            <span class="material-symbols-outlined">star</span>
                            ${repo.stargazers_count}
                        </span>
                        <span class="repo-stat">
                            <span class="material-symbols-outlined">fork_right</span>
                            ${repo.forks_count}
                        </span>
                        <span class="repo-stat">
                            <span class="material-symbols-outlined">update</span>
                            ${formatDate(repo.updated_at)}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
`;

// Scroll to results
resultsContainer.scrollIntoView({ behavior: 'smooth' });
    
}

// ============================================
// ERROR STATE
// ============================================

function showError(message) {
    heroSection.style.display = 'none';
    resultsContainer.style.display = 'block';
    resultsContainer.innerHTML = `
        <div class="error-state">
            <span class="material-symbols-outlined error-icon">error</span>
            <h2>Oops!</h2>
            <p>${message}</p>
            <button class="back-button" onclick="resetSearch()">
                <span class="material-symbols-outlined">arrow_back</span>
                <span>Try Again</span>
            </button>
        </div>
    `;
}

// ============================================
// RESET SEARCH
// ============================================

function resetSearch() {
    resultsContainer.style.display = 'none';
    heroSection.style.display = 'flex';
    usernameInput.value = '';
    usernameInput.focus();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}