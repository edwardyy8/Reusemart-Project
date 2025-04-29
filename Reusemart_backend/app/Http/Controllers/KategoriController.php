<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kategori;

class KategoriController extends Controller
{
    public function index()
    {
        $kategori = Kategori::all();

        return response()->json([
            'message' => 'All categories retrieved successfully',
            'status' => 'success',
            'data' => $kategori,
        ]);
    }

    public function show($id)
    {
        $kategori = Kategori::find($id);

        if (!$kategori) {
            return response()->json([
                'message' => 'Kategori not found',
                'status' => 'error',
            ], 404);
        }

        return response()->json([
            'message' => 'Kategori retrieved successfully',
            'status' => 'success',
            'data' => $kategori,
        ]);
    }
}
