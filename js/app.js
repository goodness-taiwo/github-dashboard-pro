// ============================================
// GITHUB DASHBOARD PRO - USING EXISTING NAV
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

// Global state
let currentUser = null;
let currentRepos = [];
let allRepos = [];
let currentPage = 'dashboard';
let currentLanguageFilter = 'All';
let currentSort = 'updated';
let currentSearch = '';

window.addEventListener('load', function() {
    console.log('Page loaded');
    
    const searchForm = document.getElementById('searchForm');
    const usernameInput = document.getElementById('usernameInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const exampleChips = document.querySelectorAll('.example-chip');
    
    // Get all landing page content
    const landingPageContent = document.querySelectorAll('.hero, .features-section, .how-it-works, .stats-bar, .footer');
    
    // Get navbar links
    const navLinks = document.querySelectorAll('.nav-link');
    
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
    
    // Setup navbar link clicks
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (href === '#dashboard') {
                showDashboard();
            } else if (href === '#repositories') {
                showRepositories();
            } else if (href === '#insights') {
                showInsights();
            }
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
        
        // Fetch user data
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
                currentUser = userData;
                
                // Fetch ALL repositories
                return fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(reposData) {
                        console.log('Repos data received:', reposData.length, 'repos');
                        allRepos = reposData;
                        currentRepos = reposData.slice(0, 10);
                        showDashboard();
                    });
            })
            .catch(function(error) {
                console.error('Error:', error.message);
                showError(error.message);
            });
    }
    
    // ============================================
    // PAGE NAVIGATION
    // ============================================
    
    window.showDashboard = function() {
        currentPage = 'dashboard';
        updateNavActive();
        displayDashboard();
    };
    
    window.showRepositories = function() {
        currentPage = 'repositories';
        updateNavActive();
        displayRepositories();
    };
    
    window.showInsights = function() {
        currentPage = 'insights';
        updateNavActive();
        displayInsights();
    };
    
    function updateNavActive() {
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#dashboard' && currentPage === 'dashboard') {
                link.classList.add('active');
            } else if (href === '#repositories' && currentPage === 'repositories') {
                link.classList.add('active');
            } else if (href === '#insights' && currentPage === 'insights') {
                link.classList.add('active');
            }
        });
    }
    
    // ============================================
    // SHOW RESULTS PAGE
    // ============================================
    
    function showResultsPage() {
        landingPageContent.forEach(function(section) {
            section.style.display = 'none';
        });
        resultsContainer.style.display = 'block';
        window.scrollTo(0, 0);
    }
    
    // ============================================
    // BACK TO HOME
    // ============================================
    
    window.backToHome = function() {
        console.log('Returning to landing page');
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        landingPageContent.forEach(function(section) {
            if (section.classList.contains('hero')) {
                section.style.display = 'flex';
            } else {
                section.style.display = 'block';
            }
        });
        usernameInput.value = '';
        window.scrollTo(0, 0);
        
        // Reset state
        currentUser = null;
        currentRepos = [];
        allRepos = [];
        currentPage = 'dashboard';
        
        updateNavActive();
    };
    
    // ============================================
    // CALCULATE LANGUAGE STATISTICS
    // ============================================
    
    function calculateLanguages(repos) {
        console.log('Calculating language statistics');
        
        const languageCounts = {};
        let totalRepos = 0;
        
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
        
        languagesArray.sort(function(a, b) {
            return b.count - a.count;
        });
        
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
    // DISPLAY DASHBOARD
    // ============================================
    
    function displayDashboard() {
        console.log('Displaying dashboard');
        
        const totalStars = allRepos.reduce(function(sum, repo) {
            return sum + repo.stargazers_count;
        }, 0);
        
        const totalForks = allRepos.reduce(function(sum, repo) {
            return sum + repo.forks_count;
        }, 0);
        
        const totalWatchers = allRepos.reduce(function(sum, repo) {
            return sum + repo.watchers_count;
        }, 0);
        
        const totalIssues = allRepos.reduce(function(sum, repo) {
            return sum + repo.open_issues_count;
        }, 0);
        
        const createdDate = new Date(currentUser.created_at);
        const now = new Date();
        const accountAge = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24 * 365));
        
        const languages = calculateLanguages(allRepos);
        const topLanguage = languages.length > 0 ? languages[0].name : 'None';
        
        resultsContainer.innerHTML = `
            <div class="results-page">
                <div class="results-content">
                    <button onclick="backToHome()" class="back-button">
                        <span class="material-symbols-outlined">arrow_back</span>
                        <span>Back to Home</span>
                    </button>

                    <div class="profile-section">
                        <div class="profile-header">
                            <img src="${currentUser.avatar_url}" alt="${currentUser.name}" class="profile-avatar">
                            <div class="profile-info">
                                <h1 class="profile-name">${currentUser.name || currentUser.login}</h1>
                                <a href="${currentUser.html_url}" target="_blank" class="profile-username">@${currentUser.login}</a>
                                ${currentUser.bio ? `<p class="profile-bio">${currentUser.bio}</p>` : ''}
                                
                                <div class="profile-meta">
                                    ${currentUser.location ? `<span class="meta-item"><span class="material-symbols-outlined">location_on</span>${currentUser.location}</span>` : ''}
                                    ${currentUser.company ? `<span class="meta-item"><span class="material-symbols-outlined">business</span>${currentUser.company}</span>` : ''}
                                    ${currentUser.blog ? `<a href="${currentUser.blog.startsWith('http') ? currentUser.blog : 'https://' + currentUser.blog}" target="_blank" class="meta-item"><span class="material-symbols-outlined">link</span>${currentUser.blog}</a>` : ''}
                                </div>
                            </div>
                        </div>

                        <div class="stats-grid stats-grid-8">
                            <div class="stat-card">
                                <span class="material-symbols-outlined stat-icon blue">folder</span>
                                <div class="stat-value">${currentUser.public_repos}</div>
                                <div class="stat-label">Repositories</div>
                            </div>
                            <div class="stat-card">
                                <span class="material-symbols-outlined stat-icon yellow">star</span>
                                <div class="stat-value">${totalStars.toLocaleString()}</div>
                                <div class="stat-label">Total Stars</div>
                            </div>
                            <div class="stat-card">
                                <span class="material-symbols-outlined stat-icon purple">group</span>
                                <div class="stat-value">${currentUser.followers.toLocaleString()}</div>
                                <div class="stat-label">Followers</div>
                            </div>
                            <div class="stat-card">
                                <span class="material-symbols-outlined stat-icon cyan">fork_right</span>
                                <div class="stat-value">${totalForks.toLocaleString()}</div>
                                <div class="stat-label">Total Forks</div>
                            </div>
                            <div class="stat-card">
                                <span class="material-symbols-outlined stat-icon green">visibility</span>
                                <div class="stat-value">${totalWatchers.toLocaleString()}</div>
                                <div class="stat-label">Watchers</div>
                            </div>
                            <div class="stat-card">
                                <span class="material-symbols-outlined stat-icon orange">bug_report</span>
                                <div class="stat-value">${totalIssues.toLocaleString()}</div>
                                <div class="stat-label">Open Issues</div>
                            </div>
                            <div class="stat-card">
                                <span class="material-symbols-outlined stat-icon pink">schedule</span>
                                <div class="stat-value">${accountAge}</div>
                                <div class="stat-label">${accountAge === 1 ? 'Year' : 'Years'} on GitHub</div>
                            </div>
                            <div class="stat-card">
                                <span class="material-symbols-outlined stat-icon blue">code</span>
                                <div class="stat-value stat-value-small">${topLanguage}</div>
                                <div class="stat-label">Top Language</div>
                            </div>
                        </div>
                    </div>

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

                    <div class="repositories-section">
                        <h2 class="section-title">
                            <span class="material-symbols-outlined">folder_open</span>
                            Recent Repositories
                            <button onclick="showRepositories()" class="view-all-btn">
                                View All ${allRepos.length} →
                            </button>
                        </h2>
                        <div class="repos-grid">
                            ${currentRepos.map(function(repo) {
                                return createRepoCard(repo);
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(function() {
            createLanguageChart(languages);
        }, 100);
        
        console.log('Dashboard displayed');
    }
    
    // ============================================
    // DISPLAY REPOSITORIES PAGE
    // ============================================
    
    function displayRepositories() {
        console.log('Displaying repositories page');
        
        const uniqueLanguages = getUniqueLanguages(allRepos);
        
        resultsContainer.innerHTML = `
            <div class="results-page">
                <div class="results-content">
                    <button onclick="backToHome()" class="back-button">
                        <span class="material-symbols-outlined">arrow_back</span>
                        <span>Back to Home</span>
                    </button>

                    <div class="repo-controls">
                        <div class="repo-header">
                            <h1>All Repositories</h1>
                            <p>${allRepos.length} total repositories</p>
                        </div>

                        <div class="search-box">
                            <span class="material-symbols-outlined">search</span>
                            <input type="text" id="repoSearch" placeholder="Search repositories..." />
                        </div>

                        <div class="filter-sort-container">
                            <div class="language-filters">
                                <button class="filter-btn active" data-language="All">All</button>
                                ${uniqueLanguages.map(function(lang) {
                                    return `<button class="filter-btn" data-language="${lang}">${lang}</button>`;
                                }).join('')}
                            </div>

                            <div class="sort-dropdown">
                                <label>Sort by:</label>
                                <select id="sortSelect">
                                    <option value="updated">Recently Updated</option>
                                    <option value="stars">Most Stars</option>
                                    <option value="forks">Most Forks</option>
                                    <option value="name">Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div id="repoGrid" class="repos-grid">
                        ${renderFilteredRepos()}
                    </div>
                </div>
            </div>
        `;
        
        setupRepositoryFilters();
        
        console.log('Repositories page displayed');
    }
    
    // ============================================
    // DISPLAY INSIGHTS PAGE
    // ============================================
    
    function displayInsights() {
        console.log('Displaying insights page');
        
        const languages = calculateLanguages(allRepos);
        
        const totalStars = allRepos.reduce(function(sum, repo) {
            return sum + repo.stargazers_count;
        }, 0);
        
        const totalForks = allRepos.reduce(function(sum, repo) {
            return sum + repo.forks_count;
        }, 0);
        
        resultsContainer.innerHTML = `
            <div class="results-page">
                <div class="results-content">
                    <button onclick="backToHome()" class="back-button">
                        <span class="material-symbols-outlined">arrow_back</span>
                        <span>Back to Home</span>
                    </button>
                    
                    <div class="page-header">
                        <h1>
                            <span class="material-symbols-outlined">insights</span>
                            Insights & Analytics
                        </h1>
                        <p>Deep dive into coding patterns and statistics</p>
                    </div>
                    
                    <div class="insights-stats-grid">
                        <div class="insight-stat-card">
                            <span class="material-symbols-outlined stat-icon-large blue">folder</span>
                            <div class="stat-info">
                                <div class="stat-value">${allRepos.length}</div>
                                <div class="stat-label">Total Repositories</div>
                            </div>
                        </div>
                        <div class="insight-stat-card">
                            <span class="material-symbols-outlined stat-icon-large yellow">star</span>
                            <div class="stat-info">
                                <div class="stat-value">${totalStars.toLocaleString()}</div>
                                <div class="stat-label">Total Stars</div>
                            </div>
                        </div>
                        <div class="insight-stat-card">
                            <span class="material-symbols-outlined stat-icon-large cyan">fork_right</span>
                            <div class="stat-info">
                                <div class="stat-value">${totalForks.toLocaleString()}</div>
                                <div class="stat-label">Total Forks</div>
                            </div>
                        </div>
                        <div class="insight-stat-card">
                            <span class="material-symbols-outlined stat-icon-large purple">code</span>
                            <div class="stat-info">
                                <div class="stat-value">${languages.length}</div>
                                <div class="stat-label">Languages Used</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="insight-section">
                        <h2 class="section-title">
                            <span class="material-symbols-outlined">bar_chart</span>
                            Language Distribution
                        </h2>
                        <div class="bar-chart-container">
                            <canvas id="languageBarChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(function() {
            createLanguageBarChart(languages);
        }, 100);
        
        console.log('Insights page displayed');
    }
    
    // ============================================
    // CREATE LANGUAGE BAR CHART
    // ============================================
    
    function createLanguageBarChart(languages) {
        console.log('Creating language bar chart');
        
        const canvas = document.getElementById('languageBarChart');
        
        if (!canvas) {
            console.error('Bar chart canvas not found');
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
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Usage Percentage',
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
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
                                const lang = languages[context.dataIndex];
                                return lang.name + ': ' + lang.percentage + '% (' + lang.count + ' repos)';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#30363d'
                        },
                        ticks: {
                            color: '#8b949e',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#8b949e',
                            font: {
                                size: 14,
                                weight: '500'
                            }
                        }
                    }
                }
            }
        });
        
        console.log('Bar chart created successfully');
    }
    
    // ============================================
    // REPOSITORY FILTERING & SORTING
    // ============================================
    
    function setupRepositoryFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentLanguageFilter = btn.getAttribute('data-language');
                updateRepoDisplay();
            });
        });
        
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                currentSort = sortSelect.value;
                updateRepoDisplay();
            });
        }
        
        const searchInput = document.getElementById('repoSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                currentSearch = searchInput.value;
                updateRepoDisplay();
            });
        }
    }
    
    function updateRepoDisplay() {
        const repoGrid = document.getElementById('repoGrid');
        if (repoGrid) {
            repoGrid.innerHTML = renderFilteredRepos();
        }
    }
    
    function renderFilteredRepos() {
        let filtered = allRepos;
        
        if (currentLanguageFilter !== 'All') {
            filtered = filtered.filter(function(repo) {
                return repo.language === currentLanguageFilter;
            });
        }
        
        if (currentSearch) {
            filtered = filtered.filter(function(repo) {
                return repo.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                       (repo.description && repo.description.toLowerCase().includes(currentSearch.toLowerCase()));
            });
        }
        
        filtered = sortRepos(filtered, currentSort);
        
        if (filtered.length === 0) {
            return `
                <div class="no-results">
                    <span class="material-symbols-outlined">search_off</span>
                    <h3>No repositories found</h3>
                    <p>Try adjusting your filters or search term</p>
                </div>
            `;
        }
        
        return filtered.map(function(repo) {
            return createRepoCard(repo);
        }).join('');
    }
    
    function sortRepos(repos, sortBy) {
        const sorted = [...repos];
        
        switch(sortBy) {
            case 'stars':
                sorted.sort(function(a, b) {
                    return b.stargazers_count - a.stargazers_count;
                });
                break;
            case 'forks':
                sorted.sort(function(a, b) {
                    return b.forks_count - a.forks_count;
                });
                break;
            case 'name':
                sorted.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });
                break;
            case 'updated':
            default:
                sorted.sort(function(a, b) {
                    return new Date(b.updated_at) - new Date(a.updated_at);
                });
        }
        
        return sorted;
    }
    
    function getUniqueLanguages(repos) {
        const languages = new Set();
        repos.forEach(function(repo) {
            if (repo.language) {
                languages.add(repo.language);
            }
        });
        return Array.from(languages).sort();
    }
    
    // ============================================
    // CREATE REPO CARD
    // ============================================
    
    function createRepoCard(repo) {
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