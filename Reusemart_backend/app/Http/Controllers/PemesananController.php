<?php

namespace App\Http\Controllers;

use App\Models\Pemesanan;
use App\Models\Barang;
use App\Models\Rincian_Pemesanan;
use App\Models\Penitipan;
use Illuminate\Http\Request;


class PemesananController extends Controller
{
    //

    public function getPemesananByIdPembeli($id)
    {
        try {
            $pemesanan = Pemesanan::where('id_pembeli', $id)
                ->with(['rincianPemesanan.barang'])
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

    public function getPemesananByIdPemesanan($id)
    {
        try {
            $pemesanan = Pemesanan::where('id_pemesanan', $id)
            ->with([
                'rincianPemesanan.barang', 'alamat', 
            ])
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
