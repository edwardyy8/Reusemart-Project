<?php

namespace App\Http\Controllers;

use App\Models\Request_Donasi;
use App\Models\Donasi;
use App\Models\Barang; // Ditambahkan karena dipakai di getBarangTerdonasikan
use Illuminate\Http\Request;
use Carbon\Carbon;

class RequestDonasiController extends Controller
{
    public function index(Request $request)
    {
        // Asumsikan kamu sudah tahu id_organisasi atau ambil dari session/auth
        $organisasi = auth()->user()->organisasi; // Sesuaikan ini kalau pakai relasi user ke organisasi

        // Ambil semua request donasi dari organisasi ini + donasinya + barang dari donasi tsb
        $requestDonasi = Request_Donasi::with('donasi.barang')
            ->where('id_organisasi', $organisasi->id_organisasi)
            ->get();

        return view('request_donasi.index', compact('requestDonasi'));
    }

    public function getRequestDonasi()
{
    try {
        $requestdonasi = Request_Donasi::with('organisasi') // Menambahkan relasi organisasi
            ->select('id_request', 'id_organisasi', 'isi_request', 'tanggal_request', 'tanggal_approve')
            ->get();
        return response()->json($requestdonasi, 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
    }
}


    public function indexByOrganisasi(Request $request)
    {
        try {
            $organisasi = $request->user();
            if (!$organisasi) {
                return response()->json(['message' => 'Unauthorized'], 401);
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
        // Ambil satu request donasi + relasinya
        $requestDonasi = Request_Donasi::with('donasi.barang')
            ->findOrFail($id);

        return response()->json([
            'message' => 'Berhasil mengambil data request donasi',
            'data' => $requestDonasi
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'isi_request' => 'required|string',
        ]);

        $newRequest = Request_Donasi::with('organisasi')
        ->create([
            'id_request' => Request_Donasi::generateId(),
            'id_organisasi' => $request->user()->id_organisasi,
            'isi_request' => $request->isi_request,
            'tanggal_request' => Carbon::now('Asia/jakarta'),
            'tanggal_approve' => null,
        ]);

        return response()->json([
            'message' => 'Request berhasil dibuat',
            'status' => 'success',
            'data' => $newRequest,
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
        $req->tanggal_request = Carbon::now('Asia/Jakarta');
        $req->save();

        return response()->json([
            'message' => 'Request berhasil diperbarui',
            'status' => 'success',
            'data' => $req,
        ]);
    }

    public function destroy($id)
    {
        $req = Request_Donasi::find($id);

        if (!$req) {
            return response()->json(['message' => 'Request tidak ditemukan.'], 404);
        }

        $req->delete();

        return response()->json(['message' => 'Request berhasil dihapus.']);
    }

    public function deleteRequestOwner($id)
    {
        $request = Request_Donasi::find($id);

        if (!$request) {
            return response()->json([
                'status' => false,
                'message' => 'request tidak ditemukan',
            ], 404);
        }

        $request->delete();

        return response()->json([
            'status' => true,
            'message' => 'request Berhasil Dihapus',
        ]);
    }

    public function confirmRequest($id_request)
    {
        try {
            $requestDonasi = Request_Donasi::findOrFail($id_request);
            $requestDonasi->tanggal_approve = now();
            $requestDonasi->save();

            return response()->json(['message' => 'Request donasi berhasil dikonfirmasi dan data donasi dibuat.'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengonfirmasi request donasi.', 'error' => $e->getMessage()], 500);
        }
    }

    public function getBarangTerdonasikan()
    {
        $barangTerdonasikan = Barang::where('status_barang', 'Didonasikan')->get();

        return response()->json(['data' => $barangTerdonasikan], 200);
    }
}
