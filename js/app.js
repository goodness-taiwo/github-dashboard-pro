// ============================================
// GITHUB DASHBOARD PRO
// ============================================

console.log('Script loaded');

// GitHub Language Colors
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C': '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'PHP': '#4F5D95',
    'Swift': '#F05138',
    'Kotlin': '#A97BFF',
    'Dart': '#00B4AB',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Shell': '#89e051',
    'Vue': '#41b883',
    'R': '#198CE7',
    'Scala': '#c22d40',
    'Objective-C': '#438eff',
    'Perl': '#0298c3',
    'Lua': '#000080',
    'Assembly': '#6E4C13',
    'Default': '#8b949e'
};

window.addEventListener('load', function() {
    console.log('Page loaded');
    
    const searchForm = document.getElementById('searchForm');
    const usernameInput = document.getElementById('usernameInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const exampleChips = document.querySelectorAll('.example-chip');
    
    // Get all landing page content
    const landingPageContent = document.querySelectorAll('.hero, .features-section, .how-it-works, .stats-bar, .footer');
    
    console.log('All elements found');
    
    // Form submit
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = usernameInput.value.trim();
            if (username) {
                searchUser(username);
            }
        });
    }
    
    // Example chips
    exampleChips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            const username = chip.textContent.trim();
            usernameInput.value = username;
            searchUser(username);
        });
    });
    
    // ============================================
    // SEARCH FUNCTION
    // ============================================
    
    function searchUser(username) {
        console.log('Searching for:', username);
        
        // Navigate to results page
        showResultsPage();
        
        // Show loading
        resultsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading ${username}'s profile...</p>
            </div>
        `;
        
        // Fetch data
        fetch(`https://api.github.com/users/${username}`)
            .then(function(response) {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('User not found');
                    }
                    throw new Error('API error');
                }
                return response.json();
            })
            .then(function(userData) {
                console.log('User data received');
                return fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(reposData) {
                        console.log('Repos data received');
                        displayResults(userData, reposData);
                    });
            })
            .catch(function(error) {
                console.error('Error:', error.message);
                showError(error.message);
            });
    }
    
    // ============================================
    // SHOW RESULTS PAGE
    // ============================================
    
    function showResultsPage() {
        // Hide all landing page content
        landingPageContent.forEach(function(section) {
            section.style.display = 'none';
        });
        
        // Show results container
        resultsContainer.style.display = 'block';
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    // ============================================
    // BACK TO LANDING PAGE
    // ============================================
    
    window.backToHome = function() {
        console.log('Returning to landing page');
        
        // Hide results
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        
        // Show all landing page content
        landingPageContent.forEach(function(section) {
            if (section.classList.contains('hero')) {
                section.style.display = 'flex';
            } else {
                section.style.display = 'block';
            }
        });
        
        // Clear input
        usernameInput.value = '';
        
        // Scroll to top
        window.scrollTo(0, 0);
    };




    // ============================================
// CALCULATE LANGUAGE STATISTICS
// ============================================

function calculateLanguages(repos) {
    console.log('Calculating language statistics');
    
    const languageCounts = {};
    let totalRepos = 0;
    
    // Count each language
    repos.forEach(function(repo) {
        if (repo.language) {
            totalRepos++;
            if (languageCounts[repo.language]) {
                languageCounts[repo.language]++;
            } else {
                languageCounts[repo.language] = 1;
            }
        }
    });
    
    // Convert to array with percentages
    const languagesArray = [];
    for (const language in languageCounts) {
        const count = languageCounts[language];
        const percentage = ((count / totalRepos) * 100).toFixed(1);
        languagesArray.push({
            name: language,
            count: count,
            percentage: parseFloat(percentage),
            color: LANGUAGE_COLORS[language] || LANGUAGE_COLORS['Default']
        });
    }
    
    // Sort by count (most used first)
    languagesArray.sort(function(a, b) {
        return b.count - a.count;
    });
    
    // Take top 6, group rest as "Other"
    if (languagesArray.length > 6) {
        const top6 = languagesArray.slice(0, 6);
        const others = languagesArray.slice(6);
        
        const otherCount = others.reduce(function(sum, lang) {
            return sum + lang.count;
        }, 0);
        
        const otherPercentage = ((otherCount / totalRepos) * 100).toFixed(1);
        
        if (otherCount > 0) {
            top6.push({
                name: 'Other',
                count: otherCount,
                percentage: parseFloat(otherPercentage),
                color: LANGUAGE_COLORS['Default']
            });
        }
        
        return top6;
    }
    
    return languagesArray;
}



// ============================================
// CREATE LANGUAGE CHART
// ============================================

function createLanguageChart(languages) {
    console.log('Creating language chart');
    
    const canvas = document.getElementById('languageChart');
    
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const labels = languages.map(function(lang) {
        return lang.name;
    });
    
    const data = languages.map(function(lang) {
        return lang.percentage;
    });
    
    const colors = languages.map(function(lang) {
        return lang.color;
    });
    
    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#161b22',
                    titleColor: '#f0f6fc',
                    bodyColor: '#8b949e',
                    borderColor: '#30363d',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
    
    console.log('Chart created successfully');
}

    
    // ============================================
    // DISPLAY RESULTS
    // ============================================
    
    function displayResults(user, repos) {
        console.log('Displaying results');
        
        const totalStars = repos.reduce(function(sum, repo) {
            return sum + repo.stargazers_count;
        }, 0);
        
        const totalForks = repos.reduce(function(sum, repo) {
            return sum + repo.forks_count;
        }, 0);
        
        // Calculate language statistics
        const languages = calculateLanguages(repos);
        
        resultsContainer.innerHTML = `
            <div class="results-page">
                <div class="results-content">
                    <!-- Back Button -->
                    <button onclick="backToHome()" class="back-button">
                        <span class="material-symbols-outlined">arrow_back</span>
                        <span>Back to Home</span>
                    </button>
    
                    <!-- Profile Section -->
                    <div class="profile-section">
                        <div class="profile-header">
                            <img src="${user.avatar_url}" alt="${user.name}" class="profile-avatar">
                            <div class="profile-info">
                                <h1 class="profile-name">${user.name || user.login}</h1>
                                <a href="${user.html_url}" target="_blank" class="profile-username">@${user.login}</a>
                                ${user.bio ? `<p class="profile-bio">${user.bio}</p>` : ''}
                                
                                <div class="profile-meta">
                                    ${user.location ? `<span class="meta-item"><span class="material-symbols-outlined">location_on</span>${user.location}</span>` : ''}
                                    ${user.company ? `<span class="meta-item"><span class="material-symbols-outlined">business</span>${user.company}</span>` : ''}
                                    ${user.blog ? `<a href="${user.blog.startsWith('http') ? user.blog : 'https://' + user.blog}" target="_blank" class="meta-item"><span class="material-symbols-outlined">link</span>${user.blog}</a>` : ''}
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
    
                    <!-- Language Breakdown Section -->
                    <div class="language-section">
                        <h2 class="section-title">
                            <span class="material-symbols-outlined">code</span>
                            Language Breakdown
                        </h2>
                        <div class="language-content">
                            <div class="chart-container">
                                <canvas id="languageChart"></canvas>
                            </div>
                            <div class="language-list">
                                ${languages.map(function(lang) {
                                    return `
                                        <div class="language-item">
                                            <div class="language-color" style="background-color: ${lang.color};"></div>
                                            <div class="language-details">
                                                <div class="language-name">${lang.name}</div>
                                                <div class="language-stats">${lang.count} ${lang.count === 1 ? 'repo' : 'repos'} • ${lang.percentage}%</div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
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
                            ${repos.map(function(repo) {
                                return `
                                    <div class="repo-card">
                                        <div class="repo-header">
                                            <h3 class="repo-name">
                                                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                                            </h3>
                                            ${repo.language ? `<span class="repo-language" style="background-color: ${LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS['Default']}15; color: ${LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS['Default']};">${repo.language}</span>` : ''}
                                        </div>
                                        <p class="repo-description">${repo.description || 'No description provided'}</p>
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
                                                ${getTimeAgo(repo.updated_at)}
                                            </span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Create the chart after HTML is rendered
        setTimeout(function() {
            createLanguageChart(languages);
        }, 100);
        
        console.log('Results displayed');
    }
    
    // ============================================
    // SHOW ERROR
    // ============================================
    
    function showError(message) {
        resultsContainer.innerHTML = `
            <div class="error-container">
                <span class="material-symbols-outlined error-icon">error</span>
                <h2>Oops!</h2>
                <p>${message}</p>
                <button onclick="backToHome()" class="back-button">
                    <span class="material-symbols-outlined">arrow_back</span>
                    <span>Back to Home</span>
                </button>
            </div>
        `;
    }
    
    // ============================================
    // UTILITY
    // ============================================
    
    function getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'today';
        if (days === 1) return 'yesterday';
        if (days < 7) return days + ' days ago';
        if (days < 30) return Math.floor(days / 7) + ' weeks ago';
        if (days < 365) return Math.floor(days / 30) + ' months ago';
        return Math.floor(days / 365) + ' years ago';
    }
    
    console.log('Ready');
});