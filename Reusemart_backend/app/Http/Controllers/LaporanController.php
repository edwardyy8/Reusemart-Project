<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;

use App\Models\Barang;
use App\Models\Pemesanan;
use App\Models\Donasi;


class LaporanController extends Controller
{

    public function laporanDonasiBarang($tahun)
    {
        $data = DB::table('donasi as d')
            ->join('barang as b', 'd.id_barang', '=', 'b.id_barang')
            ->join('penitip as p', 'b.id_penitip', '=', 'p.id_penitip')
            ->join('request_donasi as rd', 'd.id_request', '=', 'rd.id_request')
            ->join('organisasi as o', 'rd.id_organisasi', '=', 'o.id_organisasi')
            ->select(
                'b.id_barang as kode_produk',
                'b.nama_barang as nama_produk',
                'p.id_penitip',
                'p.nama as nama_penitip',
                'd.tanggal_donasi',
                'o.nama as organisasi',
                'd.nama_penerima'
            )
            ->whereYear('d.tanggal_donasi', $tahun)
            ->orderByDesc('d.tanggal_donasi')
            ->get();


        if ($data->isEmpty()) {
            return response()->json([
                'status' => true,
                'data' => [],
                'message' => 'Tidak ada data donasi barang yang ditemukan',
                'tahun' => $tahun,
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $data,
            'message' => 'Data donasi barang berhasil diambil',
        ], 200);
    }

    public function laporanRekapRequest()
    {
        $data = DB::table('request_donasi as rd')
            ->join('organisasi as o', 'rd.id_organisasi', '=', 'o.id_organisasi')
            ->leftJoin('donasi as d', 'rd.id_request', '=', 'd.id_request')
            ->whereNull('d.id_donasi')
            ->select(
                'o.id_organisasi',
                'o.nama as nama',
                'o.alamat_organisasi as alamat',
                'rd.isi_request as request'
            )
            ->orderBy('o.nama')
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Tidak ada data request donasi yang belum dipenuhi',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $data,
            'message' => 'Data request donasi yang belum dipenuhi berhasil diambil',
        ], 200);
    }
    public function laporanPenitip($tahun, $bulan, $id)
    {
        $data = DB::table('barang as b')
            ->join('penitip as pe', 'b.id_penitip', '=', 'pe.id_penitip')
            ->join('rincian_pemesanan as r', 'b.id_barang', '=', 'r.id_barang')
            ->join('pemesanan as p', 'r.id_pemesanan', '=', 'p.id_pemesanan')
            ->select([
                'pe.id_penitip',
                'pe.nama as nama_penitip',
                'b.id_barang as kode_produk',
                'b.nama_barang as nama_produk',
                'b.tanggal_masuk',
                'p.tanggal_pelunasan as tanggal_laku',
                DB::raw('(r.harga_barang - r.komisi_hunter - r.komisi_reusemart) as harga_jual_bersih'),
                'r.bonus_penitip as bonus_terjual_cepat',
                DB::raw('((r.harga_barang - r.komisi_hunter - r.komisi_reusemart) + r.bonus_penitip) as pendapatan'),
            ])
            ->where('b.id_penitip', '=', $id)
            ->where('b.status_barang', 'Terjual')
            ->whereNotIn('p.status_pembayaran', ['Batal', 'Menunggu Verifikasi'])
            ->whereMonth('p.tanggal_pemesanan', $bulan)
            ->whereYear('p.tanggal_pemesanan', $tahun)
            ->where('p.tanggal_diterima', '!=', null)
            ->orderByDesc('p.tanggal_pelunasan')
            ->get();

        $total = DB::table('barang as b')
            ->join('rincian_pemesanan as r', 'b.id_barang', '=', 'r.id_barang')
            ->join('pemesanan as p', 'r.id_pemesanan', '=', 'p.id_pemesanan')
            ->where('b.id_penitip', '=', $id)
            ->where('b.status_barang', 'Terjual')
            ->where('p.tanggal_diterima', '!=', null)
            ->whereNotIn('p.status_pembayaran', ['Batal', 'Menunggu Verifikasi'])
            ->whereMonth('p.tanggal_pemesanan', $bulan)
            ->whereYear('p.tanggal_pemesanan', $tahun)
            ->select([
                DB::raw('SUM(r.harga_barang - r.komisi_hunter - r.komisi_reusemart) AS total_harga_jual_bersih'),
                DB::raw('SUM(r.bonus_penitip) AS total_bonus_terjual_cepat'),
                DB::raw('SUM((r.harga_barang - r.komisi_hunter - r.komisi_reusemart) + r.bonus_penitip) AS total_pendapatan'),
            ])
            ->first();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Tidak ada data penjualan untuk bulan dan tahun yang diminta',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => [
                'data' => $data,
                'total' => $total,
            ],
            'message' => 'Data penjualan penitip berhasil diambil',
        ], 200);
    }

public function laporanByKategori($tahun)
    {
        $data = DB::table('kategori as k2')
            ->select([
                'k2.nama_kategori as nama_kategori_utama',
                DB::raw("COUNT(CASE WHEN b.status_barang = 'Terjual' AND p.id_pemesanan IS NOT NULL THEN 1 END) as jumlah_barang_terjual"),
                DB::raw("COUNT(CASE WHEN b.status_barang != 'Terjual' AND p.id_pemesanan IS NOT NULL THEN 1 END) as jumlah_barang_gagal_terjual")
            ])
            ->rightJoin('kategori as k', function ($join) {
                $join->on(DB::raw('FLOOR(k.id_kategori / 10) * 10'), '=', 'k2.id_kategori');
            })
            ->leftJoin('barang as b', 'b.id_kategori', '=', 'k.id_kategori')
            ->leftJoin('rincian_pemesanan as rp', 'rp.id_barang', '=', 'b.id_barang')
            ->leftJoin('pemesanan as p', function ($join) use ($tahun) {
                $join->on('p.id_pemesanan', '=', 'rp.id_pemesanan')
                    ->whereYear('p.tanggal_pemesanan', $tahun);
            })
            ->groupBy('k2.nama_kategori', 'k2.id_kategori')
            ->orderBy('k2.id_kategori')
            ->get();

        $totalTerjual = $data->sum('jumlah_barang_terjual');
        $totalGagalTerjual = $data->sum('jumlah_barang_gagal_terjual');

        if ($data->isEmpty()) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Tidak ada data penjualan untuk tahun yang diminta',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $data,
            'total' => [
                'jumlah_terjual' => $totalTerjual,
                'jumlah_gagal_terjual' => $totalGagalTerjual,
                'tahun' => $tahun
            ],
            'message' => 'Data penjualan per kategori berhasil diambil',
        ], 200);
    }

    public function laporanPenitipanHabis ($tahun)
    {
        $sekarang = Carbon::now('Asia/Jakarta');
        $data = DB::table('barang as b')
            ->select([
                'b.id_barang',
                'b.nama_barang',
                'p.id_penitip',
                'p.nama',
                'b.tanggal_masuk',
                'rp.tanggal_akhir',
                'rp.batas_akhir',
                'b.status_barang',
            ])
            ->join('rincian_penitipan as rp', 'b.id_barang', '=', 'rp.id_barang')
            ->join('penitip as p', 'b.id_penitip', '=', 'p.id_penitip')
            ->where('rp.tanggal_akhir', '<', $sekarang)
            ->where('b.status_barang', '!=', 'Terjual')
            ->whereYear('rp.tanggal_akhir', $tahun)
            ->orderBy('rp.tanggal_akhir', 'asc')
            ->get();


        if ($data->isEmpty()) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Tidak ada data penitipan habis',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $data,
            'message' => 'Data penitipan habis berhasil diambil',
        ], 200);
    }

    public function laporanStokGudang()
    {
        $data = DB::table('rincian_penitipan as rp')
            ->join('penitipan as p', 'rp.id_penitipan', '=', 'p.id_penitipan')
            ->join('barang as b', 'rp.id_barang', '=', 'b.id_barang')
            ->join('penitip as pt', 'p.id_penitip', '=', 'pt.id_penitip')
            ->join('pegawai as h', 'p.id_hunter', '=', 'h.id_pegawai')
            ->select(
                'b.id_barang as kode_produk',
                'b.nama_barang as nama_produk',
                'pt.id_penitip',
                'pt.nama as nama_penitip',
                'p.tanggal_masuk',
                'rp.perpanjangan',
                'h.id_pegawai as id_hunter',
                'h.nama as nama_hunter',
                'b.harga_barang'
            )
            ->orderBy('p.tanggal_masuk', 'desc')
            ->get();

        if ($data->isEmpty()) {
            return response()->json([
                'status' => false,
                'data' => [],
                'message' => 'Tidak ada data stok gudang tersedia.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $data,
            'message' => 'Data stok gudang berhasil diambil.',
        ], 200);
    }
    public function laporanKomisiBulanan($tahun, $bulan)
{
    $data = DB::table('pemesanan as p')
        ->join('rincian_pemesanan as rp', 'p.id_pemesanan', '=', 'rp.id_pemesanan')
        ->join('barang as b', 'rp.id_barang', '=', 'b.id_barang')
        ->select(
            'b.id_barang as kode_produk',
            'b.nama_barang as nama_produk',
            'b.harga_barang as harga_produk',
            'b.tanggal_masuk', // Perbaiki dari ranggal_masuk
            'p.tanggal_diterima as tanggal_laku',
            'rp.komisi_hunter',
            'rp.komisi_reusemart',
            'rp.bonus_penitip' // Perbaiki dari komisi_penitip
        )
        ->whereYear('p.tanggal_diterima', $tahun)
        ->whereMonth('p.tanggal_diterima', $bulan)
        ->where('p.status_pengiriman', 'Selesai') // Tambah filter status
        ->whereNotNull('p.tanggal_diterima') // Pastikan tanggal_diterima tidak null
        ->orderByDesc('p.tanggal_diterima')
        ->get();

    if ($data->isEmpty()) {
        return response()->json([
            'status' => false, // Ubah ke false untuk 404
            'data' => [],
            'message' => 'Tidak ada data komisi bulanan yang ditemukan',
            'tahun' => $tahun,
            'bulan' => $bulan
        ], 404);
    }

    return response()->json([
        'status' => true,
        'data' => $data,
        'message' => 'Data komisi bulanan berhasil diambil',
        'tahun' => $tahun,
        'bulan' => $bulan
    ], 200);
}

public function laporanPenjualanKeseluruhan($tahun)
{
    {
        $data = DB::table('pemesanan as p')
            ->join('rincian_pemesanan as rp', 'p.id_pemesanan', '=', 'rp.id_pemesanan')
            ->join('barang as b', 'rp.id_barang', '=', 'b.id_barang')
            ->select(
                DB::raw('MONTH(p.tanggal_diterima) as bulan'),
                DB::raw('COUNT(rp.id_rincianpemesanan) as jumlah_barang_terjual'),
                DB::raw('SUM(rp.harga_barang) as jumlah_penjualan_kotor')
            )
            ->whereYear('p.tanggal_diterima', $tahun)
            ->where('p.status_pengiriman', 'Selesai')
            ->whereNotNull('p.tanggal_diterima')
            ->groupBy(DB::raw('MONTH(p.tanggal_diterima)'))
            ->orderBy('bulan')
            ->get();

        // Inisialisasi array untuk semua bulan (1-12)
        $bulanNama = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        $result = [];
        $totalBarang = 0;
        $totalPenjualan = 0;

        // Isi data untuk setiap bulan, termasuk bulan tanpa data
        for ($i = 1; $i <= 12; $i++) {
            $found = $data->firstWhere('bulan', $i);
            $result[] = [
                'bulan' => $bulanNama[$i],
                'jumlah_barang_terjual' => $found ? (int)$found->jumlah_barang_terjual : 0,
                'jumlah_penjualan_kotor' => $found ? (int)$found->jumlah_penjualan_kotor : 0
            ];
            $totalBarang += $found ? (int)$found->jumlah_barang_terjual : 0;
            $totalPenjualan += $found ? (int)$found->jumlah_penjualan_kotor : 0;
        }

        // Tambahkan total
        $result[] = [
            'bulan' => 'Total',
            'jumlah_barang_terjual' => $totalBarang,
            'jumlah_penjualan_kotor' => $totalPenjualan
        ];

        if (empty(array_filter($result, fn($item) => $item['jumlah_barang_terjual'] > 0))) {
            return response()->json([
                'status' => false,
                'data' => $result,
                'message' => 'Tidak ada data penjualan bulanan untuk tahun ' . $tahun,
                'tahun' => $tahun
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $result,
            'message' => 'Data penjualan bulanan berhasil diambil',
            'tahun' => $tahun
        ], 200);
    }
}
}
