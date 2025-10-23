const express = require('express');
const getConnection = require('./db'); // <-- DIUBAH: Impor fungsi koneksi dari db.js
const app = express();

app.use(express.json());

// endpoint test
app.get('/', (req, res) => {
  res.send('API Pendapatan Daerah berjalan 🚀');
});

// endpoint ambil semua data
app.get('/pendapatan', async (req, res) => {
  let connection; // Definisikan di luar try agar bisa diakses di finally
  try {
    connection = await getConnection(); // <-- DIUBAH: Gunakan fungsi yang sudah ada
    const result = await connection.execute(`SELECT * FROM pendapatan_daerah`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengambil data');
  } finally {
    if (connection) {
      try {
        await connection.close(); // Pastikan koneksi selalu ditutup
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// endpoint tambah data
// DIPERBAIKI: Logika disesuaikan dengan skema tabel yang benar
app.post('/pendapatan', async (req, res) => {
  // Ambil semua data yang relevan dari body request
  const { nama_daerah, tahun, pajak, retribusi, lain_lain } = req.body;

  // Validasi sederhana
  if (!nama_daerah || !tahun || !pajak || !retribusi || !lain_lain) {
    return res.status(400).send('Semua field (nama_daerah, tahun, pajak, retribusi, lain_lain) wajib diisi.');
  }

  let connection;
  try {
    connection = await getConnection();
    await connection.execute(
      // Gunakan kolom yang benar
      `INSERT INTO pendapatan_daerah (nama_daerah, tahun, pajak, retribusi, lain_lain) 
       VALUES (:1, :2, :3, :4, :5)`,
      // Masukkan semua data yang relevan
      [nama_daerah, tahun, pajak, retribusi, lain_lain],
      { autoCommit: true } // autoCommit bagus untuk insert tunggal
    );
    res.status(201).send('Data berhasil ditambahkan!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menambahkan data');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});