<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Schedule::command('notif:notif-pengiriman-barang')->everyMinute();
Schedule::command('notif:notif-masa-penitipan')->daily();
Schedule::command('penitip:set-top-seller')->everyMinute();

// Schedule::command('penitip:set-top-seller')->monthlyOn(1, time: '00:00');
Schedule::command('donasi:check')->everyMinute();

