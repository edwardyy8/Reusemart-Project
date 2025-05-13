<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Rincian_Penitipan;
use App\Models\Penitipan;
class PenitipanController extends Controller
{
    public function getPenitipanData($id)
    {
        try {
            $titipanList = Rincian_Penitipan::whereHas('barang', function ($query) use ($id) {
                $query->where('id_penitip', $id);
                })
                ->with(['penitipan', 'barang'])
                ->get();

            if (!$titipanList) {
                return response()->json([
                    'status' => false,
                    'message' => 'Penitipan tidak ditemukan',
                ], 404);
            }

            foreach ($titipanList as $titipan){
                $batasAkhir = Carbon::parse($titipan->batas_akhir);
                $hariIni = Carbon::now('Asia/Jakarta');

                if ($batasAkhir->lt($hariIni) && $titipan->barang->status_barang === 'Diambil Kembali') {
                    $titipan->barang->update([
                        'status_barang' => 'Barang untuk Donasi',
                    ]);

                    $titipan->update([
                        'status_penitipan' => 'Barang untuk Donasi',
                    ]);
                }
            }


            $titipan = Rincian_Penitipan::whereHas('barang', function ($query) use ($id) {
                    $query->where('id_penitip', $id);
                })
                ->with(['penitipan', 'barang'])
                ->get();

            return response()->json([
                'status' => true,
                'message' => 'Data Penitipan',
                'data' => $titipan,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

}
