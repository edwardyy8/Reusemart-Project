<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Penitipan;
use App\Models\Pegawai;
use App\Models\Penitip;
use App\Models\Kategori;
use App\Models\Rincian_Penitipan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

$wibTime = Carbon::now('Asia/Jakarta');

class RincianPenitipanController extends Controller
{
    public function perpanjangRincianPenitipan(Request $request, $id)
    {
        try {
            $rincian = Rincian_Penitipan::findOrFail($id);

            $tanggal_akhir = Carbon::parse($rincian->tanggal_akhir)->addDays(30);
            $rincian->update([
                'tanggal_akhir' => $tanggal_akhir,
                'batas_akhir' => $tanggal_akhir,
                'perpanjangan' => 'Ya'
            ]);

            return response()->json([
                'message' => 'Rincian penitipan diperpanjang'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperpanjang.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

public function tambahPenitipanBarang(Request $request)
{
    DB::beginTransaction();

    try {
        // 1. Generate ID Barang
        $id_barang = $this->generateBarangId();

        // 2. Tanggal hari ini
        $tanggal_masuk = Carbon::now();
        $tanggal_akhir = $tanggal_masuk->copy()->addDays(30);
        $batas_akhir = $tanggal_akhir->copy()->addDays(3);

        // 3. Generate ID Penitipan
        $id_penitipan = now()->format('y.m.d');

        // 4. Proses Upload Foto
        $namaFoto = null;
        if ($request->hasFile('foto_barang')) {
            $file = $request->file('foto_barang');

            // Nama file unik (timestamp + nama asli)
            $namaFoto = time() . '_' . $file->getClientOriginalName();

            // Simpan di storage/app/public/foto_barang
            $file->storeAs('foto_barang', $namaFoto, 'public');
        }

        // 5. Insert ke tabel Barang
        Barang::create([
            'id_barang' => $id_barang,
            'id_penitip' => $request->id_penitip,
            'id_kategori' => $request->id_kategori,
            'nama_barang' => $request->nama_barang,
            'stok_barang' => $request->stok_barang,
            'harga_barang' => $request->harga_barang,
            'garansi' => 'Tidak',
            'status_barang' => 'Tersedia',
            'tanggal_garansi' => $request->tanggal_garansi,
            'deskripsi' => $request->deskripsi,
            'tanggal_masuk' => $tanggal_masuk,
            'berat_barang' => $request->berat_barang,
            'foto_barang' => $namaFoto, // Hanya nama file yang disimpan
        ]);

        // 6. Insert ke tabel Penitipan
        Penitipan::create([
            'id_penitipan' => $id_penitipan,
            'id_penitip' => $request->id_penitip,
            'id_qc' => $request->id_qc,
            'id_hunter' => $request->id_hunter,
            'tanggal_masuk' => $tanggal_masuk,
        ]);

        // 7. Insert ke tabel Rincian Penitipan
        Rincian_Penitipan::create([
            'id_penitipan' => $id_penitipan,
            'id_barang' => $id_barang,
            'tanggal_akhir' => $tanggal_akhir,
            'perpanjangan' => 'Tidak',
            'batas_akhir' => $batas_akhir,
            'status_penitipan' => 'Aktif',
        ]);

        DB::commit();

        return response()->json(['message' => 'Barang berhasil dititipkan.'], 201);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function editPenitipanBarang(Request $request, $id)
    {
        $request->validate([
        'nama_barang' => 'nullable|string|max:255',
        'harga_barang' => 'nullable|numeric',
        'deskripsi' => 'nullable|string',
        'berat_barang' => 'nullable|numeric',
        'tanggal_garansi' => 'nullable|date',
        'id_kategori' => 'nullable|exists:kategori,id_kategori',
        'foto_barang' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    $barang = Barang::findOrFail($id);

    if ($request->filled('nama_barang')) {
        $barang->nama_barang = $request->nama_barang;
    }

    if ($request->filled('harga_barang')) {
        $barang->harga_barang = $request->harga_barang;
    }

    if ($request->filled('deskripsi')) {
        $barang->deskripsi = $request->deskripsi;
    }

    if ($request->filled('berat_barang')) {
        $barang->berat_barang = $request->berat_barang;
    }

    if ($request->filled('tanggal_garansi')) {
        $barang->tanggal_garansi = $request->tanggal_garansi;
    }

    if ($request->filled('id_kategori')) {
        $barang->id_kategori = $request->id_kategori;
    }

    if ($request->hasFile('foto_barang')) {
        // Hapus foto lama jika ada
        if ($barang->foto_barang) {
            $oldPath = 'foto_barang/' . $barang->foto_barang;
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        // Simpan foto baru
        $uploadFolder = 'foto_barang';
        $image = $request->file('foto_barang');
        $image_uploaded_path = $image->store($uploadFolder, 'public');
        $barang->foto_barang = basename($image_uploaded_path);
    }

    $barang->save();

    return response()->json([
        'message' => 'Data barang berhasil diperbarui.',
        'barang' => $barang,
    ]);
    }

    public function getAllPenitipanBarang()
    {
        $barang = Barang::with(['rincian_penitipan.penitipan', 'penitip', 'donasi', 'kategori'])->get();
        return response()->json(['data' => $barang], 200);
    }

    public function generateBarangId()
{
    $lastBarang = Barang::select('id_barang')
        ->orderByRaw('CAST(SUBSTRING(id_barang, 2) AS UNSIGNED) DESC')
        ->first();

    if (!$lastBarang) {
        return 'T1';
    }

    $lastIdNumber = (int) substr($lastBarang->id_barang, 1);
    $newIdNumber = $lastIdNumber + 1;

    return 'T' . $newIdNumber;
}

public function getAllRequiredTambahBarang()
{
    try {
        $pegawai = Pegawai::all(); // semua pegawai (bisa difilter QC/Hunter di frontend)
        $penitip = Penitip::all(); // data penitip
        $kategori = Kategori::all(); // data kategori barang

        return response()->json([
            'pegawai' => $pegawai,
            'penitip' => $penitip,
            'kategori' => $kategori
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Gagal mengambil data',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function getPenitipanBarangById($id)
{
    $barang = Barang::find($id);

    if (!$barang) {
        return response()->json([
            'status' => false,
            'message' => 'barang tidak ditemukan',
        ], 404);
    }

    return response()->json([
        'status' => true,
        'message' => 'Data barang',
        'data' => $barang,
    ]);
}

}
