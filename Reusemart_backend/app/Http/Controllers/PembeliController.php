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


}
