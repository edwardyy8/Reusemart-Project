<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PegawaiController extends Controller
{
    //

    
    public function getFotoProfile($filename)
    {
        $fullPath = storage_path('app/private/foto_profile_pegawai/' . $filename);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($fullPath);
    }

}
