<?php

namespace App\Http\Controllers;

use App\Models\Organisasi;
use Illuminate\Http\Request;
use Storage;

class OrganisasiController extends Controller
{
    public function index()
    {
        $organisasi = Organisasi::all();

        return response()->json([
            'message' => 'All organisasi retrieved successfully',
            'status' => 'success',
            'data' => $organisasi,
        ]);
    }

    public function show($id)
    {
        $organisasi = Organisasi::find($id);

        if (!$organisasi) {
            return response()->json([
                'message' => 'Penitip not found',
                'status' => 'error',
            ], 404);
        }

        return response()->json([
            'message' => 'Organisasi retrieved successfully',
            'status' => 'success',
            'data' => $organisasi,
        ]);
    }
    public function getOrganisasiProfile(Request $request){
        try {
            $user = $request->user();
            return response([
                'organisasi' => $user,
            ]);
            
        } catch (\Exception $e) {
            return response([
                'message' => 'Failed to get organisasi profile',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function getAllOrganisasi()
    {
        $organisasi = Organisasi::orderBy('createdAt', 'asc')->get();

        return response()->json([
            'status' => true,
            'message' => 'Data Organisasi',
            'data' => $organisasi,
            'jumlah' => $organisasi->count(),
        ]);
    }

    public function getOrganisasi($id)
    {
        $organisasi = Organisasi::find($id);

        if (!$organisasi) {
            return response()->json([
                'status' => false,
                'message' => 'Organisasi tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Data Organisasi',
            'data' => $organisasi,
        ]);
    }

    public function deleteOrganisasi($id)
    {
        $organisasi = Organisasi::find($id);

        if (!$organisasi) {
            return response()->json([
                'status' => false,
                'message' => 'Organisasi tidak ditemukan',
            ], 404);
        }

        $organisasi->delete();

        return response()->json([
            'status' => true,
            'message' => 'Organisasi Berhasil Dihapus',
        ]);
    }

    public function editOrganisasi(Request $request, $id)
    {
        $organisasi = Organisasi::find($id);

        if (!$organisasi) {
            return response()->json([
                'status' => false,
                'message' => 'Organisasi tidak ditemukan',
            ], 404);
        }

        $request->validate([
            'nama' => 'nullable|string|max:255',
            'alamat_organisasi' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('foto_profile')) {
            if ($organisasi->foto_profile) {
                $oldPath = 'foto_profile/' . $organisasi->foto_profile;
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $uploadFolder = 'foto_profile';
            $image = $request->file('foto_profile');
            $image_uploaded_path = $image->store($uploadFolder, 'public');
            $fotoProfile = basename($image_uploaded_path);
            $organisasi->foto_profile = $fotoProfile;
        }

        $organisasi->nama = $request->nama;
        $organisasi->alamat_organisasi = $request->alamat_organisasi;
        $organisasi->email = $request->email;

        $organisasi->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Organisasi Berhasil Diperbarui',
            'data' => $organisasi,
        ]);
    }
}
