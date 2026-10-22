const db = require('../config/database');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query database untuk mencocokkan kredensial
        const [rows] = await db.query(
            'SELECT * FROM pengguna WHERE username = ? AND password = ?', 
            [username, password]
        );

        // Jika data ditemukan (Array tidak kosong)
        if (rows.length > 0) {
            const user = rows[0];
            res.status(200).json({
                status: 'success',
                message: 'Autentikasi berhasil',
                data: { role: user.role, username: user.username }
            });
        } else {
            // Jika tidak cocok, tolak akses (HTTP 401 Unauthorized)
            res.status(401).json({ status: 'error', message: 'Kredensial tidak valid' });
        }
    } catch (error) {
        console.error('Error saat login:', error);
        res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server database' });
    }
};

module.exports = { login };