<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PegawaiController extends Controller
{
    public function index()
    {
        // Ambil data minimal, tanpa relasi
        try {
            $pegawai = Pegawai::select('id_pegawai', 'nama', 'email', 'id_jabatan', 'tanggal_lahir', 'foto_profile')->get();
            return response()->json($pegawai, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    public function generatePegawaiId()
{
    // Ambil semua ID pegawai yang sudah ada, dan hilangkan huruf 'P' di depannya
    $lastPegawai = Pegawai::select('id_pegawai')
        ->orderByRaw('CAST(SUBSTRING(id_pegawai, 2) AS UNSIGNED) DESC')
        ->first();

    // Jika tidak ada data pegawai, berarti ini pegawai pertama, maka ID dimulai dari P1
    if (!$lastPegawai) {
        return 'P1';
    }

    // Ambil angka dari ID terakhir (misalnya P15, ambil 15-nya)
    $lastIdNumber = (int) substr($lastPegawai->id_pegawai, 1);

    // Increment angka ID terakhir
    $newIdNumber = $lastIdNumber + 1;

    // Format ID baru dengan menambahkan 'P' di depannya
    return 'P' . $newIdNumber;
}




public function tambahPegawai(Request $request)
{
    // Validasi data
    $validated = $request->validate([
        'nama' => 'required|string|max:255',
        'email' => 'required|email|unique:pegawai,email',
        'password' => 'required|string|min:6',
        'confirm_password' => 'required|string|min:6|same:password',
        'id_jabatan' => 'required|integer',
        'tanggal_lahir' => 'required|date', // Validasi tanggal lahir
        'foto_pegawai' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validasi gambar
    ]);

    // Cek apakah password dan konfirmasi password cocok
    if ($request->password !== $request->confirm_password) {
        return response()->json(['error' => 'Password dan konfirmasi password tidak cocok.'], 400);
    }

    // Simpan foto jika ada
    if ($request->hasFile('foto_pegawai')) {
        $file = $request->file('foto_pegawai');
        $path = $file->store('public/foto_pegawai'); // Simpan di direktori public/foto_pegawai
    } else {
        $path = null;
    }

    // Generate id_pegawai baru
    $id_pegawai = $this->generatePegawaiId();

    // Simpan pegawai
    try {
        $pegawai = new Pegawai();
        $pegawai->id_pegawai = $id_pegawai;  // Set id_pegawai yang baru
        $pegawai->nama = $request->input('nama');
        $pegawai->email = $request->input('email');
        $pegawai->password = bcrypt($request->input('password')); // Enkripsi password
        $pegawai->id_jabatan = $request->input('id_jabatan');
        $pegawai->foto_profile = $path;
        $pegawai->tanggal_lahir = $request->input('tanggal_lahir'); // Simpan tanggal lahir
        $pegawai->createdAt = now(); // Menambahkan waktu pembuatan
        $pegawai->save();

        return response()->json([
            'message' => 'Pegawai berhasil ditambah',
            'data' => $pegawai,
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Terjadi kesalahan: ' . $e->getMessage(),
        ], 500);
    }
}




    public function getAllPegawai()
    {
        // Mengambil data pegawai dan menyertakan jabatan
        $pegawai = Pegawai::select('id_pegawai', 'nama', 'email', 'tanggal_lahir', 'id_jabatan')
            ->with('jabatan') // Menyertakan relasi jabatan
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Data Pegawai',
            'data' => $pegawai,
            'jumlah' => $pegawai->count(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:100',
            'email' => 'required|email|unique:pegawai,email|unique:penitip,email',
            'password' => 'required|min:8|same:confirm_password',
            'confirm_password' => 'required|min:8',
            'jabatan' => 'required|string|max:100',
            'foto_pegawai' => 'required|image|max:2048',
        ]);

        $fotoPath = $request->file('foto_pegawai')->store('foto_pegawai', 'public');

        $pegawai = Pegawai::create([
            'id_pegawai' => Pegawai::generateId(),
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'jabatan' => $request->jabatan,
            'foto_pegawai' => $fotoPath,
            'createdAt' => now('Asia/Jakarta'),
        ]);

        return response()->json([
            'message' => 'Pegawai berhasil ditambahkan',
            'status' => 'success',
            'data' => $pegawai,
        ]);
    }



    public function getPegawai($id)
    {
        $pegawai = Pegawai::with('jabatan')->find($id);

        if (!$pegawai) {
            return response()->json([
                'status' => false,
                'message' => 'Pegawai tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Data Pegawai',
            'data' => $pegawai,
        ]);
    }

    public function deletePegawai($id)
    {
        $pegawai = Pegawai::find($id);

        if (!$pegawai) {
            return response()->json([
                'status' => false,
                'message' => 'Pegawai tidak ditemukan',
            ], 404);
        }

        // Jika ada foto profil, hapus juga dari penyimpanan
        if ($pegawai->foto_profile) {
            $fotoPath = storage_path('app/public/foto_profile/' . $pegawai->foto_profile);
            if (file_exists($fotoPath)) {
                unlink($fotoPath);
            }
        }

        $pegawai->delete();

        return response()->json([
            'status' => true,
            'message' => 'Pegawai berhasil dihapus',
        ]);
    }


    public function updatePegawai(Request $request, $id)
{
    // Validasi input data dengan pengecualian pada email untuk pegawai yang sedang diupdate
    $validated = $request->validate([
        'id_jabatan' => 'nullable|string',
        'nama' => 'nullable|string|max:255',
        // Pengecualian pada validasi email, agar email yang sama dengan pegawai yang sedang diupdate diizinkan
        'email' => 'nullable|email|unique:pegawai,email,' . $id . ',id_pegawai',  // Memperbaiki pengecualian untuk email
        'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validasi foto profile
    ]);

    // Cek apakah pegawai ada dengan id_pegawai
    $pegawai = DB::table('pegawai')->where('id_pegawai', $id)->first();

    if (!$pegawai) {
        return response()->json([
            'status' => false,
            'message' => 'Pegawai tidak ditemukan',
        ], 404);
    }

    // Update foto profile jika ada
    if ($request->hasFile('foto_profile')) {
        // Hapus foto lama jika ada
        if ($pegawai->foto_profile) {
            $oldPath = 'foto_profile/' . $pegawai->foto_profile;
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        // Simpan foto baru
        $uploadFolder = 'foto_profile';
        $image = $request->file('foto_profile');
        $image_uploaded_path = $image->store($uploadFolder, 'public');
        $fotoProfile = basename($image_uploaded_path);
    } else {
        // Jika tidak ada foto baru, gunakan foto lama
        $fotoProfile = $pegawai->foto_profile;
    }

    // Melakukan update data pegawai menggunakan query DB::table()
    DB::table('pegawai')
        ->where('id_pegawai', $id) // Menggunakan id_pegawai
        ->update([
            'id_jabatan' => $request->id_jabatan,
            'nama' => $request->nama,
            'email' => $request->email, // Update email
            'foto_profile' => $fotoProfile, // Update foto profile jika ada
        ]);

    // Ambil data pegawai yang sudah diperbarui
    $updatedPegawai = DB::table('pegawai')->where('id_pegawai', $id)->first();

    return response()->json([
        'status' => 'success',
        'message' => 'Pegawai berhasil diperbarui',
        'data' => $updatedPegawai
    ]);
}



public function register(Request $request)
{
    $validatedData = $request->validate([
        'nama' => 'required|string',
        'email' => 'required|email|unique:pegawai,email',
        'password' => 'required|string|min:6',
        'id_jabatan' => 'required|integer',
        'tanggal_lahir' => 'required|date',
    ]);

    // Buat ID otomatis: P1, P2, dst.
    $lastPegawai = Pegawai::orderBy('id_pegawai', 'desc')->first();
    if ($lastPegawai) {
        $lastIdNumber = intval(substr($lastPegawai->id_pegawai, 1)); // ambil angka dari "P14"
        $newId = 'P' . ($lastIdNumber + 1);
    } else {
        $newId = 'P1';
    }

    // Cek apakah ID sudah ada
    while (Pegawai::where('id_pegawai', $newId)->exists()) {
        $lastIdNumber = intval(substr($newId, 1)); // ambil angka
        $newId = 'P' . ($lastIdNumber + 1); // generate ID baru
    }

    // Buat Pegawai baru
    $pegawai = Pegawai::create([
        'id_pegawai' => $newId,
        'nama' => $validatedData['nama'],
        'email' => $validatedData['email'],
        'password' => Hash::make($validatedData['password']),
        'id_jabatan' => $validatedData['id_jabatan'],
        'tanggal_lahir' => $validatedData['tanggal_lahir'],
        'foto_profile' => 'default.png',
        'createdAt' => Carbon::now('Asia/Jakarta'),
    ]);

    return response()->json([
        'message' => 'Registrasi berhasil',
        'pegawai' => $pegawai,
    ], 201);
}

public function resetPassword($id)
{
    $pegawai = Pegawai::findOrFail($id);

    // Asumsikan pegawai memiliki atribut 'tanggal_lahir' dengan format YYYY-MM-DD
    $tglLahir = \Carbon\Carbon::parse($pegawai->tanggal_lahir)->format('dmY');

    $pegawai->password = Hash::make($tglLahir);
    $pegawai->save();

    return response()->json(['message' => 'Password berhasil direset'], 200);
}

    public function getFotoProfile($filename)
    {
        $fullPath = storage_path('app/private/foto_profile_pegawai/' . $filename);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($fullPath);
    }
}
