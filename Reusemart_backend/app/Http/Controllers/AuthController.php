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

        // if (!Auth::attempt($loginData)) {
        //     return response(['message' => 'Email & password tidak cocok'], 401);
        // }

        $penitip = Penitip::where('email', $request->email)->first();
        // $pembeli = Pembeli::where('email', $request->email)->first();
        // $pegawai = Pegawai::where('email', $request->email)->first();
        // $organisasi = Organisasi::where('email', $request->email)->first();

        if ($penitip && $request->password === $penitip->password) {
            
            return response([
                'message' => 'Selamat datang, ' . $penitip->nama_penitip,
                'user' => $penitip,
                'token' => $penitip->createToken('Authentication Token')->accessToken,
                'token_type' => 'Bearer',
                'user_type' => 'penitip'
            ]);
        }
        
        // if ($pembeli && Hash::check($request->password, $pembeli->password)) {
        //     $user = Auth::user();

        //     return response([
        //         'message' => 'Authenticated',
        //         'user' => $user,
        //         'token' => $pembeli->createToken('Authentication Token')->accessToken,
        //         'token_type' => 'Bearer',
        //         'userType' => 'pembeli'
        //     ]);
        // }

        // if ($pegawai && Hash::check($request->password, $pegawai->password)) {
        //     $user = Auth::user();

        //     return response([
        //         'message' => 'Authenticated',
        //         'user' => $user,
        //         'token' => $pegawai->createToken('Authentication Token')->accessToken,
        //         'token_type' => 'Bearer',
        //         'userType' => 'pegawai'
        //     ]);
        // }

        // if ($organisasi && Hash::check($request->password, $organisasi->password)) {
        //     $user = Auth::user();

        //     return response([
        //         'message' => 'Authenticated',
        //         'user' => $user,
        //         'token' => $organisasi->createToken('Authentication Token')->accessToken,
        //         'token_type' => 'Bearer',
        //         'userType' => 'organisasi'
        //     ]);
        // }


        return response(['message' => 'Email & password tidak cocok'], 401);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        return response([
            'message' => 'Logged out'
        ]);
    }

}
