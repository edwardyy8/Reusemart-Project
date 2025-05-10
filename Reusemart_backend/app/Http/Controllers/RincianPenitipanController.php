<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rincian_Penitipan;
use Carbon\Carbon;
$wibTime = Carbon::now('Asia/Jakarta');

class RincianPenitipanController extends Controller
{
    public function perpanjangRincianPenitipan(Request $request, $id)
    {
        try {
            $rincian = Rincian_Penitipan::findOrFail($id);
    
            $tanggal_akhir = Carbon::parse($rincian->tanggal_akhir)->addDays(30);
            $rincian->update([
                'tanggal_akhir' => $tanggal_akhir,
                'perpanjangan' => 'Ya'
            ]);
    
            return response()->json([
                'message' => 'Rincian penitipan diperpanjang'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperpanjang.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function ambilTitipan($id)
    {
        try {
            $rincian = Rincian_Penitipan::findOrFail($id);
            $batas_akhir = Carbon::now('Asia/Jakarta')->addDays(7);
            $rincian->update([
                'batas_akhir' => $batas_akhir,
                'status_penitipan' => 'Diambil Kembali'
            ]);
    
            return response()->json([
                'message' => 'Berhasil Memilih Ambil Penitipan',
                'batas_akhir' => $batas_akhir->toDateTimeString(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperpanjang.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
