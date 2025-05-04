<?php

namespace App\Http\Controllers;

use App\Models\Jabatan;
use Illuminate\Http\Request;

class JabatanController extends Controller
{
    public function getJabatan($id)
{
    $jabatan = Jabatan::find($id);

    if (!$jabatan) {
        return response()->json([
            'status' => false,
            'message' => 'Jabatan tidak ditemukan',
        ], 404);
    }

    return response()->json([
        'status' => true,
        'message' => 'Data Jabatan',
        'data' => $jabatan,
    ]);
}

    public function getAllJabatan()
    {
        $jabatans = Jabatan::orderBy('id_jabatan', 'asc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Data Jabatan',
            'data' => $jabatans,
            'jumlah' => $jabatans->count(),
        ]);
    }

    public function deleteJabatan($id)
    {
        $jabatan = Jabatan::find($id);

        if (!$jabatan) {
            return response()->json([
                'status' => false,
                'message' => 'Jabatan tidak ditemukan',
            ], 404);
        }

        $jabatan->delete();

        return response()->json([
            'status' => true,
            'message' => 'Jabatan Berhasil Dihapus',
        ]);
    }

    public function editJabatan(Request $request, $id)
    {
        $jabatan = Jabatan::find($id);

        if (!$jabatan) {
            return response()->json([
                'status' => false,
                'message' => 'Jabatan tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'nama_jabatan' => 'nullable|string|max:255',
        ]);

        $jabatan->nama_jabatan = $request->nama_jabatan;
        $jabatan->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Jabatan Berhasil Diperbarui',
            'data' => $jabatan,
        ]);
    }
}
