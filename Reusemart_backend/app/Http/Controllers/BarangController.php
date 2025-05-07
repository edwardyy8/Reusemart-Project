<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barang;
use Illuminate\Support\Facades\DB;

class BarangController extends Controller
{
    public function index()
    {
        $barang = Barang::orderBy('tanggal_masuk', 'desc')
            ->get();

        return response()->json([
            'message' => 'All barang retrieved successfully',
            'status' => 'success',
            'data' => $barang,
        ]);
    }

    public function findBySubKategori($id_kategori)
    {
        $barang = Barang::where('id_kategori', $id_kategori)
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

        return response()->json([
            'message' => 'Barang retrieved successfully',
            'status' => 'success',
            'data' => $barang,
        ]);
    }

    public function search(Request $request)
    {
        $query = strtolower($request->input('q'));
        $threshold = 3; // maksimal jarak typo, misalnya laptopp vs laptop = 1

        $barang = Barang::with('fotoBarang')->get();

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


}
