# SkillSync

SkillSync is a student skill-sharing frontend with Supabase authentication, profile and skill management, and a chronological post feed.

## Features

- Responsive Home, Discover, My Learning, My Teaching, Requests, Classrooms, and Profile pages
- Discover includes a search bar for featured demo courses and the signed-in member's own skill offers
- Supabase-backed post feed inside Discover, ordered newest first by `created_at`, with private attachments, draft editing, publishing, archiving, and author-only post management
- Signup collects name, institution, date of birth, roles, skills, and bio; role and skill choices are applied to the member's Supabase profile after authentication
- Skill offer posts are instructor-only and include separate course and post titles, a description, related links, video uploads, and general attachments
- My Teaching lists the signed-in user's instructor posts from `posts`
- Profile skill selections backed by the shared skill catalogue and role-gated `profile_skills`
- Learning, request, teaching, and classroom screens use clearly marked demo examples where live backend tables are unavailable
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
    userProfile.js         User display name and initials
  components/
    AppSidebar.jsx         Shared responsive navigation
    DashboardPreview.jsx   Home dashboard preview
    DiscoverPosts.jsx      Authenticated post feed, drafts, publishing, and attachments
    Hero.jsx               Home hero section
    StatCard.jsx           Reusable dashboard card
  data/
    demoData.jsx           Clearly marked sample course, request, and classroom previews
  layouts/
    AppLayout.jsx          Shared workspace shell and collapsible sidebar state
  pages/
    AuthPage.jsx
    ClassroomPage.jsx
    DiscoverPage.jsx       Skill catalogue and chronological post feed
    HomePage.jsx
    MyLearningPage.jsx
    MyTeachingPage.jsx
    ProfilePage.jsx
    RequestsPage.jsx
  App.jsx                  App state and page composition
  lib/
    supabase.js            Browser client using the publishable key
    skillService.js        Skill catalogue and profile skill data access
supabase/
  20261022_post_attachment_limits.sql  Private bucket size and MIME restrictions
  20261101_instructor_only_posts.sql  Restrict post creation to instructor role
  20261101_remove_post_attachment_limits.sql  Remove bucket MIME and object-size restrictions
  20261101_profile_date_of_birth.sql  Add a profile date-of-birth field
  index.css                Theme, page styles, and responsive rules
  main.jsx                 React entry point
  assets/                  Image and icon assets
public/                     Public icons and static assets
index.html                  HTML entry point and document metadata
```

Each route has its own page component. Shared navigation and layout live under `components/` and `layouts/`.

Tailwind CSS utilities handle the shared shell layout and responsive spacing. `src/index.css` defines the SkillSync theme and page-specific component styles.

## Current implementation notes

The app connects to the existing Supabase project through `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. It expects the tables, row-level security policies, trigger, Storage bucket, and RPCs provisioned in `Skill_Sharing_Database_Developer_Manual-1.pdf`. Post reads are only issued after a user session is restored; Supabase RLS remains the data-access boundary.

The frontend currently queries `profiles` (`user_id`, `full_name`, `institution`, `bio`), `user_roles` (`user_id`, `role`), `skills` (`skill_id`, `skill_name`, `category`), `profile_skills` (`user_id`, `skill_id`, `skill_type`), and `posts` (`post_id`, `user_id`, `posting_role`, `description`, `status`, `created_at`). Post attachment UI also uses `attachment_id`, `post_id`, `original_name`, `byte_size`, `bucket_id`, and `object_path`, with files stored in Supabase Storage. These names are taken from current queries; base table DDL is not checked into this repository, so column types and all constraints must be verified in the deployed database.

Post attachment uploads apply no client-side file-type or per-file size restriction. The migration `supabase/20261101_remove_post_attachment_limits.sql` removes the bucket MIME and object-size restrictions configured by the older `supabase/20261022_post_attachment_limits.sql`; Supabase project or plan limits can still apply. Apply the new migration in the Supabase SQL Editor as a project administrator. Apply `supabase/20261101_instructor_only_posts.sql` as well so the database enforces instructor-only post creation. The user's browser uses only the publishable key; never put an admin/service-role key in `.env`.

Apply `supabase/20261101_profile_date_of_birth.sql` before using the signup date-of-birth field. Signup temporarily carries the date in Auth metadata and moves it to `profiles.date_of_birth` after a session becomes available, then clears the temporary metadata value. The initial roles and comma-separated skills are applied to `user_roles`, `skills`, and `profile_skills` after a session becomes available. If email confirmation is enabled, this happens after the user confirms and signs in. Confirm the live database's RLS policies allow these self-service operations.

Members can add or remove learner and instructor roles from Edit profile. Apply or rerun `supabase/20261022_allow_self_select_roles.sql` in the Supabase SQL Editor to permit signed-in users to change only their own roles. Removing a role keeps its saved skill selections so they return if the role is added back.

Apply `supabase/20261024_allow_role_removal_with_existing_posts.sql` to allow role removal without deleting historical posts. The migration replaces the posts-to-role foreign key with a trigger that still requires the author to have that role when a new post is created.

Members can create a skill from Discover or Edit profile. New skills are added to the shared `skills` catalogue and automatically selected for the chosen learner/instructor profile. Apply `supabase/20261023_allow_member_created_skills.sql` in the Supabase SQL Editor to allow authenticated inserts into that catalogue.

The checked-in Supabase SQL files configure policies and Storage; they do not define the base tables. This repository has no queries for `details`, `course_offerings`, `interest_requests`, `classrooms`, `classroom_members`, `live_meetings`, `materials`, or `notifications`. The course, request, and classroom examples on those pages are labeled demo content and are not saved to Supabase. Add and expose the needed tables with appropriate row-level security before those examples can be replaced by live records.

The Outfit font is loaded from Google Fonts, with a system sans-serif fallback if it cannot be reached.

## Production build

```bash
npm run lint
npm run build
npm run preview
```

The generated `dist/` directory can be deployed to a static host. Since page navigation uses URL hashes, direct page links do not require server-side route rewrites.
