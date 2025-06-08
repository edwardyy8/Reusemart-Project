<?php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
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
            ->where('p.tanggal_diterima', '!=', null)
            ->whereMonth('p.tanggal_pemesanan', $bulan)
            ->whereYear('p.tanggal_pemesanan', $tahun)
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
}