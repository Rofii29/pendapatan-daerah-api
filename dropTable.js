// File: dropTable.js
const getConnection = require('./db');

async function dropTable() {
  let connection;
  try {
    connection = await getConnection();
    await connection.execute(`DROP TABLE status_pajak`);
    console.log("Tabel status_pajak berhasil dihapus!");
  } catch (err) {
    if (err.errorNum === 942) { // ORA-00942: table or view does not exist
      console.log("Tabel status_pajak tidak ditemukan (mungkin sudah dihapus sebelumnya).");
    } else {
      console.error("Gagal menghapus tabel:", err);
    }
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

dropTable();