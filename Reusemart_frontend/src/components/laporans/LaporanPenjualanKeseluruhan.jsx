import React, { forwardRef } from 'react';
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
  // Validasi data
  if (!laporan || !Array.isArray(laporan) || laporan.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Data tidak tersedia untuk tahun {tahun}</div>;
  }
console.log('Props diterima:', { laporan, tahun });
  // Fungsi untuk mengonversi string mata uang ke angka
  const parseCurrency = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string') return 0;
    return parseFloat(value.replace(/[^0-9,-]+/g, '').replace(',', '.')) || 0;
  };

  // Data untuk grafik (tanpa item "Total")
  const filteredLaporan = laporan.filter(item => item.bulan !== 'Total');
  const labels = filteredLaporan.map(item => item.bulan);
  const penjualanKotor = filteredLaporan.map(item => parseCurrency(item.jumlah_penjualan_kotor));

  // Validasi jika tidak ada data untuk grafik
  if (labels.length === 0 || penjualanKotor.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Tidak ada data untuk ditampilkan pada grafik untuk tahun {tahun}</div>;
  }

  const data = {
    labels,
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
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Penjualan Kotor Tahun ${tahun}` },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `${value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Jumlah Penjualan Kotor (Rp)' },
        ticks: {
          callback: (value) =>
            `${value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`,
        },
      },
      x: {
        title: { display: true, text: 'Bulan' },
      },
    },
  };

  return (
    <div
      ref={ref}
      style={{
        fontSize: '15px',
        padding: '20px',
        border: '1px solid black',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <strong>ReUse Mart</strong>
        <br />
        Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta
      </div>
      <br />
      <div>
        <strong style={{ textDecoration: 'underline' }}>LAPORAN PENJUALAN KESELURUHAN</strong>
        <br />
        Tahun : 2024
        <br />
        Tanggal Cetak:{' '}
        {new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>
      <div style={{ marginTop: '10px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid black',
          }}
        >
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '5px' }}>Bulan</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Jumlah Barang Terjual</th>
              <th style={{ border: '1px solid black', padding: '5px' }}>Jumlah Penjualan Kotor</th>
            </tr>
          </thead>
          <tbody>
            {laporan.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    border: '1px solid black',
                    padding: '5px',
                    fontWeight: item.bulan === 'Total' ? 'bold' : 'normal',
                  }}
                >
                  {item.bulan}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    padding: '5px',
                    textAlign: 'right',
                    fontWeight: item.bulan === 'Total' ? 'bold' : 'normal',
                  }}
                >
                  {item.jumlah_barang_terjual}
                </td>
                <td
                  style={{
                    border: '1px solid black',
                    padding: '5px',
                    textAlign: 'right',
                    fontWeight: item.bulan === 'Total' ? 'bold' : 'normal',
                  }}
                >
                  {typeof item.jumlah_penjualan_kotor === 'number'
                    ? item.jumlah_penjualan_kotor.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      })
                    : item.jumlah_penjualan_kotor}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '20px', height: '400px', position: 'relative' }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
});

export default LaporanPenjualanKeseluruhan;