# Skill Share Hub

A Next.js platform for sharing short tutorials across coding, cooking, and design.  
It supports user accounts and profiles, tutorial posting, ratings and comments, category‑based search and filtering, responsive layouts, and clear error handling.

---

## 📌 Project Overview
- **Title:** Skill Share Hub  
- **Description:** Provide bite‑sized, peer‑driven tutorials for learners who prefer quick, focused lessons.  
- **Target Audience:** Students, hobbyists, and professionals seeking practical skills without long courses.  

---
## Team-mates Names
Sampson Havor
Simone Leticia C G Plaine

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

User Stories & Acceptance Scenarios
User Story 1 – Create an account and manage a profile (P1)
Sign up with valid details → profile created.

Update bio, avatar, display name → changes saved.

Invalid data → validation feedback shown.

User Story 2 – Publish, discover, and filter tutorials (P1)
Authenticated author publishes tutorial → visible to others.

Learner searches or filters → matching tutorials shown.

No matches → empty‑state message displayed.

User Story 3 – Update and delete tutorials (P1)
Author edits tutorial → updates successfully.

Author deletes tutorial → removed from results.

Unauthorized user → blocked with error message.

User Story 4 – Rate, comment, and evaluate content (P2)
Signed‑in user submits rating/comment → stored and displayed.

Invalid feedback → rejected with guidance.

Multiple ratings → aggregate score shown.

User Story 5 – Responsive design (P2)
Mobile users can browse, manage profiles, and submit content.

Forms remain usable on smaller viewports.

⚙️ Requirements
Functional Requirements
FR‑001 → FR‑014: Authentication, profile management, tutorial CRUD, search/filter, ratings/comments, responsive design, error handling, and security.

Key Entities
User: Registered member with profile details.

Tutorial: Shared learning resource with metadata.

Category: Topical grouping (coding, cooking, design).

Rating/Feedback: Learner’s evaluation with rating + comment.

GitHub repository:https://github.com/havor13/skill-share-hub 

API Endpoints
POST /api/auth/signup → create account

POST /api/auth/login → authenticate user

GET /api/users/:id → fetch profile

PUT /api/users/:id → update profile

POST /api/tutorials → create tutorial

GET /api/tutorials → list tutorials (search/filter)

GET /api/tutorials/:id → tutorial detail

PUT /api/tutorials/:id → update tutorial

DELETE /api/tutorials/:id → delete tutorial

POST /api/tutorials/:id/ratings → submit rating/comment

GET /api/tutorials/:id/ratings → fetch ratings/comments

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
