import React, { forwardRef } from 'react';

const LaporanDonasiBarang = forwardRef(({ laporan }, ref) => {
  if (!laporan) return <div>Data tidak tersedia</div>;


  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, border: '1px solid black', width: '100%' }}>
      
      <div><strong>ReUse Mart</strong><br />Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta</div>
      <br />

      <div><strong className='text-decoration-underline'>LAPORAN Donasi Barang</strong>
        <br />
        Tahun : {laporan.length > 0 && new Date(laporan[0].tanggal_donasi).getFullYear()}
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
              <th style={{ border: '1px solid black', padding: 5 }}>Id Penitip</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Nama Penitip</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Tanggal Donasi</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Organisasi</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Nama Penerima</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.kode_produk}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.nama_produk}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.id_penitip}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.nama_penitip}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{new Date(item.tanggal_donasi).toLocaleDateString()}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.organisasi}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.nama_penerima}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
});

export default LaporanDonasiBarang;
