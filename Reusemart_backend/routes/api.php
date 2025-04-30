<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\DonasiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PenitipController;
use App\Http\Controllers\FotoBarangController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\MerchandiseController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\JabatanController;

use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

use App\Http\Middleware\CekJabatan;
use App\Http\Middleware\EnsureApiTokenIsValid;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/donasi',[DonasiController::class,'index']);

Route::get('/barang',[BarangController::class,'index']);
Route::get('/barang/kategori/{id_kategori}',[BarangController::class,'findByKategori']);
Route::get('/barang/sub/{id_kategori}',[BarangController::class,'findBySubKategori']);
Route::get('/barang/{id}', [BarangController::class, 'show']);


Route::post('/register',[AuthController::class,'register']);

Route::middleware('guest')->group(function () {
    Route::post('/login',[AuthController::class,'login']);
    
});
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/getrole', [AuthController::class, 'getRole']);
});


Route::middleware('auth:pegawai')->group(function () {
    Route::get('/getJabatan', [AuthController::class, 'getJabatan']);

    Route::post('/resetPassPegawai', [AuthController::class, 'resetPassPegawai'])
        ->middleware(EnsureApiTokenIsValid::class, CekJabatan::class.':Admin');

    Route::get('/pegawai/foto-profile/{filename}', [PegawaiController::class, 'getFotoProfile']);
});

Route::get('/penitip', [PenitipController::class, 'index']);
Route::get('/penitip/{id}', [PenitipController::class, 'show']);


Route::post('/fotobarang', [FotoBarangController::class, 'store']);
Route::get('/fotobarang/barang/{id_barang}', [FotoBarangController::class, 'getByBarangId']);
Route::delete('/fotobarang/{id}', [FotoBarangController::class, 'destroy']);

Route::get('/kategori', [KategoriController::class, 'index']);
Route::get('/kategori/{id}', [KategoriController::class, 'show']);

Route::get('/merchandise', [MerchandiseController::class, 'index']);
Route::get('/merchandise/{id}', [MerchandiseController::class, 'show']);

Route::get('/pegawai', [PegawaiController::class, 'index']);
Route::get('/pegawai/{id}', [PegawaiController::class, 'show']);

Route::get('/jabatan', [JabatanController::class, 'index']);
Route::get('/jabatan/{id}', [JabatanController::class, 'show']);
