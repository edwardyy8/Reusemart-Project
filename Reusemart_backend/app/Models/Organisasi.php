<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Organisasi extends Authenticatable
{
    use HasFactory, HasApiTokens;

    public $timestamps = false;
    public $table = 'organisasi';
    protected $primaryKey = 'id_organisasi';
    protected $keyType = 'string'; 
    public $incrementing = false;

    protected $fillable = [
        'id_organisasi',
        'nama_organisasi',
        'email',
        'password',
        'alamat_organisasi',
        'foto_profile',
        'createdAt'
    ];

    protected $hidden = [
        'password',
    ];

    public function getUserType() {
        return 'organisasi';
    }

    public function diskusi() {
        return $this->hasMany(Diskusi::class, 'id_organisasi');
    }

    public function request_donasi() {
        return $this->hasMany(Request_Donasi::class, 'id_organisasi');
    }
}
