const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this_secret'

// Middleware to verify JWT
function auth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' })
  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Get SOS contacts for logged-in patient
router.get('/', auth, (req, res) => {
  const patient_id = req.user.role === 'patient' ? req.user.patient_id : req.query.patient_id
  if (!patient_id) return res.status(400).json({ message: 'Patient ID required' })
  const contacts = db.prepare('SELECT * FROM sos_contacts WHERE patient_id = ?').all(patient_id)
  res.json(contacts)
})

// Add new SOS contact for patient
router.post('/', auth, (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ message: 'Name and number required' })

  const patient_id = req.user.role === 'patient' ? req.user.patient_id : req.body.patient_id
  if (!patient_id) return res.status(400).json({ message: 'Patient ID required' })

  const info = db.prepare('INSERT INTO sos_contacts (patient_id, name, number) VALUES (?, ?, ?)').run(patient_id, name, number)
  res.json({ id: info.lastInsertRowid, name, number })
})

module.exports = router
