const getConnection = require('./db');

async function createTable() {
  const connection = await getConnection();
  try {
    // Membuat tabel baru untuk menyimpan status pajak penduduk
    await connection.execute(`
      CREATE TABLE status_pajak (
        id_wajib_pajak VARCHAR2(20) PRIMARY KEY,
        nama_wp VARCHAR2(100),
        alamat_wp VARCHAR2(255),
        jenis_pajak VARCHAR2(200),
        status_pembayaran VARCHAR2(50),
        id_pembayaran_terakhir VARCHAR2(20),
        tanggal_pembayaran DATE,
        jumlah_pembayaran NUMBER
      )
    `);
    console.log("Tabel status_pajak berhasil dibuat!");
  } catch (err) {
    console.error("Gagal membuat tabel:", err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

createTable();