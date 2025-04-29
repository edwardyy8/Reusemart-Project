<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Organisasi;
use App\Models\Pembeli;
use App\Models\Penitip;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
       
            $request->validate([
                'email' => ['required', 'email'],
                'user_type' => ['required', 'in:pembeli,penitip,organisasi'],
            ]);
    
            $email = $request->email;
            $userType = $request->user_type;
    
            switch ($userType) {
                case 'penitip':
                    $status = Password::broker('penitips')->sendResetLink(['email' => $email]);
                    break;
    
                case 'pembeli':
                    $status = Password::broker('pembelis')->sendResetLink(['email' => $email]);
                    break;
    
                case 'organisasi':
                    $status = Password::broker('organisasis')->sendResetLink(['email' => $email]);
                    break;
    
                default:
                    return response()->json(['message' => 'Tipe user tidak valid'], 400);
            }

            if($status == Password::INVALID_USER) {
                return response()->json(['message' => 'Email tidak ditemukan pada sistem.'], 404);
            }
            
            if ($status == Password::RESET_LINK_SENT) {
                return response()->json(['message' => 'Link reset password telah dikirim.']);
            }
    
            return response()->json(['message' => 'Gagal mengirim link reset.'], 400);

       
        
    }
}
