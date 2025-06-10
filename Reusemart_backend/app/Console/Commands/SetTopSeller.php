<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Penitip;
use App\Models\Pemesanan;
use App\Models\Rincian_Pemesanan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SetTopSeller extends Command
{
    protected $signature = 'penitip:set-top-seller';
    protected $description = 'Menetapkan penitip dengan penjualan tertinggi sebagai Top Seller setiap bulan';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Tentukan rentang waktu untuk bulan sebelumnya
        $startOfLastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();

        // Hitung total penjualan per penitip untuk transaksi selesai
        $topPenitip = Rincian_Pemesanan::select(
            'penitip.id_penitip',
            DB::raw('SUM(rincian_pemesanan.harga_barang) as total_penjualan')
        )
            ->join('pemesanan', 'rincian_pemesanan.id_pemesanan', '=', 'pemesanan.id_pemesanan')
            ->join('barang', 'rincian_pemesanan.id_barang', '=', 'barang.id_barang')
            ->join('penitip', 'barang.id_penitip', '=', 'penitip.id_penitip')
            ->where('pemesanan.status_pengiriman', 'Selesai')
            ->whereNotNull('pemesanan.tanggal_diterima')
            ->whereBetween('pemesanan.tanggal_diterima', [$startOfLastMonth, $endOfLastMonth])
            ->groupBy('penitip.id_penitip')
            ->orderByDesc('total_penjualan')
            ->first();

        // Reset semua is_top menjadi 0
        Penitip::query()->update(['is_top' => 'Tidak']);

        if ($topPenitip) {
            // Set penitip dengan penjualan tertinggi sebagai Top Seller
            $penitip = Penitip::find($topPenitip->id_penitip);
            if ($penitip) {
                $penitip->is_top = 'Ya';
                $penitip->save();

                // Hitung bonus 1% dari total penjualan
                $bonus = $topPenitip->total_penjualan * 0.01;
                $penitip->saldo_penitip += $bonus;
                $penitip->save();

                $this->info("Top Seller ditetapkan: {$penitip->nama} dengan total penjualan Rp {$topPenitip->total_penjualan}. Bonus Rp {$bonus} ditambahkan.");
            }
        } else {
            $this->info("Tidak ada penjualan yang memenuhi syarat untuk bulan ini.");
        }
    }
}
