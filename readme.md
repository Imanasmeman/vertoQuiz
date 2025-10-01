Perfect 👍 here’s a **single README.md** text that includes **both backend and frontend setup**, role details, and usage.
You can copy-paste this into one file (`README.md`) at the root of your project.

---

```markdown
# 🎯 VertoQuiz (MERN Quiz Application)

VertoQuiz is a **MERN-stack quiz management system** that supports three roles:  
- **Admin**: Super user (created manually, not via registration).  
- **Organization**: Can create quizzes, bulk upload questions, and assign quizzes to students.  
- **Student**: Can register/login, attempt quizzes, and view results.  

---

## 🚀 Features
- User authentication with **JWT (Access + Refresh tokens)**
- Role-based access control (`admin`, `organization`, `student`)
- Secure password hashing with **bcrypt**
- Quiz creation & bulk question upload (organization)
- Quiz attempt management (student)
- Access/Refresh token handling with **HttpOnly cookies**
- MongoDB + Mongoose models
- Frontend with **React + Axios interceptors**
- Protected routes with **React Router**

---

## 📂 Project Structure

```

vertoquiz/
│
├── backend/               # Express + MongoDB API
│   ├── config/            # Database connection
│   ├── middlewares/       # JWT auth, role protection
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes
│   ├── server.js          # Entry point
│   └── .env               # Environment variables
│
├── frontend/              # React app
│   ├── src/
│   │   ├── api/           # Axios setup
│   │   ├── components/    # Shared UI components
│   │   ├── context/       # Auth context
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page-level components
│   │   ├── routes/        # Route definitions
│   │   ├── styles/        # CSS/Tailwind
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md              # Project documentation

````

---

## ⚙️ Backend Setup

### 1. Environment Variables (`backend/.env`)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=5000
````

### 2. Install & Run

```bash
cd backend
npm install
npm run dev
```

### 3. API Routes

#### 🔹 User Routes (`/api/user`)

* **POST /register** → Register student/organization
* **POST /login** → Login, get `{ accessToken, user }` + refresh token (cookie)
* **POST /refresh** → Refresh access token
* **POST /logout** → Clear refresh token cookie
* **GET /quiz** → Get quizzes for student (protected)

#### 🔹 Organization Routes (`/api/org`)

* **POST /bulk-add-que** → Bulk upload questions
* **POST /create-quiz** → Create new quiz

---

## ⚙️ Frontend Setup

### 1. Install & Run

```bash
cd frontend
npm install
npm start
```

### 2. Token Management

* **Access token** stored in localStorage (short-lived)
* **Refresh token** stored in **HttpOnly cookie** (long-lived)
* Axios interceptors handle:

  * Auto-attach `Authorization: Bearer <accessToken>`
  * Refresh token when access token expires

### 3. Folder Highlights

* `context/AuthContext.js` → Manages user state + token
* `components/ProtectedRoute.js` → Role-based route guard
* `api/api.js` → Axios instance with interceptors
* `pages/` → Role-based dashboards & quiz pages

---

## 🔐 Authentication Flow

1. **Register** → Student/Organization
2. **Login** → Get tokens
3. **Access Protected Routes** → Using access token
4. **Auto Refresh** → Access token renewed via cookie
5. **Logout** → Refresh token cleared

---

## 🧩 Example API Usage

### Register

```http
POST /api/user/register
Content-Type: application/json

{
  "name": "John",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Login

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "accessToken": "xxxx.yyyy.zzzz",
  "user": {
    "id": "123",
    "email": "john@example.com",
    "role": "student"
  }
}
```

(refresh token stored in cookie)

---

## 🛡 Error Handling

* `400` → Bad request (missing fields)
* `401` → Unauthorized (invalid/expired token)
* `403` → Forbidden (role not allowed)
* `500` → Server error

---

## 👨‍💻 Author

Developed by **Your Name** 🚀

---

```

---

⚡ This way, your **README.md** covers both **backend + frontend**, setup, routes, roles, and usage in **one single file**.  

Do you also want me to include a **sample `.env` file for frontend** (like API base URL)?
```
