<?php

namespace App\Http\Controllers;

use App\Models\Claim_Merchandise;
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
}
