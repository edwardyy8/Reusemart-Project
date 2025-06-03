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

class RincianPenitipanController extends Controller
{
    public function tambahPenitipanBarang(Request $request)
    {
        DB::beginTransaction();

        try {
            // Log request data
            \Log::info('Request data:', $request->all());
            \Log::info('Request files:', $request->allFiles());

            // Validate request
            $request->validate([
                'id_penitip' => 'required|exists:penitip,id_penitip',
                'id_qc' => 'required|exists:pegawai,id_pegawai',
                'id_hunter' => 'nullable|exists:pegawai,id_pegawai',
                'isHunting' => 'required|in:yes,no',
                'barang.*.id_kategori' => 'required|exists:kategori,id_kategori',
                'barang.*.nama_barang' => 'required|string|max:255',
                'barang.*.stok_barang' => 'required|integer|min:1',
                'barang.*.harga_barang' => 'required|numeric|min:0',
                'barang.*.deskripsi' => 'nullable|string',
                'barang.*.berat_barang' => 'required|numeric|min:0',
                'barang.*.tanggal_garansi' => 'nullable|date',
                'barang.*.foto_barang' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            // Generate ID Penitipan
            $id_penitipan = $this->generatePenitipanId();

            // Current date
            $tanggal_masuk = Carbon::now();

            // Create Penitipan
            Penitipan::create([
                'id_penitipan' => $id_penitipan,
                'id_penitip' => $request->id_penitip,
                'id_qc' => $request->id_qc,
                'id_hunter' => $request->id_hunter ?: null,
                'tanggal_masuk' => $tanggal_masuk,
            ]);

            // Process barang array
            $barang_list = $request->input('barang', []);

            foreach ($barang_list as $index => $barang) {
                // Generate ID Barang
                $id_barang = $this->generateBarangId();

                // Process photo upload
                $namaFoto = null;
                if ($request->hasFile("barang.$index.foto_barang")) {
                    $file = $request->file("barang.$index.foto_barang");
                    \Log::info("File received for barang[$index][foto_barang]: " . $file->getClientOriginalName());
                    $namaFoto = time() . '_' . $file->getClientOriginalName();
                    $file->storeAs('foto_barang', $namaFoto, 'public');
                } else {
                    \Log::error("File not found for barang[$index][foto_barang]");
                    throw new \Exception("Foto barang untuk indeks $index tidak ditemukan.");
                }

                // Create Barang
                Barang::create([
                    'id_barang' => $id_barang,
                    'id_penitip' => $request->id_penitip,
                    'id_kategori' => $barang['id_kategori'],
                    'nama_barang' => $barang['nama_barang'],
                    'stok_barang' => $barang['stok_barang'],
                    'harga_barang' => $barang['harga_barang'],
                    'garansi' => 'Tidak',
                    'status_barang' => 'Tersedia',
                    'tanggal_garansi' => $barang['tanggal_garansi'] ?: null,
                    'deskripsi' => $barang['deskripsi'],
                    'tanggal_masuk' => $tanggal_masuk,
                    'berat_barang' => $barang['berat_barang'],
                    'foto_barang' => $namaFoto,
                ]);


                // Calculate tanggal_akhir and batas_akhir
                $tanggal_akhir = $tanggal_masuk->copy()->addDays(30);
                $batas_akhir = $tanggal_akhir->copy()->addDays(3);

                // Create Rincian Penitipan
                Rincian_Penitipan::create([
                    'id_penitipan' => $id_penitipan,
                    'id_barang' => $id_barang,
                    'tanggal_akhir' => $tanggal_akhir,
                    'perpanjangan' => 0,
                    'batas_akhir' => $batas_akhir,
                    'status_penitipan' => 'Sedang Dititipkan',
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
            return response()->json([
                'message' => 'Gagal menyimpan penitipan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function perpanjangRincianPenitipan(Request $request, $id)
    {
        try {
            $rincian = Rincian_Penitipan::findOrFail($id);

            $tanggal_akhir = Carbon::parse($rincian->tanggal_akhir)->addDays(30);
            $rincian->update([
                'tanggal_akhir' => $tanggal_akhir,
                'batas_akhir' => $tanggal_akhir,
                'perpanjangan' => 1
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

        $last = DB::table('penitipan')
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

    private function generateBarangId()
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

    private function generateRincianPenitipanId()
    {
        $lastRincian = Rincian_Penitipan::select('id_rincianpenitipan')
            ->orderBy('id_rincianpenitipan', 'desc')
            ->first();

        if (!$lastRincian) {
            return 'RP1';
        }

        $lastIdNumber = (int) substr($lastRincian->id_rincianpenitipan, 2);
        $newIdNumber = $lastIdNumber + 1;

        return 'RP' . $newIdNumber;
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
        'id_penitip' => 'nullable|exists:penitip,id_penitip',
        'id_qc' => 'nullable|exists:pegawai,id_pegawai',
        'id_hunter' => 'nullable|exists:pegawai,id_pegawai',
        'foto_barang' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'perpanjangan' => 'nullable|in:0,1',
        'status_penitipan' => 'nullable|in:Sedang Dititipkan,Barang Untuk Donasi,Diambil Kembali',
    ]);

    $barang = Barang::findOrFail($id);

    // Update tabel barang
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

    if ($request->filled('id_penitip')) {
        $barang->id_penitip = $request->id_penitip;
    }

    if ($request->hasFile('foto_barang')) {
        if ($barang->foto_barang) {
            $oldPath = 'foto_barang/' . $barang->foto_barang;
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
        $uploadFolder = 'foto_barang';
        $image = $request->file('foto_barang');
        $image_uploaded_path = $image->store($uploadFolder, 'public');
        $barang->foto_barang = basename($image_uploaded_path);
    }

    $barang->save();

    // Update tabel penitipan melalui rincian_penitipan
    if ($request->filled('id_qc') || $request->filled('id_hunter') || $request->filled('perpanjangan') || $request->filled('status_penitipan')) {
        $rincianPenitipan = $barang->rincian_penitipan;
        if ($rincianPenitipan) {
            $penitipan = Penitipan::find($rincianPenitipan->id_penitipan);
            if ($penitipan) {
                if ($request->filled('id_qc')) {
                    $penitipan->id_qc = $request->id_qc;
                }
                if ($request->filled('id_hunter')) {
                    $penitipan->id_hunter = $request->id_hunter;
                }
                $penitipan->save();
            }

            // Update rincian_penitipan untuk perpanjangan dan status
            if ($request->filled('perpanjangan')) {
                $rincianPenitipan->perpanjangan = $request->perpanjangan;
            }
            if ($request->filled('status_penitipan')) {
                $rincianPenitipan->status_penitipan = $request->status_penitipan;
            }
            $rincianPenitipan->save();
        }
    }

    return response()->json([
        'message' => 'Data barang dan penitipan berhasil diperbarui.',
        'barang' => $barang,
    ]);
}

    public function getAllPenitipanBarang()
    {
        $barang = Barang::with(['rincian_penitipan.penitipan', 'penitip', 'donasi', 'kategori'])->get();
        return response()->json(['data' => $barang], 200);
    }

    public function getAllRequiredTambahBarang()
    {
        try {
            $pegawai = Pegawai::all();
            $penitip = Penitip::all();
            $kategori = Kategori::all();

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
        $barang = Barang::with('rincian_penitipan.penitipan')->find($id);

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
