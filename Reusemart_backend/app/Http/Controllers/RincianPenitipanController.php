<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rincian_Penitipan;
use Carbon\Carbon;

class RincianPenitipanController extends Controller
{
    public function perpanjangRincianPenitipan(Request $request, $id)
    {
        try {
            $rincian = Rincian_Penitipan::findOrFail($id);
    
            $tanggal_akhir = Carbon::parse($rincian->tanggal_akhir)->addDays(30);
    
            $rincian->tanggal_akhir = $tanggal_akhir;
            $rincian->perpanjangan = 'Ya'; 
            $rincian->save();
    
            return response()->json(['message' => 'Rincian penitipan diperpanjang'], 200);
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
            $batas_akhir = Carbon::parse($rincian->batas_akhir)->addDays(2);
    
            $rincian->batas_akhir = $batas_akhir;
            $rincian->status_penitipan = 'Diambil'; 
            $rincian->save();
    
            return response()->json(['message' => 'Berhasil Memilih Ambil Penitipan'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperpanjang.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
