import React, { forwardRef, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LaporanPenjualanKeseluruhan = forwardRef(({ laporan, tahun }, ref) => {
  if (!laporan || laporan.length === 0) return <div>Data tidak tersedia</div>;

  // Data untuk grafik
  const labels = laporan.slice(0, -1).map(item => item.bulan); // Mengambil bulan tanpa "Total"
  const penjualanKotor = laporan.slice(0, -1).map(item => item.jumlah_penjualan_kotor); // Mengambil penjualan kotor tanpa "Total"

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Jumlah Penjualan Kotor (Rp)',
        data: penjualanKotor,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Penjualan Kotor Tahun ${tahun}` },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Jumlah Penjualan Kotor (Rp)' },
        ticks: { callback: value => `${value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}` },
      },
      x: { title: { display: true, text: 'Bulan' } },
    },
  };

  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, border: '1px solid black', width: '100%' }}>
      <div>
        <strong>ReUse Mart</strong><br />
        Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta
      </div>
      <br />
      <div>
        <strong className='text-decoration-underline'>LAPORAN PENJUALAN KESELURUHAN</strong>
        <br />
        Tahun: {tahun}
        <br />
        Tanggal Cetak: {new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </div>
      <div style={{ marginTop: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: 5 }}>Bulan</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Jumlah Barang Terjual</th>
              <th style={{ border: '1px solid black', padding: 5 }}>Jumlah Penjualan Kotor</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: 5, fontWeight: item.bulan === 'Total' ? 'bold' : 'normal' }}>
                  {item.bulan}
                </td>
                <td style={{ border: '1px solid black', padding: 5, textAlign: 'right', fontWeight: item.bulan === 'Total' ? 'bold' : 'normal' }}>
                  {item.jumlah_barang_terjual.toLocaleString('id-ID')}
                </td>
                <td style={{ border: '1px solid black', padding: 5, textAlign: 'right', fontWeight: item.bulan === 'Total' ? 'bold' : 'normal' }}>
                  {item.jumlah_penjualan_kotor.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 20, height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
});

const tableStyle = {
  border: '1px solid black',
  padding: 5,
};

export default LaporanPenjualanKeseluruhan;