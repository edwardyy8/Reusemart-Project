<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Keranjang extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'keranjang';
    protected $primaryKey = 'id_keranjang';
    protected $fillable = [
        'id_keranjang',
        'id_barang',
        'id_pembeli',
        'harga_barang',
        'is_selected'
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang');
    }

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli');
    }
}
