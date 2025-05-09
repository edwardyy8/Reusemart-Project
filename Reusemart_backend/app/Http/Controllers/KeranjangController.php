<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Keranjang;

class KeranjangController extends Controller
{
    //

    public function tambahKeranjang(Request $request)
    {
        try {
            $id_pembeli = $request->user()->id_pembeli;
            if (!$id_pembeli) {
                return response()->json([
                    'status' => false,
                    'message' => 'Hanya pembeli yang dapat menambahkan produk ke keranjang',
                ], 401);
            }

            $validatedData = $request->validate([
                'id_barang' => 'required',
                'harga_barang' => 'required',
            ]);

            $cekBarangDiKeranjang = Keranjang::where('id_barang', $validatedData['id_barang'])
                ->where('id_pembeli', $id_pembeli)
                ->first();

            if ($cekBarangDiKeranjang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Barang sudah ada di keranjang',
                ], 400);
            }
            
            $keranjang = new Keranjang();
            $keranjang->id_barang = $validatedData['id_barang'];
            $keranjang->harga_barang = $validatedData['harga_barang'];
            $keranjang->id_pembeli = $id_pembeli; 
            $keranjang->is_selected = 1;
            $keranjang->save();
    
            return response()->json(['message' => 'Produk berhasil ditambahkan ke keranjang']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menambahkan produk ke keranjang', 
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getKeranjangByIdPembeli(Request $request)
    {
        try {
            $id_pembeli = $request->user()->id_pembeli; 
            $keranjang = Keranjang::with('barang')
                ->where('id_pembeli', $id_pembeli)
                ->get();
    
            return response()->json([
                'message' => 'Keranjang Berhasil didapatkan',
                'status' => 'success',
                'data' => $keranjang,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mendapatkan keranjang', 
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
