<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use Illuminate\Http\Request;
use Validator;

class AlamatController extends Controller
{
    //

    public function getAlamatById($id)
    {
        try {
            $alamat = Alamat::find($id);

            if (!$alamat) {
                return response()->json([
                    'status' => false,
                    'message' => 'Alamat tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Alamat',
                'data' => $alamat,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAlamatByIdPembeli($id)
    {
        try {
            $alamat = Alamat::where('id_pembeli', $id)
                ->orderBy('is_default', 'desc')
                ->get();

            if (!$alamat) {
                return response()->json([
                    'status' => false,
                    'message' => 'Alamat tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Alamat',
                'data' => $alamat,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteAlamat($id)
    {
        try {
            $alamat = Alamat::find($id);

            $alamatAll = Alamat::where('id_pembeli', $alamat->id_pembeli)
                ->orderBy('id_alamat', 'asc')
                ->get();

            if ($alamatAll->count() <= 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'Tidak boleh menghapus alamat, alamat harus ada minimal 1',
                ], 404); 
            }

            if (!$alamat) {
                return response()->json([
                    'status' => false,
                    'message' => 'Alamat tidak ditemukan',
                ], 404);
            }

            if ($alamat->is_default) {
                return response()->json([
                    'status' => false,
                    'message' => 'Alamat default tidak boleh dihapus',
                ], 404);
            }

            $alamat->delete();

            return response()->json([
                'status' => true,
                'message' => 'Alamat berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function editAlamat(Request $request, $id)
    {
        try {
            $alamatData = $request->all();

            $required = [
                'label_alamat' => ['nullable', 'string'],
                'nama_penerima' => ['nullable', 'string'],
                'nama_alamat' => ['nullable', 'string'],
                'no_hp' => ['nullable', 'string', 'max:15', 'regex:/^(?:\+62|62|0)8[1-9][0-9]{6,9}$/'],
                'is_default' => ['nullable', 'boolean'],
                'id_pembeli' => ['required'],
            ];

            $validate = Validator::make($alamatData, $required);

            if ($validate->fails()) {
                return response(['message' => $validate->errors()->first()], 400);
            }

            $alamat = Alamat::find($id);

            if (!$alamat) {
                return response()->json([
                    'status' => false,
                    'message' => 'Alamat tidak ditemukan',
                ], 404);
            }

            $alamatDefault = Alamat::where('id_pembeli', $alamat->id_pembeli)
                ->where('is_default', true)
                ->first();

            if ($alamatDefault && $alamatDefault->id_alamat == $id) {

            }else {
                if ($request->has('is_default') && $request->is_default) {
                    Alamat::where('id_pembeli', $request->id_pembeli)
                        ->where('is_default', true)
                        ->update(['is_default' => false]);
                }
            }
            

            $alamat->update($request->all());

            return response()->json([
                'status' => true,
                'message' => 'Alamat berhasil diperbarui',
                'data' => $alamat,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function tambahAlamat(Request $request)
    {
        try {
            $alamatData = $request->all();
            $alamatData['id_pembeli'] = $request->user()->id_pembeli;

            $required = [
                'label_alamat' => ['required', 'string'],
                'nama_penerima' => ['required', 'string'],
                'nama_alamat' => ['required', 'string'],
                'no_hp' => ['required', 'string', 'max:15', 'regex:/^(?:\+62|62|0)8[1-9][0-9]{6,9}$/'],
                'is_default' => ['nullable', 'boolean'],
                'id_pembeli' => ['required'],
            ];

            $validate = Validator::make($alamatData, $required);

            if ($validate->fails()) {
                return response(['message' => $validate->errors()->first()], 400);
            }

            if ($request->has('is_default') && $request->is_default) {
                Alamat::where('id_pembeli', $alamatData['id_pembeli'])
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }

            $alamat = Alamat::create($alamatData);

            return response()->json([
                'status' => true,
                'message' => 'Alamat berhasil ditambahkan',
                'data' => $alamat,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getDefaultAlamat(Request $request)
    {
        try {
            $alamat = Alamat::where('id_pembeli', $request->user()->id_pembeli)
                ->where('is_default', true)
                ->first();

            if (!$alamat) {
                return response()->json([
                    'status' => false,
                    'message' => 'Alamat tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Alamat',
                'data' => $alamat,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
    
}