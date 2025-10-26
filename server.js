// ==========================================================
// ===                    BAGIAN IMPORT                   ===
// ==========================================================
const express = require('express');
const getConnection = require('./db');
const os = require('os');
const oracledb = require('oracledb');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());

// ==========================================================
// ===                    BAGIAN ENDPOINTS                ===
// ==========================================================

// Endpoint root untuk tes koneksi
app.get('/', (req, res) => {
    res.send('API Status Pajak Penduduk berjalan 🚀');
});

// ENDPOINT: Mengambil SEMUA data pajak
app.get('/pajak', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM status_pajak ORDER BY id_wajib_pajak ASC`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Terjadi error di API (GET /pajak):", err);
        res.status(500).send('Gagal mengambil semua data dari server.');
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error("Gagal menutup koneksi:", err); }
        }
    }
});

// ENDPOINT: Mencari data pajak berdasarkan ID SPESIFIK
app.get('/pajak/:id', async (req, res) => {
    const idWajibPajak = req.params.id;
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT * FROM status_pajak WHERE id_wajib_pajak = :id`,
            [idWajibPajak],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
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
            try { await connection.close(); } catch (err) { console.error("Gagal menutup koneksi:", err); }
        }
    }
});

// ==========================================================
// ===         ENDPOINT STATISTIK DASHBOARD              ===
// ==========================================================
app.get('/statistik', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        // Total pendapatan (NULL-safe)
        const pendapatanResult = await connection.execute(
            `SELECT NVL(SUM(jumlah_pembayaran),0) AS total FROM status_pajak`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const totalPendapatan = pendapatanResult.rows[0]?.TOTAL ?? 0;

        // Jumlah wajib pajak unik
        const wpResult = await connection.execute(
            `SELECT COUNT(DISTINCT id_wajib_pajak) AS total FROM status_pajak`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const jumlahWajibPajak = wpResult.rows[0]?.TOTAL ?? 0;

        // Dua jenis pajak terbanyak
        const jenisPajakResult = await connection.execute(
            `SELECT jenis_pajak FROM status_pajak 
             GROUP BY jenis_pajak 
             ORDER BY COUNT(*) DESC 
             FETCH FIRST 2 ROWS ONLY`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        const jenisPajakTerbanyak = jenisPajakResult.rows.map(row => row.JENIS_PAJAK);

        res.json({
            totalPendapatan,
            jumlahWajibPajak,
            jenisPajakTerbanyak
        });
    } catch (err) {
        console.error("Terjadi error di API (GET /statistik):", err);
        res.status(500).send('Gagal mengambil data statistik dari server.');
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error("Gagal menutup koneksi:", err); }
        }
    }
});

// ==========================================================
// ===   ENDPOINT BARU UNTUK GRAFIK TREN PEMBAYARAN       ===
// ==========================================================
app.get('/tren-pajak', async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const sql = `
            SELECT
                TO_CHAR(tanggal_pembayaran, 'YYYY-MM') AS bulan_tahun,
                SUM(jumlah_pembayaran) AS total_pembayaran
            FROM
                status_pajak
            WHERE
                tanggal_pembayaran >= ADD_MONTHS(TRUNC(SYSDATE, 'MM'), -2)
            GROUP BY
                TO_CHAR(tanggal_pembayaran, 'YYYY-MM')
            ORDER BY
                bulan_tahun ASC
        `;

        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

        const chartData = result.rows.map(row => {
            const monthIndex = parseInt(row.BULAN_TAHUN.split('-')[1], 10) - 1;
            return {
                label: monthNames[monthIndex],
                total: row.TOTAL_PEMBAYARAN
            };
        });

        res.json(chartData);
    } catch (err) {
        console.error("Terjadi error di API (GET /tren-pajak):", err);
        res.status(500).send('Gagal mengambil data tren pembayaran dari server.');
    } finally {
        if (connection) {
            try { await connection.close(); } catch (err) { console.error("Gagal menutup koneksi:", err); }
        }
    }
});

// ==========================================================
// ===               BAGIAN JALANKAN SERVER               ===
// ==========================================================
app.listen(PORT, HOST, () => {
    const getIpAddresses = () => {
        const interfaces = os.networkInterfaces();
        const addresses = [];
        for (const name of Object.keys(interfaces)) {
            for (const iface of interfaces[name]) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    addresses.push({ name: name, address: iface.address });
                }
            }
        }
        return addresses;
    };
    const availableIps = getIpAddresses();
    console.log(`\n✅ Server berjalan dan siap menerima koneksi.`);
    console.log(`   -> Akses dari komputer ini: http://localhost:${PORT}`);
    if (availableIps.length > 0) {
        console.log(`\n   -> Akses dari perangkat lain, pilih salah satu IP di bawah ini:`);
        availableIps.forEach(ip => {
            console.log(`      - ${ip.name}: http://${ip.address}:${PORT}`);
        });
        console.log(`\n   (Gunakan alamat IP yang sesuai dengan jaringan Wi-Fi/LAN Anda, biasanya bukan VMware/VirtualBox)`);
    } else {
        console.log(`\n   Tidak dapat mendeteksi alamat IP jaringan. Pastikan Anda terhubung ke Wi-Fi atau LAN.`);
    }
    console.log(`\nTekan CTRL + C untuk menghentikan server.`);
});