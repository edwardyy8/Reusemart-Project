<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\DonasiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PenitipController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/donasi',[DonasiController::class,'index']);

Route::get('/barang',[BarangController::class,'index']);
Route::get('/barang/kategori/{id_kategori}',[BarangController::class,'findByKategori']);
Route::get('/barang/sub/{id_kategori}',[BarangController::class,'findBySubKategori']);


Route::post('/login',[AuthController::class,'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/getrole', [AuthController::class, 'getRole']);
});


Route::middleware('auth:pegawai')->group(function () {
    Route::get('/getJabatan', [AuthController::class, 'getJabatan']);
   
});
