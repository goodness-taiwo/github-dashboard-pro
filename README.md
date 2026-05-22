# GitHub Dashboard Pro

Advanced GitHub profile analytics and insights dashboard built with vanilla JavaScript.

## Live Demo

View Live: https://goodness-taiwo.github.io/github-dashboard-pro/

## Features

### Landing Page
- Hero section with real-time GitHub username search
- Feature showcase grid highlighting 6 key capabilities
- Three-step process explanation
- Statistics bar displaying platform metrics
- Comprehensive footer with links

### Dashboard Page
- User profile display with avatar, name, username, and bio
- Profile metadata including location, company, and website
- Eight statistics cards showing:
  - Total repositories
  - Total stars across all repos
  - Follower count
  - Total forks
  - Total watchers
  - Open issues count
  - Account age in years
  - Top programming language
- Interactive doughnut chart visualizing language distribution
- Language breakdown list with percentages and repository counts
- Recent repositories section displaying 10 most recently updated repos

### Repositories Page
- Complete listing of all user repositories
- Real-time search functionality across repository names and descriptions
- Language filter buttons (dynamically generated from user's languages)
- Sort options:
  - Recently Updated
  - Most Stars
  - Most Forks
  - Name (A-Z)
- Repository cards displaying:
  - Repository name with GitHub link
  - Description
  - Primary language badge
  - Star count
  - Fork count
  - Last update timestamp

### Insights Page
- Four summary statistics cards:
  - Total repositories
  - Total stars
  - Total forks
  - Languages used count
- Horizontal bar chart showing language distribution by percentage
- 365-day contribution heatmap calendar:
  - GitHub-style green squares
  - Five activity levels (0 to 16+ commits)
  - Interactive tooltips showing exact commit counts
  - Month labels and day indicators
- Productivity metrics section:
  - Peak coding hour identification
  - Most productive day of week
  - Longest commit streak tracking
  - Average commits per active day
  - Commits by hour bar chart (24-hour breakdown)
  - Commits by day bar chart (weekly pattern with peak day highlighted)

### Activity Page
- Timeline of recent public GitHub events
- Events grouped by date (Today, Yesterday, days ago, weeks ago)
- Supported event types:
  - Push events (commits)
  - Repository creation
  - Star events
  - Fork events
  - Issues (opened/closed)
  - Pull requests (opened/merged)
  - Branch/tag deletion
  - Repository made public
- Color-coded icons for different activity types
- Clickable repository links
- Timestamps showing relative time

## Technical Stack

**Frontend:**
- HTML5 with semantic markup
- CSS3 (Custom properties, Grid, Flexbox)
- Vanilla JavaScript (ES6+)

**Libraries:**
- Chart.js for data visualizations
- Google Fonts (Inter, JetBrains Mono)
- Material Symbols for iconography

**API:**
- GitHub REST API v3

## Design Features

**User Interface:**
- Dark theme interface optimized for extended viewing
- Consistent color scheme using CSS custom properties
- Material design icon system
- Responsive typography scaling

**Animations:**
- Page fade-in transitions
- Stat card slide-up animations
- Repository card fade-in effects
- Activity item slide-in animations
- Smooth hover effects on interactive elements
- Button press feedback
- Loading spinners with animated steps

**Responsive Design:**
- Mobile-first approach
- Hamburger menu for mobile navigation
- Flexible grid layouts adapting to screen size
- Horizontal scroll for heatmap on smaller screens
- Breakpoints at 640px, 768px, and 1024px

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Setup and Usage

1. Clone repository:
```bash
git clone https://github.com/goodness-taiwo/github-dashboard-pro.git
```

2. Open index.html in web browser

3. Enter any public GitHub username in search bar

4. Click "Analyze" to view dashboard

No build process or dependencies installation required.

## API Rate Limits

GitHub REST API rate limits:
- Unauthenticated requests: 60 per hour
- For optimal performance, consider adding GitHub personal access token
- Dashboard fetches data from multiple endpoints per user search

## File Structure

github-dashboard-pro/
├── css/
│   └── main.css          (Complete styling, 1000+ lines)
├── js/
│   └── app.js            (Complete functionality, 1200+ lines)
├── index.html            (Main HTML structure)
├── README.md
├── LICENSE
└── .gitignore



## Key Functions

**Data Fetching:**
- fetchContributionData() - Retrieves commit history for past year
- fetchUserActivity() - Gets recent public events
- GitHub API integration with error handling

**Data Analysis:**
- calculateLanguages() - Aggregates language usage statistics
- analyzeProductivityMetrics() - Processes commit patterns
- groupEventsByDate() - Organizes activity timeline
- Streak calculation algorithm
- Hour and day-of-week analysis

**Visualization:**
- createLanguageChart() - Doughnut chart rendering
- createLanguageBarChart() - Horizontal bar chart
- createContributionHeatmap() - 365-day calendar grid
- createProductivityCharts() - Hour and day charts

**UI Management:**
- Page navigation system (Dashboard, Repositories, Insights, Activity)
- Filter and sort functionality
- Real-time search implementation
- Mobile menu toggle
- Loading state management


## Learning Outcomes

**JavaScript Concepts Applied:**
- Asynchronous programming (Promises, async/await)
- Array methods (map, filter, reduce, sort)
- DOM manipulation and event handling
- Local state management
- API integration and error handling
- Date/time manipulation
- Algorithm implementation (streak calculation)

**CSS Techniques:**
- CSS Grid and Flexbox layouts
- CSS custom properties (variables)
- Responsive design patterns
- CSS animations and transitions
- Media queries
- Mobile-first methodology

## Performance Considerations

- Limits API calls to 30 repositories for commit history
- Implements request batching with Promise.all
- Caches user data during session
- Optimized DOM manipulation
- Lazy loading for charts

## Future Enhancement Possibilities

- Profile comparison (side-by-side analysis of two users)
- Star growth timeline chart
- Export data as PDF report
- Dark/light theme toggle
- Custom date range selection
- Advanced filtering options
- Bookmark favorite profiles
- GitHub authentication for higher rate limits

## Known Limitations

- Relies on public GitHub data only
- Subject to GitHub API rate limits
- Contribution heatmap shows data from past 365 days only
- Activity timeline limited to most recent 100 events
- Requires modern browser with JavaScript enabled

## License

MIT License

Copyright (c) 2026 Goodness Taiwo

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Author

Goodness Taiwo
- GitHub: github.com/goodness-taiwo

## Acknowledgments

- GitHub REST API documentation
- Chart.js library and documentation
- Google Fonts
- Material Symbols icon library 