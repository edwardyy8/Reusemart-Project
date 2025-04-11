<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barang;

class BarangController extends Controller
{
    public function index()
    {
        $barang = Barang::orderBy('barang.tanggal_masuk', 'desc')
            ->get();

        return response()->json([
            'message' => 'All barang retrieved successfully',
            'status' => 'success',
            'data' => $barang, 
        ]);
    }

    public function findBySubKategori($id_kategori)
    {
        $barang = Barang::where('id_kategori', $id_kategori)->get();

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
        if($id_kategori == 1){
            $barang = Barang::where('id_kategori', 'like', '1%')
                ->whereRaw('CHAR_LENGTH(id_kategori) = 2')
                ->get();
        }else{
            $barang = Barang::where('id_kategori', 'like', $id_kategori . '%')->get();
        }


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


}
