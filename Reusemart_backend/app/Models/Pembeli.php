<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembeli extends Model
{
    use HasFactory;

    public $timestamps = false;

    public $table = 'pembeli';

    protected $primaryKey = 'id_pembeli';

    protected $fillable = [
        'id_pembeli',
        'nama_pembeli',
        'email_pembeli',
        'password_pembeli',
        'is_aktif',
        'poin_pembeli',
        'foto_profile'
    ];

    public function alamat()
    {
        return $this->hasMany(Alamat::class, 'id_pembeli');
    }

    public function diskusi(){
        return $this->hasMany(Diskusi::class, 'id_pembeli');
    }

    public function claimMerchandise()
    {
        return $this->hasMany(Claim_Merchandise::class, 'id_pembeli');
    }

    public function keranjang(){
        return $this->hasMany(Keranjang::class, 'id_pembeli');
    }

    public function pemesanan()
    {
        return $this->hasMany(Pemesanan::class, 'id_pembeli');
    }
}
