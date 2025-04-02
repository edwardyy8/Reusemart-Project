<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Claim_Merchandise extends Model
{   
    use HasFactory;

    public $timestamps = false;
    public $table = 'claim_merchandise';
    protected $primaryKey = 'id_claim';

    protected $fillable = [
        'id_claim',
        'id_merchandise',
        'id_pembeli',
        'tanggal_claim',
        'id_pegawai',
    ];

    public function merchandise()
    {
        return $this->belongsTo(Merchandise::class, 'id_merchandise');
    }

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli');
    }

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai');
    }
}
