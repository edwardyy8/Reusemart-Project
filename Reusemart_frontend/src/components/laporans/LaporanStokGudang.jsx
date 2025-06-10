import React, { forwardRef } from 'react';

const LaporanStokGudang = forwardRef(({ laporan }, ref) => {
  if (!laporan || laporan.length === 0) return <div>Data tidak tersedia</div>;

  const currentDate = new Date();
  const formattedDate = currentDate instanceof Date && !isNaN(currentDate)
    ? currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Tanggal tidak tersedia';

  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, border: '1px solid black', width: '100%' }}>
      <div>
        <strong>ReUse Mart</strong><br />
        Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta
      </div>
      <br />

      <div>
        <strong className='text-decoration-underline'>LAPORAN STOK GUDANG</strong>
        <br />
        Tanggal cetak: {formattedDate}
      </div>

      <div style={{ marginTop: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={thStyle}>Kode Produk</th>
              <th style={thStyle}>Nama Produk</th>
              <th style={thStyle}>ID Penitip</th>
              <th style={thStyle}>Nama Penitip</th>
              <th style={thStyle}>Tanggal Masuk</th>
              <th style={thStyle}>Perpanjangan</th>
              <th style={thStyle}>ID Hunter</th>
              <th style={thStyle}>Nama Hunter</th>
              <th style={thStyle}>Harga</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.kode_produk}</td>
                <td style={tdStyle}>{item.nama_produk}</td>
                <td style={tdStyle}>{item.id_penitip}</td>
                <td style={tdStyle}>{item.nama_penitip}</td>
                <td style={tdStyle}>{item.tanggal_masuk}</td>
                <td style={tdStyle}>{item.perpanjangan}</td>
                <td style={tdStyle}>{item.id_hunter}</td>
                <td style={tdStyle}>{item.nama_hunter}</td>
                <td style={tdStyle}>{item.harga_barang}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const thStyle = {
  border: '1px solid black',
  padding: 5,
  backgroundColor: '#f0f0f0',
};

const tdStyle = {
  border: '1px solid black',
  padding: 5,
};

export default LaporanStokGudang;