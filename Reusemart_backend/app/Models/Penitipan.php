<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Penitipan extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'penitipan';
    protected $primaryKey = 'id_penitipan';
    protected $keyType = 'string';
    public $incrementing = false;
    protected $fillable = [
        'id_penitipan',
        'id_penitip',
        'id_qc',
        'id_hunter',
        'tanggal_masuk',
    ];

    public function penitip()
    {
        return $this->belongsTo(Penitip::class, 'id_penitip');
    }

    public function qc()
    {
        return $this->belongsTo(Pegawai::class, 'id_qc');
    }

    public function hunter()
    {
        return $this->belongsTo(Pegawai::class, 'id_hunter');
    }

    public function rincian_penitipan()
    {
        return $this->hasMany(Rincian_Penitipan::class, 'id_penitipan');
    }
}
