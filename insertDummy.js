// File: insertDummy.js
const getConnection = require('./db');

async function insertDummy() {
  const connection = await getConnection();

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  console.log(`Membuat data pembayaran acak antara ${formatDate(threeMonthsAgo)} dan ${formatDate(today)}...`);

  const dataUntukTren = [
    ['WPX007', 'Rina Hartati', 'Jl. Gajah Mada No. 101, Semarang', 'PBB', 'Lunas', 'BAY014', formatDate(randomDate(threeMonthsAgo, new Date(new Date().setMonth(today.getMonth() - 2)))), 850000],
    ['WPX008', 'Agus Salim', 'Jl. Diponegoro No. 22, Medan', 'Pajak Reklame', 'Lunas', 'BAY015', formatDate(randomDate(threeMonthsAgo, new Date(new Date().setMonth(today.getMonth() - 2)))), 1500000],
    ['WPX009', 'Lina Marlina', 'Jl. Sudirman No. 5, Pekanbaru', 'Pajak Restoran', 'Lunas', 'BAY016', formatDate(randomDate(threeMonthsAgo, new Date(new Date().setMonth(today.getMonth() - 2)))), 2200000],
    ['WPX010', 'Hendra Gunawan', 'Jl. Veteran No. 3, Palembang', 'PBB', 'Lunas', 'BAY017', formatDate(randomDate(threeMonthsAgo, new Date(new Date().setMonth(today.getMonth() - 2)))), 950000],
    ['WPX011', 'Citra Kirana', 'Jl. Basuki Rahmat No. 12, Makassar', 'Pajak Hotel', 'Lunas', 'BAY018', formatDate(randomDate(threeMonthsAgo, new Date(new Date().setMonth(today.getMonth() - 2)))), 5500000],
    ['WPX012', 'Dian Permata', 'Jl. Pahlawan No. 7, Semarang', 'PBB', 'Lunas', 'BAY019', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 2)), new Date(new Date().setMonth(today.getMonth() - 1)))), 780000],
    ['WPX013', 'Eko Prasetyo', 'Jl. Thamrin No. 8, Medan', 'Pajak Restoran', 'Lunas', 'BAY020', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 2)), new Date(new Date().setMonth(today.getMonth() - 1)))), 3100000],
    ['WPX014', 'Fitri Handayani', 'Jl. Gatot Subroto No. 9, Pekanbaru', 'PBB', 'Lunas', 'BAY021', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 2)), new Date(new Date().setMonth(today.getMonth() - 1)))), 1100000],
    ['WPX015', 'Galih Nugroho', 'Jl. Siliwangi No. 11, Palembang', 'Pajak Parkir', 'Lunas', 'BAY022', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 2)), new Date(new Date().setMonth(today.getMonth() - 1)))), 600000],
    ['WPX016', 'Indah Setiawati', 'Jl. Cendrawasih No. 14, Makassar', 'Pajak Reklame', 'Lunas', 'BAY023', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 2)), new Date(new Date().setMonth(today.getMonth() - 1)))), 1800000],
    ['WPX017', 'Joko Susilo', 'Jl. Pemuda No. 20, Semarang', 'Pajak Hotel', 'Lunas', 'BAY024', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 1)), today)), 4500000],
    ['WPX018', 'Kartika Putri', 'Jl. Imam Bonjol No. 30, Medan', 'PBB', 'Lunas', 'BAY025', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 1)), today)), 920000],
    ['WPX019', 'Lukman Hakim', 'Jl. Nangka No. 40, Pekanbaru', 'Pajak Restoran', 'Lunas', 'BAY026', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 1)), today)), 2800000],
    ['WPX020', 'Maya Sari', 'Jl. Jenderal Sudirman No. 50, Palembang', 'PBB', 'Lunas', 'BAY027', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 1)), today)), 1350000],
    ['WPX021', 'Nanda Pratama', 'Jl. Sam Ratulangi No. 60, Makassar', 'Pajak Parkir', 'Lunas', 'BAY028', formatDate(randomDate(new Date(new Date().setMonth(today.getMonth() - 1)), today)), 750000],
  ];

  try {
    const sql = `INSERT INTO status_pajak (id_wajib_pajak, nama_wp, alamat_wp, jenis_pajak, status_pembayaran, id_pembayaran_terakhir, tanggal_pembayaran, jumlah_pembayaran)
                 VALUES (:1, :2, :3, :4, :5, :6, TO_DATE(:7, 'YYYY-MM-DD'), :8)`;
    for (const row of dataUntukTren) {
      await connection.execute(sql, row);
      console.log(`Data untuk ${row[0]} (${row[1]}) pada tanggal ${row[6]} berhasil disiapkan.`);
    }
    await connection.commit();
    console.log("\nSUKSES! 15 data dummy tambahan berhasil dimasukkan!");
  } catch (err) {
    console.error("\nGAGAL memasukkan data dummy:", err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

insertDummy();