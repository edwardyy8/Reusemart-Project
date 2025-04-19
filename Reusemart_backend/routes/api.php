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
Route::get('/barang/{id}', [BarangController::class, 'show']);


Route::get('/penitip', [PenitipController::class, 'index']);
Route::get('/penitip/{id}', [PenitipController::class, 'show']);


Route::post('/login',[AuthController::class,'login']);
