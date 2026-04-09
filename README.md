# 🎬 DevChill

<p align="center">
  <b>A modern movie streaming platform with AI-powered recommendations 🎥✨</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20(Vite)-blue?style=for-the-badge&logo=react">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql">
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-black?style=for-the-badge">
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge">
</p>

---

## 📖 Overview

**DevChill** is a modern movie streaming platform that allows users to:

- 🎬 Watch movies and series online (HD/4K)
- 🎥 Join live premiere rooms
- 💬 Chat in real-time while watching
- 🤖 Receive AI-powered movie recommendations
- 🎟 Manage tickets and subscriptions

The system is built with **React (Vite)** for the frontend and **Node.js + Express** for the backend, focusing on performance, scalability, and user experience.

---

## 🚀 Tech Stack

### 🎨🎨 Frontend

- React (Vite) — Fast and modern UI development
- Tailwind CSS — Clean & responsive design
- React Router v6 — Client-side routing
- Axios / Fetch API — API communication
- Framer Motion — Smooth animations
- React Icons — UI icon library
- React Toastify — Notifications
- React QR Code — QR display for tickets 

---

### 🛠 Backend

- Node.js + Express.js — RESTful API
- Sequelize ORM — Database abstraction
- PostgreSQL / MySQL — Database
- JWT — Authentication & authorization
- bcrypt — Password hashing
- Socket.IO — Real-time chat
- Stripe — Payment integration
- Helmet & CORS — Security

---

## 🤖 AI Features

- 🎯 Personalized movie recommendations
- 🔍 Smart suggestion system based on user behavior
- 💬 Chatbot for movie suggestions & Premium support

---

## 🔐 Authentication

- User registration & login
- JWT-based authentication
- Protected routes
- Role-based access control (RBAC)

---

## 🎬 Movie Streaming Features

- Browse & search movies/series
- View movie details & trailers
- Watch movies online
- Join live premiere rooms
- Real-time chat while watching

---

## 🎟 Ticket Management

- View purchased tickets
- Display ticket details
- QR code for check-in/payment
- Pagination, modal & tabs UI

---

## 💳 Premium Subscription

- Browse Premium plans
- Subscribe via Stripe
- Display plan details & expiration

---

## 🛠 Admin Features

- 🎬 Manage movies
- 📅 Manage streaming schedules
- 👥 Manage users
- 📞 Manage support requests
- 💳 Manage subscription plans
- 📊 Reports & statistics

---

## 🌍 Additional Features

- 📱 Responsive UI (desktop & mobile)
- ⚡ Smooth animations
- 🔄 Real-time updates
- 🤖 AI-powered recommendation system

---

## ⚡ Getting Started

### 🖥 Frontend

```bash
git clone https://github.com/TuanPham180704/DevChill_FE.git

cd DevChill_FE
npm install
npm run dev



```

### 🖥 Backend

```bash
git clone https://github.com/TuanPham180704/DevChill_BE.git

cd DevChill_BE
npm install
npm run dev


```

## 📂 Project Structure

### 🎨 Frontend

```bash
src/
├── api/           # Handle API calls & Axios configuration (base URL, interceptors, auth token)
├── assets/        # Static assets (images, icons, fonts, videos)
├── components/    # Reusable UI components (buttons, cards, modals, chat box, etc.)
├── layouts/       # Layout wrappers (MainLayout, AuthLayout, AdminLayout)
├── pages/         # Application pages (Home, Login, MovieDetail, Profile, Admin pages)
├── routes/        # Route definitions & access control (private routes, role-based routing)
├── schemas/       # Form validation schemas (Yup/Zod for login, register, etc.)
├── utils/         # Utility/helper functions (format date, handle errors, constants, etc.)
├── App.jsx        # Root component (routing + global providers)
├── main.jsx       # Entry point (render React app)

```

### 🛠 Backend

```bash
src/
├── controllers/    # Handle HTTP requests & responses (receive input, return output)
├── services/       # Business logic layer (process data, call models, handle core logic)
├── models/         # Database models (Sequelize schemas, table definitions)
├── routes/         # Define API endpoints and map to controllers
├── middlewares/    # Custom middleware (auth, error handling, logging, validation)
├── configs/        # Configuration files (database, environment, app settings)
├── utils/          # Helper functions (formatting, constants, reusable logic)
├── app.js          # Express app setup (middlewares, routes initialization)
├── server.js       # Entry point (start server, connect database)

```

---

## 🏗 System Architecture

- Client–Server architecture
- RESTful API communication
- WebSocket (Socket.IO) for real-time features
- AI-powered recommendation module

---

## 👨‍💻 Team

- **Pham Tuan** — Team Leader
- **Le Tat Thang**
- **Pham Duc Tuan**
- **Pham Ngoc Tai**
- **Nguyen Van Nhat Tan**

---
