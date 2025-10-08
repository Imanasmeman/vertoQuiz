
# VertoQuiz Platform Documentation

VertoQuiz is a full-stack quiz management and participation platform for organizations and students. It features secure authentication, a dynamic quiz system, bulk question uploads, and detailed quiz attempt tracking, with clean, modern frontend interfaces.

***

## Table of Contents

- Platform Overview
- Backend Structure
  - Models
  - API Routes & Endpoints
  - Auth Workflow
- Frontend Structure
  - Pages & UI Flow (with screenshots integration reference)
  - Route Map
  - State Management
- User & Organization Features
- API Examples
- Development Tips & Extensions

***

## Platform Overview

VertoQuiz supports:
- Organizations uploading/bulk-adding questions, creating & launching quizzes, tracking results.
- Students viewing assigned quizzes, attempting within deadlines, and reviewing results.
- Modern, minimal UI for both roles.

***

## Backend Structure

### Models

- **User:** name, email, hashed password, role (`student` | `organization`).
- **Question:** text, subject, options, correctAnswer, organizationId.
- **Quiz:** title, description, questions (array), duration, deadline, allowedUsers (array of user emails), organizationId.
- **QuizAttempt:** quizId, userId, answers [{questionId, selectedOption, isCorrect}], status (`started` | `completed` | `blocked`), score, startTime, endTime.

### API Routes (Highlights)

#### Auth & User

| Endpoint                  | Method | Description                           | Auth Required |
|:--------------------------|:-------|:--------------------------------------|:--------------|
| /register                 | POST   | Register as `student` or `organization` | No            |
| /login                    | POST   | Login, get tokens                     | No            |
| /refresh                  | POST   | Get new access token                  | Cookie        |
| /logout                   | POST   | Logout, clear refresh token           | Yes           |
| /profile                  | GET    | User profile                          | Yes           |

#### Student

| Endpoint                    | Method | Description                                  |
|:----------------------------|:-------|:---------------------------------------------|
| /all-quiz                   | GET    | List all available quizzes for student       |
| /quiz/:id/start             | GET    | Start or resume a quiz                       |
| /quiz/:id/submit            | POST   | Submit quiz answers                          |
| /quiz-attempts              | GET    | List past quiz attempts                      |
| /:attemptId/quiz-attempt-detailed | GET | Detailed result for an attempt              |

#### Organization

| Endpoint           | Method | Description                                                                    |
|:-------------------|:-------|:-------------------------------------------------------------------------------|
| /quizzes           | GET    | List all quizzes created by org                                                |
| /add-questions     | POST   | Bulk upload questions                                                          |
| /questions         | GET    | View all created questions                                                     |
| /create-quiz       | POST   | Create & launch a new quiz                                                     |
| /orgquiz-attempts/:quizId | GET | See student attempts/results for a quiz                                  |

***

### Auth Workflow

- JWT-based authentication. Access tokens (short-lived) and refresh tokens (in HttpOnly cookie).
- Middleware checks token & role, attaches user info to requests.
- Secure routes for both `student` and `organization` users.

***

## Frontend Structure

### Core Folders

| Folder           | Purpose                                                        |
|:-----------------|:--------------------------------------------------------------|
| api/             | All API services (`api.js`)                                   |
| assets/          | App images, logos                                             |
| context/         | Shared React context, e.g., `AuthContext.jsx` for auth state  |
| pages/           | All main routes (“dashboard”, “quizstart”, etc.)              |

### Page Components & UI Flow

**[Student Side]**

- Dashboard: Lists all new quizzes assigned. “No New Quizzes” if all are completed.  
  ![Dashboard Screenshot][1]
- Attempted: List of past quiz attempts with score, status, and a “View Details” button for each attempt.  
  ![Attempts Screenshot][2]
- Quiz Taking: Question navigation on the left, legend for statuses (answered, marked, unattempted), time left indicator, radio options, mark for review.  
  ![Quiz Page Screenshot][3]
- Result: (Not shown, but links directly from attempted)

**[Organization Side]**

- My Quizzes: Shows cards for each created quiz, number of questions, simple info.  
- Add Questions: Opens bulk upload (from org top menu).
- Launch Quiz: UI for quiz creation, selection of questions and allowed users.
- Quiz Attempts: See all user attempts/results for each quiz.

**[General]**

- Navigation header with: Dashboard, Attempted, About User/Profile, Logout.

### Route Map

| Path             | Component           | Role           |
|:-----------------|:--------------------|:---------------|
| /                | Dashboard           | student        |
| /attempted       | Attempts List       | student        |
| /quizstart       | Quiz Attempt        | student        |
| /aboutuser       | User Info           | both           |
| /login           | Auth                | both           |
| /register        | Auth                | both           |
| /org             | Org Dashboard       | organization   |
| /org/addq        | Add Questions       | organization   |
| /org/launch      | Launch Quiz         | organization   |

### State Management

- Uses React Context (AuthContext) for authentication and user state.
- API services use tokens from context/local storage/cookie as required.
- Navigation adapts to role (`student`/`organization`) after login.

***

## User & Organization Features

### Student Features

- View assigned quizzes and available deadlines.
- Take assigned quizzes with timer and question navigation.
- Mark questions for review.
- Submit quizzes; see scores immediately after submit.
- Review history and see previous attempt details.

### Organization Features

- Register/login as an org user.
- Bulk or single question upload.
- Create quizzes from question bank, set deadlines, assign to users.
- View all published quizzes in dashboard.
- Track detailed quiz attempts and results.
- Clean, quick switch between question upload and quiz launch from header.

***

## API Request Examples

**Student: Submit a quiz:**

```json
POST /quiz/<quizId>/submit
Headers: { "Authorization": "Bearer <accessToken>" }
Body:
{
  "answers": [
    { "questionId": "...", "selectedOption": "..." }
  ]
}
```

**Organization: Bulk Question Upload**

```json
POST /add-questions
Headers: { "Authorization": "Bearer <accessToken>" }
Body:
{
  "questions": [
    {
      "text": "...",
      "subject": "...",
      "options": ["...", "..."],
      "correctAnswer": "...",
    }
  ]
}
```

**Organization: Create a Quiz**

```json
POST /create-quiz
Headers: { "Authorization": "Bearer <accessToken>" }
Body:
{
  "title": "...",
  "description": "...",
  "questions": ["<questionID1>", "<questionID2>"],
  "duration": 30,
  "deadline": "2025-12-31T23:59:00Z",
  "allowedUsers": [
    "student1@email.com",
    "student2@email.com"
  ]
}
```

***

## Development & Extension Tips

- Add user notifications for quiz availability and result publication.
- Integrate analytics for detailed performance.
- Enhance question editing and randomization.
- Extensive mobile responsiveness for all pages.
- Add role-based dashboard widgets and filters.
- Implement proctoring features or webcam monitoring if needed.

***


***

This documentation covers VertoQuiz's data model, backend and frontend structure, and UI/UX workflows for maximum clarity and maintainability.[2][4][3][1]

