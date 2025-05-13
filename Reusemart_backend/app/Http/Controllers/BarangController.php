<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barang;
use Illuminate\Support\Facades\DB;

class BarangController extends Controller
{
    public function index()
    {
        $barang = Barang::with('penitip') // Eager load relasi penitip
                        ->where('status_barang', 'Tersedia')
                        ->orderBy('tanggal_masuk', 'desc')
                        ->get();

        return response()->json([
            'message' => 'All available barang retrieved successfully',
            'status' => 'success',
            'data' => $barang,
        ]);
    }


    public function findBySubKategori($id_kategori)
    {
        $barang = Barang::where('id_kategori', $id_kategori)
                        ->where('status_barang', 'Tersedia')
                        ->get();

        if ($barang->isEmpty()) {
            return response()->json([
                'message' => 'Barang not found',
                'status' => 'error',
            ], 404);
        }

        return response()->json([
            'message' => 'Barang retrieved successfully',
            'status' => 'success',
            'data' => $barang,
        ]);
    }


        public function findByKategori($id_kategori)
    {
        $query = Barang::query();

        if ($id_kategori == 1) {
            $query->where('id_kategori', 'like', '1%')
                ->whereRaw('CHAR_LENGTH(id_kategori) = 2');
        } else {
            $query->where('id_kategori', 'like', $id_kategori . '%');
        }

        $query->where('status_barang', 'Tersedia'); // Tambahan filter

        $barang = $query->get();

        if ($barang->isEmpty()) {
            return response()->json([
                'message' => 'Barang not found',
                'status' => 'error',
            ], 404);
        }

        return response()->json([
            'message' => 'Barang retrieved successfully',
            'status' => 'success',
            'data' => $barang,
        ]);
    }


    public function show($id)
    {
        $barang = Barang::find($id);

        if (!$barang) {
            return response()->json([
                'message' => 'Barang not found',
                'status' => 'error',
            ], 404);
        }

        // Hitung jumlah barang terjual oleh penitip yang sama
        $jumlahTerjual = Barang::where('id_penitip', $barang->id_penitip)
                                ->where('status_barang', 'Terjual')
                                ->count();

        return response()->json([
            'message' => 'Barang retrieved successfully',
            'status' => 'success',
            'data' => [
                'barang' => $barang,
                'jumlah_barang_terjual' => $jumlahTerjual,
            ],
        ]);
    }


    public function search(Request $request)
    {
        $query = strtolower($request->input('q'));
        $threshold = 3;

        $barang = Barang::all();

        $filtered = $barang->filter(function ($item) use ($query, $threshold) {
            $distance = levenshtein(strtolower($item->nama_barang), $query);
            return $distance <= $threshold || str_contains(strtolower($item->nama_barang), $query);
        });

        return response()->json([
            'message' => 'Levenshtein fuzzy search result',
            'status' => 'success',
            'data' => array_values($filtered->toArray())
        ]);
    }

    public function donasiByPenitip($id)
    {
        try {
            $barang = Barang::with('rincian_penitipan')->findOrFail($id);

            $barang->rincian_penitipan->status_penitipan = 'Didonasikan';
            $barang->status_barang = 'Didonasikan';
            $barang->save();
            $barang->rincian_penitipan->save();

            return response()->json(['message' => 'Status barang berhasil diubah'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengubah status barang.',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                
            ], 500);
        }
    }

}
