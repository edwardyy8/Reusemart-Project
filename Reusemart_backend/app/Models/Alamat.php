<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alamat extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'alamat';
    protected $primaryKey = 'id_alamat';

    protected $fillable = [
        'id_alamat',
        'id_pembeli',
        'is_default',
        'nama_alamat',
        'label_alamat',
        'nama_penerima',
        'no_hp'
    ];

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli');
    }

    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_alamat');
    }

}
