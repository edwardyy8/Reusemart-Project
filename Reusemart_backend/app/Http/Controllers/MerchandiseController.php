<?php

namespace App\Http\Controllers;

use App\Models\Merchandise;
use Illuminate\Http\Request;

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
        try {
            $validated = $request->validate([
                'nama_merchandise' => 'required|string|max:255',
                'stok_merchandise' => 'required|integer|min:0',
                'poin_merchandise' => 'required|integer|min:0',
                'foto_merchandise' => 'nullable|string',
            ]);

            $merchandise = Merchandise::create($validated);
            return response()->json([
                'status' => 'success',
                'message' => 'Merchandise berhasil ditambahkan',
                'data' => $merchandise,
            ], 201);
        } catch (\Exception $e) {
            Log::error('CreateMerchandise Error: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal menambah merchandise', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateMerchandise(Request $request, $id)
    {
        try {
            $merchandise = Merchandise::findOrFail($id);
            $validated = $request->validate([
                'nama_merchandise' => 'required|string|max:255',
                'stok_merchandise' => 'required|integer|min:0',
                'poin_merchandise' => 'required|integer|min:0',
                'foto_merchandise' => 'nullable|string',
            ]);

            $merchandise->update($validated);
            return response()->json([
                'status' => 'success',
                'message' => 'Merchandise berhasil diperbarui',
                'data' => $merchandise,
            ], 200);
        } catch (\Exception $e) {
            Log::error('UpdateMerchandise Error: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal memperbarui merchandise', 'error' => $e->getMessage()], 500);
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
