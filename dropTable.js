// File: dropTable.js
const getConnection = require('./db');

async function dropOldTable() {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(`DROP TABLE pendapatan_daerah`);
    console.log("Tabel pendapatan_daerah berhasil dihapus!");
  } catch (err) {
    // Jika tabel tidak ada, akan error, ini tidak apa-apa
    if (err.errorNum === 942) {
      console.log("Tabel pendapatan_daerah tidak ditemukan (mungkin sudah dihapus).");
    } else {
      console.error("Gagal menghapus tabel:", err);
    }
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

dropOldTable();