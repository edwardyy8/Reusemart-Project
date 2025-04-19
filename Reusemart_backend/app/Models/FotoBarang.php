<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FotoBarang extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'foto_barang';
    protected $primaryKey = 'id_foto_barang';
    protected $keyType = 'int';
    protected $fillable = [
        'id_foto_barang',
        'id_barang',
        'foto_barang',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }
}
