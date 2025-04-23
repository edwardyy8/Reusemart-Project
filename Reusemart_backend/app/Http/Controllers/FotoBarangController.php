<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FotoBarang;

class FotoBarangController extends Controller
{
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

