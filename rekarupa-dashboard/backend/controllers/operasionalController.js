// backend/controllers/operasionalController.js
const db = require('../config/database');

const getStok = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM stok_barang');
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Gagal mengambil data stok' });
    }
};

const getTransaksi = async (req, res) => {
    try {
        // TAMBAHAN: SELECT kolom kasir
        const query = `
            SELECT t.id, t.tanggal_waktu as tanggal, t.tipe, s.nama as item, t.qty, t.total, t.kasir 
            FROM log_transaksi t 
            JOIN stok_barang s ON t.id_barang = s.id 
            ORDER BY t.tanggal_waktu DESC
        `;
        const [rows] = await db.query(query);
        res.status(200).json({ status: 'success', data: rows });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Gagal mengambil log transaksi' });
    }
};

const transaksiKeluar = async (req, res) => {
    const { id_barang, qty, kasir } = req.body; // Tangkap kasir
    try {
        const [barang] = await db.query('SELECT stok, harga FROM stok_barang WHERE id = ?', [id_barang]);
        if (barang.length === 0) return res.status(404).json({ status: 'error', message: 'Barang tidak ditemukan' });
        if (barang[0].stok < qty) return res.status(400).json({ status: 'error', message: 'Stok tidak mencukupi!' });

        const totalKalkulasi = barang[0].harga * qty;
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query('UPDATE stok_barang SET stok = stok - ? WHERE id = ?', [qty, id_barang]);
            // TAMBAHAN: Insert kasir
            await connection.query('INSERT INTO log_transaksi (tipe, id_barang, qty, total, kasir) VALUES (?, ?, ?, ?, ?)', ['Keluar', id_barang, qty, totalKalkulasi, kasir || 'Sistem']);
            await connection.commit();
            res.status(200).json({ status: 'success', message: 'Transaksi keluar berhasil' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan internal server' });
    }
};

const transaksiMasuk = async (req, res) => {
    const { nama, jenis, qty, harga, kasir } = req.body; // Tangkap kasir
    const foto = req.file ? req.file.filename : null;

    try {
        const [existingBarang] = await db.query('SELECT id FROM stok_barang WHERE nama = ?', [nama]);
        if (existingBarang.length > 0) return res.status(400).json({ status: 'error', message: 'Barang sudah terdaftar!' });

        const totalKalkulasi = harga * qty;
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const [result] = await connection.query('INSERT INTO stok_barang (nama, jenis, stok, harga, foto) VALUES (?, ?, ?, ?, ?)', [nama, jenis, qty, harga, foto]);
            // TAMBAHAN: Insert kasir
            await connection.query('INSERT INTO log_transaksi (tipe, id_barang, qty, total, kasir) VALUES (?, ?, ?, ?, ?)', ['Masuk', result.insertId, qty, totalKalkulasi, kasir || 'Sistem']);
            await connection.commit();
            res.status(200).json({ status: 'success', message: 'Barang masuk berhasil dicatat' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan internal server' });
    }
};

const restockBarangLama = async (req, res) => {
    const { id_barang, qty, kasir } = req.body; // Tangkap kasir
    try {
        const [barang] = await db.query('SELECT harga FROM stok_barang WHERE id = ?', [id_barang]);
        if (barang.length === 0) return res.status(404).json({ status: 'error', message: 'Barang tidak ditemukan' });

        const totalKalkulasi = barang[0].harga * qty;
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query('UPDATE stok_barang SET stok = stok + ? WHERE id = ?', [qty, id_barang]);
            // TAMBAHAN: Insert kasir
            await connection.query('INSERT INTO log_transaksi (tipe, id_barang, qty, total, kasir) VALUES (?, ?, ?, ?, ?)', ['Masuk', id_barang, qty, totalKalkulasi, kasir || 'Sistem']);
            await connection.commit();
            res.status(200).json({ status: 'success', message: 'Stok berhasil ditambah!' });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan internal server' });
    }
};

module.exports = { getStok, getTransaksi, transaksiKeluar, transaksiMasuk, restockBarangLama };