<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemesanan extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'pemesanan';
    protected $primaryKey = 'id_pemesanan';
    protected $keyType = 'string'; 
    public $incrementing = false;
    protected $fillable = [
        'id_pemesanan',
        'id_pembeli',
        'id_kurir',
        'id_gudang',
        'status_pembayaran',
        'total_harga',
        'metode_pengiriman',
        'tanggal_pemesanan',
        'tanggal_pengiriman',
        'tanggal_pelunasan',
        'status_pengiriman',
        'batas_pengambilan',
        'poin_digunakan',
        'poin_didapatkan'
    ];

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli');
    }

    public function kurir()
    {
        return $this->belongsTo(Pegawai::class, 'id_kurir');
    }

    public function gudang()
    {
        return $this->belongsTo(Pegawai::class, 'id_gudang');
    }

    public function rincianPemesanan()
    {
        return $this->hasMany(Rincian_Pemesanan::class, 'id_pemesanan');
    }
}
