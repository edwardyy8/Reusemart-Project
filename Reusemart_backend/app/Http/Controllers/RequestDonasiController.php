<?php

namespace App\Http\Controllers;

use App\Models\Request_Donasi;
use App\Models\Donasi;
use Illuminate\Http\Request;
use Storage;
use Carbon\Carbon;


class RequestDonasiController extends Controller
{
    public function indexByOrganisasi(Request $request)
    {
        try {
            $organisasi = $request->user();
    

            if (!$organisasi) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 401);
            }

    
            $requestDonasi = Request_Donasi::with('donasi')
                ->where('id_organisasi', $organisasi->id_organisasi)
                ->get();

            return response()->json([
                'message' => 'Request donasi retrieved',
                'status' => 'success',
                'data' => $requestDonasi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to get request donasi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $req = Request_Donasi::find($id);

        if (!$req) {
            return response()->json([
                'message' => 'Request not found',
                'status' => 'error',
            ], 404);
        }

        return response()->json([
            'message' => 'Request retrieved successfully',
            'status' => 'success',
            'data' => $req,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'isi_request' => 'required|string',
        ]);
        $wibTime = Carbon::now('Asia/Jakarta');

        $req = Request_Donasi::create([
            'id_request' => Request_Donasi::generateId(),
            'id_organisasi' => $request->user()->id_organisasi,
            'isi_request' => $request->isi_request,
            'tanggal_request' => $wibTime
        ]);

        return response()->json([
            'message' => 'Request berhasil ditambahkan',
            'status' => 'success',
            'data' => $req,
        ]);
    }


    public function destroy($id)
    {
        $req = Request_Donasi::find($id);

        if (!$req) {
            return response()->json([
                'message' => 'Request tidak ditemukan.'
            ], 404);
        }

        $req->delete();

        return response()->json([
            'message' => 'Request berhasil dihapus.'
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'isi_request' => 'nullable|string',
        ]);

        $req = Request_Donasi::findOrFail($id);
        if ($request->has('isi_request')) {
            $req->isi_request = $request->isi_request;
        }

        $req->save();

        return response()->json([
            'message' => 'Request berhasil diperbarui',
            'status' => 'success',
            'data' => $req,
        ]);
    }
}
