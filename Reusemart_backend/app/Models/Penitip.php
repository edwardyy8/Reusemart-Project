<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Penitip extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    public $timestamps = false;
    public $table = 'penitip';
    protected $primaryKey = 'id_penitip';

    protected $keyType = 'string'; 
    public $incrementing = false;

    protected $fillable = [
        'id_penitip',
        'nama',
        'rating_penitip',
        'saldo_penitip',
        'poin_penitip',
        'no_ktp',
        'email',
        'password',
        'is_top',
        'foto_ktp',
        'createdAt',
        'foto_profile',
        'is_aktif'
    ];


    public static function generateId()
    {
        $latestPenitip = Penitip::orderBy('id_penitip', 'desc')->first();
        
        if (!$latestPenitip) {
            return 'T1';
        }

        $lastNumber = (int) str_replace('T', '', $latestPenitip->id_penitip); 

        do {
            $lastNumber++;
            $newId = 'T' . $lastNumber;
        } while (Penitip::where('id_penitip', $newId)->exists());

        return $newId;
    }


    public function getUserType() {
        return 'penitip';
    }

    public function barang()
    {
        return $this->hasMany(Barang::class, 'id_penitip');
    }

    public function penitipan(){
        return $this->hasMany(Penitipan::class, 'id_penitip');
    }


}
