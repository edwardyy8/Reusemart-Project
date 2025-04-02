<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request_Donasi extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'request_donasi';
    protected $primaryKey = 'id_request';
    protected $fillable = [
        'id_request',
        'id_organisasi',
        'isi_request',
        'tanggal_request',
    ];

    public function organisasi()
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi');
    }
    public function donasi()
    {
        return $this->hasMany(Donasi::class, 'id_request');
    }


}
