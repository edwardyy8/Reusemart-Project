<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rincian_Penitipan extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'rincian_penitipan';
    protected $primaryKey = 'id_rincianpenitipan';
    protected $fillable = [
        'id_rincianpenitipan',
        'id_penitipan',
        'id_barang',
        'tanggal_akhir',
        'perpanjangan',
        'batas_akhir'
    ];

    public function penitipan()
    {
        return $this->belongsTo(Penitipan::class, 'id_penitipan');
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang');
    }
}
