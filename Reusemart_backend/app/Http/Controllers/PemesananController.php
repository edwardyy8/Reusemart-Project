<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use Illuminate\Http\Request;

class PemesananController extends Controller
{
    //

    public function getPemesananByIdPembeli($id)
    {
        try {
            $pemesanan = Pemesanan::where('id_pembeli', $id)
                ->with(['rincianPemesanan.barang.fotoBarang'])
                ->get();

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Pemesanan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getPemesananById($id)
    {
        try {
            $pemesanan = Pemesanan::find($id)
                ->with('alamat')
                ->first();

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Pemesanan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }



}
