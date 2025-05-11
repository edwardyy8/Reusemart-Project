<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donasi extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'donasi';
    protected $primaryKey = 'id_donasi';
    protected $fillable = [
        'id_donasi',
        'id_barang',
        'id_request',
        'id_pegawai',
        'tanggal_donasi',
        'nama_penerima',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang');
    }

    public function request_donasi()
    {
        return $this->belongsTo(Request_Donasi::class, 'id_request');
    }

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai');
    }

    public function donasi()
{
    return $this->hasMany(Donasi::class, 'id_request');
}

}
