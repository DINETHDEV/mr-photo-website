<div align="center">

<img src="frontend/public/images/logo.png" alt="MR Photo Logo" width="100" />

# MR · PHOTO 📸

### *Value For Every Customer*

**Premium Photo Restoration, Design & Printing Studio — Sri Lanka**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448C5?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

> A production-ready full-stack studio platform with a premium glassmorphic UI, real-time admin dashboard, Cloudinary image uploads, and WhatsApp integration — deployed as a single monolith on Render.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Premium UI** | Glassmorphism, neon gradients, Framer Motion animations |
| 🖼️ **Previous Projects Gallery** | Category-filtered gallery synced with admin dashboard |
| 💼 **Services & Pricing** | Dynamic service management with Full Package, Frame Only, and more |
| 🎁 **Gift Packages** | Curated bundles with feature lists and cover images |
| 📦 **Order System** | Customer orders with image upload, WhatsApp redirect |
| ⚙️ **Admin Dashboard** | Full CRUD — orders, services, packages, gallery, reviews |
| 📊 **Order Tracking** | Pending → Processing → Completed → Cancelled with delete |
| ⭐ **Customer Reviews** | Review moderation and public display |
| 🌐 **WhatsApp Integration** | Direct WhatsApp contact from orders and Contact page |
| 🚀 **Monolith Deployment** | Frontend + Backend on a single Render service |

---

## 🛠️ Tech Stack

```
Frontend  →  Next.js 14 (Static Export) · Tailwind CSS · Framer Motion · Lucide Icons
Backend   →  Node.js · Express.js · JWT Auth · Multer
Database  →  MongoDB Atlas (Mongoose ODM)
Storage   →  Cloudinary (Image uploads)
Deploy    →  Render (Monolith — single service)
```

---

## 📁 Project Structure

```
mr-photo/
├── frontend/              # Next.js 14 App (Static Export)
│   ├── app/
│   │   ├── page.js        # Home page
│   │   ├── portfolio/     # Previous Projects gallery
│   │   ├── services/      # Services & Pricing
│   │   ├── packages/      # Gift Packages
│   │   ├── order/         # Order form
│   │   ├── contact/       # Contact page
│   │   └── admin/         # Admin Panel (protected)
│   │       ├── page.js    # Dashboard
│   │       ├── orders/    # Orders management
│   │       ├── products/  # Services management
│   │       ├── packages/  # Packages management
│   │       ├── portfolio/ # Gallery management
│   │       └── reviews/   # Reviews moderation
│   ├── components/        # Navbar, Footer, GlassCard, etc.
│   └── utils/             # API helpers
│
├── backend/               # Express API
│   ├── routes/            # auth, products, packages, orders, portfolio, reviews
│   ├── models/            # Mongoose schemas
│   ├── middleware/         # JWT protect, admin guard
│   ├── utils/             # Cloudinary config
│   └── scripts/           # seed.js (admin user)
│
├── package.json           # Root scripts (monolith)
├── render.yaml            # Render deployment config
└── server.js              # Entry point
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mr-photo.git
cd mr-photo
```

### 2. Install all dependencies

```bash
npm run install-all
npm install concurrently --save-dev
```

### 3. Configure environment variables

**`backend/.env`**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🔑 Admin Access

Seed the default admin account after your database is connected:

```bash
npm run seed
```

## 🏃 Running Locally

### Development (Frontend + Backend together)

```bash
npm run dev
```

- Frontend → `http://localhost:3000`
- Backend API → `http://localhost:5000/api`

### Production Build (Monolith)

```bash
npm run build-production
npm start
```

---

## 🚀 Deploy to Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New +** → **Blueprint**
3. Connect your GitHub repository
4. Render reads `render.yaml` and sets up the monolith automatically
5. Add your environment variables in the Render dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

---

<div align="center">

Made with ❤️ by **GridX Dev Studio**

*© 2025 MR Photo Studio · All Rights Reserved*

</div>
