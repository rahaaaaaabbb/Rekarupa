// backend/controllers/laporanController.js
const db = require('../config/database');

const getRingkasanOperasional = async (req, res) => {
    try {
        // Algoritma Agregasi Kondisional SQL
        // Memilah pemasukan dan pengeluaran, lalu menghitung profit (Pendapatan - Pengeluaran)
        const [rows] = await db.query(`
            SELECT 
                s.jenis AS kategori_layanan, 
                SUM(CASE WHEN t.tipe = 'Keluar' THEN t.total ELSE 0 END) AS total_pendapatan,
                SUM(CASE WHEN t.tipe = 'Masuk' THEN t.total ELSE 0 END) AS total_pengeluaran,
                SUM(CASE WHEN t.tipe = 'Keluar' THEN t.total ELSE -t.total END) AS profit_bersih
            FROM log_transaksi t
            JOIN stok_barang s ON t.id_barang = s.id
            GROUP BY s.jenis
        `);
        
        res.status(200).json({
            status: 'success',
            message: 'Data kalkulasi laba/rugi berhasil diambil',
            data: rows
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = {
    getRingkasanOperasional
};