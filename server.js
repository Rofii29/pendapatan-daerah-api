const express = require('express');
const getConnection = require('./db');
const app = express();
const PORT = 3000;

app.use(express.json());

// Endpoint root untuk tes
app.get('/', (req, res) => {
    res.send('API Status Pajak Penduduk berjalan 🚀');
});


// ==========================================================
// === BARU: ENDPOINT UNTUK MENGAMBIL SEMUA DATA PAJAK ===
// Cara memanggil: GET http://localhost:3000/pajak
// ==========================================================
app.get('/pajak', async (req, res) => {
    let connection;

    try {
        connection = await getConnection();
        
        // Query sederhana untuk mengambil semua baris dari tabel
        const result = await connection.execute(
            `SELECT * FROM status_pajak ORDER BY id_wajib_pajak ASC` // Diurutkan agar rapi
        );

        // Kirim semua data yang ditemukan sebagai array JSON.
        // Jika tidak ada data, ini akan mengirim array kosong [], yang merupakan perilaku yang benar.
        res.json(result.rows);

    } catch (err) {
        console.error("Terjadi error di API (GET /pajak):", err);
        res.status(500).send('Gagal mengambil semua data dari server.');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Gagal menutup koneksi:", err);
            }
        }
    }
});


// ================================================================
// === ENDPOINT UNTUK MENCARI DATA PAJAK BERDASARKAN ID SPESIFIK ===
// Cara memanggil: GET http://localhost:3000/pajak/WPX001
// ================================================================
app.get('/pajak/:id', async (req, res) => {
    const idWajibPajak = req.params.id;
    let connection;

    try {
        connection = await getConnection();
        
        const result = await connection.execute(
            `SELECT * FROM status_pajak WHERE id_wajib_pajak = :id`,
            [idWajibPajak]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: `Data untuk ID Wajib Pajak '${idWajibPajak}' tidak ditemukan.` });
        }

        res.json(result.rows[0]);

    } catch (err) {
        console.error("Terjadi error di API (GET /pajak/:id):", err);
        res.status(500).send('Gagal mengambil data dari server.');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Gagal menutup koneksi:", err);
            }
        }
    }
});


// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});