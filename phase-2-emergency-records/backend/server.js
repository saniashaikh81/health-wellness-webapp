// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// For emergency route
const emergencyRoutes = require('./routes/emergency');
app.use('/api/emergency', emergencyRoutes);




const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Phase-2 backend running on http://localhost:${PORT}`));


