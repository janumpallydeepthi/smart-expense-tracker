# Smart Expense Tracker
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-5.2-black?logo=express)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-authentication-orange?logo=jsonwebtokens)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full‑stack web application for tracking income and expenses, visualizing spending habits, and managing personal finances – built with **React**, **Node.js**, **Express**, and **PostgreSQL**.

## Live Demo

[https://smart-expense-tracker-six-snowy.vercel.app](https://smart-expense-tracker-six-snowy.vercel.app)
---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Future Plans](#future-plans)
- [Author](#author)

---

## Features

| Area | Details |
|------|---------|
| **🔐 Authentication** | Secure signup/login with JWT, password hashing (bcrypt), and protected routes |
| **📊 Dashboard** | Interactive charts (Pie, Bar, Line) showing expense distribution, monthly trends, spending patterns |
| **💳 Expense Management** | Add, edit, delete, and view expenses with custom categories |
| **🔍 Filtering & Sorting** | Search by category/amount, filter by category, sort by amount/date/category |
| **📱 Responsive UI** | Clean, modern design with a collapsible sidebar and glass-morphism effects |
| **🧑‍💻 User Profile** | View user info, logout, and account deletion (with cascade delete of all expenses) |
| **📈 Analytics** | Quick stats: total expenses, average, highest transaction, and transaction count |

---

## Tech Stack

**Frontend**
- [React](https://reactjs.org/) (v19) – UI library
- [React Router](https://reactrouter.com/) (v7) – routing
- [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) – data visualisation
- [Axios](https://axios-http.com/) – HTTP client
- [React Icons](https://react-icons.github.io/react-icons/) – icon set

**Backend**
- [Node.js](https://nodejs.org/) (v18+) – runtime
- [Express](https://expressjs.com/) (v5) – web framework
- [PostgreSQL](https://www.postgresql.org/) (v16) – relational database
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) – JWT handling
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) – password hashing
- [dotenv](https://github.com/motdotla/dotenv) – environment variables

---

## Architecture
```
client/                        # React frontend
├── public/
├── src/
│   ├── components/            # Reusable UI (Layout, Sidebar, Navbar)
│   ├── pages/                 # Login, Register, Dashboard, Expenses, Add/Edit Expense
│   ├── routes/                # AppRoutes, ProtectedRoute
│   ├── services/              # Axios instance with JWT interceptor
│   ├── constants/             # Shared category list
│   └── App.js
server/                        # Node.js backend
├── config/                    # Database connection (db.js)
├── controllers/               # Auth, Expense, User logic
├── middleware/                # JWT authentication
├── routes/                    # API route handlers
├── .env                       # Environment variables (not committed)
└── server.js                  # Entry point
```

---

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js** (v18 or later) – [Download](https://nodejs.org/)
- **PostgreSQL** (v16 or later) – [Download](https://www.postgresql.org/download/)
- **Git** (optional, for cloning)

---

### 1. Clone the repository

```bash
git clone https://github.com/janumpallydeepthi/smart-expense-tracker.git
cd smart-expense-tracker
```

---

### 2. Backend Setup

#### 2.1 Navigate to the server folder

```bash
cd server
```

#### 2.2 Install dependencies

```bash
npm install
```

#### 2.3 Create a `.env` file

Create a file named `.env` in the `server` directory with the following content:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=expense_tracker
DB_PASSWORD=your_password_here
DB_PORT=5432
JWT_SECRET=your_secure_jwt_secret
```

> Replace `your_password_here` and `your_secure_jwt_secret` with your actual PostgreSQL password and a random string for JWT signing.

#### 2.4 Set up the database

Launch PostgreSQL and run the following commands to create the database and tables:

```sql
CREATE DATABASE expense_tracker;
\c expense_tracker;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  amount INT,
  category TEXT,
  date DATE,
  description TEXT
);
```

> You can also run these from the command line using `psql -U postgres -f setup.sql` if you save them in a file.

#### 2.5 Start the backend server

```bash
npm run dev
```

The server will run at `http://localhost:3001` by default.

---

### 3. Frontend Setup

#### 3.1 Navigate to the client folder

```bash
cd ../client   # or open a new terminal and go to the client folder
```

#### 3.2 Install dependencies

```bash
npm install
```

#### 3.3 Create a `.env` file (optional)

If you need to change the API base URL, create a `.env` file in the `client` folder:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

(If omitted, the default `http://localhost:3001/api` will be used.)

#### 3.4 Start the React development server

```bash
npm start
```

The app will open at `http://localhost:3000` (or another available port).

---

### 4. Using the application

- **Register** a new account with your name, email, and password.
- **Login** with the same credentials.
- Start adding expenses, view your dashboard, and manage your finances!

---

### 5. (Optional) Running with Docker

If you prefer Docker, you can use the provided `docker-compose.yml` (if available) or create your own. Otherwise, the manual setup above works perfectly.

---

### 6. Troubleshooting

- **Database connection errors**: Ensure PostgreSQL is running and the credentials in `.env` are correct.
- **Port conflicts**: Change the `PORT` in `server/.env` or the `REACT_APP_API_URL` accordingly.
- **JWT issues**: Make sure `JWT_SECRET` is set and not empty.

---

That's it! You now have a fully functional Smart Expense Tracker running on your local machine. 🎉

---

## Future Plans
- Mobile app (React Native)
- Budget goals per category with progress bars
- Recurring expenses automation
- CSV export of transactions
- Email notifications for budget limits
- Dark mode

---

## Author
**Deepthi Janumpally**
- Github: https://github.com/janumpallydeepthi
- LinkedIn: https://linkedin.com/in/deepthi-janumpally
