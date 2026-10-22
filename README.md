# SkillSync

SkillSync is a student skill-sharing platform prototype. It brings course discovery, peer learning, teaching requests, classroom materials and meetings, notifications, and learner profiles into one responsive interface.

## Features

- Responsive Home, Discover, My Learning, My Teaching, Requests, Classrooms, Notifications, Profile, and Settings pages
- Searchable course catalog with category and skill filters, course details, and join-request interactions
- Teaching dashboard with course management and request actions
- Classroom overview, materials, meetings, and members views
- Collapsible desktop sidebar and a hamburger navigation menu on tablet and mobile
- Browser history navigation using hash routes, such as `#discover` and `#classroom`

## Requirements

- Node.js `20.19+` or `22.12+`
- npm

## Get started

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal, usually `http://localhost:5173`.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Vite development server |
| `npm run lint` | Run Oxlint on the project |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Project layout

```text
src/
  app/
    pageRoutes.js          Hash route names and initial route parsing
  components/
    AppSidebar.jsx         Shared responsive navigation
    DashboardPreview.jsx   Home dashboard preview
    Hero.jsx               Home hero section
    StatCard.jsx           Reusable dashboard card
  data/
    demoData.jsx           Sample courses, requests, and classroom data
  layouts/
    AppLayout.jsx          Shared workspace shell and collapsible sidebar state
  pages/
    AuthPage.jsx
    ClassroomPage.jsx
    DiscoverPage.jsx       Includes the course details view
    HomePage.jsx
    MyLearningPage.jsx
    MyTeachingPage.jsx
    NotificationsPage.jsx
    ProfilePage.jsx
    RequestsPage.jsx
    SettingsPage.jsx
  App.jsx                  App state and page composition
  index.css                Theme, page styles, and responsive rules
  main.jsx                 React entry point
  assets/                  Image and icon assets
public/                     Public icons and static assets
index.html                  HTML entry point and document metadata
```

Each route has its own page component. Shared navigation and layout live under `components/` and `layouts/`, while sample content is kept in `data/`.

Tailwind CSS utilities handle the shared shell layout and responsive spacing. `src/index.css` defines the SkillSync theme and page-specific component styles.

## Current implementation notes

This repository contains the frontend prototype; it does not currently include an API server or database configuration. Course, classroom, profile, notification, and request data are sample data held in React state. Most changes reset when the page reloads; the sidebar collapsed preference is stored in browser local storage.

Login, account creation, password reset, Google/GitHub sign-in, classroom messaging, and some material or recording actions are not connected to services yet. The interface displays a message for unavailable actions. Connect these flows to an authentication provider and application API before using real accounts or data.

The Outfit font is loaded from Google Fonts, with a system sans-serif fallback if it cannot be reached.

## Production build

```bash
npm run lint
npm run build
npm run preview
```

The generated `dist/` directory can be deployed to a static host. Since page navigation uses URL hashes, direct page links do not require server-side route rewrites.
