<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\CanResetPassword;

class Organisasi extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    public $timestamps = false;
    public $table = 'organisasi';
    protected $primaryKey = 'id_organisasi';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id_organisasi',
        'nama',
        'email',
        'password',
        'alamat_organisasi',
        'foto_profile',
        'createdAt'
    ];

    public static function generateId()
    {
        $latestOrg = Organisasi::orderBy('id_organisasi', 'desc')->first();

        if (!$latestOrg) {
            return 'ORG1';
        }

        $lastNumber = (int) str_replace('ORG', '', $latestOrg->id_organisasi);

        do {
            $lastNumber++;
            $newId = 'ORG' . $lastNumber;
        } while (Organisasi::where('id_organisasi', $newId)->exists());

        return $newId;
    }

    public function getUserType() {
        return 'organisasi';
    }

    public function request_donasi() {
        return $this->hasMany(Request_Donasi::class, 'id_organisasi');
    }
}
