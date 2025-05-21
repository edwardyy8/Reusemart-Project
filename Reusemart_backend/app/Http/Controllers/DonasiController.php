<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Barang;
use App\Models\Donasi;
use App\Models\Request_Donasi;
use Illuminate\Http\Request;
use function Symfony\Component\Translation\t;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DonasiController extends Controller
{
    public function index()
{
    try {
        $donasis = Donasi::join('barang', 'donasi.id_barang', '=', 'barang.id_barang')
            ->join('request_donasi', 'donasi.id_request', '=', 'request_donasi.id_request')
            ->join('organisasi', 'request_donasi.id_organisasi', '=', 'organisasi.id_organisasi')
            ->select(
                'donasi.id_donasi',
                'donasi.tanggal_donasi',
                'barang.nama_barang',
                'barang.foto_barang', // Sekarang berasal langsung dari tabel barang
                'organisasi.foto_profile',
                'organisasi.nama'
            )
            ->orderBy('donasi.tanggal_donasi', 'desc')
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->tanggal_donasi)->format('Y-m-d');
            });

        return response()->json([
            'message' => 'All donasi retrieved successfully',
            'status' => 'success',
            'data' => $donasis,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage(),
            'status' => 'error',
        ], 500);
    }
}



public function createDonasiOwner(Request $request)
{
    $validated = $request->validate([
        'id_barang' => 'required|exists:barang,id_barang',
        'id_request' => 'required|exists:request_donasi,id_request',
        'id_pegawai' => 'required|exists:pegawai,id_pegawai',
        'nama_penerima' => 'required|string|max:255',
    ]);

    $validated['tanggal_donasi'] = now(); // otomatis isi tanggal sekarang

    // Gunakan transaksi agar data konsisten
    DB::beginTransaction();
    try {
        // Buat donasi
        $donasi = Donasi::create($validated);

        // Ambil data barang
        $barang = Barang::findOrFail($validated['id_barang']);

        // Update status barang jadi 'didonasikan'
        $barang->status_barang = 'Didonasikan';
        $barang->save();

        // Hitung poin yang didapat penitip
        $poinTambahan = (int) ceil($barang->harga_barang / 10000);

        // Update poin penitip
        $penitip = $barang->penitip;
        $penitip->poin_penitip += $poinTambahan;
        $penitip->save();

        DB::commit();

        return response()->json([
            'message' => 'Donasi berhasil ditambahkan',
            'data' => $donasi,
            'poin_didapat' => $poinTambahan,
            'total_poin_penitip' => $penitip->poin_penitip
        ], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Gagal membuat donasi',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function store(Request $request)
    {
        // Validate input
        $request->validate([
            'id_request' => 'required|exists:request_donasi,id_request',
            'id_barang' => 'required|exists:barang,id_barang',
            'nama_penerima' => 'required|string',
        ]);

        // Create Donasi record
        $donasi = new Donasi([
            'id_donasi' => Donasi::generateId(), // Assuming you have a function to generate ID
            'id_request' => $request->id_request,
            'id_barang' => $request->id_barang,
            'id_pegawai' => "P1", // Use logged-in employee ID
            'tanggal_donasi' => now(),
            'nama_penerima' => $request->nama_penerima,
        ]);

        // Save the Donasi record
        $donasi->save();

        return redirect()->route('donasi.index')->with('success', 'Donasi successfully created!');
    }

    public function getAllBarangTerdonasikan()
{
    $barangs = Barang::where('status_barang', 'Barang untuk Donasi')
        ->whereDoesntHave('donasi') // artinya: tidak ada record di tabel donasi dengan id_barang ini
        ->get();

    if ($barangs->isEmpty()) {
        return response()->json([
            'message' => 'Barang terdonasikan tidak ditemukan',
            'status' => 'error',
        ], 404);
    }

    return response()->json([
        'message' => 'Barang terdonasikan ditemukan',
        'status' => 'success',
        'data' => $barangs,
    ]);
}

// Mengambil id request yang tidak ada di donasi dan tanggal_approve not null
public function getRequestNotNull()
{
    try {
        $requestdonasi = Request_Donasi::select('request_donasi.id_request', 'request_donasi.id_organisasi', 'request_donasi.isi_request', 'request_donasi.tanggal_request', 'request_donasi.tanggal_approve')
            ->whereNotNull('request_donasi.tanggal_approve') // Memastikan tanggal_approve tidak null
            ->whereNotIn('request_donasi.id_request', function($query) {
                $query->select('id_request')
                      ->from('donasi');
            }) // Memastikan id_request belum ada di tabel donasi
            ->with('organisasi') // Mengambil relasi organisasi
            ->get();

        return response()->json($requestdonasi, 200);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
    }
}


}
