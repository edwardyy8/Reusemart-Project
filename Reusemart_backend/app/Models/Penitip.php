<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Penitip extends Authenticatable
{
    use HasFactory, HasApiTokens;

    public $timestamps = false;
    public $table = 'penitip';
    protected $primaryKey = 'id_penitip';

    protected $fillable = [
        'id_penitip',
        'nama_penitip',
        'rating_penitip',
        'saldo_penitip',
        'poin_penitip',
        'no_ktp',
        'email',
        'password',
        'is_top',
        'foto_ktp'
    ];

    protected $hidden = [
        'password',
    ];

    public function getUserType() {
        return 'penitip';
    }

    public function barang()
    {
        return $this->hasMany(Barang::class, 'id_penitip');
    }

    public function diskusi(){
        return $this->hasMany(Diskusi::class, 'id_penitip');
    }

    public function penitipan(){
        return $this->hasMany(Penitipan::class, 'id_penitip');
    }
}
