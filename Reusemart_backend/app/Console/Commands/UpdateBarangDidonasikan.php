<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Rincian_Penitipan;
use Carbon\Carbon;

class UpdateBarangDidonasikan extends Command
{
    protected $signature = 'barang:donasikan';
    protected $description = 'Update status barang menjadi didonasikan jika batas akhir sudah lewat';

    public function handle()
    {
        $now = Carbon::now()->toDateString();
        $this->info("Tanggal sekarang: $now");

        $rincianList = Rincian_Penitipan::with('barang', 'barang.penitip')
            ->whereDate('batas_akhir', '<', $now)
            ->get();

        if ($rincianList->isEmpty()) {
            $this->warn("Tidak ada rincian penitipan yang lewat batas akhir.");
            return 0;
        }

        foreach ($rincianList as $rincian) {
            $barang = $rincian->barang;

            if (!$barang) {
                $this->warn("Barang tidak ditemukan untuk rincian ID {$rincian->id}.");
                continue;
            }

            if ($barang->status_barang === 'Tersedia') {
                $barang->status_barang = 'Didonasikan';
                $barang->save();

                $penitip = $barang->penitip;
                if ($penitip) {
                    $poinTambahan = (int) ceil($barang->harga_barang / 10000);
                    $penitip->poin_penitip += $poinTambahan;
                    $penitip->save();

                    $this->info("Barang {$barang->nama_barang} didonasikan & penitip dapat {$poinTambahan} poin.");
                } else {
                    $this->warn("Penitip tidak ditemukan untuk barang {$barang->nama_barang}.");
                }
            } else {
                $this->warn("Barang {$barang->nama_barang} statusnya bukan 'tersedia' (status: {$barang->status_barang}).");
            }
        }

        return 0;
    }
}
