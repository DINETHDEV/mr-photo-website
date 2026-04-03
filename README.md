# MR Photo — Premium Full-Stack Studio Platform (Monolith)

A production-ready web application for photo restoration, design, and printing services. Featuring a premium glassmorphic UI, real-time admin dashboard, and WhatsApp integration.

## 🚀 Features

- **Premium UI/UX**: Next.js 14 with Framer Motion, glassmorphism, and neon gradients.
- **Portfolio Gallery**: Before/After image comparison sliders with category filtering.
- **Service Management**: Dynamic pricing for prints (A4, A3), frames, and restoration.
- **Gift Packages**: Specially curated gift bundles for customers.
- **Order System**: Image upload with Cloudinary support and automatic WhatsApp redirection.
- **Admin Dashboard**: Full CRUD for all data, order status tracking, and review moderation.
- **Unified Deployment**: Both frontend and backend run on a **single Render service** (Monolith).

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (Static Export), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express.js (serving the static frontend).
- **Database**: MongoDB (Mongoose).
- **Storage**: Cloudinary (Image uploads).
- **Language**: JavaScript (ES6+).

---

## 📦 Installation & Setup

1. **Install Dependencies**: Run this in the **root** folder:
   ```bash
   npm run install-all
   npm install concurrently --save-dev
   ```

2. **Configure Environment**:
   - Create `backend/.env` based on `backend/.env.example`.
   - Create `frontend/.env.local` pointing to `http://localhost:5000/api`.

---

## 🔑 Admin Access

1. **Seed the Admin**: Run this in the **root** folder after connecting your database:
   ```bash
   npm run seed
   ```
2. **Default Credentials**:
   - Email: `mrphoto444@gmail.com`
   - Password: `adminpassword123`

---

## 🏃 Running the Application

### Development Mode (Both together)
From the **root** folder:
```bash
npm run dev
```

### Production Build (Monolith)
From the **root** folder:
```bash
npm run build-production
npm start
```

---

## 🚀 Deployment to Render

1.  **New +** -> **Blueprint**.
2.  Connect your GitHub repository.
3.  Render will read `render.yaml` and set up the **Monolith** automatically.
4.  Provide your **MongoDB** and **Cloudinary** credentials in the Render dashboard.

---

## 📸 Project Structure
- `/frontend`: Next.js application (Builds to `/frontend/out`).
- `/backend`: Express API (Serves `/frontend/out` static files).
- `/package.json`: Root scripts to manage the unified project.
