<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

use App\Models\Pegawai;
use App\Models\Pembeli;
use App\Models\Penitip;
use App\Models\Organisasi;
use Laravel\Sanctum\PersonalAccessToken;

$wibTime = Carbon::now('Asia/Jakarta');

class AuthController extends Controller
{
    //
    public function register(Request $request)
    {
        try {
            $registrationData = $request->all();

            $required = [
                'nama' => 'required|max:60',
                'email' => 'required|email:rfc|unique:penitip,email|unique:pembeli,email|unique:organisasi,email|unique:pegawai,email',
                'password' => 'required|min:8|same:confirm_password',
                'confirm_password' => 'required|min:8',
                'role' => 'required|in:pembeli,organisasi',
                'alamat' => 'required|string',
                'foto_profile' => 'required|image:jpeg,png,jpg,gif,svg|max:2048',
            ];

            if ($registrationData['role'] === 'pembeli') {
                $required['no_hp'] = ['required', 'string', 'max:15', 'regex:/^(?:\+62|62|0)8[1-9][0-9]{6,9}$/'];
                $required['label_alamat'] = 'required|string';
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
                'nama' => $registrationData['nama'],
                'email' => $registrationData['email'],
                'password' => bcrypt($registrationData['password']),
                'foto_profile' => $fotoProfile,
                'createdAt' => Carbon::now('Asia/Jakarta')
            ];

            if ($registrationData['role'] == 'pembeli') {
                $insertData['is_aktif'] = 'Ya';
                $insertData['poin_pembeli'] = 0;
            } else {
                $insertData['id_organisasi'] = Organisasi::generateId();
                $insertData['alamat_organisasi'] = $registrationData['alamat'];
            }

            $user = $registrationData['role'] == 'pembeli'
                ? Pembeli::create($insertData)
                : Organisasi::create($insertData);

            if($registrationData['role'] == 'pembeli') {
                $alamatData = [
                    'id_pembeli' => $user->id_pembeli,
                    'is_default' => true,
                    'nama_alamat' => $registrationData['alamat'],
                    'label_alamat' => $registrationData['label_alamat'],
                    'nama_penerima' => $registrationData['nama'],
                    'no_hp' => $registrationData['no_hp']
                ];
                Alamat::create($alamatData);
            }


            return response([
                'message' => 'Register Success',
            ], 200);
        } catch (\Exception $e) {

            return response([
                'message' => 'Register Failed :',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $loginData = $request->all();

        $validate = Validator::make($loginData, [
            'email' => 'required|email:rfc',
            'password' => 'required|min:8',
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

            if ($user){
                if ($user->is_aktif==="Tidak" && strtolower($user->is_aktif) === "tidak"){
                    return response(['message' => 'Akun Anda tidak aktif'], 401);
                }

                if (Hash::check($request->password, $user->password)) {
                $token = $user->createToken('Authentication Token')->plainTextToken;

                return response([
                    'message' => 'Selamat datang, ' . ($user->nama),
                    'token' => $token,
                    'user_type' => $type,
                    'jabatan' => $user->jabatan->nama_jabatan ?? null,
                ]);

                }
            }    
        }

        return response(['message' => 'Email & password tidak cocok'], 401);
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['message' => 'User tidak terautentikasi'], 401);
            }

            $user->currentAccessToken()->delete();

            return response()->json(['message' => 'Berhasil Logout'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal Logout', 'error' => $e->getMessage()], 500);
        }
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
        try{
            $user = $request->user();

            return response([
                'jabatan' => $user->jabatan->nama_jabatan,
                'id_pegawai' => $user->id_pegawai,
                'nama_pegawai' => $user->nama,
                'foto_profile' => $user->foto_profile,
            ]);
        }
        catch (\Exception $e) {
            return response([
                'message' => 'Gagal untuk mendapatkan jabatan',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function resetPassPegawai ($id_pegawai)
    {
        try {
            $pegawai = Pegawai::where('id_pegawai', $id_pegawai)->first();

            if (!$pegawai) {
                return response(['message' => 'Pegawai tidak ditemukan'], 404);
            }

            $pegawai->password = Hash::make($pegawai->tanggal_lahir);
            $pegawai->save();

            return response(['message' => 'Password berhasil diubah'], 200);
        } catch (\Exception $e) {
            return response([
                'message' => 'Gagal mengubah password',
                'error' => $e->getMessage()
            ], status: 401);
        }
    }

}
