<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CekJabatan
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $jabatan): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Harus login terlebih dahulu',
            ], 401);
        }

        if ($user->jabatan->nama_jabatan != $jabatan) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak: Jabatan tidak sesuai: ' . $user->jabatan->nama_jabatan . ', harus ' . $jabatan,
            ], 403);
        }

        return $next($request);
    }
}
