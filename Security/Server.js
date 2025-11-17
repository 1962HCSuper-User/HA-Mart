// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const generateCode = require('./utils/codeGenerator');  // ✅ CommonJS import
const rateLimit = require("express-rate-limit");



const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
const crypto = require('crypto'); // add at the top if not already

// --- CONFIG (from .env)
const {
  PORT = 3000,
  JWT_SECRET = 'jhfukhdhuqdjgjygyteyjgjeyj637dd',
  APP_HOST = `http://localhost:${PORT}`,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME
} = process.env;

// --- MySQL connection pool
const pool = mysql.createPool({
  host: DB_HOST || 'localhost',
  user: DB_USER || 'root',
  password: DB_PASS || '',
  database: DB_NAME || 'testdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'smtp.example.com',
  port: SMTP_PORT ? Number(SMTP_PORT) : 587,
  secure: SMTP_PORT === '465', // true for 465, false for others
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
});

// Health-check
app.get('/health', (req, res) => res.send('OK'));

// --- LOGIN

// 🔹 Add rate limiting to prevent brute force
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // 5 attempts
  message: { error: "Too many login attempts. Try again later." }
});

app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    // Fetch user
    const [rows] = await pool.query(
      'SELECT id, email, password FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' });

    // Generate JWT with jti (unique ID)
    const payload = { sub: user.id, email: user.email, jti: crypto.randomUUID() };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '6h' });

    const dashboardUrl = `${APP_HOST}/dashboard?token=${encodeURIComponent(token)}`;

    // Email HTML template
    const mailOptions = {
      from: FROM_EMAIL || `no-reply@${new URL(APP_HOST).hostname}`,
      to: user.email,
      subject: '🌐 Secure Dashboard Access Link (6 Hours Valid)',
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 6px 16px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(90deg, #0d6efd, #6610f2); padding: 25px; text-align: center;">
            <img src="${APP_HOST}/images/logo.png" alt="MyApp Logo" style="height:60px; margin-bottom:10px;">
            <h1 style="color:#fff; font-size:22px; margin:0;">Secure Dashboard Login</h1>
          </div>

          <!-- Body -->
          <div style="padding:30px; color:#333;">
            <p>Hello <strong>${user.email}</strong>,</p>
            <p>You requested secure access to your dashboard. Click below to proceed. This link is valid for <strong>6 hours</strong>.</p>

            <div style="text-align:center; margin:30px 0;">
              <a href="${dashboardUrl}" style="display:inline-block; background:#0d6efd; color:#fff; text-decoration:none; padding:15px 35px; border-radius:8px; font-weight:600; font-size:16px;">
                🔑 Access Dashboard
              </a>
            </div>

            <p style="font-size:13px; color:#777;">If you didn’t request this, simply ignore this email. Your account is safe.</p>
          </div>

          <!-- Footer -->
          <div style="background:#f1f3f5; text-align:center; padding:15px; font-size:12px; color:#555;">
            &copy; ${new Date().getFullYear()} MyApp — All rights reserved.<br>
            <a href="${APP_HOST}" style="color:#0d6efd; text-decoration:none;">Visit our website</a>
          </div>
        </div>
      </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: 'Dashboard link sent to your email (valid 6 hours).' });

  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// --- DASHBOARD
app.get('/`dash`board', (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send('<h2>Missing token</h2>');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.send(`
      <html>
        <head><title>Dashboard</title></head>
        <body>
          <h1>Welcome to your Dashboard</h1>
          <p>User: ${decoded.email}</p>
          <p>Token expires at: ${new Date(decoded.exp * 1000).toLocaleString()}</p>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('Token verification failed', err);
    return res.status(401).send(`
      <html>
        <head><title>Invalid or expired link</title></head>
        <body>
          <h2>Link invalid or expired</h2>
          <p>This dashboard link has expired or is invalid. Please request a new link by logging in again.</p>
        </body>
      </html>
    `);
  }
});





// --- REGISTER (POST /api/register)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Insert into DB
    const [result] = await pool.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hash]
    );

    return res.json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    console.error('Register error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});









// POST /api/get-code
// POST /api/get-code
// POST /api/get-code
app.post('/api/generate-code', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const code = generateCode();

    const [result] = await pool.query(
      "UPDATE users SET code = ? WHERE email = ?",
      [code, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Code generated successfully", code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});





// POST /api/request-reset
app.post('/api/request-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    // 1️⃣ Check user exists
    const [rows] = await pool.query('SELECT id, email FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = rows[0];

    // 2️⃣ Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 60 * 60 * 1000; // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?',
      [resetToken, new Date(expires), user.id]
    );

    // 3️⃣ Build reset URL
    const host = APP_HOST || `http://localhost:${PORT}`;
    const resetUrl = `${host}/reset-password.html?token=${resetToken}`;

    // 4️⃣ Prepare email
    const mailOptions = {
      from: FROM_EMAIL || 'no-reply@example.com', // fallback if FROM_EMAIL not set
      to: user.email,
      subject: '🔑 Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f6f8;">
          <h3>Hello ${user.email}</h3>
          <p>You requested a password reset. Click the button below to reset your password. This link is valid for 1 hour.</p>
          <p><a href="${resetUrl}" style="padding: 10px 20px; background: #0d6efd; color: #fff; text-decoration: none; border-radius: 6px;">Reset Password</a></p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `
    };

    // 5️⃣ Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset link sent to your email.' });

  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});




// GET /reset-password
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, reset_expires FROM users WHERE reset_token = ?',
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const user = rows[0];

    if (new Date() > new Date(user.reset_expires)) {
      return res.status(400).json({ error: 'Token expired' });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password & clear reset token
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
      [hashed, user.id]
    );

    res.json({ message: 'Password reset successfully. You can now login.' });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});







// --- START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
