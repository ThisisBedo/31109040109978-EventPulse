# EventPulse API

A production-ready RESTful API for event management, built with **Node.js, Express, MongoDB, Mongoose, and Socket.io**.

EventPulse provides authentication, role-based access control, event management, registrations, real-time announcements, validation, security protections, and automated testing.

## Author

**Abdelrahman Mohamed Elfar**

---

## Features

* **Authentication & Authorization**

  * JWT-based authentication
  * Role-based access control
  * Attendee and admin roles

* **Event Management**

  * Create, read, update, and delete events
  * Search and filtering
  * Filter by city, category, and date
  * Pagination
  * Dynamic sorting

* **Event Registrations**

  * User event registration
  * Duplicate registration prevention
  * Real-time capacity enforcement
  * View personal registrations

* **Real-Time Announcements**

  * Socket.io integration
  * Event-specific rooms
  * Live announcement broadcasting

* **Security & Validation**

  * Express Validator
  * Input sanitization
  * NoSQL injection protection
  * Centralized error handling
  * JWT authentication

* **Automated Testing**

  * Jest
  * Supertest
  * Unit tests
  * Integration tests
  * Code coverage


---

## Tech Stack

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| Node.js 18+       | Runtime                 |
| Express.js        | REST API framework      |
| MongoDB           | Database                |
| Mongoose          | MongoDB ODM             |
| Socket.io         | Real-time communication |
| JWT               | Authentication          |
| BcryptJS          | Password hashing        |
| Express Validator | Input validation        |
| Jest              | Testing                 |
| Supertest         | API integration testing |

---

## Prerequisites

Before running the project, make sure you have:

* Node.js **v18.x or higher**
* npm **v9.x or higher**
* MongoDB Atlas connection 
* Postman for manual API testing

---

## Installation

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd 31109040109978-EVENTPULSE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/eventpulse
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

> **Security:** Never commit your `.env` file or expose your JWT secret publicly.

Add `.env` to `.gitignore`:

```gitignore
node_modules/
.env
coverage/
```

---

## Database Seeding

Populate the database with initial categories, sample events, and the default administrator account:

```bash
npm run seed
```

### Default Admin Account

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@eventpulse.com` |
| Password | `Admin123!`            |

> **Important:** Change the default admin password before deploying the application to a production environment.

---

## Running the Server

### Development

Start the server with Nodemon:

```bash
npm run dev
```

### Production

Start the server normally:

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

### Health Check

Open:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "status": "success"
}
```

---

# API Testing

The following workflow can be used to test the complete application using Postman.

## 1. System Health Check

**Method:** `GET`

**URL:**

```text
http://localhost:3000/health
```

**Expected Status:**

```text
200 OK
```

---

## 2. Search and Filter Events

Events can be searched and filtered without authentication.

**Method:** `GET`

**URL:**

```text
http://localhost:3000/api/events?city=Cairo&page=1&limit=10&sortBy=date
```

**Expected Status:**

```text
200 OK
```

### Example Response

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

## 3. Register an Attendee

**Method:** `POST`

**URL:**

```text
http://localhost:3000/api/auth/register
```

**Headers:**

```text
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "attendee"
}
```

Save the returned JWT token as the **Attendee Token**.

---

## 4. Login as Admin

**Method:** `POST`

**URL:**

```text
http://localhost:3000/api/auth/login
```

**Headers:**

```text
Content-Type: application/json
```

**Body:**

```json
{
  "email": "admin@eventpulse.com",
  "password": "Admin123!"
}
```

Save the returned JWT token as the **Admin Token**.

---

## 5. Create an Event

Only administrators can create events.

**Method:** `POST`

**URL:**

```text
http://localhost:3000/api/events
```

**Headers:**

```text
Content-Type: application/json
Authorization: Bearer <ADMIN_TOKEN>
```

**Body:**

```json
{
  "title": "AI & Future Tech Summit",
  "description": "An interactive summit on modern AI developments.",
  "category": "<CATEGORY_ID>",
  "date": "2026-11-20",
  "city": "Cairo",
  "venue": "Grand Hall",
  "capacity": 100
}
```

Save the returned event `_id` as the **Event ID**.

---

## 6. Register for an Event

**Method:** `POST`

**URL:**

```text
http://localhost:3000/api/registrations
```

**Headers:**

```text
Content-Type: application/json
Authorization: Bearer <ATTENDEE_TOKEN>
```

**Body:**

```json
{
  "event": "<EVENT_ID>"
}
```

The attendee should now be registered for the event.

---

## 7. Test Duplicate Registration

Send the same registration request again.

**Method:** `POST`

**URL:**

```text
http://localhost:3000/api/registrations
```

**Headers:**

```text
Content-Type: application/json
Authorization: Bearer <ATTENDEE_TOKEN>
```

**Body:**

```json
{
  "event": "<EVENT_ID>"
}
```

**Expected Status:**

```text
400 Bad Request
```

**Expected Message:**

```text
You are already registered for this event
```

This verifies duplicate registration protection.

---

## 8. Get My Registrations

**Method:** `GET`

**URL:**

```text
http://localhost:3000/api/registrations/my-registrations
```

**Headers:**

```text
Authorization: Bearer <ATTENDEE_TOKEN>
```

**Expected Status:**

```text
200 OK
```

---

## 9. Broadcast a Real-Time Announcement

Administrators can broadcast announcements to event participants using Socket.io.

**Method:** `POST`

**URL:**

```text
http://localhost:3000/api/announcements
```

**Headers:**

```text
Content-Type: application/json
Authorization: Bearer <ADMIN_TOKEN>
```

**Body:**

```json
{
  "eventId": "<EVENT_ID>",
  "text": "The opening keynote starts 15 minutes earlier. Please arrive on time!"
}
```

**Expected Status:**

```text
201 Created
```

The announcement is broadcast through the corresponding Socket.io event room.

---

## 10. Test Unauthorized Access

An attendee should not be able to delete an event.

**Method:** `DELETE`

**URL:**

```text
http://localhost:3000/api/events/<EVENT_ID>
```

**Headers:**

```text
Authorization: Bearer <ATTENDEE_TOKEN>
```

**Expected Status:**

```text
403 Forbidden
```

**Expected Message:**

```text
You do not have permission to perform this action
```

---

# Automated Testing

EventPulse uses **Jest** and **Supertest** for automated testing.

## Run All Tests

```bash
npm test
```

## Watch Mode

```bash
npx jest --watch
```

## Generate Coverage Report

```bash
npx jest --coverage
```

---

## Test Coverage

### Integration Tests

Located at:

```text
tests/integration/events.test.js
```

Tests include:

* `GET /health`
* `GET /api/events`
* Event pagination
* Event filtering
* Category population
* Admin authorization
* Unauthorized event creation

### Unit Tests

Located at:

```text
tests/unit/
```

#### `asyncHandler.test.js`

Tests:

* Successful asynchronous route execution
* Error forwarding to `next()`
* Rejected promises inside controllers

#### `AppError.test.js`

Tests:

* Custom HTTP status codes
* Operational error handling
* Correct error status formatting

---

# Project Structure

```text
31109040109978-EVENTPULSE/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── announcementController.js
│   ├── authController.js
│   ├── eventController.js
│   └── registrationController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validateMiddleware.js
│
├── models/
│   ├── announcement.model.js
│   ├── category.model.js
│   ├── event.model.js
│   ├── registration.model.js
│   └── user.model.js
│
├── routes/
│   ├── announcementRoutes.js
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   └── registrationRoutes.js
│
├── tests/
│   ├── integration/
│   │   └── events.test.js
│   └── unit/
│       ├── AppError.test.js
│       └── asyncHandler.test.js
│
├── utils/
│   ├── AppError.js
│   └── asyncHandler.js
│
├── .env
├── .gitignore
├── package.json
├── seed.js
├── server.js
└── README.md
```

---

# API Endpoints

| Method   | Endpoint                              | Access   | Description            |
| -------- | ------------------------------------- | -------- | ---------------------- |
| `GET`    | `/health`                             | Public   | API health check       |
| `POST`   | `/api/auth/register`                  | Public   | Register a user        |
| `POST`   | `/api/auth/login`                     | Public   | Login                  |
| `GET`    | `/api/events`                         | Public   | List and search events |
| `POST`   | `/api/events`                         | Admin    | Create an event        |
| `PUT`    | `/api/events/:id`                     | Admin    | Update an event        |
| `DELETE` | `/api/events/:id`                     | Admin    | Delete an event        |
| `POST`   | `/api/registrations`                  | Attendee | Register for an event  |
| `GET`    | `/api/registrations/my-registrations` | Attendee | View registrations     |
| `POST`   | `/api/announcements`                  | Admin    | Broadcast announcement |

---

# Security

The application includes several security measures:

* JWT authentication
* Password hashing with BcryptJS
* Role-based authorization
* Request validation
* Input sanitization
* NoSQL injection protection
* Centralized error handling
* Duplicate registration protection
* Event capacity enforcement

