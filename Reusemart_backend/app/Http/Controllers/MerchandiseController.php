<?php

namespace App\Http\Controllers;

use App\Models\Merchandise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MerchandiseController extends Controller
{
    public function getAllMerchandiseCS()
    {
        try {
            $merchandises = Merchandise::all();
            return response()->json([
                'data' => $merchandises,
                'jumlah' => $merchandises->count(),
            ], 200);
        } catch (\Exception $e) {
            Log::error('GetAllMerchandise Error: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mengambil data merchandise', 'error' => $e->getMessage()], 500);
        }
    }

    public function getMerchandiseById($id)
    {
        try {
            $merchandise = Merchandise::findOrFail($id);
            return response()->json([
                'status' => true,
                'message' => 'Data Merchandise',
                'data' => $merchandise,
            ], 200);
        } catch (\Exception $e) {
            Log::error('GetMerchandiseById Error: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Merchandise tidak ditemukan',
            ], 404);
        }
    }

    public function createMerchandise(Request $request)
{
    $validator = Validator::make($request->all(), [
        'nama_merchandise' => 'required|string|max:255',
        'stok_merchandise' => 'required|integer|min:0',
        'poin_merchandise' => 'required|integer|min:0',
        'foto_merchandise' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        $merchandise = new Merchandise();
        $merchandise->nama_merchandise = $request->input('nama_merchandise');
        $merchandise->stok_merchandise = $request->input('stok_merchandise');
        $merchandise->poin_merchandise = $request->input('poin_merchandise');

        if ($request->hasFile('foto_merchandise')) {
            $file = $request->file('foto_merchandise');
            $image_uploaded_path = $file->store('foto_barang', 'public');
            $merchandise->foto_merchandise = basename($image_uploaded_path);
        } else {
            $merchandise->foto_merchandise = null;
        }

        $merchandise->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Merchandise created successfully'
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
}

    public function updateMerchandise(Request $request, $id)
{
    try {
        $merchandise = Merchandise::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'nama_merchandise' => 'required|string|max:255',
            'stok_merchandise' => 'required|integer|min:0',
            'poin_merchandise' => 'required|integer|min:0',
            'foto_merchandise' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $merchandise->nama_merchandise = $request->input('nama_merchandise');
        $merchandise->stok_merchandise = $request->input('stok_merchandise');
        $merchandise->poin_merchandise = $request->input('poin_merchandise');

        if ($request->hasFile('foto_merchandise')) {
            $file = $request->file('foto_merchandise');
            $image_uploaded_path = $file->store('foto_profile', 'public');
            $merchandise->foto_merchandise = basename($image_uploaded_path);
        }

        $merchandise->updated_at = now();
        $merchandise->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Merchandise berhasil diperbarui',
            'data' => $merchandise,
        ], 200);
    } catch (\Exception $e) {
        Log::error('UpdateMerchandise Error: ' . $e->getMessage());
        return response()->json([
            'status' => 'error',
            'message' => 'Gagal memperbarui merchandise',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function deleteMerchandise($id)
    {
        try {
            $merchandise = Merchandise::findOrFail($id);
            $merchandise->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Merchandise berhasil dihapus',
            ], 200);
        } catch (\Exception $e) {
            Log::error('DeleteMerchandise Error: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menghapus merchandise', 'error' => $e->getMessage()], 500);
        }
    }
}
