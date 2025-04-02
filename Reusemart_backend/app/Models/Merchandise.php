<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Merchandise extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'merchandise';
    protected $primaryKey = 'id_merchandise';

    protected $fillable = [
        'id_merchandise',
        'nama_merchandise',
        'stok_merchandise',
        'poin_merchandise',
        'foto_merchandise',
    ];

    public function claimMerchandise()
    {
        return $this->hasMany(Claim_Merchandise::class, 'id_merchandise');
    }
}
