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
        // Log semua data yang diterima
        \Log::info('Request data:', $request->all());
        \Log::info('Request files:', $request->allFiles());

        // 1. Generate ID Penitipan
        $id_penitipan = $this->generatePenitipanId();

        // 2. Tanggal hari ini
        $tanggal_masuk = Carbon::now();

        // 3. Insert ke tabel Penitipan (sekali saja)
        Penitipan::create([
            'id_penitipan' => $id_penitipan,
            'id_penitip' => $request->id_penitip,
            'id_qc' => $request->id_qc,
            'id_hunter' => $request->id_hunter,
            'tanggal_masuk' => $tanggal_masuk,
        ]);

        // 4. Proses array barang
        $barang_list = $request->barang;

        foreach ($barang_list as $index => $barang) {
            // Generate ID Barang
            $id_barang = $this->generateBarangId();

            // Proses upload foto
            $namaFoto = null;
            $file = $request->file("barang.$index.foto_barang");
            if ($file) {
                \Log::info("File diterima untuk barang[$index][foto_barang]: " . $file->getClientOriginalName());
                $namaFoto = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('foto_barang', $namaFoto, 'public');
            } else {
                \Log::warning("File tidak ditemukan untuk barang[$index][foto_barang]");
            }

            // Insert ke tabel Barang
            Barang::create([
                'id_barang' => $id_barang,
                'id_penitip' => $request->id_penitip,
                'id_kategori' => $barang['id_kategori'],
                'nama_barang' => $barang['nama_barang'],
                'stok_barang' => $barang['stok_barang'],
                'harga_barang' => $barang['harga_barang'],
                'garansi' => 'Tidak',
                'status_barang' => 'Tersedia',
                'tanggal_garansi' => $barang['tanggal_garansi'],
                'deskripsi' => $barang['deskripsi'],
                'tanggal_masuk' => $tanggal_masuk,
                'berat_barang' => $barang['berat_barang'],
                'foto_barang' => $namaFoto,
            ]);

            // Hitung tanggal akhir dan batas akhir untuk Rincian Penitipan
            $tanggal_akhir = $tanggal_masuk->copy()->addDays(30);
            $batas_akhir = $tanggal_akhir->copy()->addDays(3);

            // Insert ke tabel Rincian Penitipan
            Rincian_Penitipan::create([
                'id_penitipan' => $id_penitipan,
                'id_barang' => $id_barang,
                'tanggal_akhir' => $tanggal_akhir,
                'perpanjangan' => 'Tidak',
                'batas_akhir' => $batas_akhir,
                'status_penitipan' => 'Aktif',
            ]);
        }

        DB::commit();

        return response()->json([
            'message' => 'Penitipan barang berhasil.',
            'id_penitipan' => $id_penitipan
        ], 201);
    } catch (\Exception $e) {
        DB::rollBack();
        \Log::error('Error saat menyimpan penitipan: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function getPenitipanDetails($id_penitipan)
{
    $penitipan = Penitipan::with(['penitip', 'qc', 'rincian_penitipan.barang'])
        ->where('id_penitipan', $id_penitipan)
        ->first();

    if (!$penitipan) {
        return response()->json([
            'status' => false,
            'message' => 'Penitipan tidak ditemukan',
        ], 404);
    }

    return response()->json([
        'status' => true,
        'data' => $penitipan,
    ]);
}

private function generatePenitipanId()
{
    $prefix = date('y') . '.' . date('m');

    $last = \DB::table('penitipan')
        ->select('id_penitipan')
        ->where('id_penitipan', 'LIKE', $prefix . '.%')
        ->orderByRaw("CAST(SUBSTRING_INDEX(id_penitipan, '.', -1) AS UNSIGNED) DESC")
        ->limit(1)
        ->first();

    $newIncrement = 1;
    if ($last && isset($last->id_penitipan)) {
        $parts = explode('.', $last->id_penitipan);
        $lastIncrement = isset($parts[2]) ? (int)$parts[2] : 0;
        $newIncrement = $lastIncrement + 1;
    }

    return $prefix . '.' . $newIncrement;
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
