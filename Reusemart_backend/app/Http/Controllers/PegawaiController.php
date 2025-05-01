<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PegawaiController extends Controller
{
    public function index()
    {
        // Ambil data minimal, tanpa relasi
        try {
            $pegawai = Pegawai::select('id_pegawai', 'nama_pegawai', 'email')->get();
            return response()->json($pegawai, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAllPegawai()
    {
        $pegawais = Pegawai::with('jabatan')->orderBy('created_at', 'asc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Data Pegawai',
            'data' => $pegawais,
            'jumlah' => $pegawais->count(),
        ]);
    }

    public function getPegawai($id)
    {
        $pegawai = Pegawai::with('jabatan')->find($id);

        if (!$pegawai) {
            return response()->json([
                'status' => false,
                'message' => 'Pegawai tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Data Pegawai',
            'data' => $pegawai,
        ]);
    }

    public function deletePegawai($id)
    {
        $pegawai = Pegawai::find($id);

        if (!$pegawai) {
            return response()->json([
                'status' => false,
                'message' => 'Pegawai tidak ditemukan',
            ], 404);
        }

        $pegawai->delete();

        return response()->json([
            'status' => true,
            'message' => 'Pegawai Berhasil Dihapus',
        ]);
    }

    public function editPegawai(Request $request, $id)
    {
        $pegawai = Pegawai::find($id);

        if (!$pegawai) {
            return response()->json([
                'status' => false,
                'message' => 'Pegawai tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'nama_pegawai' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'id_jabatan' => 'nullable|exists:jabatans,id_jabatan',
            'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('foto_profile')) {
            $fotoProfilePath = $request->file('foto_profile')->store('foto_profile', 'public');
            $pegawai->foto_profile = basename($fotoProfilePath);
        }

        $pegawai->nama_pegawai = $request->nama_pegawai;
        $pegawai->email = $request->email;
        $pegawai->id_jabatan = $request->id_jabatan;

        $pegawai->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Pegawai Berhasil Diperbarui',
            'data' => $pegawai,
        ]);
    }

    public function getFotoProfile($filename)
    {
        $fullPath = storage_path('app/private/foto_profile_pegawai/' . $filename);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($fullPath);
    }

}
