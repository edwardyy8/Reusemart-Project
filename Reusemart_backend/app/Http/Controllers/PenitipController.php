<?php

namespace App\Http\Controllers;

use App\Models\Penitip;
use Illuminate\Http\Request;

class PenitipController extends Controller
{
    public function index()
    {
        $penitip = Penitip::all();

        return response()->json([
            'message' => 'All penitip retrieved successfully',
            'status' => 'success',
            'data' => $penitip,
        ]);
    }

    public function show($id)
    {
        $penitip = Penitip::find($id);

        if (!$penitip) {
            return response()->json([
                'message' => 'Penitip not found',
                'status' => 'error',
            ], 404);
        }

        return response()->json([
            'message' => 'Penitip retrieved successfully',
            'status' => 'success',
            'data' => $penitip,
        ]);
    }

    public function getPenitipProfile(Request $request){
        try {
            $user = $request->user();
            return response([
                'penitip' => $user,
            ]);
            
        } catch (\Exception $e) {
            return response([
                'message' => 'Failed to get penitip profile',
                'error' => $e->getMessage()
            ], 401);
        }
    }
}
