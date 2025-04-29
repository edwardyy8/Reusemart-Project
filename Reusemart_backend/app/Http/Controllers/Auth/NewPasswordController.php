<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Organisasi;
use App\Models\Pembeli;
use App\Models\Penitip;
use DB;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class NewPasswordController extends Controller
{
    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8', 'confirmed', Rules\Password::defaults()],
        ]);
    
        $email = $request->email;
        $token = $request->token;
    
        
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();
    
        if (!$record || !Hash::check($token, $record->token)) {
            throw ValidationException::withMessages([
                'email' => ['Token reset password tidak valid atau kadaluarsa.'],
            ]);
        }
    
        $user = Penitip::where('email', $email)->first()
            ?? Organisasi::where('email', $email)->first()
            ?? Pembeli::where('email', $email)->first();
    
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Email tidak ditemukan pada sistem.'],
            ]);
        }
    
        $user->forceFill([
            'password' => Hash::make($request->password),
        ])->save();
    
        DB::table('password_reset_tokens')->where('email', $email)->delete();
    
        return response()->json(['message' => 'Password berhasil direset.']);
    }
}
