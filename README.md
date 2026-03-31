```markdown
# My Assignment Collection

<p align="center">
  <strong>A curated index of all coursework across subjects</strong><br>
  Web Programming &bull; Mobile Programming &bull; Database
</p>

---

## Overview

A classical-styled web application to organize and quickly access coding assignments from multiple subjects. Built with vanilla HTML, CSS, and JavaScript, integrated with **Firebase Authentication** and **Cloud Firestore** for role-based access control.

**Visitor** can browse and open assignments. **Admin** (authenticated user) can add, edit, delete, and toggle status.

---

## Features

| Feature | Visitor | Admin |
|---------|---------|-------|
| Browse all assignments | ✅ | ✅ |
| Open assignment (relative link) | ✅ | ✅ |
| Filter by subject (Web / Mobile / Database) | ✅ | ✅ |
| Filter by status (All / Pending / Done) | ✅ | ✅ |
| Search by name, path, or note | ✅ | ✅ |
| Add new assignment | ❌ | ✅ |
| Edit assignment | ❌ | ✅ |
| Delete assignment | ❌ | ✅ |
| Toggle status (Done / Pending) | ❌ | ✅ |

### Additional

- Real-time data sync via Firestore `onSnapshot`
- Persistent data — saved to cloud, not localStorage
- Responsive design — works on desktop and mobile
- No external CSS/JS libraries — pure vanilla
- No external fonts — uses system serif fonts
- Classical parchment aesthetic with warm tones

---

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, flexbox, grid, animations
- **JavaScript** (ES5) — no build tools, no frameworks
- **Firebase Authentication** — email/password sign-in
- **Cloud Firestore** — real-time NoSQL database

---

## File Structure

```text
my-projects/
├── task-list.html          # Main page
├── task-list.css           # Stylesheet
├── script.js               # All logic + Firebase integration
├── README.md               # You are here
│
├── web/                    # Web Programming assignments
│   ├── task-list/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   ├── portfolio/
│   │   └── index.html
│   └── ...
│
├── mobile/                 # Mobile Programming assignments
│   ├── login/
│   │   └── index.html
│   ├── dashboard/
│   │   └── index.html
│   └── ...
│
└── database/               # Database assignments
    ├── student-db/
    │   └── index.html
    ├── crud/
    │   └── index.html
    └── ...
```

> The `web/`, `mobile/`, and `database/` folders are your actual project folders. The file paths in each assignment entry point to these folders using relative paths (e.g., `./web/task-list/index.html`).

---

## Setup

### 1. Firebase Project

Go to [Firebase Console](https://console.firebase.google.com) and create a new project (or use an existing one).

### 2. Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click **Add user** — create your admin account with email and password

### 3. Enable Firestore

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (we will set proper rules next)
3. Select a location closest to you

### 4. Set Security Rules

In **Firestore** → **Rules**, replace everything with:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /assignments/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

> This allows **anyone to read** but **only authenticated users to write**.

Then click **Publish**.

### 5. Get Firebase Config

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to **Your apps** → **Add app** → choose **Web** (`</>`)
3. Register the app with any nickname
4. Copy the `firebaseConfig` object

### 6. Configure script.js

Open `script.js` and paste your config:

```javascript
var FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 7. Run

Open `task-list.html` in a browser. That's it — no build step, no `npm install`, no server required.

> For local development, you can use any local server (e.g., `python -m http.server 8000` or VS Code Live Server). Direct `file://` protocol works but Firebase SDK may show warnings.

---

## Usage

### As Visitor

1. Open the page
2. Browse assignments organized by subject tabs
3. Click any assignment card to open it
4. Use the search bar to find specific assignments
5. Filter by status (All / Pending / Done)

### As Admin

1. Click **Admin Login** in the top-right corner
2. Enter your email and password
3. After login, the **Add Assignment** button appears
4. **Add** — click the button, fill the form, save
5. **Edit** — hover any card, click the pencil icon
6. **Delete** — hover any card, click the trash icon
7. **Toggle status** — click the Done/Pending tag on any card
8. Click **Logout** when done

---

## How Assignments Are Stored

Each assignment in Firestore has this structure:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Display name (e.g., "Task List App") |
| `path` | string | Relative file path (e.g., `./web/task-list/index.html`) |
| `subject` | string | `web`, `mobile`, or `database` |
| `status` | string | `pending` or `done` |
| `note` | string | Optional note (e.g., "Week 3") |
| `createdAt` | timestamp | Auto-generated by Firestore |

---

## Customization

### Change Subject Colors

In `task-list.css`, modify these variables:

```css
:root {
  --web-color: #b85c1a;
  --mobile-color: #2e6a8a;
  --db-color: #3b6632;
}
```

### Change Theme Colors

All colors are defined as CSS custom properties in `:root`:

```css
:root {
  --bg: #f3ede3;
  --card: #faf7f0;
  --accent: #7a3b10;
  --gold: #a67928;
  --fg: #2a1e12;
  --fg-dim: #70604e;
}
```

### Add More Subjects

1. In `script.js`, add to `SUBJECTS`:

```javascript
var SUBJECTS = {
  web:      { label: 'Web Prog',    short: 'WEB', css: 'web' },
  mobile:   { label: 'Mobile Prog', short: 'MOB', css: 'mobile' },
  database: { label: 'Database',    short: 'DB',  css: 'database' },
  ai:       { label: 'AI / ML',     short: 'AI',  css: 'ai' }
};
```

2. In `task-list.html`, add a tab button:

```html
<button class="tab" data-subject="ai">
  <span class="tab-dot ai"></span> AI / ML
</button>
```

3. In `task-list.css`, add the color:

```css
.tab-dot.ai { background: #7c3a8a; }
.a-strip.ai { background: #7c3a8a; }
.a-badge.ai { background: #7c3a8a; }
```

4. In the form modal's select, add an option:

```html
<option value="ai">AI / ML</option>
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Red banner "Firebase Not Configured" | Fill in `FIREBASE_CONFIG` in `script.js` |
| Login shows "User not found" | Create the user in Firebase Console → Authentication → Users |
| Login shows "Wrong password" | Reset password in Firebase Console → Users → click user → Reset Password |
| Data not loading | Check Firestore Rules — `allow read: if true` must be present |
| Assignment links don't work | Make sure the `path` value is correct relative to `task-list.html` |
| Console shows CORS error | Use a local server instead of `file://` protocol |
| Firebase SDK warnings in console | Non-blocking; compat SDK detects non-module environment |

---

## License

This project is for personal educational use. Feel free to modify and adapt for your own coursework collection.

---

<p align="center">
  Built with vanilla HTML, CSS & JavaScript — powered by Firebase
</p>
```

---
