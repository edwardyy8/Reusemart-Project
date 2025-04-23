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
    public function register(Request $request)
    {
        $registrationData = $request->all();

        $required = [
            'username' => 'required|max:60',
            'email' => 'required|email:rfc|unique:penitip,email|unique:pembeli,email|unique:organisasi,email|unique:pegawai,email',
            'password' => 'required|min:8|same:confirm_password',
            'confirm_password' => 'required|min:8',
            'role' => 'required|in:pembeli,organisasi',
            'alamat' => 'required|string',
            'foto_profile' => 'required|image:jpeg,png,jpg,gif,svg|max:2048',
        ];

        if ($registrationData['role'] === 'pembeli') {
            $required['no_hp'] = 'required|string|max:15';
            $required['label_alamat'] = 'nullable|string';
        } else {
            $required['no_hp'] = 'nullable|string|max:15';
            $required['label_alamat'] = 'nullable|string';
        }

        $validate = Validator::make($registrationData, $required);

        if ($validate->fails()) {
            return response(['message' => $validate->errors()->first()], 400);
        }

        $uploadFolder = 'foto_profile';
        $image = $request->file('foto_profile');
        $image_uploaded_path = $image->store($uploadFolder, 'public');
        $fotoProfile = basename($image_uploaded_path);

        $insertData = [
            'name' => $registrationData['username'],
            'username' => $registrationData['username'],
            'email' => $registrationData['email'],
            'password' => bcrypt($registrationData['password']),
            'alamat' => $registrationData['alamat'],
            'no_hp' => $registrationData['no_hp'] ?? null,
            'label_alamat' => $registrationData['label_alamat'] ?? null,
            'foto_profile' => $fotoProfile,
        ];

        $user = $registrationData['role'] == 'pembeli'
            ? Pembeli::create($insertData)
            : Organisasi::create($insertData);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response([
            'message' => 'Register Success',
            'user' => $user,
            'token' => $token
        ], 200);
    }


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
