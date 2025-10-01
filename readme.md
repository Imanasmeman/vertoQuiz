Here is your backend documentation written in a single **Markdown-formatted (`.md`) text file**:  

***

# VertoQuiz Backend Documentation

## Overview
The backend is built with **Node.js** and **Express**. It provides RESTful APIs for user registration, authentication, quiz management, and quiz attempts. **MongoDB** is used for data storage via Mongoose models.

***

## Project Structure
```
backend/
│
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── server.js              # Entry point
│
├── config/
│   └── db.js              # MongoDB connection
│
├── middlewares/
│   └── authMiddleware.js  # JWT authentication & role-based access
│
├── models/
│   ├── questionModel.js       # Question schema
│   ├── quizAttemptModel.js    # Quiz attempt schema
│   ├── quizModel.js           # Quiz schema
│   └── userModel.js           # User schema
│
├── routes/
│   ├── appRouter.js       # Main router (can combine all routes)
│   ├── orgRouter.js       # Organization routes (quiz creation, bulk add)
│   └── userRouter.js      # User routes (register, login, refresh, quiz)
```

***

## Environment Variables (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
PORT=5000
```

***

## Main Entry (server.js)
- Loads environment variables  
- Connects to MongoDB  
- Sets up Express app and middleware (including cookie-parser)  
- Mounts routers  

***

## Middlewares

**authMiddleware.js**
- Verifies JWT access token  
- Checks user role for protected routes  
- Attaches user info to `req.user`  

***

## Models

**userModel.js**
- Fields: `name`, `email`, `password`, `role (student, organization)`  
- Password is hashed before saving  

**quizModel.js**
- Fields: `title`, `description`, `duration`, `deadline`, `allowedUsers`, `questions`, `organizationId`  

**questionModel.js**
- Fields: `text`, `subject`, `options`, `correctAnswer`, `organizationId`  

**quizAttemptModel.js**
- Fields: `userId`, `quizId`, `answers`, `score`, `attemptedAt`  

***

## Routes

### 1. User Routes (`routes/userRouter.js`)

**POST /register**  
- Register a new user (student or organization)  
- Request: `{ name, email, password, role }`  
- Response: Success or error  

**POST /login**  
- Login user, returns access and refresh tokens  
- Request: `{ email, password }`  
- Response: `{ accessToken, user }` (refresh token in HttpOnly cookie)  

**POST /refresh**  
- Refresh access token using refresh token (from cookie)  
- Response: `{ accessToken }`  

**POST /logout**  
- Clears refresh token cookie  

**GET /quiz**  
- Get quizzes available for the logged-in student  
- Protected: `authMiddleware(["student"])`  
- Response: List of quizzes (if not already attempted)  

***

### 2. Organization Routes (`routes/orgRouter.js`)

**POST /bulk-add-que**  
- Bulk add questions for organization  
- Protected: `authMiddleware(["organization"])`  
- Request: `{ questions: [...] }`  
- Response: Success message and saved questions  

**POST /create-quiz**  
- Create a new quiz  
- Protected: `authMiddleware(["organization"])`  
- Request: `{ title, description, questions, duration, deadline, allowedUsers }`  
- Response: Success message and quiz data  

***

### 3. App Router (`routes/appRouter.js`)
- Can be used to combine all routers and mount them in `server.js`  

***

## Authentication Flow
1. **Register:** User registers with email, password, and role.  
2. **Login:** User logs in, receives *access token (JWT)* and *refresh token (cookie)*.  
3. **Protected Routes:** Access token required in Authorization header. Role-based access enforced by middleware.  
4. **Refresh Token:** When access token expires, client calls `/refresh` to get new access token using refresh token cookie.  
5. **Logout:** Clears refresh token cookie.  

***

## Error Handling
- All routes return proper HTTP status codes and error messages.  
- Common errors:
  - Missing fields  
  - Invalid credentials  
  - Unauthorized access  
  - Forbidden actions  
  - Server errors  

***

## Example Usage

**Register**
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

**Login**
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Create Quiz (Organization)**
```http
POST /api/org/create-quiz
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Math Quiz",
  "description": "Basic math quiz",
  "questions": ["questionId1", "questionId2"],
  "duration": 30,
  "deadline": "2025-10-10T23:59:59Z",
  "allowedUsers": ["student1@example.com"]
}
```

***

## Notes
- All passwords are hashed before saving.  
- JWT secrets must be defined in `.env`.  
- Use **cookie-parser** for refresh token functionality.  
- MongoDB connection string must be valid.  

***

## Extending
- Add more user roles if needed.  
- Add quiz attempt endpoints.  
- Add admin routes for management.  

***

Would you like me to also prepare a **README.md file structure** with installation and setup instructions so you can directly use it in your repository?
