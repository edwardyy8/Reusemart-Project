import React, { forwardRef } from 'react';

const LaporanByKategori = forwardRef(({ laporan }, ref) => {
  if (!laporan) return <div>Data tidak tersedia</div>;


  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, border: '1px solid black', width: '100%' }}>
      
      <div><strong>ReUse Mart</strong><br />Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta</div>
      <br />

      <div><strong className='text-decoration-underline'>LAPORAN PENJUALAN PER KATEGORI BARANG</strong>
        <br />
        Tahun : {laporan.data && laporan.data.length > 0 && new Date(laporan.total.tahun).getFullYear()}
        <br />
        Tanggal cetak : {new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: 5 }}>Kategori</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Jumlah item terjual</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Jumlah item gagal terjual</th>
            </tr>
          </thead>
          <tbody>
            {laporan.data && laporan.data.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: 5 }}>
                  {item.nama_kategori_utama}
                </td>
                <td style={{ border: '1px solid black', padding: 5 }}>
                  {item.jumlah_barang_terjual}
                </td>
                <td style={{ border: '1px solid black', padding: 5 }}>
                  {item.jumlah_barang_gagal_terjual}
                </td>
              </tr>
            ))}
            {laporan.total && (
                <tr>
                    <td style={{ border: '1px solid black', padding: 5 }}><strong>Total</strong></td>
                    <td style={{ border: '1px solid black', padding: 5 }}>
                        <strong>{laporan.total.jumlah_terjual}</strong>
                    </td>
                    <td style={{ border: '1px solid black', padding: 5 }}>
                        <strong>{laporan.total.jumlah_gagal_terjual}</strong>
                    </td>
                </tr>
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default LaporanByKategori;
