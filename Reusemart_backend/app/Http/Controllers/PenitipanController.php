<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rincian_Penitipan;
use App\Models\Penitipan;
class PenitipanController extends Controller
{
    public function getPenitipanData($id)
    {
        try {
            $titipan = Rincian_Penitipan::whereHas('barang', function ($query) use ($id) {
                $query->where('id_penitip', $id);
                })
                ->with(['penitipan', 'barang'])
                ->get();

            if (!$titipan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Penitipan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Penitipan',
                'data' => $titipan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

}
