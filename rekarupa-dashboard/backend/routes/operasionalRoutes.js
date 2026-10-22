// backend/routes/operasionalRoutes.js
const express = require('express');
const router = express.Router();
const operasionalController = require('../controllers/operasionalController');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan Multer untuk Upload Foto
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Endpoint untuk Read (Menampilkan Data)
router.get('/stok', operasionalController.getStok);
router.get('/transaksi', operasionalController.getTransaksi);

// Endpoint untuk Create/Update (Memanipulasi Data)
router.post('/transaksi-keluar', operasionalController.transaksiKeluar);

// Endpoint Restock Barang Baru
router.post('/transaksi-masuk', upload.single('foto'), operasionalController.transaksiMasuk);

// Endpoint Restock Barang Lama
router.post('/restock-lama', operasionalController.restockBarangLama);

module.exports = router;
