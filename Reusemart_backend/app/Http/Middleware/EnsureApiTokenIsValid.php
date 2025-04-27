<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Sanctum\PersonalAccessToken;

class EnsureApiTokenIsValid
{
    public function handle(Request $request, Closure $next): Response
    {
        $tokenString = $request->bearerToken();
        

        if (!$tokenString) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak ditemukan. Harap login kembali.',
            ], 401);
        }

        $accessToken = PersonalAccessToken::findToken($tokenString);

        if (!$accessToken) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid. Harap login ulang.',
            ], 401);
        }

        // Set the user for the request
        $request->setUserResolver(function () use ($accessToken) {
            return $accessToken->tokenable;
        });

        return $next($request);
    }
}
