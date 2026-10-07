# StudyBuddy

StudyBuddy is a responsive, private study planner built with React, Vite and Express. It demonstrates a clear client–server architecture: React manages the interface and Express authenticates users, protects routes and stores each student's tasks.

## Features

- Register and log in to a private student account
- Salted password hashing and token-protected Express routes
- Each user can access only their own task data
- Add a task with title, subject, deadline, priority and optional notes
- Form validation and clear feedback messages
- View all, incomplete or completed tasks
- Sort by deadline or priority
- Mark tasks complete or incomplete
- Delete tasks after confirmation
- Live progress summary
- Mobile bottom-sheet form and desktop side-panel form
- Working Dashboard, My Tasks, Resources and Settings navigation
- Search, overdue count, upcoming deadlines and weekly progress visuals
- Image-led resource cards, light/dark appearance and compact task option
- Four working subject areas: Web Development, Databases, Software Engineering and Code Lab
- Sixteen expandable study chapters containing 48 clickable lessons
- Full lesson reader with explanations, practical examples and Previous/Next navigation
- “Plan this lesson” sends the selected subject, lesson title and notes to the private task form
- Chapter completion tracking saved in the browser
- A study-task shortcut from every subject pathway
- Expanded settings for appearance, compact cards, reminders, daily study goal and comfortable text
- Tasks saved by the Express server in `server/data/tasks.json`
- User accounts saved by the Express server in `server/data/users.json`

## Demonstration account

```text
Email: zineb@example.com
Password: StudyBuddy2026!
```

The demonstration password is included only so the assessor can test the project. A real deployed application would not publish login credentials and would use HTTPS, secure cookies and a production database.

## Run the application

Open the project in VS Code. Use two terminals.

### Terminal 1: server

```powershell
cd server
npm install
npm run dev
```

The server runs at `http://localhost:3000`.

### Terminal 2: client

```powershell
cd client
npm install
npm run dev
```

Open the exact Local link printed by Vite, normally `http://localhost:5173`.

## API routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a private account |
| POST | `/api/auth/login` | Check credentials and start a session |
| GET | `/api/auth/me` | Return the logged-in user's profile |
| POST | `/api/auth/logout` | End the current session |
| GET | `/api/tasks` | Return the logged-in user's tasks |
| POST | `/api/tasks` | Create a task for the logged-in user |
| PATCH | `/api/tasks/:id` | Update an owned task's completion status |
| DELETE | `/api/tasks/:id` | Delete an owned task |
| GET | `/api/health` | Check the server |

Protected routes require an `Authorization: Bearer <token>` header. The Express middleware identifies the account and filters task data by `ownerId`.

## Study order

1. `client/src/components/AuthPage.jsx` – login and registration interface
2. `client/src/App.jsx` – authentication state, application state and API requests
3. `client/src/components/TaskForm.jsx` – controlled React form
4. `client/src/components/TaskCard.jsx` – reusable task component
5. `server/main.js` – authentication, privacy middleware, routes and validation
6. `client/src/styles.css` – visual hierarchy and responsive mobile/desktop design
