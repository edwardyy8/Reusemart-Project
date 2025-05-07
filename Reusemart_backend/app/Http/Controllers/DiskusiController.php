<?php

namespace App\Http\Controllers;

use App\Models\Diskusi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Validator;

class DiskusiController extends Controller
{
    //

    public function getDiskusiByIdBarang($id)
    {
        try {
            $diskusi = Diskusi::where('id_barang', $id)
                ->leftJoin('pembeli', 'diskusi.id_pembeli', '=', 'pembeli.id_pembeli')
                ->leftJoin('pegawai', 'diskusi.id_pegawai', '=', 'pegawai.id_pegawai')
                ->select(
                    'diskusi.*',
                    'pembeli.nama as nama_pembeli',
                    'pegawai.nama as nama_pegawai',
                    'pembeli.foto_profile as foto_profile_pembeli',
                    'pegawai.foto_profile as foto_profile_pegawai',
                )
                ->orderBy('diskusi.tanggal_diskusi', 'asc')
                ->get();

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
            $diskusiData = $request->all();

            $id = $request->user()->id_pembeli ?? $request->user()->id_penitip ?? $request->user()->id_pegawai ?? $request->user()->id_organisasi;
            if (!$id) {
                return response()->json([
                    'status' => false,
                    'message' => 'User tidak terautentikasi',
                ], 401);
            }

            $id = $request->user()->id_pembeli ?? $request->user()->id_pegawai;
            if (!$id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Hanya pembeli yang dapat menambahkan diskusi',
                ], 401);
            }

            $idjabatan = $request->user()->id_jabatan;
            if ($idjabatan && $idjabatan != 3) {
                return response()->json([
                    'status' => false,
                    'message' => 'Hanya CS yang dapat menambahkan diskusi',
                ], 401);
            }

            $userType = $request->user()->getUserType();
            if ($userType == 'pembeli') {
                $diskusiData['id_pembeli'] = $id;
            } elseif ($userType == 'pegawai') {
                $diskusiData['id_pegawai'] = $id;
            } 

            $required = [
                'id_barang' => 'required|exists:barang,id_barang',
                'id_pembeli' => 'nullable|exists:pembeli,id_pembeli',
                'id_pegawai' => 'nullable|exists:pegawai,id_pegawai',
                'komentar' => 'required|string|max:255',
            ];

            $validate = Validator::make($diskusiData, $required);

            if ($validate->fails()) {
                return response(['message' => $validate->errors()->first()], 400);
            }

            $diskusiData['tanggal_diskusi'] = Carbon::now('Asia/Jakarta');

            $diskusi = Diskusi::create($diskusiData);

            if (!$diskusi) {
                return response()->json([
                    'status' => false,
                    'message' => 'Diskusi gagal ditambahkan',
                ], 500);
            }

            return response()->json([
                'status' => true,
                'message' => 'Diskusi berhasil ditambahkan',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAllDiskusiKecualiCS()
    {
        try {
            $diskusi = Diskusi::with(['barang'])
                ->leftJoin('pembeli', 'diskusi.id_pembeli', '=', 'pembeli.id_pembeli')
                ->where('diskusi.id_pegawai', null)
                ->select(
                    'diskusi.*',
                    'pembeli.nama as nama_pembeli',
                    'pembeli.foto_profile as foto_profile_pembeli',
                )
                ->orderBy('diskusi.tanggal_diskusi', 'desc')
                ->get();

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
    
}
