<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PembeliController extends Controller
{
    
    public function getPembeliProfile(Request $request){
        try {
            $user = $request->user();
            return response([
                'pembeli' => $user,
            ]);
            
        } catch (\Exception $e) {
            return response([
                'message' => 'Gagal mendapatkan pembeli profile',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function getFotoProfile($filename)
    {
        $fullPath = storage_path('app/public/foto_profile/' . $filename);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($fullPath);
    }


}
