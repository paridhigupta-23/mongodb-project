# Demo Guide

## Prerequisites

- Node.js 18+
- MongoDB local instance or MongoDB Atlas

## Start

```bash
npm install
npm run seed
npm start
```

Open `http://localhost:5000`.

## Registration demo

The seed command prints the IDs of the demo students and events in the terminal.

In the browser console, set one seeded student ID:

```js
localStorage.setItem("stackworks_demo_user_id", "PASTE_STUDENT_ID_HERE")
```

Refresh the page and click **Register** on an event.

## What to demonstrate

1. Event data loaded from MongoDB.
2. Category filtering.
3. Registration request through Express.
4. Duplicate registration prevention.
5. Transactional seat update.
6. Analytics generated through aggregation.
