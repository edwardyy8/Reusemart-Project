<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Rincian_Penitipan;
use App\Models\Barang;
use Carbon\Carbon;

class CheckDonasi extends Command
{
    protected $signature = 'donasi:check';
    protected $description = 'Check and update donation status for items past 7 days';

    public function handle()
    {
        $rincianPenitipan = Rincian_Penitipan::with('barang')->get();

        foreach ($rincianPenitipan as $rincian) {
            if ($rincian->tanggal_akhir && Carbon::parse($rincian->tanggal_akhir)->diffInDays(Carbon::now('Asia/Jakarta')) > 7) {
                if ($rincian->barang) {
                    $rincian->barang->update(['status_barang' => 'Didonasikan']);
                    $this->info("Barang didonasikan: {$rincian->barang->nama_barang}, Tanggal akhir: {$rincian->tanggal_akhir}");
                }

                $rincian->update(['status_penitipan' => 'barang didonasikan']);
            }
        }

        $this->info('Donasi status check completed.');
    }
}
