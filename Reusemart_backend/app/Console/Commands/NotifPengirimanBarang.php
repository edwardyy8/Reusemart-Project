<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Pemesanan;
use App\Http\Controllers\NotificationController;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class NotifPengirimanBarang extends Command
{
    
    protected $signature = 'notif:notif-pengiriman-barang';

    protected $description = 'Check delivery schedule and send notifications to pembeli and penitip';

    protected $notificationController;

    public function __construct(NotificationController $notificationController)
    {
        parent::__construct();
        $this->notificationController = $notificationController;
    }

    public function handle()
    {
        try {
            // $now = Carbon::now('Asia/Jakarta');
            // $pemesananList = Pemesanan::whereBetween('tanggal_pengiriman', [
            //     $now->copy()->subMinute(),
            //     $now->copy()->addMinute(),
            // ])
            // ->with(['pembeli', 'rincianPemesanan.barang.penitip'])
            // ->get();

            $now = Carbon::now('Asia/Jakarta')->format('Y-m-d H:i:00');

            $pemesananList = Pemesanan::whereRaw("DATE_FORMAT(tanggal_pengiriman, '%Y-%m-%d %H:%i:00') = ?", [$now])
                ->with(['pembeli', 'rincianPemesanan.barang.penitip'])
                ->get();


            if( $pemesananList->isEmpty()) {
                Log::info('Tidak ada pemesanan yang perlu dikirimkan notifikasi', [
                    'time' => $now
                ]);
                return;
            }

            foreach ($pemesananList as $pemesanan) {
                if ($pemesanan->pembeli && $pemesanan->pembeli->fcm_token) {
                    $request = new Request([
                        'fcm_token' => $pemesanan->pembeli->fcm_token,
                        'title' => 'Pesanan Anda Sedang Dikirim',
                        'body' => 'Pesanan Anda #' . $pemesanan->id_pemesanan . ' sedang dalam pengiriman.',
                        'data' => [
                            'pemesanan_id' => (string) $pemesanan->id,
                        ]
                    ]);

                    $this->notificationController->sendFcmNotification($request);
                }
                
                foreach ($pemesanan->rincianPemesanan as $rincian) {
                    $penitip = $rincian->barang->penitip;
                    if ($penitip && $penitip->fcm_token) {
                        $request = new Request([
                            'fcm_token' => $penitip->fcm_token,
                            'title' => 'Barang Anda Telah Dikirim',
                            'body' => 'Barang Anda (ID: ' . $rincian->barang->id_barang . ') dari pesanan #' . $pemesanan->id_pemesanan . ' sedang dikirim.',
                            'data' => [
                                'pemesanan_id' => (string) $pemesanan->id,
                                'barang_id' => (string) $rincian->barang->id,
                            ]
                        ]);

                        $this->notificationController->sendFcmNotification($request);
                    }
                }
            }

            Log::info('Kirim notif pengiriman barang', [
                'time' => $now,
                'pemesanan_count' => $pemesananList->count(),
            ]);

        } catch (\Exception $e) {
            Log::error('Error kirim notif pengiriman barang: ' . $e->getMessage());
        }
    }
}
