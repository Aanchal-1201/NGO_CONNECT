# NGO Connect — Collaborative NGO Platform

NGO Connect is a modern, cross-platform application designed to bridge the gap between Non-Governmental Organizations (NGOs), volunteers, and donors. Built with a robust **Node.js/Express** backend and a responsive **React/Vite/Capacitor** frontend, the platform features interactive mapping, database ORM syncing, and generative AI features.

---

## 🚀 Key Features

*   **Interactive NGO Discovery**: Locate nearby active NGOs, events, and donation centers on a map utilizing **Mapbox GL** and **Capacitor Geolocation**.
*   **NGO & User Authentication**: Secure login and session management using JWT and Bcrypt password hashing.
*   **AI-Powered Assistants**: Built-in AI assistants integrated with **Google Gemini (`@google/generative-ai`)** and **Groq Llama (`groq-sdk`)** to support volunteer matching, answer community queries, and analyze platform data.
*   **Media & Document Uploads**: Submit verification documents or upload media utilizing **Multer** file management on the backend.
*   **Relational Database Sync**: Multi-dialect SQL database schema managed via **Sequelize ORM** (fully compatible with MySQL and PostgreSQL).
*   **Cross-Platform Deployments**: Prepared for Android, iOS, and Web outputs powered by **Capacitor CLI**.

---

## 🛠 Project Structure

The project is split into two primary components:

### 📁 1. Frontend (`/frontend`)
*   **Core**: React 19, React Router v7, and Vite bundler.
*   **Mapping**: Mapbox GL integration (`mapbox-gl`).
*   **Native Wrappers**: Capacitor Core, Geolocation, Android, and iOS SDKs.
*   **Run Commands**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### 📁 2. Backend (`/Backend`)
*   **Core**: Express.js, Sequelize ORM.
*   **Databases**: PostgreSQL (`pg`), MySQL (`mysql2`).
*   **AI SDKs**: Google GenAI, Groq SDK.
*   **Run Commands**:
    ```bash
    cd Backend
    npm install
    npm run dev   # Runs with nodemon auto-restart
    ```

---

## 📦 Database Initialization
A pre-configured SQL database schema is included in the backend:
*   File: `Backend/ngoconnect_dump.sql`
*   Import this dump into your local MySQL or PostgreSQL instance to pre-populate tables for NGOs, users, events, and categories.

---

## 🔧 Environment Variables Setup

Ensure you configure the `.env` files in both directories before starting the apps:

### Backend `.env` (`Backend/.env`):
```env
PORT=5000
DB_HOST=127.0.0.1
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=ngoconnect
JWT_SECRET=your_jwt_signing_secret
GEMINI_API_KEY=your_google_gemini_key
GROQ_API_KEY=your_groq_sdk_key
```

### Frontend `.env` (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```
