# Chronoxio Backend

Chronoxio is a **task management & productivity platform** that helps users track their tasks, monitor productivity, and generate weekly reports.  
This repository contains the **backend** built with **Node.js, Express, MongoDB, JWT authentication, and role-based access control (RBAC).**

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Register, login, change password, forgot/reset password
  - JWT-based auth with refresh tokens
  - Role-based access (`user`, `admin`)
- ✅ **Task Management**
  - Create, update, delete tasks
  - Mark tasks as complete / auto-expire
  - Weekly reports
- 👤 **User Management**
  - User profile (`/me`)
  - Leaderboard
  - Admin controls (get all users, deactivate users)
- 📊 **Reports**
  - Weekly task reports (Mon → Sun, Malaysia Time)

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+ recommended)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (Access & Refresh Tokens)
- **Validation**: Zod
- **Error Handling**: Custom `AppError` + centralized middleware

---

## 📂 Project Structure

```
src/
├── app/
│ ├── modules/
│ │ ├── auth/ # Authentication (register, login, reset password)
│ │ ├── task/ # Task CRUD + reporting
│ │ └── user/ # User profiles, leaderboard, admin
│ ├── middlewares/ # Auth, validation, error handling
│ ├── utils/ # Helpers (jwt, bcrypt, AppError, etc.)
│ └── config/ # Config (env vars, database)
├── server.ts # Entry point
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/chronoxio-backend.git
cd chronoxio-backend
```

### 2. Install Dependencies

```
npm install
```

### 3. Environment Variables

Create a **.env** file at the root:

```
PORT=5000
NODE_ENV=development

# MongoDB
DATABASE_URL=mongodb://127.0.0.1:27017/chronoxio

# JWT
JWT_ACCESS_SECRET=yourAccessSecret
JWT_REFRESH_SECRET=yourRefreshSecret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. Run Development Server

```
npm run dev
```

### 5. Build & Run Production

```
npm run build
npm start
```

## 🔑 Authentication Flow

- Register → `/api/v1/auth/register`
- Login → /api/v1/auth/login → returns `accessToken`
- Access protected routes with Authorization: `<token>`
- Change password (logged-in user) → `/api/v1/auth/change-password`
- Forgot/Reset password flow supported

## 📡 API Routes

- Auth `(/api/v1/auth)`
- POST `/register` → Create new user
- POST `/login` → Login user
- PATCH `/change-password` → Change password
- POST `/forgot-password` → Send reset token
- POST `/reset-password` → Reset password

### Tasks (/api/v1/tasks)

- `POST /`create → Create task
- `GET /` → Get all tasks (user-specific or admin view)
- `PUT /complete/:id` → Complete task
- `PATCH /update/:id` → Update task
- `DELETE /delete/:id` → Delete task
- `GET /report/weekly` → Weekly productivity report

### Users (/api/v1/users)

`GET /all` → Get all users (admin only)
`GET /me` → Get current user
`PATCH /update/me` → Update current user
`PATCH /deactivate/:id` → Deactivate user (admin)
`GET /leaderboard` → Get leaderboard stats

## 🧑‍💻 Developer Manual

## Code Style

- Use TypeScript strict mode
- Lint with ESLint + Prettier
- Keep controllers thin → business logic should live in services

### Adding a New Module

1. Create folder under modules/<name>
2. Define:

- <name>.model.ts → Mongoose schema
- <name>.service.ts → Business logic
- <name>.controller.ts → Route handlers
- <name>.validation.ts → Zod schema
- <name>.route.ts → Express router

3. Export in app/routes/index.ts

## Commit Conventions

Follow `Conventional Commits`:

```
feat(task): add deadline field
fix(auth): hash password before save
docs(readme): update setup instructions
```

## 🧪 Testing

- Run tests (if Jest setup):

```
npm run test
```

## 🛡️ Security Notes

- Always hash passwords with bcrypt before saving
- JWT secrets must be long & random
- Use HTTPS in production
- Rate-limit login & reset-password endpoints

## 📈 Future Roadmap

- Email notifications (task reminders)
- Multi-device session management
- Analytics dashboard
- Role-based reports (team leader vs user)

## 🤝 Contributing

1. Fork repo
2. Create feature branch: git checkout -b feat/new-feature
3. Commit changes
4. Push and create PR 🚀

## 👥 Contributors

- **Aro Arko** — Project Manager & Lead Developer
- **Irfan** — Frontend Developer & System Analyst
- **Lawrance** — QA Analyst
- **Abyaz Ahmed** — Business Analyst

---

## 📜 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this software with attribution.
