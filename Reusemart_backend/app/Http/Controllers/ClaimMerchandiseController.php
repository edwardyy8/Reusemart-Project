<?php

namespace App\Http\Controllers;

use App\Models\Claim_Merchandise;
use App\Models\Merchandise;
use App\Models\Pembeli;
use Illuminate\Http\Request;


class ClaimMerchandiseController extends Controller
{
    public function getAllClaimMerchandise()
    {
        $claim_merchandise = Claim_Merchandise::with(['merchandise', 'pegawai', 'pembeli'])->get();
        return response()->json(['data' => $claim_merchandise], 200);
    }

    public function getClaimMerchandiseById($id)
    {
        $claim_merchandise = Claim_Merchandise::find($id);

        if (!$claim_merchandise) {
            return response()->json([
                'status' => false,
                'message' => 'Claim Merchandise tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Data Claim Merchandise',
            'data' => $claim_merchandise,
        ]);
    }

     public function confirmClaimMerchandise(Request $request, $id_request)
    {
        try {
            $id_pegawai = $request->input('id_pegawai');
            $claim_merchandise = Claim_Merchandise::findOrFail($id_request);
            $claim_merchandise->tanggal_claim = now();
            $claim_merchandise->id_pegawai = $id_pegawai;
            $claim_merchandise->save();

            $claim_merchandise = Claim_Merchandise::with('pegawai', 'pegawai', 'pembeli', 'merchandise')->findOrFail($id_request);

            return response()->json([
                'message' => 'Claim merchandise berhasil dikonfirmasi.',
                'data' => $claim_merchandise
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal mengonfirmasi claim merchandise.', 'error' => $e->getMessage()], 500);
        }
    }

    public function claimMerchandise(Request $request, $id_merchandise)
    {
        try {
            $idPembeli = $request->user()->id_pembeli;
            if (!$idPembeli) {
                return response()->json([
                    'status' => false,
                    'message' => 'ID Pembeli tidak ditemukan',
                ], 404);
            }

            $pembeli = Pembeli::find($idPembeli);
            $merchandise = Merchandise::findOrFail($id_merchandise);

            if ($merchandise->stok_merchandise <= 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Stok merchandise sudah habis',
                ], 400);
            }

            if ($pembeli->poin_pembeli < $merchandise->poin_merchandise) {
                return response()->json([
                    'status' => false,
                    'message' => 'Poin tidak mencukupi untuk klaim merchandise ini',
                ], 400);
            }

            $merchandise->stok_merchandise -= 1;
            $pembeli->poin_pembeli -= $merchandise->poin_merchandise;

            $merchandise->save();
            $pembeli->save();

            $claimMerchandise = new Claim_Merchandise();
            $claimMerchandise->id_pembeli = $idPembeli;
            $claimMerchandise->id_merchandise = $id_merchandise;
            $claimMerchandise->tanggal_claim = null; 
            $claimMerchandise->id_pegawai = null; 
            
            $claimMerchandise->save();

            return response()->json([
                'status' => true,
                'message' => 'Berhasil Klaim Merchandise',
                'id_claim' => $claimMerchandise->id_claim,
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }


}
