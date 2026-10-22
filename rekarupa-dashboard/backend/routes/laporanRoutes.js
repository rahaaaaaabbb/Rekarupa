// routes/laporanRoutes.js
const express = require('express');
const router = express.Router();
const { getRingkasanOperasional } = require('../controllers/laporanController');

// Endpoint: GET /api/laporan/ringkasan
router.get('/ringkasan', getRingkasanOperasional);

module.exports = router;