import React, { forwardRef } from 'react';

const LaporanPenitipanHabis = forwardRef(({ laporan }, ref) => {
  if (!laporan) return <div>Data tidak tersedia</div>;


  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, border: '1px solid black', width: '100%' }}>
      
      <div><strong>ReUse Mart</strong><br />Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta</div>
      <br />

      <div><strong className='text-decoration-underline'>LAPORAN  Barang yang Masa Penitipannya Sudah Habis</strong>
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
              <th style={{ border: '1px solid black', padding: 5 }}>Kode Produk</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Nama Produk</th>
              <th style={{ border: '1px solid black', padding: 5 }}>ID Penitip</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Nama Penitip</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Tanggal Masuk</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Tanggal Akhir</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Batas Akhir</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.id_barang}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.nama_barang}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.id_penitip}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.nama}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{new Date(item.tanggal_masuk).toLocaleDateString()}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{new Date(item.tanggal_akhir).toLocaleDateString()}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{new Date(item.batas_akhir).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
});

export default LaporanPenitipanHabis;
