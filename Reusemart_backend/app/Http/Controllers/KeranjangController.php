<?php

namespace App\Http\Controllers;

use App\Models\Barang;
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

            $barang = Barang::find($validatedData['id_barang']);
            if (!$barang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Barang tidak ditemukan',
                ], 404);
            }
            if ($barang->stok_barang == 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Maaf, Barang sudah habis',
                ], 400);
            }

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
                ->whereHas('barang', function($query) {
                    $query->where('stok_barang', '!=', 0);
                })
                ->get();
            
            $keranjang_checked = Keranjang::with('barang')
                ->where('id_pembeli', $id_pembeli)
                ->where('is_selected', 1)
                ->whereHas('barang', function($query) {
                    $query->where('stok_barang', '!=', 0);
                })
                ->get();

            $stok_habis = Keranjang::with('barang')
                ->where('id_pembeli', $id_pembeli)
                ->whereHas('barang', function($query) {
                    $query->where('stok_barang', 0);
                })
                ->get();

            $total_harga_barang = $keranjang_checked->sum('harga_barang');
    
            return response()->json([
                'message' => 'Keranjang Berhasil didapatkan',
                'status' => 'success',
                'data' => $keranjang,
                'keranjang_checked' => $keranjang_checked,
                'total_harga_barang' => $total_harga_barang,
                'stok_habis' => $stok_habis,        
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mendapatkan keranjang', 
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function handleSelectKeranjang($id)
    {
        try {
           $keranjang = Keranjang::find($id);
            if (!$keranjang) {
                return response()->json([
                    'message' => 'Keranjang tidak ditemukan', 
                    'status' => 'error'
                ], 404);
            }

            $keranjang->is_selected = !$keranjang->is_selected;
            $keranjang->save();

            return response()->json([
                'message' => 'Status keranjang berhasil diperbarui', 
                'status' => 'success',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui keranjang', 
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteKeranjang($id)
    {
        try {
            $keranjang = Keranjang::find($id);
            if (!$keranjang) {
                return response()->json([
                    'message' => 'Keranjang tidak ditemukan', 
                    'status' => 'error'
                ], 404);
            }

            $keranjang->delete();

            return response()->json([
                'message' => 'Keranjang berhasil dihapus', 
                'status' => 'success',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus keranjang', 
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteKeranjangHabis()
    {
        try {
            $id_pembeli = request()->user()->id_pembeli; 
            $stok_habis = Keranjang::with('barang')
                ->where('id_pembeli', $id_pembeli)
                ->whereHas('barang', function($query) {
                    $query->where('stok_barang', 0);
                })
                ->get();

            foreach ($stok_habis as $item) {
                $item->delete();
            }

            return response()->json([
                'message' => 'Keranjang dengan stok habis berhasil dihapus', 
                'status' => 'success',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus keranjang dengan stok habis', 
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function handleCheckoutDariBarang(Request $request, $id)
    {
        try {
            $id_pembeli = $request->user()->id_pembeli; 

            $barang = Barang::find($id);

            if ($barang->stok_barang == 0 || !$barang) {
                return response()->json([
                    'status' => false,
                    'message' => 'Maaf, Barang sudah habis',
                ], 400);
            }

            $keranjang = Keranjang::where('id_pembeli', $id_pembeli)
                ->where('is_selected', 1)
                ->get();


            $barang = Barang::find($id);

            if($keranjang->count() > 0) {
                foreach ($keranjang as $item) {
                    $item->is_selected = 0;
                    $item->save();
                }
            }

            $cekBarangDiKeranjang = Keranjang::where('id_barang', $id)
                ->where('id_pembeli', $id_pembeli)
                ->first();

            if (!$cekBarangDiKeranjang) {
                $keranjangBaru = new Keranjang();
                $keranjangBaru->id_barang = $barang->id_barang;
                $keranjangBaru->harga_barang = $barang->harga_barang;
                $keranjangBaru->id_pembeli = $id_pembeli; 
                $keranjangBaru->is_selected = 1;
                $keranjangBaru->save();
            }else {
                $cekBarangDiKeranjang->is_selected = 1;
                $cekBarangDiKeranjang->save();
            }

            return response()->json([
                'message' => 'Status keranjang berhasil diperbarui', 
                'status' => 'success',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui keranjang', 
                'status' => 'error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
   


}
