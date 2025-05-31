import React, { forwardRef } from 'react';

const LaporanRekapRequest = forwardRef(({ laporan }, ref) => {
  if (!laporan) return <div>Data tidak tersedia</div>;


  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, border: '1px solid black', width: '100%' }}>
      
      <div><strong>ReUse Mart</strong><br />Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta</div>
      <br />

      <div><strong className='text-decoration-underline'>LAPORAN REQUEST DONASI</strong>
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
              <th style={{ border: '1px solid black', padding: 5 }}>Id Organisasi</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Nama</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Alamat</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Request</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.id_organisasi}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.nama}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.alamat}</td>
                <td style={{ border: '1px solid black', padding: 5 }}>{item.request}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </div>
  );
});

export default LaporanRekapRequest;
