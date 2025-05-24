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


class PemesananController extends Controller
{
    //

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

            foreach ($pemesanan as $p){
                $batasPengambilan = Carbon::parse($p->batas_pengambilan);
                $hariIni = Carbon::now('Asia/Jakarta');

                if ($batasPengambilan->lt($hariIni) && ($p->metode_pengiriman === 'pickup')
                    && ($p->status_pengiriman != 'Selesai') && ($pemesanan->jadwal_pengambilan != null)) {
                        $p->barang->update([
                            'status_barang' => 'Barang untuk Donasi',
                        ]);

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
                'rincianPemesanan.barang', 'alamat', 
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

    public function getAllPemesanan()
    {
        try{
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
        try{
            $pickupList = Pemesanan::where('metode_pengiriman', 'pickup')
                ->where('status_pembayaran', 'Lunas')
                ->where('status_pengiriman', '!=', 'Transaksi Selesai')
                ->with(['rincianPemesanan.barang'])
                ->get();

            foreach ($pickupList as $pemesanan){
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
        try{
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
        try{
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

}
