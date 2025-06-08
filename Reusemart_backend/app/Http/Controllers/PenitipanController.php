<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Rincian_Penitipan;
use App\Models\Penitipan;
use Illuminate\Support\Facades\Log;
class PenitipanController extends Controller
{
    public function getPenitipanData($id)
    {
        try {
            $titipanList = Rincian_Penitipan::whereHas('barang', function ($query) use ($id) {
                $query->where('id_penitip', $id);
                })
                ->with(['penitipan', 'barang'])
                ->get();

            if (!$titipanList) {
                return response()->json([
                    'status' => false,
                    'message' => 'Penitipan tidak ditemukan',
                ], 404);
            }

            foreach ($titipanList as $titipan){
                $batasAkhir = Carbon::parse($titipan->batas_akhir);
                $hariIni = Carbon::now('Asia/Jakarta');

                if ($batasAkhir->lt($hariIni) && ( $titipan->barang->status_barang === 'Tersedia')) {
                    $titipan->barang->update([
                        'status_barang' => 'Barang untuk Donasi',
                    ]);

                    $titipan->update([
                        'status_penitipan' => 'Barang untuk Donasi',
                    ]);
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Penitipan',
                'data' => $titipanList,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function jumlahItemHunter(Request $request)
    {
        try {
            $idHunter = $request->user()->id_pegawai;
            if (!$idHunter) {
                return response()->json([
                    'status' => false,
                    'message' => 'ID Hunter tidak ditemukan',
                ], 404);
            }

            $jumlahItem = Penitipan::where('id_hunter', $idHunter)
                ->count();

            return response()->json([
                'status' => true,
                'message' => 'Jumlah item hunter',
                'data' => $jumlahItem,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getJumlahKomisiHunter(Request $request)
    {
        try {
            $idHunter = $request->user()->id_pegawai;
            if (!$idHunter) {
                return response()->json([
                    'status' => false,
                    'message' => 'ID Hunter tidak ditemukan',
                ], 404);
            }

            $totalKomisi = 0;

            $penitipan = Penitipan::with(['rincian_penitipan.barang.rincianPemesanan.pemesanan'])
                ->where('id_hunter', $idHunter)
                ->whereHas('rincian_penitipan.barang.rincianPemesanan.pemesanan', function ($query) {
                    $query->whereNotNull('tanggal_diterima');
                })
                ->get();

            foreach ($penitipan as $p) {
                foreach ($p->rincian_penitipan as $rincian) {
                    $rincianPemesanan = $rincian->barang->rincianPemesanan;

                    if ($rincianPemesanan && $rincianPemesanan->pemesanan && $rincianPemesanan->pemesanan->tanggal_diterima) {
                        $totalKomisi += $rincianPemesanan->komisi_hunter ?? 0;
                    }
                }
            }
            Log::info('Total Komisi: ' . $totalKomisi);

            return response()->json([
                'status' => true,
                'message' => 'Total komisi hunter',
                'data' => $totalKomisi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function getKomisiHunter(Request $request)
    {
        try {
            $idHunter = $request->user()->id_pegawai;

            if (!$idHunter) {
                return response()->json([
                    'status' => false,
                    'message' => 'ID Hunter tidak ditemukan',
                ], 404);
            }

            $historiKomisi = Penitipan::with([
                'rincian_penitipan.barang.rincianPemesanan.pemesanan'
            ])
            ->where('id_hunter', $idHunter)
            ->whereHas('rincian_penitipan.barang.rincianPemesanan.pemesanan', function ($query) {
                $query->whereNotNull('tanggal_diterima');
            })
            ->get();

            $data = [];

            foreach ($historiKomisi as $penitipan) {
                foreach ($penitipan->rincian_penitipan as $rincian) {
                    $barang = $rincian->barang;

                    $rincianPemesanan = $barang->rincianPemesanan;

                    if ($rincianPemesanan) {
                        $pemesanan = $rincianPemesanan->pemesanan;

                        if ($pemesanan && $pemesanan->tanggal_diterima) {
                            $data[] = [
                                'id_pemesanan' => $pemesanan->id_pemesanan,
                                'tanggal_pemesanan' => $pemesanan->tanggal_pemesanan,
                                'tanggal_diterima' => $pemesanan->tanggal_diterima,
                                'barang' => [
                                    'id_barang' => $barang->id_barang,
                                    'nama_barang' => $barang->nama_barang,
                                    'harga_barang' => $barang->harga_barang,
                                    'foto_barang' => $barang->foto_barang,
                                    'id_penitip' => $barang->id_penitip,
                                    'deskripsi' => $barang->deskripsi,
                                    'berat_barang' => $barang->berat_barang,
                                    'tanggal_garansi' => $barang->tanggal_garansi,
                                ],
                                'komisi_hunter' => $rincianPemesanan->komisi_hunter,
                            ];
                        }
                    }
                }
            }

            return response()->json([
                'status' => true,
                'message' => 'Data Komisi Hunter',
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }



}
