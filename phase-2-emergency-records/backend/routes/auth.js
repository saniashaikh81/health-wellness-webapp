// backend/routes/auth.js/login
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this_secret';

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: 'username and password required' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const payload = { id: user.id, username: user.username, role: user.role, patient_id: user.patient_id || null };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

  res.json({ token, user: payload });
});

router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
    res.json({ user: payload });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});




//REGISTRATION

router.post('/register', (req, res) => {
  const { username, password, role, name, phone, address, guardian_phone } = req.body || {};

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'username, password, role required' });
  }

  const existing = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  let patientId = null;

  if (role === 'patient') {
    // Create new patient record
    const info = db.prepare(`
      INSERT INTO patients (name, phone, address, guardian_phone) VALUES (?, ?, ?, ?)
    `).run(name || '', phone || '', address || '', guardian_phone || '');
    patientId = info.lastInsertRowid;
  }

  db.prepare('INSERT INTO users (username, password, role, patient_id) VALUES (?, ?, ?, ?)').run(
    username, hashed, role, patientId
  );

  return res.json({ message: 'Registration successful. You can now login.' });
});


module.exports = router;