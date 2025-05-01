<?php

namespace App\Http\Controllers;

use App\Models\Organisasi;
use Illuminate\Http\Request;
use Storage;

class OrganisasiController extends Controller
{
    public function index()
    {
        $organisasi = Organisasi::all();

        return response()->json([
            'message' => 'All organisasi retrieved successfully',
            'status' => 'success',
            'data' => $organisasi,
        ]);
    }

    public function show($id)
    {
        $organisasi = Organisasi::find($id);

        if (!$organisasi) {
            return response()->json([
                'message' => 'Penitip not found',
                'status' => 'error',
            ], 404);
        }

        return response()->json([
            'message' => 'Organisasi retrieved successfully',
            'status' => 'success',
            'data' => $organisasi,
        ]);
    }
    public function getOrganisasiProfile(Request $request){
        try {
            $user = $request->user();
            return response([
                'organisasi' => $user,
            ]);
            
        } catch (\Exception $e) {
            return response([
                'message' => 'Failed to get organisasi profile',
                'error' => $e->getMessage()
            ], 401);
        }
    }
}
