<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rincian_Pemesanan extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'rincian_pemesanan';
    protected $primaryKey = 'id_rincianpemesanan';

    protected $fillable = [
        'id_rincianpemesanan',
        'id_pemesanan',
        'id_barang',
        'harga_barang',
        'komisi_hunter',
        'komisi_reusemart',
        'bonus_penitip',
    ];

    public function pemesanan()
    {
        return $this->belongsTo(Pemesanan::class, 'id_pemesanan');
    }
    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang');
    }
}
