<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Rincian_Penitipan;
use App\Http\Controllers\NotificationController;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class NotifMasaPenitipan extends Command
{
    protected $signature = 'notif:notif-masa-penitipan';
    protected $description = 'Check penitipan expiration and send notifications to penitip';

    protected $notificationController;

    public function __construct(NotificationController $notificationController)
    {
        parent::__construct();
        $this->notificationController = $notificationController;
    }

    public function handle()
    {
        try {
            $now = Carbon::now('Asia/Jakarta');
            $today = $now->format('Y-m-d');
            $threeDaysFromNow = $now->copy()->addDays(3)->format('Y-m-d');

            $penitipanList = Rincian_Penitipan::whereIn(
                \DB::raw("DATE_FORMAT(tanggal_akhir, '%Y-%m-%d')"),
                [$today, $threeDaysFromNow]
            )
                ->with(['barang.penitip'])
                ->get();

            if ($penitipanList->isEmpty()) {
                Log::info('Tidak ada penitipan yang perlu dikirimkan notifikasi', [
                    'time' => $now->toDateTimeString(),
                ]);
                return;
            }

            foreach ($penitipanList as $penitipan) {
                $penitip = $penitipan->barang->penitip;
                $barang = $penitipan->barang;

                if ($penitip && $penitip->fcm_token) {
                    $isToday = Carbon::parse($penitipan->tanggal_akhir)->isToday();
                    $title = $isToday
                        ? 'Masa Penitipan Barang Berakhir'
                        : 'Peringatan: Masa Penitipan Barang H-3';
                    $body = $isToday
                        ? "Masa penitipan barang Anda (ID: {$barang->id_barang}) telah berakhir pada {$penitipan->tanggal_akhir}."
                        : "Masa penitipan barang Anda (ID: {$barang->id_barang}) akan berakhir dalam 3 hari pada {$penitipan->tanggal_akhir}.";

                    $request = new Request([
                        'fcm_token' => $penitip->fcm_token,
                        'title' => $title,
                        'body' => $body,
                        'data' => [
                            'barang_id' => (string) $barang->id_barang,
                        ],
                    ]);

                    $this->notificationController->sendFcmNotification($request);
                }
            }

            Log::info('Notifikasi masa penitipan dikirim', [
                'time' => $now->toDateTimeString(),
                'penitipan_count' => $penitipanList->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error mengirim notifikasi masa penitipan: ' . $e->getMessage());
        }
    }
}
