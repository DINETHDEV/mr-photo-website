const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Always load .env from the same folder as this file (backend/)
dotenv.config({ path: path.join(__dirname, '.env') });

// Crash early with a helpful message if critical env vars are missing
if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL: MONGODB_URI environment variable is not set!');
  console.error('On Render: Go to your service → Environment tab → Add MONGODB_URI');
  process.exit(1);
}

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/packages',  require('./routes/packages'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/reviews',   require('./routes/reviews'));
app.use('/api/orders',    require('./routes/orders'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'MR Photo API running 📸' }));

// ─── Static Files (Frontend) ──────────────────────────────────────────────────
// Serve static files from the Next.js export directory
const frontendPath = path.join(__dirname, '../frontend/out');
app.use(express.static(frontendPath));

// ─── SPA Fallback ─────────────────────────────────────────────────────────────
// For any route that doesn't match an API or static file, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─── Database & Server Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 MR Photo API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
