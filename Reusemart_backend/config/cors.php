<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://reusemarted.barioth.web.id'],  // Ganti dengan URL frontend Anda
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,  // Pastikan ini diatur ke true untuk mendukung cookies dan kredensial
];

