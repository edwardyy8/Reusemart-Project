<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diskusi extends Model
{   
    use HasFactory;
    public $timestamps = false;
    public $table = 'diskusi';
    protected $primaryKey = 'id_diskusi';

    protected $fillable = [
        'id_diskusi',
        'id_barang',
        'id_pembeli',
        'id_pegawai',
        'komentar',
        'tanggal_diskusi',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang');
    }

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli');
    }

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai');
    }

}
