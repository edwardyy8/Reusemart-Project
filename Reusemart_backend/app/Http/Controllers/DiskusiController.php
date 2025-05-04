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
                ->leftJoin('penitip', 'diskusi.id_penitip', '=', 'penitip.id_penitip')
                ->leftJoin('pembeli', 'diskusi.id_pembeli', '=', 'pembeli.id_pembeli')
                ->leftJoin('pegawai', 'diskusi.id_pegawai', '=', 'pegawai.id_pegawai')
                ->leftJoin('organisasi', 'diskusi.id_organisasi', '=', 'organisasi.id_organisasi')
                ->select(
                    'diskusi.*',
                    'penitip.nama as nama_penitip',
                    'pembeli.nama as nama_pembeli',
                    'pegawai.nama as nama_pegawai',
                    'organisasi.nama as nama_organisasi',
                    'penitip.foto_profile as foto_profile_penitip',
                    'pembeli.foto_profile as foto_profile_pembeli',
                    'pegawai.foto_profile as foto_profile_pegawai',
                    'organisasi.foto_profile as foto_profile_organisasi'
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

            $userType = $request->user()->getUserType();
            if ($userType == 'pembeli') {
                $diskusiData['id_pembeli'] = $id;
            } elseif ($userType == 'penitip') {
                $diskusiData['id_penitip'] = $id;
            } elseif ($userType == 'pegawai') {
                $diskusiData['id_pegawai'] = $id;
            } elseif ($userType == 'organisasi') {
                $diskusiData['id_organisasi'] = $id;
            }

            $required = [
                'id_barang' => 'required|exists:barang,id_barang',
                'id_pembeli' => 'nullable|exists:pembeli,id_pembeli',
                'id_penitip' => 'nullable|exists:penitip,id_penitip',
                'id_pegawai' => 'nullable|exists:pegawai,id_pegawai',
                'id_organisasi' => 'nullable|exists:organisasi,id_organisasi',
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
    
}
