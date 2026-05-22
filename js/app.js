// ============================================
// GITHUB DASHBOARD PRO - COMPLETE WITH POLISH
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
    
    const landingPageContent = document.querySelectorAll('.hero, .features-section, .how-it-works, .stats-bar, .footer');
    const navLinks = document.querySelectorAll('.nav-link');
    
    console.log('All elements found');
    
    // Mobile menu toggle
    const navbar = document.querySelector('.nav-content');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (!document.querySelector('.mobile-menu-toggle')) {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<span class="material-symbols-outlined">menu</span>';
        navbar.querySelector('.nav-right').prepend(mobileToggle);
        
        mobileToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('mobile-open');
            const icon = mobileToggle.querySelector('.material-symbols-outlined');
            icon.textContent = navLinksContainer.classList.contains('mobile-open') ? 'close' : 'menu';
        });
        
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navLinksContainer.classList.remove('mobile-open');
                const icon = mobileToggle.querySelector('.material-symbols-outlined');
                icon.textContent = 'menu';
            });
        });
    }
    
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
            } else if (href === '#activity') {
                showActivity();
            }
        });
    });
    
    // ============================================
    // SEARCH FUNCTION
    // ============================================
    
    function searchUser(username) {
        console.log('Searching for:', username);
        
        showResultsPage();
        
        resultsContainer.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text-animated">Loading ${username}'s profile...</p>
                <div class="loading-steps">
                    <div class="loading-step">
                        <span class="material-symbols-outlined step-icon">account_circle</span>
                        <span>Fetching profile data</span>
                    </div>
                    <div class="loading-step">
                        <span class="material-symbols-outlined step-icon">folder</span>
                        <span>Loading repositories</span>
                    </div>
                    <div class="loading-step">
                        <span class="material-symbols-outlined step-icon">analytics</span>
                        <span>Calculating statistics</span>
                    </div>
                </div>
            </div>
        `;
        
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
    
    window.showActivity = function() {
        currentPage = 'activity';
        updateNavActive();
        displayActivity();
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
            } else if (href === '#activity' && currentPage === 'activity') {
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
                    
                    <div class="insight-section">
                        <h2 class="section-title">
                            <span class="material-symbols-outlined">calendar_month</span>
                            Contribution Activity
                            <span class="loading-text" id="heatmapLoading">Loading...</span>
                        </h2>
                        <div id="contributionHeatmap" class="heatmap-wrapper">
                            <div class="loading-spinner-small"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        setTimeout(function() {
            createLanguageBarChart(languages);
            
            fetchContributionData(currentUser.login).then(function(data) {
                const loadingText = document.getElementById('heatmapLoading');
                if (loadingText) {
                    loadingText.remove();
                }
                createContributionHeatmap(data.contributionsMap);
                
                // NEW: Analyze productivity metrics
                const metrics = analyzeProductivityMetrics(data.detailedCommits, data.contributionsMap);
                
                // Add productivity section HTML
                const insightsContent = document.querySelector('.results-content');
                const productivityHTML = `
                    <div class="insight-section">
                        <h2 class="section-title">
                            <span class="material-symbols-outlined">speed</span>
                            Productivity Metrics
                        </h2>
                        
                        <div class="productivity-stats-grid">
                            <div class="productivity-stat-card">
                                <span class="material-symbols-outlined stat-icon-large blue">schedule</span>
                                <div class="stat-info">
                                    <div class="stat-value">${formatHour(metrics.peakHour)}</div>
                                    <div class="stat-label">Peak Coding Hour</div>
                                </div>
                            </div>
                            <div class="productivity-stat-card">
                                <span class="material-symbols-outlined stat-icon-large purple">calendar_today</span>
                                <div class="stat-info">
                                    <div class="stat-value">${getDayName(metrics.peakDay)}</div>
                                    <div class="stat-label">Most Productive Day</div>
                                </div>
                            </div>
                            <div class="productivity-stat-card">
                                <span class="material-symbols-outlined stat-icon-large orange">local_fire_department</span>
                                <div class="stat-info">
                                    <div class="stat-value">${metrics.longestStreak}</div>
                                    <div class="stat-label">Longest Streak (Days)</div>
                                </div>
                            </div>
                            <div class="productivity-stat-card">
                                <span class="material-symbols-outlined stat-icon-large green">trending_up</span>
                                <div class="stat-info">
                                    <div class="stat-value">${metrics.averagePerActiveDay}</div>
                                    <div class="stat-label">Avg Commits/Active Day</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="productivity-charts">
                            <div class="productivity-chart-box">
                                <h3 class="chart-title">Commits by Hour of Day</h3>
                                <div class="productivity-chart-container">
                                    <canvas id="productivityHourChart"></canvas>
                                </div>
                            </div>
                            <div class="productivity-chart-box">
                                <h3 class="chart-title">Commits by Day of Week</h3>
                                <div class="productivity-chart-container">
                                    <canvas id="productivityDayChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                insightsContent.insertAdjacentHTML('beforeend', productivityHTML);
                
                // Create the charts
                createProductivityCharts(metrics);
                
            }).catch(function(error) {
                console.error('Error creating heatmap:', error);
                const heatmapContainer = document.getElementById('contributionHeatmap');
                if (heatmapContainer) {
                    heatmapContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Unable to load contribution data</p>';
                }
            });
        }, 100);
        
        console.log('Insights page displayed');
    }
    
    // ============================================
    // DISPLAY ACTIVITY PAGE
    // ============================================
    
    function displayActivity() {
        console.log('Displaying activity page');
        
        resultsContainer.innerHTML = `
            <div class="results-page">
                <div class="results-content">
                    <button onclick="backToHome()" class="back-button">
                        <span class="material-symbols-outlined">arrow_back</span>
                        <span>Back to Home</span>
                    </button>
                    
                    <div class="page-header">
                        <h1>
                            <span class="material-symbols-outlined">timeline</span>
                            Activity Timeline
                        </h1>
                        <p>Recent GitHub activity and contributions</p>
                    </div>
                    
                    <div id="activityTimeline" class="activity-container">
                        <div class="loading-spinner-small"></div>
                        <p style="text-align: center; color: var(--text-muted); margin-top: 1rem;">Loading activity...</p>
                    </div>
                </div>
            </div>
        `;
        
        fetchUserActivity(currentUser.login).then(function(events) {
            renderActivityTimeline(events);
        }).catch(function(error) {
            console.error('Error loading activity:', error);
            const activityContainer = document.getElementById('activityTimeline');
            if (activityContainer) {
                activityContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Unable to load activity data</p>';
            }
        });
        
        console.log('Activity page displayed');
    }
    
    // ============================================
    // FETCH USER ACTIVITY
    // ============================================
    
    async function fetchUserActivity(username) {
        console.log('Fetching user activity...');
        
        try {
            const response = await fetch(
                `https://api.github.com/users/${username}/events/public?per_page=100`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch activity');
            }
            
            const events = await response.json();
            console.log('Activity fetched:', events.length, 'events');
            return events;
        } catch (error) {
            console.error('Error fetching activity:', error);
            throw error;
        }
    }
    
    // ============================================
    // RENDER ACTIVITY TIMELINE
    // ============================================
    
    function renderActivityTimeline(events) {
        const activityContainer = document.getElementById('activityTimeline');
        
        if (!activityContainer) {
            console.error('Activity container not found');
            return;
        }
        
        if (events.length === 0) {
            activityContainer.innerHTML = `
                <div class="no-activity">
                    <span class="material-symbols-outlined">history_toggle_off</span>
                    <h3>No recent activity</h3>
                    <p>This user hasn't had any public activity recently</p>
                </div>
            `;
            return;
        }
        
        const groupedEvents = groupEventsByDate(events);
        
        let html = '';
        
        for (const dateLabel in groupedEvents) {
            html += `<div class="activity-date-group">`;
            html += `<h3 class="date-label">${dateLabel}</h3>`;
            html += `<div class="activity-items">`;
            
            groupedEvents[dateLabel].forEach(function(event) {
                const formatted = formatEvent(event);
                if (formatted) {
                    html += `
                        <div class="activity-item">
                            <div class="activity-icon-container">
                                <span class="activity-icon ${formatted.color}">
                                    <span class="material-symbols-outlined">${formatted.icon}</span>
                                </span>
                            </div>
                            <div class="activity-details">
                                <p class="activity-text">
                                    ${formatted.text}
                                    ${formatted.repo ? `<a href="https://github.com/${formatted.repo}" target="_blank" class="activity-repo">${formatted.repo}</a>` : ''}
                                </p>
                                ${formatted.extra ? `<p class="activity-extra">${formatted.extra}</p>` : ''}
                                <span class="activity-time">${getTimeAgo(event.created_at)}</span>
                            </div>
                        </div>
                    `;
                }
            });
            
            html += `</div></div>`;
        }
        
        activityContainer.innerHTML = html;
        console.log('Activity timeline rendered');
    }
    
    // ============================================
    // GROUP EVENTS BY DATE
    // ============================================
    
    function groupEventsByDate(events) {
        const grouped = {};
        
        events.forEach(function(event) {
            const date = new Date(event.created_at);
            const dateLabel = getDateLabel(date);
            
            if (!grouped[dateLabel]) {
                grouped[dateLabel] = [];
            }
            
            grouped[dateLabel].push(event);
        });
        
        return grouped;
    }
    
    // ============================================
    // GET DATE LABEL
    // ============================================
    
    function getDateLabel(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 14) return 'Last week';
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }
    
    // ============================================
    // FORMAT EVENT
    // ============================================
    
    function formatEvent(event) {
        switch(event.type) {
            case 'PushEvent':
                const commitCount = event.payload.commits ? event.payload.commits.length : 0;
                const commitWord = commitCount === 1 ? 'commit' : 'commits';
                return {
                    icon: 'upload',
                    color: 'green',
                    text: `Pushed ${commitCount} ${commitWord} to`,
                    repo: event.repo.name
                };
            
            case 'CreateEvent':
                if (event.payload.ref_type === 'repository') {
                    return {
                        icon: 'add_box',
                        color: 'blue',
                        text: `Created repository`,
                        repo: event.repo.name
                    };
                } else if (event.payload.ref_type === 'branch') {
                    return {
                        icon: 'call_split',
                        color: 'purple',
                        text: `Created branch ${event.payload.ref} in`,
                        repo: event.repo.name
                    };
                }
                break;
            
            case 'WatchEvent':
                return {
                    icon: 'star',
                    color: 'yellow',
                    text: `Starred`,
                    repo: event.repo.name
                };
            
            case 'ForkEvent':
                return {
                    icon: 'fork_right',
                    color: 'cyan',
                    text: `Forked`,
                    repo: event.repo.name
                };
            
            case 'IssuesEvent':
                const issueAction = event.payload.action;
                return {
                    icon: issueAction === 'opened' ? 'error' : 'check_circle',
                    color: issueAction === 'opened' ? 'orange' : 'green',
                    text: `${issueAction.charAt(0).toUpperCase() + issueAction.slice(1)} issue in`,
                    repo: event.repo.name,
                    extra: event.payload.issue ? event.payload.issue.title : ''
                };
            
            case 'PullRequestEvent':
                const prAction = event.payload.action;
                return {
                    icon: prAction === 'opened' ? 'pull_request' : 'merge',
                    color: prAction === 'opened' ? 'purple' : 'purple',
                    text: `${prAction.charAt(0).toUpperCase() + prAction.slice(1)} pull request in`,
                    repo: event.repo.name,
                    extra: event.payload.pull_request ? event.payload.pull_request.title : ''
                };
            
            case 'DeleteEvent':
                return {
                    icon: 'delete',
                    color: 'red',
                    text: `Deleted ${event.payload.ref_type} ${event.payload.ref} in`,
                    repo: event.repo.name
                };
            
            case 'PublicEvent':
                return {
                    icon: 'public',
                    color: 'blue',
                    text: `Made repository public`,
                    repo: event.repo.name
                };
            
            default:
                return null;
        }
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
    // FETCH CONTRIBUTION DATA
    // ============================================
    
    async function fetchContributionData(username) {
        console.log('Fetching contribution data...');
        
        const contributionsMap = {};
        const detailedCommits = []; // NEW: Store all commits with timestamps
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        for (let d = new Date(oneYearAgo); d <= new Date(); d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            contributionsMap[dateKey] = 0;
        }
        
        const commitPromises = allRepos.slice(0, 30).map(async function(repo) {
            try {
                const response = await fetch(
                    `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&since=${oneYearAgo.toISOString()}&per_page=100`
                );
                
                if (!response.ok) return [];
                
                const commits = await response.json();
                return commits;
            } catch (error) {
                console.error(`Error fetching commits for ${repo.name}:`, error);
                return [];
            }
        });
        
        const allCommitsArrays = await Promise.all(commitPromises);
        const allCommits = allCommitsArrays.flat();
        
        allCommits.forEach(function(commit) {
            if (commit.commit && commit.commit.author) {
                const fullDate = commit.commit.author.date;
                const date = fullDate.split('T')[0];
                
                if (contributionsMap[date] !== undefined) {
                    contributionsMap[date]++;
                }
                
                // NEW: Store detailed commit data
                detailedCommits.push({
                    date: new Date(fullDate),
                    timestamp: fullDate,
                    repo: commit.repository ? commit.repository.name : 'unknown'
                });
            }
        });
        
        console.log('Contribution data fetched:', Object.keys(contributionsMap).length, 'days');
        console.log('Detailed commits:', detailedCommits.length);
        
        // Return BOTH the map and detailed commits
        return {
            contributionsMap: contributionsMap,
            detailedCommits: detailedCommits
        };
    }


    // ============================================
// ANALYZE PRODUCTIVITY METRICS
// ============================================

function analyzeProductivityMetrics(detailedCommits, contributionsMap) {
    console.log('Analyzing productivity metrics...');
    
    // Initialize counters
    const commitsByHour = {};
    const commitsByDay = {};
    
    // Initialize all hours (0-23)
    for (let h = 0; h < 24; h++) {
        commitsByHour[h] = 0;
    }
    
    // Initialize all days (0-6, Sunday-Saturday)
    for (let d = 0; d < 7; d++) {
        commitsByDay[d] = 0;
    }
    
    // Analyze each commit
    detailedCommits.forEach(function(commit) {
        const hour = commit.date.getHours();
        const dayOfWeek = commit.date.getDay();
        
        commitsByHour[hour]++;
        commitsByDay[dayOfWeek]++;
    });
    
    // Find peak hour
    let peakHour = 0;
    let maxHourCommits = 0;
    for (let h = 0; h < 24; h++) {
        if (commitsByHour[h] > maxHourCommits) {
            maxHourCommits = commitsByHour[h];
            peakHour = h;
        }
    }
    
    // Find peak day
    let peakDay = 0;
    let maxDayCommits = 0;
    for (let d = 0; d < 7; d++) {
        if (commitsByDay[d] > maxDayCommits) {
            maxDayCommits = commitsByDay[d];
            peakDay = d;
        }
    }
    
    // Calculate longest streak
    const sortedDates = Object.keys(contributionsMap).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    
    sortedDates.forEach(function(dateKey) {
        if (contributionsMap[dateKey] > 0) {
            currentStreak++;
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        } else {
            currentStreak = 0;
        }
    });
    
    // Calculate averages
    const totalCommits = detailedCommits.length;
    const totalDays = 365;
    const activeDays = Object.values(contributionsMap).filter(function(count) {
        return count > 0;
    }).length;
    
    const averagePerDay = (totalCommits / totalDays).toFixed(2);
    const averagePerActiveDay = activeDays > 0 ? (totalCommits / activeDays).toFixed(2) : 0;
    
    return {
        byHour: commitsByHour,
        byDay: commitsByDay,
        peakHour: peakHour,
        peakDay: peakDay,
        longestStreak: longestStreak,
        totalCommits: totalCommits,
        averagePerDay: parseFloat(averagePerDay),
        averagePerActiveDay: parseFloat(averagePerActiveDay),
        activeDays: activeDays
    };
}

// ============================================
// CREATE PRODUCTIVITY CHARTS
// ============================================

function createProductivityCharts(metrics) {
    console.log('Creating productivity charts');
    
    // Chart 1: Commits by Hour
    const hourCanvas = document.getElementById('productivityHourChart');
    if (hourCanvas) {
        const hourLabels = [];
        const hourData = [];
        
        for (let h = 0; h < 24; h++) {
            // Format hours: 12 AM, 1 AM, 2 AM, ..., 11 PM
            const period = h < 12 ? 'AM' : 'PM';
            const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
            hourLabels.push(hour12 + ' ' + period);
            hourData.push(metrics.byHour[h]);
        }
        
        new Chart(hourCanvas, {
            type: 'bar',
            data: {
                labels: hourLabels,
                datasets: [{
                    label: 'Commits',
                    data: hourData,
                    backgroundColor: '#58a6ff',
                    borderRadius: 6
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
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + ' commits at ' + context.label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#8b949e',
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#30363d'
                        },
                        ticks: {
                            color: '#8b949e',
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    // Chart 2: Commits by Day of Week
    const dayCanvas = document.getElementById('productivityDayChart');
    if (dayCanvas) {
        const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayData = [];
        const dayColors = [];
        
        for (let d = 0; d < 7; d++) {
            dayData.push(metrics.byDay[d]);
            // Highlight peak day
            dayColors.push(d === metrics.peakDay ? '#56d364' : '#58a6ff');
        }
        
        new Chart(dayCanvas, {
            type: 'bar',
            data: {
                labels: dayLabels,
                datasets: [{
                    label: 'Commits',
                    data: dayData,
                    backgroundColor: dayColors,
                    borderRadius: 6
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
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + ' commits on ' + context.label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#8b949e',
                            font: {
                                size: 11
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#30363d'
                        },
                        ticks: {
                            color: '#8b949e',
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    console.log('Productivity charts created');
}

// ============================================
// FORMAT HOUR (24 to 12-hour format)
// ============================================

function formatHour(hour) {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    if (hour < 12) return hour + ' AM';
    return (hour - 12) + ' PM';
}

// ============================================
// GET DAY NAME
// ============================================

function getDayName(dayIndex) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}
    
    // ============================================
    // CREATE CONTRIBUTION HEATMAP
    // ============================================
    
    function createContributionHeatmap(contributionsMap) {
        console.log('Creating contribution heatmap');
        
        const heatmapContainer = document.getElementById('contributionHeatmap');
        if (!heatmapContainer) {
            console.error('Heatmap container not found');
            return;
        }
        
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        const mostRecentSunday = new Date(today);
        mostRecentSunday.setDate(today.getDate() - today.getDay());
        
        const weeks = [];
        let currentDate = new Date(mostRecentSunday);
        currentDate.setDate(currentDate.getDate() - (51 * 7));
        
        for (let week = 0; week < 52; week++) {
            const weekData = [];
            for (let day = 0; day < 7; day++) {
                const dateKey = currentDate.toISOString().split('T')[0];
                const count = contributionsMap[dateKey] || 0;
                
                weekData.push({
                    date: new Date(currentDate),
                    dateKey: dateKey,
                    count: count,
                    level: getContributionLevel(count)
                });
                
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(weekData);
        }
        
        let html = '<div class="heatmap-grid">';
        
        html += '<div class="heatmap-months">';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let lastMonth = -1;
        weeks.forEach(function(week, weekIndex) {
            const month = week[0].date.getMonth();
            if (month !== lastMonth && week[0].date.getDate() <= 7) {
                html += `<span class="month-label" style="left: ${weekIndex * 15}px;">${months[month]}</span>`;
                lastMonth = month;
            }
        });
        html += '</div>';
        
        html += '<div class="heatmap-days">';
        html += '<span class="day-label">Mon</span>';
        html += '<span class="day-label"></span>';
        html += '<span class="day-label">Wed</span>';
        html += '<span class="day-label"></span>';
        html += '<span class="day-label">Fri</span>';
        html += '<span class="day-label"></span>';
        html += '<span class="day-label"></span>';
        html += '</div>';
        
        html += '<div class="heatmap-weeks">';
        weeks.forEach(function(week) {
            html += '<div class="heatmap-week">';
            week.forEach(function(day) {
                const dateStr = day.date.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
                html += `
                    <div class="heatmap-day level-${day.level}" 
                         data-date="${dateStr}" 
                         data-count="${day.count}"
                         title="${day.count} contributions on ${dateStr}">
                    </div>
                `;
            });
            html += '</div>';
        });
        html += '</div>';
        
        html += '</div>';
        
        html += `
            <div class="heatmap-legend">
                <span class="legend-label">Less</span>
                <div class="legend-squares">
                    <div class="legend-square level-0"></div>
                    <div class="legend-square level-1"></div>
                    <div class="legend-square level-2"></div>
                    <div class="legend-square level-3"></div>
                    <div class="legend-square level-4"></div>
                </div>
                <span class="legend-label">More</span>
            </div>
        `;
        
        heatmapContainer.innerHTML = html;
        
        const days = heatmapContainer.querySelectorAll('.heatmap-day');
        days.forEach(function(dayEl) {
            dayEl.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'heatmap-tooltip';
                tooltip.textContent = `${dayEl.getAttribute('data-count')} contributions on ${dayEl.getAttribute('data-date')}`;
                tooltip.style.position = 'fixed';
                tooltip.style.display = 'none';
                document.body.appendChild(tooltip);
                
                const rect = dayEl.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
                tooltip.style.display = 'block';
                
                dayEl._tooltip = tooltip;
            });
            
            dayEl.addEventListener('mouseleave', function() {
                if (dayEl._tooltip) {
                    dayEl._tooltip.remove();
                    dayEl._tooltip = null;
                }
            });
        });
        
        console.log('Heatmap created successfully');
    }
    
    function getContributionLevel(count) {
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 8) return 2;
        if (count <= 15) return 3;
        return 4;
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