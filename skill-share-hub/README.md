# Skill Share Hub

Skill Share Hub is a community learning platform where people share and discover short, practical tutorials on everyday skills such as coding, cooking, design, music and more. Members can post tutorials, browse them by keyword and category, and rate them so the best content is easy to find.

**Live app:** https://skill-share-hub-eta.vercel.app/
**Project board:** https://github.com/users/havor13/projects/2

## Team

| Name | GitHub |
| --- | --- |
| Sampson Havor | [@havor13](https://github.com/havor13) |
| Simone Leticia Cavallari Gois Plaine | [@slplaine](https://github.com/slplaine) |

## Product demo summary

Skill Share Hub helps learners find quick, focused tutorials without committing to a long course. It is intended for students, hobbyists and professionals who want to pick up new skills, and for contributors who want to share what they know.

The main flow is: sign up, log in, create a tutorial, and see it appear in the tutorial list. Other users can search and filter tutorials, open a tutorial, rate it, and leave comments. Authors can edit or delete their own tutorials, and administrators can moderate any tutorial.

Search, category filters and ratings help people find good content quickly, and the responsive layout works on desktop and mobile.

## Features

- Sign up, log in and log out (NextAuth credentials, JWT sessions)
- Roles: regular users and administrators
- Create, view, edit and delete tutorials (CRUD)
  - Only the author or an admin can edit or delete a tutorial
- Search by keyword and filter by category (13 categories)
- Star ratings with an automatically updated average (one rating per user, re-rating updates it)
- Comments on tutorials (saved to the database; the comment's author or an admin can delete a comment)
- Responsive layout

## Tech stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- NextAuth v4 (Credentials provider) with bcrypt password hashing
- Deployed on Vercel

## Getting started

### Prerequisites

- Node.js 20 or later
- A MongoDB database (for example MongoDB Atlas)

### Setup

```bash
git clone https://github.com/havor13/skill-share-hub.git
cd skill-share-hub/skill-share-hub
npm install
```

Create a `.env.local` file in the project root (the folder with `package.json`):

```
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a-long-random-string
```

Run the app:

```bash
npm run dev
```

Open http://localhost:3000.

### Useful commands

```bash
npm run lint          # ESLint
npx tsc --noEmit      # type check
npm run build         # production build
```

### Admin accounts

New accounts are regular users. To make a user an admin, use the helper script in `scripts/set-user-role.ts` (run it with `npx tsx` from the project root).

## Deployment

The app is deployed on Vercel. Set these environment variables in the Vercel project settings:

| Variable | Value |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | long random string |
| `NEXTAUTH_URL` | `https://skill-share-hub-eta.vercel.app` (the production URL, not localhost) |

Redeploy after changing environment variables.

## Project structure

```
app/
  api/
    auth/               signup and NextAuth routes
    tutorials/          tutorial, rating and comment routes
  (auth)/login          login page
  signup                sign-up page
  tutorials/            list page
  tutorials/new         create page
  tutorials/[id]        detail page
  tutorials/[id]/edit   edit page
components/             reusable UI (tutorial card, filter, search, forms, rating widget, comments, ...)
hooks/                  useRatings, useComments
lib/                    dbConnect, authOptions, categories, API helpers
models/                 Mongoose models (User, Tutorial)
```

## API documentation

All responses are JSON. Errors have the form `{ "error": "message" }`.

### Authentication

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create an account. Body: `name`, `email`, `password`. Returns 409 if the email already exists. |
| POST | `/api/auth/callback/credentials` | Log in (handled by NextAuth; use `signIn('credentials')`). |
| GET | `/api/auth/session` | Current session, including user `id` and `role`. |
| POST | `/api/auth/signout` | Log out. |

### Tutorials

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/tutorials` | Public | List tutorials. Optional query params: `search` (text) and `category`. |
| POST | `/api/tutorials` | Logged in | Create a tutorial. Body: `title`, `description`, `category`, `contentUrl`. |
| GET | `/api/tutorials/:id` | Public | Get one tutorial. |
| PUT | `/api/tutorials/:id` | Owner or admin | Update a tutorial. |
| DELETE | `/api/tutorials/:id` | Owner or admin | Delete a tutorial. |

Status codes: `401` when not logged in, `403` when logged in but neither the owner nor an admin, `400` for an invalid id, `404` when the tutorial does not exist.

### Ratings

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/tutorials/:id/ratings` | Public | Ratings for a tutorial plus the average and count. |
| POST | `/api/tutorials/:id/ratings` | Logged in | Submit a rating. Body: `value` (integer 1 to 5). Returns 201 for a new rating and 200 when updating your existing rating. |

### Comments

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/tutorials/:id/comments` | Public | List comments for a tutorial, oldest first, with author names. |
| POST | `/api/tutorials/:id/comments` | Logged in | Add a comment. Body: `text` (1 to 1000 characters). Returns 201. |
| DELETE | `/api/tutorials/:id/comments/:commentId` | Comment author or admin | Delete a comment. Returns 403 for anyone else. |

## Known issues and opportunities

- Comments cannot be edited after posting, and long comment lists are not paginated.
- The comments UI does not have a delete button yet (deleting is available through the API).
- **Performance:** the mobile Lighthouse performance score has room to improve (font loading, client-side JavaScript, image optimization).
- Future ideas: comment editing and a delete button, user profile page, tutorial bookmarks, pagination for the tutorial and comment lists.

## Workflow

Work is done on feature branches and merged through pull requests, each linked to a GitHub issue on the project board.