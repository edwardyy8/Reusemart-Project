<?php

namespace App\Http\Controllers;

use App\Models\Donasi;
use Illuminate\Http\Request;
use function Symfony\Component\Translation\t;
use Carbon\Carbon;

class DonasiController extends Controller
{
    public function index()
{
    try {
        $donasis = Donasi::join('barang', 'donasi.id_barang', '=', 'barang.id_barang')
            ->join('request_donasi', 'donasi.id_request', '=', 'request_donasi.id_request')
            // Pastikan ini menghubungkan dengan organisasi melalui request_donasi
            ->join('organisasi', 'request_donasi.id_organisasi', '=', 'organisasi.id_organisasi')
            // Menggunakan leftJoin untuk foto_barang, karena bisa saja tidak ada foto
            ->leftJoin('foto_barang', 'barang.id_barang', '=', 'foto_barang.id_barang')
            ->select(
                'donasi.*',
                'barang.nama_barang',
                'foto_barang.foto_barang',
                'organisasi.foto_profile',
                'organisasi.nama'
            )
            ->orderBy('donasi.tanggal_donasi', 'desc')
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->tanggal_donasi)->format('Y-m-d');
            });

        return response()->json([
            'message' => 'All donasi retrieved successfully',
            'status' => 'success',
            'data' => $donasis,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage(),
            'status' => 'error',
        ], 500);
    }
}



}
