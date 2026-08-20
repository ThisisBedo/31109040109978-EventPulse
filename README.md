# EventPulse API

EventPulse is a feature-rich, production-ready RESTful API built with Node.js, Express, MongoDB, and Socket.io. It provides scalable event management, real-time announcements, role-based access control (RBAC), dynamic capacity management, input sanitization, and comprehensive automated test coverage.

---

## Features

- Authentication & Authorization: JWT-based authentication with role-based access (attendee, admin).
- Event Management: Full CRUD support, advanced filtering (by city, category, date), search, pagination, and dynamic sorting.
- Event Registrations: Real-time capacity enforcement, duplicate registration prevention, and user booking management.
- Real-Time Announcements: Live WebSocket notifications via Socket.io event rooms.
- Security & Validation: Strict input validation using express-validator, centralized error handling, and NoSQL injection safeguards.
- Automated Testing Suite: Unit and integration testing powered by Jest and Supertest.

---

## Tech Stack

- Runtime Environment: Node.js (v18+)
- Framework: Express.js
- Database: MongoDB & Mongoose ODM
- Real-Time Engine: Socket.io
- Testing Tools: Jest & Supertest
- Security & Auth: JSON Web Tokens (JWT), BcryptJS, Express Validator

---

## Prerequisites

Before getting started, ensure you have installed:

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Local MongoDB Service running on localhost:27017 OR a MongoDB Atlas URI
- Postman (for manual endpoint testing)

---

## Environment Configuration

Create a `.env` file in the root folder and add the following configuration variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/eventpulse
JWT_SECRET=super_secret_jwt_key_eventpulse_2026
JWT_EXPIRES_IN=7d
```

---

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed the Database
Populate initial categories, sample events, and the default Admin account:

```bash
npm run seed
```

**Seed Admin Credentials:**
- **Email:** admin@eventpulse.com
- **Password:** Admin123!

### 3. Launch Server

- **Development Mode** (with live hot-reloading via Nodemon):
  ```bash
  npm run dev
  ```

- **Production Mode:**
  ```bash
  npm start
  ```

Verify the API status in your browser or Postman at: `http://localhost:3000/health`

---

## Comprehensive Automated Testing Guide

The project uses Jest and Supertest to cover both unit utilities and integration end-to-end API routes.

### Running Test Suites

- **Run all automated tests once:**
  ```bash
  npm test
  ```

- **Run tests in Watch Mode** (triggers automatically on file save):
  ```bash
  npx jest --watch
  ```

- **Run tests with Code Coverage Report:**
  ```bash
  npx jest --coverage
  ```

### Automated Test Coverage Breakdown

#### 1. Integration Tests (`tests/integration/events.test.js`)
- `GET /health` — Validates system health and database status.
- `GET /api/events` — Verifies listing events, pagination metadata, filtering parameters, and category population.
- `POST /api/events` — Asserts role protection (rejects unauthenticated or non-admin requests with 401 Unauthorized/403 Forbidden).

#### 2. Unit Tests (`tests/unit/asyncHandler.test.js`)
- Validates execution of asynchronous route handlers.
- Asserts that rejected promises inside controller functions correctly forward errors to `next()`.

#### 3. Unit Tests (`tests/unit/AppError.test.js`)
- Ensures operational errors correctly format custom status codes (4xx/5xx) and fail/error status strings.

---

## Step-by-Step Postman Testing Guide

Follow this sequence in Postman to manually test the full application flow:

### Step 1: System Health Check
- **Method:** `GET`
- **URL:** `http://localhost:3000/health`
- **Expected Status:** `200 OK`

---

### Step 2: Query & Filter Events (Public Search)
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/events?city=Cairo&page=1&limit=10&sortBy=date`
- **Expected Status:** `200 OK`
- **Expected Response:**
  ```json
  {
    "status": "success",
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "data": [
      {
        "_id": "66f...",
        "title": "Global Tech Summit 2026",
        "description": "Annual flagship technology and AI conference.",
        "category": {
          "_id": "66f...",
          "name": "Tech"
        },
        "date": "2026-10-15T00:00:00.000Z",
        "city": "Cairo",
        "venue": "Cairo International Convention Centre",
        "capacity": 500
      }
    ]
  }
  ```

---

### Step 3: Register a New Attendee
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "attendee"
  }
  ```
> **Action:** Copy the returned token (Attendee Token).

---

### Step 4: Login as Admin
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "admin@eventpulse.com",
    "password": "Admin123!"
  }
  ```
> **Action:** Copy the returned token (Admin Token).

---

### Step 5: Create a New Event (Admin Authorization)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/events`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_TOKEN>`
- **Body (raw JSON):**
  ```json
  {
    "title": "AI & Future Tech Summit",
    "description": "An interactive summit on modern AI developments.",
    "category": "<INSERT_CATEGORY_ID>",
    "date": "2026-11-20",
    "city": "Cairo",
    "venue": "Grand Hall",
    "capacity": 100
  }
  ```
> **Action:** Copy the newly created event `_id`.

---

### Step 6: Register for an Event (Attendee Action)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/registrations`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ATTENDEE_TOKEN>`
- **Body (raw JSON):**
  ```json
  {
    "event": "<INSERT_EVENT_ID>"
  }
  ```

---

### Step 7: Test Duplicate Registration Protection (Edge Case)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/registrations`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ATTENDEE_TOKEN>`
- **Body (raw JSON):**
  ```json
  {
    "event": "<SAME_EVENT_ID_AS_STEP_6>"
  }
  ```
- **Expected Status:** `400 Bad Request` ("You are already registered for this event")

---

### Step 8: Fetch User's Registered Events
- **Method:** `GET`
- **URL:** `http://localhost:3000/api/registrations/my-registrations`
- **Headers:** `Authorization: Bearer <ATTENDEE_TOKEN>`
- **Expected Status:** `200 OK`

---

### Step 9: Broadcast Real-Time Announcement (Admin Action)
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/announcements`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_TOKEN>`
- **Body (raw JSON):**
  ```json
  {
    "eventId": "<INSERT_EVENT_ID>",
    "text": "The opening keynote starts 15 minutes earlier. Please arrive on time!"
  }
  ```
- **Expected Status:** `201 Created` (Triggers live WebSocket event to connected room clients)

---

### Step 10: Test Unauthorized Access (Error Case)
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/api/events/<EVENT_ID>`
- **Headers:** `Authorization: Bearer <ATTENDEE_TOKEN>`
- **Expected Status:** `403 Forbidden` ("You do not have permission to perform this action")

---

## Project Structure

```text
31109040109978-EVENTPULSE/
├── config/             # Database connectivity setup
│   └── db.js
├── controllers/        # Express request controllers & logic
│   ├── announcementController.js
│   ├── authController.js
│   ├── eventController.js
│   └── registrationController.js
├── middleware/         # Auth, validation, RBAC, and error handlers
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validateMiddleware.js
├── models/             # Mongoose schemas
│   ├── announcement.model.js
│   ├── category.model.js
│   ├── event.model.js
│   ├── registration.model.js
│   └── user.model.js
├── routes/             # API route definitions
│   ├── announcementRoutes.js
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── registrationRoutes.js
├── tests/              # Jest test suites (unit & integration)
│   ├── integration/
│   │   └── events.test.js
│   └── unit/
│       ├── AppError.test.js
│       └── asyncHandler.test.js
├── utils/              # Helper utilities
│   ├── AppError.js
│   └── asyncHandler.js
├── .env                # Environment variables setup
├── package.json        # Dependencies and npm scripts
├── seed.js             # DB initialization and seeder file
├── server.js           # Main application entry point & Socket.io setup
└── README.md           # API documentation & testing guide
```#   3 1 1 0 9 0 4 0 1 0 9 9 7 8 - E v e n t P u l s e  
 #   3 1 1 0 9 0 4 0 1 0 9 9 7 8 - E v e n t P u l s e  
 