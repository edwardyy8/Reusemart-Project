<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organisasi extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'organisasi';
    protected $primaryKey = 'id_organisasi';
    protected $fillable = [
        'id_organisasi',
        'nama_organisasi',
        'email_organisasi',
        'password_organisasi',
        'alamat_organisasi',
        'foto_profile'
    ];

    public function diskusi() {
        return $this->hasMany(Diskusi::class, 'id_organisasi');
    }

    public function request_donasi() {
        return $this->hasMany(Request_Donasi::class, 'id_organisasi');
    }
}
