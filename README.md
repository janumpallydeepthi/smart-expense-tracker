# Smart Expense Tracker
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-5.2-black?logo=express)](https://expressjs.com/)
[![JWT](https://img.shields.io/badge/JWT-authentication-orange?logo=jsonwebtokens)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full‑stack web application for tracking income and expenses, visualizing spending habits, and managing personal finances – built with **React**, **Node.js**, **Express**, and **PostgreSQL**.

**Live Demo:**
---

## Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Future Plans](#-future-plans)
- [Author](#-author)

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

## 🛠️ Tech Stack

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

## 🧱 Architecture
client/ # React frontend
├── public/
├── src/
│ ├── components/ # Reusable UI (Layout, Sidebar, Navbar)
│ ├── pages/ # Login, Register, Dashboard, Expenses, Add/Edit Expense
│ ├── routes/ # AppRoutes, ProtectedRoute
│ ├── services/ # Axios instance with JWT interceptor
│ ├── constants/ # Shared category list
│ └── App.js
server/ # Node.js backend
├── config/ # Database connection (db.js)
├── controllers/ # Auth, Expense, User logic
├── middleware/ # JWT authentication
├── routes/ # API route handlers
├── .env # Environment variables (not committed)
└── server.js # Entry point

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
Deepthi Janumpally
Github: https://github.com/janumpallydeepthi
LinkedIn: https://linkedin.com/in/deepthi-janumpally

## Live Demo
https://janumpallydeepthi.github.io/smart-expense-tracker/
