<?php

namespace App\Http\Controllers;

use App\Models\Penitip;
use Illuminate\Http\Request;
use Storage;

class PenitipController extends Controller
{
    public function index()
    {
        $penitip = Penitip::all();

        return response()->json([
            'message' => 'All penitip retrieved successfully',
            'status' => 'success',
            'data' => $penitip,
        ]);
    }

    public function show($id)
    {
        $penitip = Penitip::find($id);

        if (!$penitip) {
            return response()->json([
                'message' => 'Penitip not found',
                'status' => 'error',
            ], 404);
        }

        return response()->json([
            'message' => 'Penitip retrieved successfully',
            'status' => 'success',
            'data' => $penitip,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:100',
            'no_ktp' => 'required|string|min:16|max:16|unique:penitip,no_ktp',
            'email' => 'required|email|unique:penitip,email|unique:pegawai,email|unique:pembeli,email|unique:organisasi,email',
            'password' => 'required|min:8|same:confirm_password',
            'confirm_password' => 'required|min:8',
            'foto_ktp' => 'required|image|max:2048',
            'foto_profile' => 'required|image|max:2048',
        ]);

        $ktpPath = $request->file('foto_ktp')->store('foto_ktp', 'private');
        $profilePath = $request->file('foto_profile')->store('foto_profile', 'public');

        $penitip = Penitip::create([
            'id_penitip' => Penitip::generateId(),
            'nama' => $request->nama,
            'rating_penitip' => 0,
            'saldo_penitip' => 0,
            'poin_penitip' => 0,
            'no_ktp' => $request->no_ktp,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_top' => 'Tidak',
            'foto_ktp' => $ktpPath,
            'foto_profile' => $profilePath,
            'createdAt' => now('Asia/Jakarta'),
        ]);

        return response()->json([
            'message' => 'Penitip berhasil ditambahkan',
            'status' => 'success',
            'data' => $penitip,
        ]);
    }

    public function destroy($id)
    {
        $penitip = Penitip::find($id);

        if (!$penitip) {
            return response()->json([
                'message' => 'Penitip tidak ditemukan.'
            ], 404);
        }

        $penitip->is_aktif = 'Tidak';
        $penitip->save();

        return response()->json([
            'message' => 'Penitip berhasil dihapus.'
        ]);
    }



    public function getPenitipProfile(Request $request){
        try {
            $user = $request->user();
            return response([
                'penitip' => $user,
            ]);
            
        } catch (\Exception $e) {
            return response([
                'message' => 'Failed to get penitip profile',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'nullable|string|max:100',
            'no_ktp' => 'nullable|string|max:20|unique:penitip,no_ktp,' . $id .',id_penitip',
            'email' => 'nullable|email|unique:penitip,email,' . $id .',id_penitip', '|unique:pegawai,email|unique:pembeli,email|unique:organisasi,email',
            'foto_ktp' => 'nullable|image|max:2048',
            // 'foto_profile' => 'nullable|image|max:2048',
        ]);

        $penitip = Penitip::findOrFail($id);
        $penitip->nama = $request->nama ?? $penitip->nama;
        $penitip->no_ktp = $request->no_ktp ?? $penitip->no_ktp;
        $penitip->email = $request->email ?? $penitip->email;
    
        if ($request->hasFile('foto_ktp')) {
            if ($penitip->foto_ktp) {
                $oldPath = 'foto_ktp/' . $penitip->foto_ktp;
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $uploadFolder = 'foto_ktp';
            $image = $request->file('foto_ktp');
            $image_uploaded_path = $image->store($uploadFolder, 'public');
            $fotoKtp = basename($image_uploaded_path);
            $penitip->foto_ktp = $fotoKtp;
        }

        // if ($request->hasFile('foto_profile')) {
        //     if ($penitip->foto_profile && Storage::exists('public/' . $penitip->foto_profile)) {
        //         Storage::delete('public/' . $penitip->foto_profile);
        //     }
        //     $profilePath = $request->file('foto_profile')->store('foto_profile', 'public');
        //     $penitip->foto_profile = $profilePath;
        // }

        $penitip->save();

        return response()->json([
            'message' => 'Penitip berhasil diperbarui',
            'status' => 'success',
            'data' => $penitip,
        ]);
    }

    public function getFotoProfile($filename)
    {
        $fullPath = storage_path('app/public/foto_profile/' . $filename);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($fullPath);
    }

}