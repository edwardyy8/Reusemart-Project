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
        'id_penitip',
        'id_pembeli',
        'id_pegawai',
        'id_organisasi',
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

    public function penitip()
    {
        return $this->belongsTo(Penitip::class, 'id_penitip');
    }

    public function organisasi()
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi');
    }

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai');
    }

}
