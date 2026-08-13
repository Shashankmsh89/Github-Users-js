# GitHub Users API - Async JavaScript Assignment

A modern, responsive web application that fetches and displays GitHub users with filtering, pagination, and detailed user information including followers and repositories.

## 📋 Project Overview

This project demonstrates core JavaScript concepts including:

- **Asynchronous Programming**: Using `async`/`await` for clean, readable async code
- **API Integration**: Fetching data from GitHub API with graceful fallback to local data
- **Data Transformation**: Converting API responses into application-specific data structures
- **DOM Manipulation**: Dynamically rendering UI based on data
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during data fetching with skeleton loaders
- **Session Management**: Using `sessionStorage` to pass data between pages
- **Promise.all()**: Parallel fetching of multiple API endpoints

## 🚀 Setup & Run Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server

### Installation

1. Navigate to the project directory:
```bash
cd path/to/Github-Users.js
```

2. Start a local HTTP server:
```bash
# Using Python 3
python -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Node.js http-server
npx http-server -p 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## 📁 Project Structure

```
Github-Users.js/
├── index.html              # Main page - users list with filtering & pagination
├── details.html            # User details page - followers & repositories
├── css/
│   └── style.css           # All styling for both pages
├── js/
│   ├── app.js              # Main application logic for index.html
│   ├── details.js          # Logic for details.html with Promise.all()
│   ├── api.js              # API fetching functions with fallback
│   ├── ui.js               # UI rendering functions
│   └── users.js            # User filtering & pagination logic
├── data/
│   └── db.json             # Local fallback data (GitHub users)
├── package.json            # Project metadata
└── README.md               # This file
```

## 🔑 Key Features

### 1. Main Page (`index.html`)

**User Listing**
- Displays GitHub users in a responsive grid layout
- Shows user avatar, login name, and ID
- User cards are clickable to view detailed information

**Filtering**
- Filter users by minimum login length
- "Apply" button triggers filtering
- Real-time count update of filtered users

**Pagination**
- 5 users per page
- Previous/Next buttons with disable state
- Current page indicator

**Loading State**
- Animated skeleton loaders while fetching data
- Provides visual feedback during API requests

**Error Handling**
- User-friendly error messages
- "Could not load users" message on failure
- No uncaught promise rejections

### 2. Details Page (`details.html`)

**User Header**
- Large avatar image
- User login name
- User ID
- Direct link to GitHub profile

**Followers Section**
- Displays first 5 followers (fetched from GitHub API or mock data)
- Shows follower avatar, login, and profile link
- Responsive grid layout

**Repositories Section**
- Displays first 5 repositories sorted by stars
- Shows repository name, description, programming language, and star count
- Direct link to each repository

**Loading & Error Handling**
- Animated skeleton loaders while fetching followers and repos
- Error message if data cannot be loaded
- Graceful fallback to mock data if GitHub API fails

**Navigation**
- Back button to return to users list
- Preserves pagination state

## 📊 Data Flow

### Async/Await Implementation

All asynchronous operations use `async`/`await` for clean, readable code:

```javascript
async function loadUsers() {
    try {
        showLoading();
        allUsers = await fetchUsers();
        hideLoading();
        // Process users...
    } catch (error) {
        console.error(error);
        showError("Could not load users");
    }
}
```

### API Fetching with Fallback

The application attempts to fetch from GitHub API but gracefully falls back to local `db.json`:

```javascript
async function fetchWithFallback(url, fallbackUrl) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        // Fallback to local data
        return fetch(fallbackUrl).then(r => r.json());
    }
}
```

### Data Transformation

Raw API responses are transformed into application-specific objects:

```javascript
// Transform GitHub API response
users.map(user => ({
    login: user.login,      // GitHub username
    id: user.id,            // Unique ID
    avatar: user.avatar_url // Avatar image URL
}))
```

### Filtering Logic

Users are filtered by minimum login length:

```javascript
export function filterUsersByLoginLength(users, minimumLength) {
    return users.filter(user => user.login.length >= minimumLength);
}
```

### Pagination Logic

Implements page-based pagination with configurable page size:

```javascript
const USERS_PER_PAGE = 5;

export function getPaginatedUsers(users) {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    const end = start + USERS_PER_PAGE;
    return users.slice(start, end);
}
```

## ⚡ Promise.all() for Parallel Requests

The details page uses `Promise.all()` to fetch followers and repositories in parallel:

```javascript
// Fetch both endpoints simultaneously
const [followers, repos] = await Promise.all([
    fetchUserFollowers(selectedUser.followers_url),
    fetchUserRepos(selectedUser.repos_url)
]);
```

**Benefits:**
- Faster page load (parallel instead of sequential)
- Better user experience
- Efficient resource utilization

## 🎨 UI/UX Features

### Responsive Design
- Desktop optimized (grid layout)
- Tablet friendly (adjusted grid)
- Mobile responsive (single column on small screens)

### Loading Skeletons
- Animated gradient effect
- Visually indicates content is loading
- Better UX than plain "Loading..." text

### Visual Hierarchy
- Clear header sections
- Distinct card-based layout
- Color-coded information
- Proper spacing and typography

### Error Handling
- Friendly error messages
- No broken layouts on errors
- Clear call-to-action guidance

### Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigable

## 🌐 API Integration

### GitHub API Endpoints Used

1. **Users List**
   ```
   GET https://api.github.com/users?per_page=30
   ```

2. **User Followers**
   ```
   GET https://api.github.com/users/{username}/followers?per_page=5
   ```

3. **User Repositories**
   ```
   GET https://api.github.com/users/{username}/repos?per_page=5&sort=stars&direction=desc
   ```

### Fallback Data

When GitHub API rate limiting or network errors occur, the application gracefully falls back to:
- `data/db.json` for user list
- Mock data for followers and repositories

## 📝 Filtering Explained

The minimum login length filter works by:

1. User enters desired minimum length (default: 4)
2. Clicks "Apply" button
3. JavaScript filters the already-fetched users
4. Only displays users with login length >= minimum
5. Shows count of remaining users
6. Resets pagination to page 1
7. No additional API calls needed (filter operates on cached data)

## 📄 Pagination Explained

The pagination system:

1. Loads all users into memory
2. Displays 5 users per page by default
3. Calculates total pages based on filtered count
4. Previous/Next buttons navigate between pages
5. Disabled state when at first/last page
6. Maintains filter state while paginating

## ⚙️ Error Handling Strategy

The application handles errors at multiple levels:

1. **API Fetch Errors**
   - Network failures → Show friendly message
   - HTTP errors (4xx, 5xx) → Use fallback data
   - JSON parse errors → Handle gracefully

2. **User Feedback**
   - Loading skeleton during requests
   - Error messages if failures occur
   - No blank page or console-only errors

3. **Promise Rejection Handling**
   - All promises have `.catch()` blocks
   - Errors logged to console for debugging
   - User-friendly messages in UI

## 🔄 Data Flow Diagram

```
index.html (Main Page)
    ↓
    app.js (initialization)
    ↓
    api.js (fetchUsers)
    ├→ GitHub API (primary)
    └→ db.json (fallback)
    ↓
    Users loaded and transformed
    ↓
    Render initial page with filter/pagination
    ↓
    User clicks "View Details" → Store in sessionStorage
    ↓
details.html (Details Page)
    ↓
    details.js (initialization)
    ├→ Retrieve user from sessionStorage
    ├→ Promise.all() parallel fetch:
    │   ├→ fetchUserFollowers()
    │   └→ fetchUserRepos()
    └→ Render followers and repos
    ↓
    User clicks "Back" → Return to index.html
```

## 🧪 Sample Data Output

### Users List Response
```javascript
[
    {
        login: "mojombo",
        id: 1,
        avatar: "https://avatars.githubusercontent.com/u/1?v=4"
    },
    {
        login: "defunkt",
        id: 2,
        avatar: "https://avatars.githubusercontent.com/u/2?v=4"
    }
    // ... more users
]
```

### Followers Response
```javascript
[
    {
        login: "octocat",
        id: 1,
        avatar: "https://avatars.githubusercontent.com/u/1?v=4",
        url: "https://github.com/octocat"
    }
    // ... up to 5 followers
]
```

### Repositories Response
```javascript
[
    {
        name: "Hello-World",
        description: "My first repository on GitHub!",
        url: "https://github.com/octocat/Hello-World",
        stars: 1234,
        language: "JavaScript"
    }
    // ... up to 5 repositories
]
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Responsive design with flexbox and grid
- **JavaScript ES6+** - async/await, arrow functions, template literals
- **Fetch API** - HTTP requests
- **sessionStorage** - Client-side data persistence

## 📚 Learning Outcomes

This project teaches:

1. ✅ Async/await patterns for clean asynchronous code
2. ✅ HTTP response validation with `.ok` checking
3. ✅ Error handling and graceful degradation
4. ✅ DOM manipulation and dynamic rendering
5. ✅ CSS Flexbox and Grid layouts
6. ✅ Responsive web design principles
7. ✅ Promise.all() for parallel operations
8. ✅ Session management with sessionStorage
9. ✅ Code organization and separation of concerns
10. ✅ User experience best practices

## 🤝 Contributing

This is a training project. For improvements or questions, refer to the assignment guidelines.

## 📄 License

ISC

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify the local HTTP server is running
3. Ensure all files are in the correct directories
4. Try clearing browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

## 🎯 Next Steps (Future Enhancements)

- Add search functionality
- Implement favorite/bookmark feature
- Add user profile editing
- Implement infinite scroll
- Add sorting options
- Create PWA support
