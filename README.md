# GitHub Users API

## Setup and Run

Install dependencies and compile the TypeScript source:

```bash
npm install
npm run build
```

Start a local HTTP server from the project directory:

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in a browser. The HTML files load the compiled `.js` files from `js/`, never the `.ts` source files.

## JavaScript to TypeScript Migration

The original JavaScript modules were converted to TypeScript. `tsconfig.json` enables `strict`, `noImplicitAny`, unused-code checks, ES2020 modules, and DOM types. `npm run build` runs `tsc`, which emits JavaScript beside each TypeScript source file in `js/`.

## Project Structure

```text
index.html
details.html
css/style.css
data/db.json
js/
  api.ts / api.js
  app.ts / app.js
  details.ts / details.js
  ui.ts / ui.js
  users.ts / users.js
tsconfig.json
package.json
README.md
```

## Types and API Design

`api.ts` defines the API interfaces:

- `GitHubUser`: `login`, `id`, `avatar_url`, and optional `name` and `public_repos`.
- `GitHubFollower`: follower identity, avatar, and profile URL fields.
- `GitHubRepository`: repository name, description, URL, stars, and language.

The `ApiResult<T>` union represents either `{ success: true, data }` or `{ success: false, error }`. The generic `apiRequest<T>(url)` helper uses `async`/`await`, checks `response.ok` before parsing JSON, and converts request failures into the error result.

`ApiService` is composed into `app.ts` and `details.ts`. It owns users, followers, and repository requests and transforms API data for the UI. `Pick<GitHubUser, "login" | "id">` is used for the list item type while the existing `avatar` field is retained for the current UI.

DOM elements use specific HTML element types, and users, filtered users, pagination, filter values, loading state, and errors are typed. Event handlers use `MouseEvent` and typed input/button elements. Application files manage state and events; `ui.ts` renders the DOM; `ApiService` handles network operations. Composition is used instead of inheritance.

## Error and Loading Handling

Users show the existing skeleton while loading, display a friendly error on failure, and stop loading in `finally`. Details show their skeleton while both independent requests are pending. Followers and repositories are requested in parallel with `Promise.allSettled`, so a failure in one request does not hide successful data from the other. Each failed section gets a visible friendly error, and cleanup runs in `finally`.

## Sample Output / Screenshots

The main page displays a paginated, filterable list of GitHub users with avatars and IDs. The details page displays the selected user, up to five followers, and up to five repositories. Add screenshots of these two existing views here when submitting the assignment.
