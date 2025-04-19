<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barang;
use App\Models\FotoBarang;

class BarangController extends Controller
{public function index()
    {
        $barang = Barang::with('fotoBarang') // load foto
            ->orderBy('barang.tanggal_masuk', 'desc')
            ->get();

        return response()->json([
            'message' => 'All barang retrieved successfully',
            'status' => 'success',
            'data' => $barang,
        ]);
    }

    public function findBySubKategori($id_kategori)
    {
        $barang = Barang::with('fotoBarang')
            ->where('id_kategori', $id_kategori)
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
        $query = Barang::with('fotoBarang');

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
        $barang = Barang::with('fotoBarang')->find($id);

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


    // Buat Tambah sama Edit foto di Admin nanti
    public function store(Request $request)
    {
        $request->validate([
            'id_barang' => 'required|string|exists:barang,id_barang',
            'foto_barang' => 'required|image|max:2048', // batasin 2MB
        ]);

        $path = $request->file('foto_barang')->store('foto_barang', 'public');

        $foto = FotoBarang::create([
            'id_barang' => $request->id_barang,
            'foto_barang' => $path,
        ]);

        return response()->json([
            'message' => 'Foto barang berhasil ditambahkan',
            'status' => 'success',
            'data' => $foto,
        ]);
    }

    public function destroy($id)
    {
        $foto = FotoBarang::findOrFail($id);
        $foto->delete();

        return response()->json([
            'message' => 'Foto barang berhasil dihapus',
            'status' => 'success',
        ]);
    }
}
