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
                
                return response([
                    'message' => 'Selamat datang, ' . ($user->nama_penitip ?? $user->nama_organisasi ?? $user->nama_pembeli),
                    'token' => $user->createToken('Authentication Token')->plainTextToken,
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

    public function getJabatan(Request $request) {
        try {
            return response([
                'jabatan' => $request->user()->jabatan->nama_jabatan,
            ]);
        } catch (\Exception $e) {
            return response([
                'message' => 'Failed to get jabatan',
                'error' => $e->getMessage()
            ], 401);
        }
    }
}
