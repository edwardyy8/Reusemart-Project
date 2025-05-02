<?php

namespace App\Http\Controllers;

use App\Models\Diskusi;
use Illuminate\Http\Request;

class DiskusiController extends Controller
{
    //

    public function getDiskusiByIdBarang($id)
    {
        try {
            $diskusi = Diskusi::where('id_barang', $id)->get();

            if (!$diskusi) {
                return response()->json([
                    'status' => false,
                    'message' => 'Diskusi tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Diskusi',
                'data' => $diskusi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function tambahDiskusi(Request $request)
    {
        try {
            $diskusi = Diskusi::create([
                'id_barang' => $request->id_barang,
                'id_penitip' => $request->id_penitip,
                'id_pembeli' => $request->id_pembeli,
                'id_pegawai' => $request->id_pegawai,
                'id_organisasi' => $request->id_organisasi,
                'komentar' => $request->komentar,
                'tanggal_diskusi' => now(),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Diskusi berhasil ditambahkan',
                'data' => $diskusi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
    
}
