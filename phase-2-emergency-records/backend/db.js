// backend/db.js
const Database = require('better-sqlite3');
const db = new Database('./phase2.db'); // file created next to this file
module.exports = db;
