<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\DonasiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PenitipController;

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



Route::post('/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/getrole', [AuthController::class, 'getRole']);
});


Route::middleware('auth:pegawai')->group(function () {
    Route::get('/getJabatan', [AuthController::class, 'getJabatan']);

    Route::post('/resetPassPegawai', [AuthController::class, 'resetPassPegawai'])
        ->middleware(EnsureApiTokenIsValid::class, CekJabatan::class.':Admin');
});

Route::get('/penitip', [PenitipController::class, 'index']);
Route::get('/penitip/{id}', [PenitipController::class, 'show']);



