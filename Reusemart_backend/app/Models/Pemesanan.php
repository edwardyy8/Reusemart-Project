<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pemesanan extends Model
{
    use HasFactory;

    public $timestamps = false;
    public $table = 'pemesanan';
    protected $primaryKey = 'id_pemesanan';
    protected $keyType = 'string'; 
    public $incrementing = false;
    protected $fillable = [
        'id_pemesanan',
        'id_pembeli',
        'id_kurir',
        'id_gudang',
        'status_pembayaran',
        'total_harga',
        'metode_pengiriman',
        'tanggal_pemesanan',
        'tanggal_pengiriman',
        'jadwal_pengambilan',
        'tanggal_diterima',
        'foto_bukti',
        'tanggal_pelunasan',
        'status_pengiriman',
        'batas_pengambilan',
        'poin_digunakan',
        'poin_didapatkan',
        'ongkos',
        'id_alamat',
    ];

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli');
    }

    public function kurir()
    {
        return $this->belongsTo(Pegawai::class, 'id_kurir');
    }

    public function gudang()
    {
        return $this->belongsTo(Pegawai::class, 'id_gudang');
    }

    public function rincianPemesanan()
    {
        return $this->hasMany(Rincian_Pemesanan::class, 'id_pemesanan');
    }

    public function alamat()
    {
        return $this->belongsTo(Alamat::class, 'id_alamat');
    }

    public static function generateIdPemesanan()
    {
        $prefix = date('y') . '.' . date('m');

        $last = \DB::table('pemesanan')
            ->select('id_pemesanan')
            ->where('id_pemesanan', 'REGEXP', '^[0-9]{2}\\.[0-9]{2}\\.[0-9]+$')
            ->orderByRaw("CAST(SUBSTRING_INDEX(id_pemesanan, '.', -1) AS UNSIGNED) DESC")
            ->limit(1)
            ->first();

        if ($last && isset($last->id_pemesanan)) {
            $parts = explode('.', $last->id_pemesanan);
            $lastIncrement = isset($parts[2]) ? (int)$parts[2] : 0;
            $newIncrement = $lastIncrement + 1;
        } else {
            $newIncrement = 1;
        }

        return $prefix . '.' . $newIncrement;
    }


}
