
# 🚀 AdVantage — Digital Marketing Management System

> **AdVantage** is a modern digital marketing platform designed to help businesses manage campaigns, analyze performance, schedule content, and engage with their audiences — all from one place.

## ✨ Features

-   🔐 **User Authentication & Authorization** — Secure user access and role-based permissions.
    
-   📢 **Campaign Management** — Create, manage, and monitor marketing campaigns.
    
-   📊 **Analytics Dashboard** — Track campaign performance with clear and actionable insights.
    
-   🗓️ **Content Scheduling** — Plan and schedule content efficiently.
    
-   👥 **Audience Reports** — Understand and analyze audience engagement and behavior.
    
-   🔔 **Notification System** — Keep users informed with relevant notifications.
    
-   🛠️ **Admin Panel** — Manage users, campaigns, and platform data from a centralized dashboard.
    

## 🧰 Tech Stack

### Frontend

-   ⚛️ React.js
    
-   🎨 Tailwind CSS
    

### Backend

-   🟢 Node.js
    
-   🚂 Express.js
    

### Database

-   🐬 MySQL
    
-   🔷 Prisma ORM
    

## 📁 Project Structure

```text
AdVantage/
├── backend/
│   ├── ...
│   └── package.json
├── frontend/
│   ├── ...
│   └── package.json
├── docs/
│   └── AdVantage.postman_collection
└── README.md

```

## ⚙️ Getting Started

Follow the steps below to run AdVantage locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd AdVantage

```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev

```

The backend development server will start using the configured environment settings.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev

```

The frontend will start using the development server configuration.

> **Note:** Make sure your MySQL database is running and your backend environment variables are configured before starting the application.

## 🔑 Environment Variables

Create the appropriate `.env` file in the backend directory and configure your database and application settings.

Example:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/advantage"
PORT=5000

```

> Do not commit your `.env` file or other sensitive credentials to the repository.

## 📮 API Documentation

The project includes a **Postman API collection** containing the available API endpoints.

You can find it here:

```text
docs/AdVantage.postman_collection

```

### Importing the Collection

1.  Open **Postman**.
    
2.  Select **Import**.
    
3.  Choose `docs/AdVantage.postman_collection`.
    
4.  Import the collection.
    
5.  Configure the required environment variables, if applicable.
    
6.  Start testing the API endpoints.
    

## 📊 Platform Overview

AdVantage brings the core tools of digital marketing management into a single platform:

```text
                 ┌─────────────────────────┐
                 │       AdVantage         │
                 └────────────┬────────────┘
                              │
       ┌──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
  📢 Campaigns           📊 Analytics          🗓️ Scheduling
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Audience Reports  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Notifications   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │    Admin Panel    │
                    └───────────────────┘

```

## 👩‍💻 Creators

Developed with creativity, teamwork, and passion by:

-   **Enea Kukaj**
    
-   **Hana Beqa**
    
-   **Rina Murtezi**
    
-   **Vesa Beqa**
    

## 💙 Our Message

> We truly enjoyed working on this project and are proud of what we achieved together. **AdVantage** represents our creativity, teamwork, and passion for building meaningful digital solutions.

----------
