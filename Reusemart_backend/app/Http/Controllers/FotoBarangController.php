<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FotoBarang;
use App\Models\Barang;
use Illuminate\Support\Facades\Storage;

class FotoBarangController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'id_barang' => 'required|string|exists:barang,id_barang',
            'foto_barang' => 'required|image|max:2048',
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

        // Hapus file dari storage
        Storage::disk('public')->delete($foto->foto_barang);

        $foto->delete();

        return response()->json([
            'message' => 'Foto barang berhasil dihapus',
            'status' => 'success',
        ]);
    }

    public function getByBarangId($id_barang)
{
    $fotos = FotoBarang::where('id_barang', $id_barang)->get();

    if ($fotos->isEmpty()) {
        return response()->json([
            'message' => 'Foto barang not found',
            'status' => 'error',
        ], 404);
    }

    return response()->json([
        'message' => 'Foto barang retrieved successfully',
        'status' => 'success',
        'data' => $fotos,
    ]);
}

    public function show($filename)
    {
        $fullPath = storage_path('app/public/foto_barang/' . $filename);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($fullPath);
    }

    public function showById($id_barang, $filename)
    {
        $barang = Barang::find($id_barang);
        if (!$barang) {
            return response()->json(['message' => 'Barang not found'], 404);
        }
        $fullPath = storage_path('app/public/foto_barang/' . $filename);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($fullPath);
    }

}
