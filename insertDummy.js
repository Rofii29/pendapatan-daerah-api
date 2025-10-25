const getConnection = require('./db');

async function insertDummy() {
  const connection = await getConnection();
  console.log("Memulai proses memasukkan 5 data dummy tambahan...");

  // Array berisi 5 data dummy baru yang bervariasi
  const dataTambahan = [
    // Format: [id_wp, nama, alamat, jenis_pajak, status, id_bayar, tgl_bayar, jumlah_bayar]
    
    // 1. Data Lunas dari Jakarta
    ['WPX002', 'Budi Santoso', 'Jl. Merdeka No. 10, Jakarta', 'PBB', 'Lunas', 'BAY011', '2024-03-15', 750000],
    
    // 2. Data Belum Lunas dari Bandung (beberapa kolom bernilai null)
    ['WPX003', 'Siti Aminah', 'Jl. Pahlawan No. 5, Bandung', 'Pajak Restoran', 'Belum Lunas', null, null, null],
    
    // 3. Data Lunas dengan beberapa jenis pajak dari Bali
    ['WPX004', 'I Gede Pratama', 'Jl. Sunset Road No. 88, Kuta, Bali', 'Pajak Hotel, Pajak Reklame', 'Lunas', 'BAY012', '2024-01-20', 2500000],

    // 4. Data Menunggak dari Surabaya
    ['WPX005', 'Dewi Lestari', 'Jl. A. Yani No. 1, Surabaya', 'PBB', 'Menunggak', null, null, null],

    // 5. Data Lunas dari Yogyakarta
    ['WPX006', 'Andi Wijaya', 'Jl. Malioboro No. 2, Yogyakarta', 'PBB, Pajak Parkir', 'Lunas', 'BAY013', '2024-05-10', 1200000]
  ];

  try {
    const sql = `INSERT INTO status_pajak (id_wajib_pajak, nama_wp, alamat_wp, jenis_pajak, status_pembayaran, id_pembayaran_terakhir, tanggal_pembayaran, jumlah_pembayaran)
                 VALUES (:1, :2, :3, :4, :5, :6, TO_DATE(:7, 'YYYY-MM-DD'), :8)`;

    // Loop untuk memasukkan setiap baris data baru
    for (const row of dataTambahan) {
      await connection.execute(sql, row);
      console.log(`Data untuk ${row[0]} (${row[1]}) berhasil disiapkan.`);
    }

    await connection.commit();
    console.log("SUKSES! 5 data dummy tambahan berhasil dimasukkan ke dalam tabel status_pajak!");

  } catch (err) {
    console.error("GAGAL memasukkan data dummy:", err);
    console.log("Kemungkinan data dengan ID tersebut sudah ada (Primary Key violation).");
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

insertDummy();