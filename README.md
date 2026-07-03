 🚀 Collab Hub
 
 A powerful **Project Management & Collaboration API** built with Node.js, Express, and MongoDB. Manage projects, tasks, subtasks, notes, and team members with role-based access control.
 
---
 
## ✨ Features
 
- 🔐 **JWT Authentication** — Register, login, logout with access & refresh tokens
- 📧 **Email Verification** — Account verification + forgot/reset password
- 👥 **Role-Based Access Control** — Admin, Project Admin, Member roles
- 📁 **Project Management** — Full CRUD with member management
- ✅ **Task Management** — Tasks with file attachments and assignees
- 🔖 **Subtask Management** — Break tasks into smaller subtasks
- 📝 **Project Notes** — Add notes with file attachments (Admin only)
- 🛡️ **Permission Guards** — Every route protected by role validation
---
 
## 🛠️ Tech Stack
 
| Technology | Usage |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | Web Framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **Multer** | File Uploads |
| **Cookie Parser** | Cookie Handling |
| **Nodemailer** | Email Service |
 
---
 
## ⚙️ Setup & Installation
 
```bash
# 1. Clone the repository
git clone https://github.com/aarushivyas-15/collab-hub.git
cd collab-hub
 
# 2. Install dependencies
npm install
 
# 3. Create .env file
 
# 4. Start the server
npm run dev
```
 
---
 
## 🔑 Environment Variables
 
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=*
SERVER_URL=http://localhost:8000
MAILTRAP_SMTP_HOST=Your_mailtrap_host
MAILTRAP_SMTP_PORT=your_port
MAILTRAP_SMTP_USER=your_user
MAILTRAP_SMTP_PASS=your_pass
```
 
---
 
## 👮 Roles & Permissions
 
| Action | ADMIN | PROJECT_ADMIN | MEMBER |
|---|:---:|:---:|:---:|
| Create Project | ✅ | ✅ | ✅ |
| Update / Delete Project | ✅ | ❌ | ❌ |
| View Project | ✅ | ✅ | ✅ |
| Add Member | ✅ | ❌ | ❌ |
| Update / Remove Member | ✅ | ❌ | ❌ |
| Create / Update Task | ✅ | ✅ | ✅ |
| Delete Task | ✅ | ❌ | ❌ |
| Create / Update Subtask | ✅ | ✅ | ✅ |
| Delete Subtask | ✅ | ❌ | ❌ |
| Create / Update Note | ✅ | ❌ | ❌ |
| View Notes | ✅ | ✅ | ✅ |
| Delete Note | ✅ | ❌ | ❌ |
 
---
 
## 📡 API Routes
 
### 🔐 Auth Routes
**Base URL:** `/api/v1/auth`
 
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and get tokens | ❌ |
| `POST` | `/logout` | Logout user | ✅ |
| `POST` | `/current-user` | Get current logged in user | ✅ |
| `POST` | `/change-password` | Change current password | ✅ |
| `POST` | `/refresh-token` | Get new access token | ❌ |
| `GET` | `/verify-email/:verificationToken` | Verify email address | ❌ |
| `POST` | `/forgot-password` | Request password reset email | ❌ |
| `POST` | `/reset-password/:resetToken` | Reset forgotten password | ❌ |
| `POST` | `/resend-email-verification` | Resend verification email | ✅ |
 
#### 🔸 Auth Flow
 
```
Register → Verify Email → Login → Get Access Token → Use API
                                        ↓
                              Token Expired?
                                        ↓
                              POST /refresh-token → New Access Token
```
 
#### 🔸 Forgot Password Flow
 
```
POST /forgot-password (email) → Email with reset link
          ↓
POST /reset-password/:resetToken (new password) → Password changed
```
 
---
 
### 📁 Project Routes
**Base URL:** `/api/v1/projects`
 
| Method | Endpoint | Description | Required Role |
|---|---|---|---|
| `GET` | `/` | Get all my projects | Authenticated |
| `POST` | `/` | Create a new project | Authenticated |
| `GET` | `/:projectId` | Get project by ID | Admin / Member |
| `PUT` | `/:projectId` | Update project | Admin |
| `DELETE` | `/:projectId` | Delete project | Admin |
 
---
 
### 👥 Member Routes
**Base URL:** `/api/v1/projects/:projectId/members`
 
| Method | Endpoint | Description | Required Role |
|---|---|---|---|
| `GET` | `/` | Get all project members | Any Member |
| `POST` | `/` | Add member to project | Admin |
| `PUT` | `/` | Update member role | Admin |
| `DELETE` | `/` | Remove member | Admin |
 

 
### 🔖 Subtask Routes
**Base URL:** `/api/v1/projects/:projectId/tasks/:taskId`
 
| Method | Endpoint | Description | Required Role |
|---|---|---|---|
| `GET` | `/subtasks` | Get all subtasks | Any Member |
| `POST` | `/subtasks` | Create a subtask | Any Member |
| `PUT` | `/subtasks/:subtaskId` | Update a subtask | Any Member |
| `DELETE` | `/subtasks/:subtaskId` | Delete a subtask | Admin |
 

 
---
 
### 📝 Note Routes
**Base URL:** `/api/v1/notes/:projectId`
 
| Method | Endpoint | Description | Required Role |
|---|---|---|---|
| `GET` | `/` | Get all project notes | Any Member |
| `POST` | `/` | Create a note | Admin |
| `GET` | `/n/:noteId` | Get note by ID | Any Member |
| `PUT` | `/n/:noteId` | Update a note | Admin |
| `DELETE` | `/n/:noteId` | Delete a note | Admin |
 

 
---
 
## 📦 Request Examples
 
### Register
```http
POST /api/v1/auth/register

 
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "John@1234"
}
```
 
### Login
```http
POST /api/v1/auth/login

 
{
  "email": "john@example.com",
  "password": "John@1234"
}
```
 
### Create Project
```http
POST /api/v1/projects
Authorization: Bearer <access_token>

 
{
  "name": "My Project",
  "description": "Project description"
}

```
 


 
## 🏥 Health Check
 
```http
GET /api/v1/healthcheck
```
Returns `200 OK` if server is running.
 
---
 

 
<p align="center">Made with ❤️ by <strong> Aarushi Vyas </strong></p>
