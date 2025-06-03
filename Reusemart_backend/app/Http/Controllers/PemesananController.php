<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use App\Models\Pemesanan;
use App\Models\Barang;
use App\Models\Rincian_Pemesanan;
use App\Models\Penitipan;
use App\Models\Penitip;
use App\Models\Pembeli;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Keranjang;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\NotificationController;


class PemesananController extends Controller
{
    //

    protected $notificationController;

    public function __construct(NotificationController $notificationController)
    {
        $this->notificationController = $notificationController;
    }


    public function getPemesananByIdPembeli($id)
    {
        try {
            $pemesanan = Pemesanan::where('id_pembeli', $id)
                ->with(['rincianPemesanan.barang'])
                ->get();

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            foreach ($pemesanan as $p) {
                $batasPengambilan = Carbon::parse($p->batas_pengambilan);
                $hariIni = Carbon::now('Asia/Jakarta');

                if (
                    $batasPengambilan->lt($hariIni) && ($p->metode_pengiriman === 'pickup')
                    && ($p->status_pengiriman != 'Selesai') && ($p->jadwal_pengambilan != null)
                ) {

                    foreach ($p->rincianPemesanan as $rincian) {
                        if ($rincian->barang) {
                            $rincian->barang->update([
                                'status_barang' => 'Barang untuk Donasi',
                            ]);
                        }
                    }

                    $p->update([
                        'status_pembayaran' => 'Hangus',
                    ]);
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Pemesanan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getPemesananById($id)
    {
        try {
            $pemesanan = Pemesanan::find($id)
                ->with('alamat')
                ->first();

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Pemesanan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getPemesananByIdPemesanan($id)
    {
        try {
            $pemesanan = Pemesanan::where('id_pemesanan', $id)
                ->with([
                    'rincianPemesanan.barang',
                    'alamat',
                ])
                ->first();

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Pemesanan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function addRating(Request $request)
    {
        try {
            $request->validate([
                'id_rincianpemesanan' => 'required|exists:rincian_pemesanan,id_rincianpemesanan',
                'rating' => 'required|integer|min:1|max:5',
            ]);

            $rincian = Rincian_Pemesanan::find($request->id_rincianpemesanan);
            if (!$rincian) {
                return response()->json([
                    'status' => false,
                    'message' => 'Rincian pemesanan tidak ditemukan',
                ], 404);
            }

            $rincian->rating = $request->rating;
            $rincian->save();

            $barang = Barang::find($rincian->id_barang);
            if ($barang && $barang->id_penitip) {
                $penitip = Penitip::find($barang->id_penitip);
                if ($penitip) {
                    $averageRating = Rincian_Pemesanan::whereHas('barang', function ($query) use ($barang) {
                        $query->where('id_penitip', $barang->id_penitip);
                    })
                        ->whereNotNull('rating')
                        ->avg('rating');

                    $penitip->rating_penitip = round($averageRating, 2);
                    $penitip->save();
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Rating berhasil ditambahkan',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAllPemesanan()
    {
        try {
            $pemesananList = Pemesanan::where('status_pembayaran', 'Lunas')
                ->whereNull('jadwal_pengambilan')
                ->whereNull('tanggal_pengiriman')
                ->with(['rincianPemesanan.barang'])
                ->get();

            return response()->json([
                'message' => 'All pemesanan retrieved successfully',
                'status' => 'success',
                'data' => $pemesananList,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAllPickup()
    {
        try {
            $pickupList = Pemesanan::where('metode_pengiriman', 'pickup')
                ->where('status_pembayaran', 'Lunas')
                ->where('status_pengiriman', '!=', 'Transaksi Selesai')
                ->with(['rincianPemesanan.barang'])
                ->get();

            foreach ($pickupList as $pemesanan) {
                $batasPengambilan = Carbon::parse($pemesanan->batas_pengambilan);
                $hariIni = Carbon::now('Asia/Jakarta');

                if ($batasPengambilan->lt($hariIni) && ($pemesanan->jadwal_pengambilan != null)) {
                    foreach ($pemesanan->rincianPemesanan as $rincian) {
                        if ($rincian->barang) {
                            $rincian->barang->update([
                                'status_barang' => 'Barang untuk Donasi',
                            ]);
                        }
                    }

                    $pemesanan->update([
                        'status_pembayaran' => 'Hangus',
                    ]);
                }
            }

            return response()->json([
                'message' => 'All pickup retrieved successfully',
                'status' => 'success',
                'data' => $pickupList,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAllDelivery()
    {
        try {
            $pickupList = Pemesanan::where('metode_pengiriman', 'kurir')
                ->where('status_pembayaran', 'Lunas')
                ->where('status_pengiriman', '!=', 'Selesai')
                ->with(['rincianPemesanan.barang'])
                ->get();

            return response()->json([
                'message' => 'All delivery retrieved successfully',
                'status' => 'success',
                'data' => $pickupList,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getAllPemesananUntukNota()
    {
        try {
            $pemesananList = Pemesanan::where('status_pembayaran', 'Lunas')
                ->where(function ($query) {
                    $query->whereNotNull('jadwal_pengambilan')
                        ->orWhereNotNull('tanggal_pengiriman');
                })
                ->whereIn('status_pengiriman', ['Transaksi Selesai', 'Menunggu Kurir'])
                ->with(['rincianPemesanan.barang'])
                ->get();

            return response()->json([
                'message' => 'All pemesanan retrieved successfully',
                'status' => 'success',
                'data' => $pemesananList,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function ambilPemesanan($id_pemesanan)
    {
        try {
            $rincian = Rincian_Pemesanan::with('barang')
                ->where('id_pemesanan', $id_pemesanan)
                ->get();

            foreach ($rincian as $item) {
                $barang = $item->barang;
                if ($barang) {
                    $barang->status_barang = 'Terjual';
                    $barang->save();
                }
            }

            $pemesanan = Pemesanan::where('id_pemesanan', $id_pemesanan)->firstOrFail();
            $tglAmbil = Carbon::now('Asia/Jakarta');

            foreach ($rincian as $item) {
                $penitip = $item->barang->penitip;

                if ($penitip && $penitip->fcm_token) {
                    // kirim notif ke penitip
                    $request = new Request([
                        'fcm_token' => $penitip->fcm_token,
                        'title' => 'Barang Telah Dijambil',
                        'body' => 'Barang Anda dengan ID ' . $item->id_barang . ' telah diambil pada tanggal ' . $tglAmbil,
                        'data' => [
                            'pemesanan_id' => (string) $pemesanan->id_pemesanan,
                        ]
                    ]);

                    $this->notificationController->sendFcmNotification($request);
                }
            }

            // kirim notif ke pembeli
            $pembeli = Pembeli::findOrFail($pemesanan->id_pembeli);
            if ($pembeli && $pembeli->fcm_token) {
                $request = new Request([
                    'fcm_token' => $pembeli->fcm_token,
                    'title' => 'Barang Telah Diambil',
                    'body' => 'Barang Anda untuk pemesanan ' . $pemesanan->id_pemesanan . ' telah diambil pada tanggal ' . $tglAmbil,
                    'data' => [
                        'pemesanan_id' => (string) $pemesanan->id_pemesanan,
                    ]
                ]);

                $this->notificationController->sendFcmNotification($request);
            }

            $pemesanan->status_pengiriman = 'Transaksi Selesai';
            $pemesanan->save();

            return response()->json([
                'message' => 'Berhasil Konfirmasi Pengambilan',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat konfirmasi.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function assignKurir(Request $request, $id)
    {
        try {
            $request->validate([
                'id_kurir' => 'required|exists:pegawai,id_pegawai'
            ]);

            $pemesanan = Pemesanan::findOrFail($id);
            $pemesanan->id_kurir = $request->input('id_kurir');
            $pemesanan->save();

            return response()->json([
                'status' => true,
                'message' => 'Kurir berhasil ditugaskan',
                'data' => $pemesanan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat assign.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateTanggalPengiriman(Request $request, $id)
    {
        try {
            $request->validate([
                'tanggal_pengiriman' => 'required|date_format:Y-m-d H:i:s',
            ]);
            $status_pengiriman = "Menunggu Kurir";
            $pemesanan = Pemesanan::findOrFail($id);
            $pemesanan->tanggal_pengiriman = $request->input('tanggal_pengiriman');
            $pemesanan->status_pengiriman = $status_pengiriman;
            $pemesanan->save();

            foreach ($pemesanan->rincianPemesanan as $item) {
                $penitip = $item->barang->penitip;

                if ($penitip && $penitip->fcm_token) {
                    // kirim notif ke penitip
                    $request = new Request([
                        'fcm_token' => $penitip->fcm_token,
                        'title' => 'Barang Anda Telah Dijadwalkan Untuk Pengiriman',
                        'body' => 'Barang Anda dengan ID ' . $item->id_barang . ' telah dijadwalkan untuk pengiriman pada tanggal ' . $pemesanan->tanggal_pengiriman,
                        'data' => [
                            'pemesanan_id' => (string) $pemesanan->id_pemesanan,
                        ]
                    ]);

                    $this->notificationController->sendFcmNotification($request);
                }
            }

            // kirim notif ke pembeli
            $pembeli = Pembeli::findOrFail($pemesanan->id_pembeli);
            if ($pembeli && $pembeli->fcm_token) {
                $request = new Request([
                    'fcm_token' => $pembeli->fcm_token,
                    'title' => 'Jadwal Pengiriman Barang',
                    'body' => 'Jadwal pengiriman barang Anda untuk pemesanan ' . $pemesanan->id_pemesanan . ' telah dijadwalkan pada tanggal ' . $pemesanan->tanggal_pengiriman,
                    'data' => [
                        'pemesanan_id' => (string) $pemesanan->id_pemesanan,
                    ]
                ]);

                $this->notificationController->sendFcmNotification($request);
            }

            // Kirim notifikasi ke kurir
            if ($pemesanan->kurir && $pemesanan->kurir->fcm_token) {
                $request = new Request([
                    'fcm_token' => $pemesanan->kurir->fcm_token,
                    'title' => 'Tugas Pengiriman Baru',
                    'body' => 'Anda memiliki pengriman baru dengan ID: ' . $pemesanan->id_pemesanan . ' Dijadwalkan pada tanggal ' . $pemesanan->tanggal_pengiriman,
                    'data' => [
                        'pemesanan_id' => (string) $pemesanan->id_pemesanan,
                    ]
                ]);

                $this->notificationController->sendFcmNotification($request);
            }


            return response()->json([
                'status' => true,
                'message' => 'Tanggal pengiriman berhasil diperbarui',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat update.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateTanggalPengambilan(Request $request, $id)
    {
        try {
            $request->validate([
                'jadwal_pengambilan' => 'required|date_format:Y-m-d H:i:s',
            ]);
            $jadwal_pengambilan = Carbon::parse($request->jadwal_pengambilan);
            $batas_pengambilan = $jadwal_pengambilan->copy()->addDays(2);
            $status_pengiriman = "Menunggu Pickup";

            $pemesanan = Pemesanan::findOrFail($id);
            $pemesanan->jadwal_pengambilan = $jadwal_pengambilan;
            $pemesanan->batas_pengambilan = $batas_pengambilan;
            $pemesanan->status_pengiriman = $status_pengiriman;
            $pemesanan->save();

            foreach ($pemesanan->rincianPemesanan as $item) {
                $penitip = $item->barang->penitip;

                if ($penitip && $penitip->fcm_token) {
                    // kirim notif
                    $request = new Request([
                        'fcm_token' => $penitip->fcm_token,
                        'title' => 'Barang Anda Telah Dijadwalkan Untuk Pengambilan',
                        'body' => 'Barang Anda dengan ID ' . $item->id_barang . ' telah dijadwalkan untuk pengambilan pada tanggal ' . $pemesanan->jadwal_pengambilan,
                        'data' => [
                            'pemesanan_id' => (string) $pemesanan->id_pemesanan,
                        ]
                    ]);

                    $this->notificationController->sendFcmNotification($request);
                }
            }

            $pembeli = Pembeli::findOrFail($pemesanan->id_pembeli);

            if ($pembeli && $pembeli->fcm_token) {
                // kirim notif ke pembeli
                $request = new Request([
                    'fcm_token' => $pembeli->fcm_token,
                    'title' => 'Jadwal Pengambilan Barang',
                    'body' => 'Jadwal pengambilan barang Anda untuk pemesanan ' . $pemesanan->id_pemesanan . ' telah dijadwalkan pada tanggal ' . $pemesanan->jadwal_pengambilan,
                    'data' => [
                        'pemesanan_id' => (string) $pemesanan->id_pemesanan,
                    ]
                ]);

                $this->notificationController->sendFcmNotification($request);
            }

            return response()->json([
                'status' => true,
                'message' => 'Jadwal pengambilan berhasil diperbarui',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat update.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showNota($id_pemesanan)
    {
        $pemesanan = Pemesanan::with([
            'rincianPemesanan.barang.rincian_penitipan.penitipan.qc',
            'rincianPemesanan.barang',
            'pembeli',
            'alamat',
            'kurir'
        ])->where('id_pemesanan', $id_pemesanan)->firstOrFail();

        $alamatDef = Alamat::where('is_default', 1)
            ->where('id_pembeli', $pemesanan->id_pembeli)
            ->first();

        return response()->json([
            'data' => $pemesanan,
            'alamatDef' => $alamatDef,
        ]);
    }

    public function hitungHasil($id_pemesanan)
    {
        try {
            $rincianList = Rincian_Pemesanan::with([
                'barang.rincian_penitipan.penitipan',
                'barang.penitip',
                'pemesanan'
            ])
                ->where('id_pemesanan', $id_pemesanan)
                ->whereHas('pemesanan', function ($query) {
                    $query->whereIn('status_pengiriman', ['Transaksi Selesai', 'Menunggu Kurir']);
                })
                ->get();

            $tanggal_diterima = Carbon::now('Asia/Jakarta');

            $pemesanan = Pemesanan::with('pembeli')->findOrFail($id_pemesanan);
            $pemesanan->tanggal_diterima = $tanggal_diterima;
            $pemesanan->save();

            $total_saldo_penitip = [];
            $total_poin = 0;

            foreach ($rincianList as $rincian) {
                $barang = $rincian->barang;
                $penitip = $barang->penitip;

                $rincian_penitipan = $barang->rincian_penitipan;

                $penitipan = $rincian_penitipan->penitipan;

                $harga_barang = $barang->harga_barang;
                $tanggal_masuk = Carbon::parse($barang->tanggal_masuk);
                $tanggal_pesan = Carbon::parse($pemesanan->tanggal_pemesanan);
                $lama_laku = $tanggal_pesan->diffInDays($tanggal_masuk);

                $id_hunter = $penitipan->id_hunter;
                $perpanjangan = $rincian_penitipan->perpanjangan ?? 'Tidak';

                $komisi_hunter = $id_hunter ? 0.05 * $harga_barang : 0;

                if ($id_hunter && $perpanjangan === 'Tidak') {
                    $komisi_reusemart = 0.15 * $harga_barang;
                } elseif (!$id_hunter && $perpanjangan === 'Tidak') {
                    $komisi_reusemart = 0.20 * $harga_barang;
                } elseif ($id_hunter && $perpanjangan === 'Ya') {
                    $komisi_reusemart = 0.25 * $harga_barang;
                } else {
                    $komisi_reusemart = 0.30 * $harga_barang;
                }

                // Bonus Penitip
                $bonus_penitip = $lama_laku < 7 ? 0.10 * $komisi_reusemart : 0;

                // Hitung saldo penitip
                $saldo_penitip = $harga_barang + $bonus_penitip - $komisi_hunter - $komisi_reusemart;

                // Simpan ke rincian pemesanan
                $rincian->komisi_hunter = $komisi_hunter;
                $rincian->komisi_reusemart = $komisi_reusemart;
                $rincian->bonus_penitip = $bonus_penitip;
                $rincian->save();

                // Akumulasi saldo penitip
                if (!isset($total_saldo_penitip[$penitip->id_penitip])) {
                    $total_saldo_penitip[$penitip->id_penitip] = 0;
                }
                $total_saldo_penitip[$penitip->id_penitip] += $saldo_penitip;

                // Akumulasi poin pembeli
                $total_poin += $pemesanan->poin_didapatkan;
            }

            // Tambahkan poin ke pembeli
            $pembeli = $pemesanan->pembeli;
            $pembeli->poin_pembeli += $total_poin;
            $pembeli->save();

            // Update saldo semua penitip
            foreach ($total_saldo_penitip as $id_penitip => $saldo) {
                $penitip = Penitip::findOrFail($id_penitip);
                if ($penitip) {
                    $penitip->saldo_penitip += $saldo;
                    $penitip->save();
                }
            }

            return response()->json([
                'message' => 'Berhasil Cetak Nota',
                'tanggal_diterima' => $pemesanan->tanggal_diterima->toDateTimeString(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat cetak nota.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function tambahPemesanan(Request $request)
    {
        try {
            $pemesanan = Pemesanan::create([
                'id_pemesanan' => Pemesanan::generateIdPemesanan(),
                'id_pembeli' => $request->id_pembeli,

                'status_pembayaran' => $request->status_pembayaran,
                'total_harga' => $request->total_harga,
                'metode_pengiriman' => $request->metode_pengiriman,
                'tanggal_pemesanan' => Carbon::now('Asia/Jakarta'),

                'poin_digunakan' => $request->poin_digunakan,
                'poin_didapatkan' => $request->poin_didapatkan,
                'ongkos' => $request->ongkos,
                'id_alamat' => $request->id_alamat,
            ]);

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan gagal ditambahkan',
                ], 500);
            }

            $pembeli = Pembeli::find($request->id_pembeli);
            if (!$pembeli) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pembeli tidak ditemukan',
                ], 404);
            }

            $pembeli->update([
                'poin_pembeli' => $pembeli->poin_pembeli - $request->poin_digunakan,
            ]);

            // buat rincian pemesanan dari keranjang
            foreach ($request->keranjang as $item) {
                $barang = Barang::with('rincian_penitipan.penitipan')
                    ->find($item['id_barang']);

                if (!$barang) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Barang tidak ditemukan',
                    ], 404);
                }

                Rincian_Pemesanan::create([
                    'id_pemesanan' => $pemesanan->id_pemesanan,
                    'id_barang' => $item['id_barang'],
                    'harga_barang' => $item['harga_barang'],
                    'komisi_hunter' => 0,
                    'komisi_reusemart' => 0,
                    'bonus_penitip' => 0,
                ]);

                // Update status barang
                $barang->update([
                    'status_barang' => 'Terjual',
                    'stok_barang' => 0,
                ]);

                // hapus keranjag checked
                $keranjang = Keranjang::find($item['id_keranjang']);
                if ($keranjang) {
                    $keranjang->delete();
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Pemesanan berhasil ditambahkan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function verifikasiBuktiPembayaran(Request $request, $id)
    {
        try {
            $pemesanan = Pemesanan::find($id);

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            if ($request->input('status')) {
                $pemesanan->update([
                    'status_pembayaran' => 'Lunas',
                    'tanggal_pelunasan' => Carbon::now('Asia/Jakarta'),
                    'status_pengiriman' => 'Disiapkan',
                ]);

                foreach ($pemesanan->rincianPemesanan as $item) {
                    $penitip = $item->barang->penitip;

                    if ($penitip && $penitip->fcm_token) {
                        // kirim notif
                        $request = new Request([
                            'fcm_token' => $penitip->fcm_token,
                            'title' => 'Barang Anda Terjual',
                            'body' => 'Barang Anda dengan ID ' . $item->id_barang . ' telah terjual. Di pemesanan ID ' . $pemesanan->id_pemesanan,
                            'data' => [
                                'pemesanan_id' => (string) $pemesanan->id_pemesanan,
                            ]
                        ]);

                        $this->notificationController->sendFcmNotification($request);
                    }
                }
            } else {
                $pemesanan->update([
                    'status_pembayaran' => 'Batal',
                ]);

                $pemesanan->pembeli->update([
                    'poin_pembeli' => $pemesanan->pembeli->poin_pembeli + $pemesanan->poin_digunakan,
                ]);

                foreach ($pemesanan->rincianPemesanan as $item) {
                    $barang = Barang::find($item->id_barang);
                    if ($barang) {
                        $barang->update([
                            'status_barang' => 'Tersedia',
                            'stok_barang' => $barang->stok_barang + 1,
                        ]);
                    } else {
                        return response()->json([
                            'status' => false,
                            'message' => 'Barang tidak ditemukan',
                        ], 404);
                    }
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Bukti pembayaran berhasil diverifikasi',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function waktuHabis(Request $request, $id)
    {
        try {
            $pemesanan = Pemesanan::find($id);

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            if ($pemesanan->status_pembayaran == 'Batal') {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan sudah dibatalkan',
                ], 404);
            }

            $pembeli = Pembeli::find($pemesanan->id_pembeli);
            if (!$pembeli) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pembeli tidak ditemukan',
                ], 404);
            }

            $pemesanan->update([
                'status_pembayaran' => 'Batal',
            ]);

            $pembeli->update([
                'poin_pembeli' => $pembeli->poin_pembeli + $pemesanan->poin_digunakan,
            ]);

            foreach ($pemesanan->rincianPemesanan as $item) {
                $barang = Barang::find($item->id_barang);
                if ($barang) {
                    $barang->update([
                        'status_barang' => 'Tersedia',
                        'stok_barang' => $barang->stok_barang + 1,
                    ]);
                } else {
                    return response()->json([
                        'status' => false,
                        'message' => 'Barang tidak ditemukan',
                    ], 404);
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Pemesanan berhasil dibatalkan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function fetchMenungguPembayaran()
    {
        try {
            $pemesanan = Pemesanan::where('status_pembayaran', 'Menunggu Pembayaran')
                ->with(['pembeli'])
                ->where('tanggal_pemesanan', '<=', Carbon::now('Asia/Jakarta')->subMinutes(1))
                ->orderBy('tanggal_pemesanan', 'asc')
                ->get();

            if (!$pemesanan) {
                return response()->json([
                    'status' => true,
                    'message' => 'Pemesanan tidak ada',
                ]);
            }

            foreach ($pemesanan as $item) {
                $item->update([
                    'status_pembayaran' => 'Batal',
                ]);

                $item->pembeli->update([
                    'poin_pembeli' => $item->pembeli->poin_pembeli + $item->poin_digunakan,
                ]);

                foreach ($item->rincianPemesanan as $rincian) {
                    $barang = Barang::find($rincian->id_barang);
                    if ($barang) {
                        $barang->update([
                            'status_barang' => 'Tersedia',
                            'stok_barang' => $barang->stok_barang + 1,
                        ]);
                    }
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Pemesanan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function kirimBuktiPembayaran(Request $request, $id)
    {
        try {
            $pemesanan = Pemesanan::find($id);

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            if ($request->hasFile('foto_bukti')) {
                $uploadFolder = 'foto_bukti';
                $image = $request->file('foto_bukti');
                $image_uploaded_path = $image->store($uploadFolder, 'private');
                $request->foto_bukti = basename($image_uploaded_path);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => 'Bukti pembayaran tidak ditemukan',
                ], 404);
            }

            $pemesanan->update([
                'status_pembayaran' => 'Menunggu Verifikasi',
                'foto_bukti' => $request->foto_bukti,
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Bukti pembayaran berhasil dikirim',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getPemesananUntukVerifikasi()
    {
        try {
            $pemesanan = Pemesanan::where('status_pembayaran', 'Menunggu Verifikasi')
                ->with(['pembeli', 'rincianPemesanan.barang'])
                ->orderBy('tanggal_pemesanan', 'asc')
                ->get();

            if (!$pemesanan) {
                return response()->json([
                    'status' => false,
                    'message' => 'Pemesanan tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Pemesanan',
                'data' => $pemesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getFotoBukti($filename)
    {
        $fullPath = storage_path('app/private/foto_bukti/' . $filename);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'Foto bukti tidak ketemu'], 404);
        }

        return response()->file($fullPath);
    }

    public function jumlahPesananKurir(Request $request)
    {
        try {
            $idKurir = $request->user()->id_pegawai;
            if (!$idKurir) {
                return response()->json([
                    'status' => false,
                    'message' => 'ID kurir tidak ditemukan',
                ], 404);
            }

            $jumlahPesanan = Pemesanan::where('id_kurir', $idKurir)
                ->count();

            return response()->json([
                'status' => true,
                'message' => 'Jumlah pesanan kurir',
                'data' => $jumlahPesanan,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
