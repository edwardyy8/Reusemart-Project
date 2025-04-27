<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

use App\Models\Pegawai;
use App\Models\Pembeli;
use App\Models\Penitip;
use App\Models\Organisasi;
use Laravel\Sanctum\PersonalAccessToken;



class AuthController extends Controller
{
    //

    public function login(Request $request)
    {   

        $loginData = $request->all();

        $validate = Validator::make($loginData, [
            'email' => 'required|email:rfc',
            'password' => 'required',
        ]);

        if ($validate->fails()) {
            return response(['message' => $validate->errors()->first()], 400);
        }

        $userTypes = [
            'penitip' => Penitip::class,
            'pembeli' => Pembeli::class,
            'pegawai' => Pegawai::class,
            'organisasi' => Organisasi::class,
        ];
    
        
        foreach ($userTypes as $type => $model) {
            $user = $model::where('email', $request->email)->first();
        
            if ($user && Hash::check($request->password, $user->password)) {                
                $token = $user->createToken('Authentication Token')->plainTextToken;
              
                return response([
                    'message' => 'Selamat datang, ' . ($user->nama_penitip ?? $user->nama_organisasi ?? $user->nama_pembeli ?? $user->nama_pegawai),
                    'token' => $token,
                    'user_type' => $type,
                    'jabatan' => $user->jabatan->nama_jabatan ?? null,
                ]);
            
            }
        }

        return response(['message' => 'Email & password tidak cocok'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json(['message' => 'Logged out']);
    }

    public function getRole(Request $request) {
        try {
            
            return response([
                'user_type' => $request->user()->getUserType(),
            ]);
            
        } catch (\Exception $e) {
            return response([
                'message' => 'Failed to get user type',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function getJabatan(Request $request)
    {
        $user = $request->user();

        return response([
            'jabatan' => $user->jabatan->nama_jabatan,
        ]);
    }

    public function resetPassPegawai (Request $request)
    {
        $request->validate([
            'id_pegawai' => 'required|exists:pegawai,id_pegawai',
        ]);

        $pegawai = Pegawai::where('id_pegawai', $request->id_pegawai)->first();

        if (!$pegawai) {
            return response(['message' => 'Pegawai tidak ditemukan'], 404);
        }

        $pegawai->password = Hash::make($pegawai->tanggal_lahir);
        $pegawai->save();

        return response(['message' => 'Password berhasil diubah']);
    }

}
