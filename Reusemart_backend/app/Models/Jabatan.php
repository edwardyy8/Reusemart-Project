<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jabatan extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'jabatan';
    protected $primaryKey = 'id_jabatan';
    protected $fillable = [
        'id_jabatan',
        'nama_jabatan',
    ];
    public function pegawai()
    {
        return $this->hasMany(Pegawai::class, 'id_jabatan');
    }
    
}
