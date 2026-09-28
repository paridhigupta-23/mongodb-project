# StackWorks — Campus Connect

**Code for Change with MongoDB | KL University**

StackWorks is a campus event management and analytics prototype built around MongoDB. It helps students discover events, register for them, and gives organizers a simple dashboard for registrations and event analytics.

## Problem

Campus events often rely on disconnected forms, spreadsheets, and manual registration tracking. This makes it difficult to maintain participant data, prevent duplicate registrations, and quickly understand event participation.

## Solution

Campus Connect provides:

- Student event discovery
- Event registration with duplicate-registration protection
- Organizer dashboard with registration analytics
- MongoDB aggregation pipelines for event statistics
- Indexed queries for common event and registration lookups
- MongoDB transactions for registration + seat-count updates
- Structured Mongoose schemas and validation
- Seed data for quick demonstration

## MongoDB Concepts Demonstrated

### 1. Schema Design
Separate collections are used for:
- Users
- Events
- Registrations

References connect users, events, and registrations while keeping the core documents focused.

### 2. Indexing
Indexes are defined for:
- Event status/date queries
- Event category
- Registration user + event uniqueness
- Registration event lookups

### 3. Aggregation
The dashboard uses MongoDB aggregation to calculate:
- Total registrations
- Registrations by event
- Registrations by category
- Event capacity utilization

### 4. Transactions
Registration uses a MongoDB transaction to:
1. Verify the event and available seats.
2. Create the registration.
3. Increment the event's registered-seat count.

If any operation fails, the transaction is rolled back.

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **API:** REST
- **Environment:** Node.js 18+

## Project Structure

```text
StackWorks-MongoDB-Project/
├── public/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── src/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── seed.js
├── docs/
│   └── architecture.svg
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure MongoDB

Create a MongoDB database locally or use MongoDB Atlas.

Copy:

```bash
.env.example
```

to:

```bash
.env
```

Then set your MongoDB connection string.

Example:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/stackworks_campus
```

### 3. Seed demonstration data

```bash
npm run seed
```

### 4. Start the application

```bash
npm start
```

Open:

```text
http://localhost:5000
```

For development:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Get one event |
| POST | `/api/registrations` | Register for an event |
| GET | `/api/registrations/user/:userId` | Get user registrations |
| GET | `/api/analytics/overview` | Dashboard overview |
| GET | `/api/analytics/events` | Event registration analytics |

## Demo Flow

1. Open the dashboard.
2. Browse upcoming campus events.
3. Click **Register**.
4. Select a seeded student.
5. Complete registration.
6. Observe the event's registered-seat count update.
7. Open the analytics section to see MongoDB aggregation results.

## Team

| Member | Role |
|---|---|
| Paridhi Gupta | Team Leader |
| Syed Ubaid Ur Rehman Bukhari | Team Member |
| Vanshika Agarwal | Team Member |
| Tirumala Venkata Balaji Saharsh | Team Member |

## Project Status

This repository contains a functional prototype demonstrating a MongoDB-backed campus event workflow. It is intended for hackathon evaluation and further development.

## Future Scope

- Authentication and role-based access
- QR-based event check-in
- Email notifications
- Advanced organizer controls
- Attendance prediction
- Event recommendation system
- Deployment with managed MongoDB Atlas

## Architecture

See [`docs/architecture.svg`](docs/architecture.svg).
