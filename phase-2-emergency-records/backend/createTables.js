// backend/createTables.js
const bcrypt = require('bcryptjs');
const db = require('./db');

function init() {
  // 1️⃣ Create tables
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      patient_id INTEGER
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      address TEXT,
      guardian_phone TEXT,
      image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS emergencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'new'
    );
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS sos_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER,
      name TEXT,
      number TEXT
    );
  `).run();

  // 2️⃣ Seed users if not exists
  const row = db.prepare('SELECT COUNT(*) as c FROM users').get();
  if (row.c === 0) {
    // Passwords
    const pwdPatient = bcrypt.hashSync('patientpass', 10);
    const pwdDoctor  = bcrypt.hashSync('doctorpass', 10);

    // Create patient
    const info = db.prepare('INSERT INTO patients (name, phone, address, guardian_phone) VALUES (?, ?, ?, ?)').run(
      'Test Patient', '9999999999', 'Unknown', '8888888888'
    );
    const patientId = info.lastInsertRowid;

    // 3️⃣ Insert default SOS contacts for this patient
    const defaultContacts = [
      { name: 'Nearest Hospital', number: '108' },
      { name: 'Fire Brigade', number: '101' },
      { name: 'Police', number: '100' },
      { name: 'Women Helpline', number: '1091' },
      { name: 'Child Helpline', number: '1098' },
      { name: 'Ambulance', number: '102' },
      { name: 'Disaster Management', number: '1070' },
    ];

    for (let c of defaultContacts) {
      db.prepare('INSERT INTO sos_contacts (patient_id, name, number) VALUES (?, ?, ?)').run(patientId, c.name, c.number);
    }

    // Create patient user
    db.prepare('INSERT INTO users (username, password, role, patient_id) VALUES (?, ?, ?, ?)').run(
      'patient1', pwdPatient, 'patient', patientId
    );

    // Create doctor user
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(
      'doctor1', pwdDoctor, 'doctor'
    );

    console.log('Seeded users: patient1/patientpass  and  doctor1/doctorpass');
  } else {
    console.log('Users already exist; skipping seed.');
  }
}

init();
