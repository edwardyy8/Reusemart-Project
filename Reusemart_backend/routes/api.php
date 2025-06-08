<?php



use App\Http\Controllers\RincianPenitipanController;
use App\Models\Organisasi;
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
use App\Http\Controllers\OrganisasiController;
use App\Http\Controllers\PembeliController;
use App\Http\Controllers\PemesananController;
use App\Http\Controllers\RincianPemesananController;
use App\Http\Controllers\AlamatController;
use App\Http\Controllers\DiskusiController;
use App\Http\Controllers\RequestDonasiController;
use App\Http\Controllers\PenitipanController;
use App\Http\Controllers\KeranjangController;

use App\Http\Controllers\LaporanController;

use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\ClaimMerchandiseController;
use App\Http\Middleware\CekJabatan;
use App\Http\Middleware\EnsureApiTokenIsValid;
use App\Models\Barang;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/donasi', [DonasiController::class, 'index']);
Route::post('/donasi', [DonasiController::class, 'store']);

Route::get('/barang', [BarangController::class, 'index']);
Route::get('/barang/kategori/{id_kategori}', [BarangController::class, 'findByKategori']);
Route::get('/barang/sub/{id_kategori}', [BarangController::class, 'findBySubKategori']);
Route::get('/barang/{id}', [BarangController::class, 'show']);
Route::get('/barang/search', [BarangController::class, 'search']);

Route::post('/register', [AuthController::class, 'register']);

Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/getrole', [AuthController::class, 'getRole']);
    Route::post('tambahDiskusi', [DiskusiController::class, 'tambahDiskusi']);
    Route::post('/fetchMenungguPembayaran', [PemesananController::class, 'fetchMenungguPembayaran']);
    Route::post('/update-fcm-token', [AuthController::class, 'updateFcmToken']);
    Route::post('/remove-fcm-token', [AuthController::class, 'removeToken']);
    Route::get('/getUserData', [AuthController::class, 'getUserData']);
});

Route::middleware('auth:pegawai')->group(function () {
    Route::get('/getJabatan', [AuthController::class, 'getJabatan']);
    Route::get('/pegawai/foto-profile/{filename}', [PegawaiController::class, 'getFotoProfile']);
    Route::get('/pegawai/foto-ktp/{filename}', [PegawaiController::class, 'getFotoKtp']);

    Route::middleware(CekJabatan::class . ':Admin')->group(function () {
        Route::post('/resetPassPegawai/{id_pegawai}', [AuthController::class, 'resetPassPegawai'])
            ->middleware(EnsureApiTokenIsValid::class);

        Route::get('/getAllOrganisasi', [OrganisasiController::class, 'getAllOrganisasi']);
        Route::post('/deleteOrganisasi/{id}', [OrganisasiController::class, 'deleteOrganisasi']);
        Route::post('/editOrganisasi/{id}', [OrganisasiController::class, 'editOrganisasi']);
        Route::get('/getOrganisasi/{id}', [OrganisasiController::class, 'getOrganisasi']);

        Route::get('/pegawai', [PegawaiController::class, 'index']);
        Route::post('/pegawai', [PegawaiController::class, 'store']);
        Route::get('/getPegawai/{id}', [PegawaiController::class, 'getPegawai']);
        Route::post('/deletePegawai/{id}', [PegawaiController::class, 'deletePegawai']);
        Route::post('/updatePegawai/{id}', [PegawaiController::class, 'updatePegawai']);
        Route::post('/tambahPegawai', [PegawaiController::class, 'tambahPegawai']);
        Route::get('/pegawai/{id}', [PegawaiController::class, 'show']);
        Route::get('/resetPasswordPegawai', [PegawaiController::class, 'resetPassword']);

        Route::get('/organisasi/organisasiPage', [OrganisasiController::class, 'getOrganisasiProfile']);
        Route::get('/organisasi/request-donasi', [RequestDonasiController::class, 'indexByOrganisasi']);
        Route::get('/organisasi/request-donasi/{id}', [RequestDonasiController::class, 'show']);
        Route::put('/request_donasi/{id}', [RequestDonasiController::class, 'update']);
        Route::get('/organisasi', [OrganisasiController::class, 'index']);

        Route::get('/getJabatan/{id}', [JabatanController::class, 'getJabatan']);
        Route::get('/getAllJabatan', [JabatanController::class, 'getAllJabatan']);
        Route::delete('/deleteJabatan/{id}', [JabatanController::class, 'deleteJabatan']);
        Route::post('/editJabatan/{id}', [JabatanController::class, 'editJabatan']);

        Route::get('/getAllMerchandiseCS', [MerchandiseController::class, 'getAllMerchandiseCS']);
        Route::get('/getMerchandiseById/{id}', [MerchandiseController::class, 'getMerchandiseById']);
        Route::post('/createMerchandise', [MerchandiseController::class, 'createMerchandise']);
        Route::put('/updateMerchandise/{id}', [MerchandiseController::class, 'updateMerchandise']);
        Route::delete('/deleteMerchandise/{id}', [MerchandiseController::class, 'deleteMerchandise']);

        // Route::get('/donasi',[DonasiController::class,'index']);
        // Route::post('/donasi', [DonasiController::class, 'store'])->name('donasi.store');
    });

    Route::middleware(CekJabatan::class . ':Customer Service')->group(function () {
        Route::post('/penitip', [PenitipController::class, 'store']);
        Route::get('/getAllDiskusiKecualiCS', [DiskusiController::class, 'getAllDiskusiKecualiCS']);
        Route::get('/penitip', [PenitipController::class, 'index']);
        // Route::get('/penitip/{id}', [PenitipController::class, 'show']);
        Route::put('/penitip/{id}', [PenitipController::class, 'update']);
        Route::post('/deletePenitip/{id}', [PenitipController::class, 'destroy']);

        Route::get('/getAllClaimMerchandise', [ClaimMerchandiseController::class, 'getAllClaimMerchandise']);
        Route::get('/getClaimMerchandiseById/{id}', [ClaimMerchandiseController::class, 'getClaimMerchandiseById']);
        Route::post('/confirmClaimMerchandise/{id_request}', [ClaimMerchandiseController::class, 'confirmClaimMerchandise']);
        Route::get('/getPemesananUntukVerifikasi', [PemesananController::class, 'getPemesananUntukVerifikasi']);
        Route::post('/verifikasiBuktiPembayaran/{id}', [PemesananController::class, 'verifikasiBuktiPembayaran']);
        Route::get('/getFotoBukti/{filename}', [PemesananController::class, 'getFotoBukti']);

    });

    Route::middleware(CekJabatan::class . ':Owner')->group(function () {
        Route::get('/barang/didonasi', [DonasiController::class, 'getBarangDidonasikan']);
        Route::get('/getRequestNotNull', [DonasiController::class, 'getRequestNotNull']);
        Route::get('/getAllBarangTerdonasikan', [DonasiController::class, 'getAllBarangTerdonasikan']);
        Route::post('/createDonasiOwner', [DonasiController::class, 'createDonasiOwner']);
        Route::delete('/deleteRequestOwner/{id}', [RequestDonasiController::class, 'deleteRequestOwner']);
        Route::post('/confirmRequest/{id_request}', [RequestDonasiController::class, 'confirmRequest']);
        Route::get('/get-request-donasi', [RequestDonasiController::class, 'getRequestDonasi']);

        Route::get('/penitip', [PenitipController::class, 'index']);
        Route::get('/laporanDonasiBarang/{tahun}', [LaporanController::class, 'laporanDonasiBarang']);
        Route::get('/laporanRekapRequest', [LaporanController::class, 'laporanRekapRequest']);
        Route::get('/laporanStokGudang', [LaporanController::class, 'laporanStokGudang']);
        Route::get('/laporanKomisiBulanan/{tahun}/{bulan}', [LaporanController::class, 'laporanKomisiBulanan']);
        Route::get('/laporanPenitip/{tahun}/{bulan}/{id}', [LaporanController::class, 'laporanPenitip']);
        Route::get('/laporanByKategori/{tahun}', [LaporanController::class, 'laporanByKategori']);
        Route::get('/laporanPenitipanHabis/{tahun}', [LaporanController::class, 'laporanPenitipanHabis']);
        Route::get('/laporanPenjualanKeseluruhan/{tahun}', [LaporanController::class, 'laporanPenjualanKeseluruhan']);

    });

    Route::middleware(cekJabatan::class.':Gudang')->group(function () {
        Route::get('/getAllPemesanan', [PemesananController::class, 'getAllPemesanan']);
        Route::get('/getAllPemesananUntukNota', [PemesananController::class, 'getAllPemesananUntukNota']);
        Route::get('/getAllPickup', [PemesananController::class, 'getAllPickup']);
        Route::get('/getAllDelivery', [PemesananController::class, 'getAllDelivery']);
        Route::get('/getAllBarangDiambil', [BarangController::class, 'getAllBarangDiambil']);
        Route::post('/ambilPemesanan/{id_pemesanan}', [PemesananController::class, 'ambilPemesanan']);
        Route::get('/getAllKurir', [PegawaiController::class, 'getAllKurir']);
        Route::post('/assignKurir/{id_pemesanan}', [PemesananController::class, 'assignKurir']);
        Route::post('/updateTanggalPengiriman/{id}', [PemesananController::class, 'updateTanggalPengiriman']);
        Route::post('/updateTanggalPengambilan/{id}', [PemesananController::class, 'updateTanggalPengambilan']);
        Route::get('/showNota/{id_pemesanan}', [PemesananController::class, 'showNota']);
        Route::post('/ambilBarang/{id_rincianpenitipan}', [BarangController::class, 'ambilBarang']);
        Route::post('/hitungHasil/{id_pemesanan}', [PemesananController::class, 'hitungHasil']);
        Route::post('/tambahPenitipanBarang', [RincianPenitipanController::class, 'tambahPenitipanBarang']);
        Route::post('/editPenitipanBarang/{id}', [RincianPenitipanController::class, 'editPenitipanBarang']);
        Route::get('/getAllPenitipanBarang', [RincianPenitipanController::class, 'getAllPenitipanBarang']);
        Route::get('/getAllRequiredTambahBarang', [RincianPenitipanController::class, 'getAllRequiredTambahBarang']);
        Route::get('/getPenitipanBarangById/{id_barang}', [RincianPenitipanController::class, 'getPenitipanBarangById']);
        Route::get('/penitipan-barang/details/{id_penitipan}', [RincianPenitipanController::class, 'getPenitipanDetails']);
    });

    Route::middleware(cekJabatan::class.':Kurir')->group(function () {
        Route::get('/jumlah-pesanan-kurir', [PemesananController::class, 'jumlahPesananKurir']);
    });

});

Route::middleware('auth:penitip')->group(function () {
    Route::get('/penitipProfile', [PenitipController::class, 'getPenitipProfile']);
    Route::get('/getPenjualanByIdPenitip/{id}', [RincianPemesananController::class, 'getPenjualanByIdPenitip']);
    Route::get('/getPenjualanById/{id}', [RincianPemesananController::class, 'getPenjualanById']);
    Route::get('/getPemesananById/{id}', [PemesananController::class, 'getPemesananById']);
    Route::get('/getPenitipanByIdPenitip/{id}', [PenitipanController::class, 'getPenitipanData']);
    Route::put('/perpanjangRincianPenitipan/{id}', [RincianPenitipanController::class, 'perpanjangRincianPenitipan']);
    Route::put('/donasiByPenitip/{id}', [BarangController::class, 'donasiByPenitip']);
    Route::put('/ambilTitipan/{id}', [BarangController::class, 'ambilTitipan']);
});

Route::middleware('auth:organisasi')->group(function () {
    Route::get('/organisasi/organisasiPage', [OrganisasiController::class, 'getOrganisasiProfile']);
    Route::get('/organisasi/request-donasi', [RequestDonasiController::class, 'indexByOrganisasi']);
    Route::post('/request_donasi', [RequestDonasiController::class, 'store']);
    Route::delete('/request_donasi/{id}', [RequestDonasiController::class, 'destroy']);
    Route::get('/organisasi/request-donasi/{id}', [RequestDonasiController::class, 'show']);
    Route::put('/request_donasi/{id}', [RequestDonasiController::class, 'update']);
    Route::get('/organisasi', [OrganisasiController::class, 'index']);
});



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

Route::middleware('auth:pembeli')->group(function () {
    Route::get('/pembeli/pembeliProfile', [PembeliController::class, 'getPembeliProfile']);
    Route::get('/getPemesananByIdPembeli/{id}', [PemesananController::class, 'getPemesananByIdPembeli']);
    Route::get('/getAlamatByIdPembeli/{id}', [AlamatController::class, 'getAlamatByIdPembeli']);
    Route::delete('/deleteAlamat/{id}', [AlamatController::class, 'deleteAlamat']);
    Route::post('/editAlamat/{id}', [AlamatController::class, 'editAlamat']);
    Route::get('/getAlamatById/{id}', [AlamatController::class, 'getAlamatById']);
    Route::post('tambahAlamat', [AlamatController::class, 'tambahAlamat']);
    Route::get('/getPemesananByIdPemesanan/{id}', [PemesananController::class, 'getPemesananByIdPemesanan']);
    Route::post('/addRating', [PemesananController::class, 'addRating']);


    Route::get('/getKeranjangByIdPembeli', [KeranjangController::class, 'getKeranjangByIdPembeli']);
    Route::post('/tambahKeranjang', [KeranjangController::class, 'tambahKeranjang']);
    Route::post('/handleSelectKeranjang/{id}', [KeranjangController::class, 'handleSelectKeranjang']);
    Route::delete('/deleteKeranjang/{id}', [KeranjangController::class, 'deleteKeranjang']);
    Route::delete('/deleteKeranjangHabis', [KeranjangController::class, 'deleteKeranjangHabis']);
    Route::post('/handleCheckoutDariBarang/{id}', [KeranjangController::class, 'handleCheckoutDariBarang']);

    Route::get('/getDefaultAlamat', [AlamatController::class, 'getDefaultAlamat']);
    Route::post('/tambahPemesanan', [PemesananController::class, 'tambahPemesanan']);
    Route::post('/waktuHabis/{id}', [PemesananController::class, 'waktuHabis']);
    Route::post('/kirimBuktiPembayaran/{id}', [PemesananController::class, 'kirimBuktiPembayaran']);
});


Route::get('/getDiskusiByIdBarang/{id}', [DiskusiController::class, 'getDiskusiByIdBarang']);
Route::get('/penitip/{id}', [PenitipController::class, 'show']);

