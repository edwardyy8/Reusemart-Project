<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'barang';
    protected $primaryKey = 'id_barang';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_barang',
        'id_penitip',
        'id_kategori',
        'nama_barang',
        'stok_barang',
        'harga_barang',
        'garansi',
        'status_barang',
        'deskripsi',
        'tanggal_masuk',
        'berat_barang',
        'tanggal_donasi',
    ];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kategori');
    }

    public function penitip()
    {
        return $this->belongsTo(Penitip::class, 'id_penitip');
    }

    public function keranjang()
    {
        return $this->hasMany(Keranjang::class, 'id_barang');
    }

    public function diskusi()
    {
        return $this->hasMany(Diskusi::class, 'id_barang');
    }

    public function rincian_penitipan()
    {
        return $this->hasOne(Rincian_Penitipan::class, 'id_barang');
    }

    public function donasi()
    {
        return $this->hasOne(Donasi::class, 'id_barang');
    }

    public function fotoBarang()
    {
        return $this->hasMany(FotoBarang::class, 'id_barang', 'id_barang');
    }
}
