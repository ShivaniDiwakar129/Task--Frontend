# Full-Stack Role-Based Project & Task Management System

A production-ready, full-stack application built with the MERN stack (MongoDB, Express, React, Node.js) featuring Role-Based Access Control (RBAC), advanced project/task management, and real-time dashboard analytics.

## 🌟 Features

### 1. User Authentication
- Secure Signup and Login.
- JSON Web Token (JWT) based authentication.
- Passwords securely hashed with `bcrypt`.

### 2. Role-Based Access Control (RBAC)
- **Admins**: Full control over the system. Can create/edit/delete projects, manage teams (add/remove users from projects), and create/edit/delete tasks.
- **Members**: Can view projects they are assigned to and update the status of their assigned tasks.

### 3. Project Management
- Create projects with descriptions and team members.
- Dynamic member assignment via live user search.

### 4. Task Management
- Create tasks within projects with Priorities (`Low`, `Medium`, `High`) and Due Dates.
- Move tasks across states (`To Do`, `In Progress`, `Done`).
- Members can only edit the status of tasks assigned to them.

### 5. Dashboard Analytics
- Admins get a bird's-eye view of operations:
  - Total Tasks across the system.
  - Tasks marked as `Done`.
  - Overdue tasks requiring attention.

---

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed locally OR a MongoDB Atlas connection URI

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure the `.env` file exists with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/auth_system
   JWT_SECRET=supersecretjwtkey_12345
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at `http://localhost:5173`.

---

## 🚀 Deployment Guide (Railway)

To fulfill the submission requirement of deploying this full-stack application so it is publicly accessible, follow these exact steps to deploy to [Railway](https://railway.app/).

### Step 1: Push to GitHub
1. Create a new empty repository on your GitHub account.
2. In your local terminal, navigate to the root folder (`Task`) and push the initialized git repository to your GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy Backend to Railway
1. Log in to [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Railway will auto-detect the root directory. To specify that this is the backend, go to the Service Settings -> **Root Directory** and type `/backend`.
5. Go to the **Variables** tab and add your Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas URI (You must use a cloud database like Atlas for production, not localhost).
   - `JWT_SECRET`: A secure random string.
   - `PORT`: `5000`
6. Under the **Settings** tab -> **Environment**, click **Generate Domain** so your backend gets a public URL (e.g., `https://backend-production-xyz.up.railway.app`).

### Step 3: Deploy Frontend to Railway
1. Click **New Service** in your Railway project -> **Deploy from GitHub repo**.
2. Select the *same* repository.
3. In Service Settings, set the **Root Directory** to `/frontend`.
4. In the `frontend/src/services/api.js` file (before pushing), make sure to change the `baseURL` from `http://localhost:5000/api` to your new Railway backend public URL.
   - *Pro Tip: Use `import.meta.env.VITE_API_URL` in React and set `VITE_API_URL` in Railway Variables to dynamically handle this without changing code!*
5. Under **Settings** -> **Environment**, click **Generate Domain**.
6. Railway will automatically build the Vite app and serve it. 

Your application is now live, full-stack, and publicly accessible! Submit your Frontend Railway URL, Backend Railway URL, and GitHub Repo link.
