# Family Organiser Application

A responsive, interactive Single Page Application (SPA) designed to help families organize their schedules. Built with React, Node.js, Express, and NeDB.

## Features
- **User Authentication**: Secure registration and login for family members.
- **Event Management**: Create, view, edit, and delete family events.
- **Search & Filter**: Search events by name/location and filter by date.
- **Privacy**: Validated security ensuring users can only manage events for their own family.
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS.

## Deployment
- **Frontend**: Deployed on [Vercel](https://gcu-fewd-family-organiser.vercel.app/) (connected to GitHub).
- **Backend**: Deployed on [Render](https://gcu-fewd-family-organiser.onrender.com/) (connected to GitHub).

## Project Structure
- `frontend/`: React application (Vite).
- `backend/`: Node.js/Express API.

## Setup & Installation

### Prerequisites
- Node.js (v14+ recommended)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed
npm run start
``` 
*Note: The backend uses a local file-based database (NeDB) in `backend/data`.*

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
*Note: The project includes a `.env.example` file that already contains the link for local development. Renaming it to `.env` configures the frontend to connect to your local backend.*
*Note: Ensure the backend is running before starting the frontend.*

## API Reference

The backend exposes the following RESTful endpoints. All protected routes require a valid JWT token in the `Authorization` header.

### Authentication
- `POST /login`
    - Body: `{ "username": "...", "password": "...", "familyId": "..." }`
    - Returns: JWT token and user info.
- `POST /register`
    - Body: `{ "username": "...", "password": "...", "familyId": "..." }`
    - Returns: Success status.

### Events (Protected)
- `POST /get-family-events`
    - Headers: `Authorization: <token>`
    - Body: (None required, uses token info)
    - Returns: List of events for the user's family.
- `GET /event/:id`
    - Headers: `Authorization: <token>`
    - Returns: Single event details.
- `POST /new-event-entry`
    - Headers: `Authorization: <token>`
    - Body: Event details (`event`, `date`, `startTime`, `location`, etc.)
    - Returns: Success message.
- `POST /update-event/:id`
    - Headers: `Authorization: <token>`
    - Body: Updated event details.
    - Returns: Success message.
- `POST /delete-event/:id`
    - Headers: `Authorization: <token>`
    - Returns: Success message.

## Technologies Used
- **Frontend**: React, React Router, Tailwind CSS, Axios, React Icons.
- **Backend**: Node.js, Express, Passport.js (JWT), NeDB (embedded database).
- **Tooling**: Vite, Prettier, ESLint.

---
**Author**: Ilyas Baqqari
**Module**: Front-End Web Development
