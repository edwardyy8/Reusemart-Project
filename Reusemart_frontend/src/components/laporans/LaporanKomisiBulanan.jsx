import React, { forwardRef } from 'react';

const LaporanKomisiBulanan = forwardRef(({ laporan, tahun, bulan }, ref) => {
  if (!laporan || laporan.length === 0) return <div>Data tidak tersedia</div>;

  const bulanNama = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ][bulan - 1];

  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, border: '1px solid black', width: '100%' }}>
      <div>
        <strong>ReUse Mart</strong><br />
        Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta
      </div>
      <br />
      <div>
        <strong className='text-decoration-underline'>LAPORAN KOMISI BULANAN</strong>
        <br />
        Tahun : {laporan.data && laporan.data.length > 0 && new Date(laporan.data[0].tanggal_laku).getFullYear()}
        <br />
        Bulan : {laporan.data && laporan.data.length > 0 && new Date(laporan.data[0].tanggal_laku).getMonthYear()}
        <br />
        Tanggal cetak: {new Date().toLocaleDateString('id-ID', {
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
              <th style={{ border: '1px solid black', padding: 5 }}>Harga Jual</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Tanggal Masuk</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Tanggal Laku</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Komisi Hunter</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Komisi ReUse Mart</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Bonus Penitip</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.kode_produk}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.nama_produk}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.harga_produk}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>
                  {new Date(item.tanggal_masuk).toLocaleDateString('id-ID')}
                </td>
                <td style={{ border: '1px solid black', padding: 5 }}>
                  {new Date(item.tanggal_laku).toLocaleDateString('id-ID')}
                </td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.komisi_hunter}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.komisi_reusemart}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.bonus_penitip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default LaporanKomisiBulanan;