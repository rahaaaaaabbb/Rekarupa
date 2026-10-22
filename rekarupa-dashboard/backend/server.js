const express = require('express');
const cors = require('cors');
require('dotenv').config();

const laporanRoutes = require('./routes/laporanRoutes');
const authRoutes = require('./routes/authRoutes');
const operasionalRoutes = require('./routes/operasionalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rute API
app.use('/api/laporan', laporanRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/operasional', operasionalRoutes);

app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
