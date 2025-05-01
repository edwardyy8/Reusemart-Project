<?php

namespace App\Http\Controllers;

use App\Models\Rincian_Pemesanan;
use Illuminate\Http\Request;

class RincianPemesananController extends Controller
{
    //

    public function getPenjualanByIdPenitip($id)
    {
        try {
            $penjualan = Rincian_Pemesanan::whereHas('barang', function ($query) use ($id) {
                $query->where('id_penitip', $id);
                })
                ->with(['barang.fotoBarang'])
                ->get();

            if (!$penjualan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Penjualan',
                'data' => $penjualan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getPenjualanById($id)
    {
        try {
            $penjualan = Rincian_Pemesanan::with(['barang.fotoBarang'])
                ->where('id_rincianpemesanan', $id)
                ->first();

            if (!$penjualan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Penjualan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Penjualan',
                'data' => $penjualan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
