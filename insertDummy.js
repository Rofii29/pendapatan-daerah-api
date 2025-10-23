const getConnection = require('./db');

async function insertDummy() {
  const connection = await getConnection();

  const data = [
    ['Kota Surabaya', 2024, 4500000000, 2300000000, 500000000],
    ['Kota Malang', 2024, 2200000000, 1200000000, 400000000],
    ['Kab. Sidoarjo', 2024, 1800000000, 800000000, 300000000]
  ];

  for (let row of data) {
    await connection.execute(
      `INSERT INTO pendapatan_daerah (nama_daerah, tahun, pajak, retribusi, lain_lain)
       VALUES (:1, :2, :3, :4, :5)`,
      row
    );
  }

  await connection.commit();
  console.log("Data dummy berhasil dimasukkan!");
  await connection.close();
}

insertDummy();
