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
        $donasis = Donasi::join('barang', 'donasi.id_barang', '=', 'barang.id_barang')
            ->join('request_donasi', 'donasi.id_request', '=', 'request_donasi.id_request')
            ->join('organisasi', 'request_donasi.id_organisasi', '=', 'organisasi.id_organisasi')
            ->select(
                'donasi.*',
                'barang.nama_barang',
                'barang.foto_barang',
                'organisasi.foto_profile',
                'organisasi.nama_organisasi',
            )
            ->orderBy('donasi.tanggal_donasi', 'desc')
            ->get()
            ->groupBy(function($item) {
                return Carbon::parse($item->tanggal_donasi)->format('Y-m-d');
            });

        return response()->json([
            'message' => 'All donasi retrieved successfully',
            'status' => 'success',
            'data' => $donasis,
        ]);
    }
}
