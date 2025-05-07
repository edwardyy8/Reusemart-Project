<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\PersonalAccessToken;

class Pegawai extends Authenticatable
{
    use HasFactory, HasApiTokens;

    public $timestamps = false;
    public $table = 'pegawai';

    protected $primaryKey = 'id_pegawai';

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id_pegawai',
        'id_jabatan',
        'nama',
        'email',
        'password',
        'foto_profile',
        'tanggal_lahir',
        'createdAt'
    ];

    public function getUserType() {
        return 'pegawai';
    }


    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class, 'id_jabatan');
    }

    public function donasi(){
        return $this->hasMany(Donasi::class, 'id_pegawai');
    }

    public function claim_merchandise(){
        return $this->hasMany(Claim_Merchandise::class, 'id_pegawai');
    }

    public function penitipanHunter(){
        return $this->hasMany(Penitipan::class, 'id_hunter');
    }

    public function penitipanQC() {
        return $this->hasMany(Penitipan::class, 'id_qc');
    }

    public function pemesananKurir(){
        return $this->hasMany(Pemesanan::class, 'id_kurir');
    }

    public function pemesananGudang(){
        return $this->hasMany(Pemesanan::class, 'id_gudang');
    }

    public function diskusi() {
        return $this->hasMany(Diskusi::class, 'id_pegawai');
    }


}
