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
        'tanggal_approve'
    ];

    public static function generateId()
    {
        $latestRequest = Request_Donasi::orderBy('id_request', 'desc')->first();

        if (!$latestRequest) {
            return '1';
        }
        $newId = $latestRequest->id_request;
        do{
            $newId++;
        }while (Request_Donasi::where('id_request', $newId)->exists());

        return (string)$newId;
    }

    public function organisasi()
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi');
    }
    public function donasi()
    {
        return $this->hasOne(Donasi::class, 'id_request');
    }


}
