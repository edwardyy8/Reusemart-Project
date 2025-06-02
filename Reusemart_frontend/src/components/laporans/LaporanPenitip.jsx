import React, { forwardRef } from 'react';

const LaporanPenitip = forwardRef(({ laporan }, ref) => {
  if (!laporan) return <div>Data tidak tersedia</div>;


  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, border: '1px solid black', width: '100%' }}>
      
      <div><strong>ReUse Mart</strong><br />Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta</div>
      <br />

      <div><strong className='text-decoration-underline'>LAPORAN Donasi Barang</strong>
        <br />
        ID Penitip : {laporan.data && laporan.data.length > 0 && laporan.data[0].id_penitip}
        <br />
        Nama Penitip : {laporan.data && laporan.data.length > 0 && laporan.data[0].nama_penitip}
        <br />
        Bulan : 
        <br />
        Tahun : {laporan.data && laporan.data.length > 0 && new Date(laporan.data[0].tanggal_laku).getFullYear()}
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
              <th style={{ border: '1px solid black', padding: 5 }}>Tanggal Masuk</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Tanggal Laku</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Harga Jual Bersih (sudah dipotong Komisi)</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Bonus terjual cepat</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            {laporan.data && laporan.data.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.kode_produk}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.nama_produk}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{new Date(item.tanggal_masuk).toLocaleDateString()}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{new Date(item.tanggal_laku).toLocaleDateString()}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.harga_jual_bersih.toLocaleString('id-ID')}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.bonus_terjual_cepat.toLocaleString('id-ID')}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.pendapatan.toLocaleString('id-ID')}</td>
              </tr>
            ))}
            {laporan.total && (
                <tr>
                    <td colSpan="4" style={{ border: '1px solid black', padding: 5, textAlign: 'right' }}><strong>TOTAL:</strong></td>
                    <td style={{ border: '1px solid black', padding: 5 }}>{laporan.total.total_harga_jual_bersih.toLocaleString('id-ID')}</td>
                    <td style={{ border: '1px solid black', padding: 5 }}>{laporan.total.total_bonus_terjual_cepat.toLocaleString('id-ID')}</td>
                    <td style={{ border: '1px solid black', padding: 5 }}>{laporan.total.total_pendapatan.toLocaleString('id-ID')}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
});

export default LaporanPenitip;
