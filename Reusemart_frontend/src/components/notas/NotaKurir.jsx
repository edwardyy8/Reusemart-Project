import React, { forwardRef } from 'react';

const NotaKurir = forwardRef(({ pemesanan }, ref) => {
  if (!pemesanan) return <div>Data tidak tersedia</div>;
  const rincian = pemesanan?.data.rincian_pemesanan ?? [];
  const pembeli = pemesanan?.data.pembeli ?? null;
  const alamat = pemesanan?.data.alamat?? null;
  const qcs = [];

  rincian.forEach(item => {
    const qc = item?.barang?.rincian_penitipan?.penitipan?.qc;
    if (qc && qc.id_pegawai) {
      qcs.push(qc);
    }
  });

  const uniqueQCs = Array.from(
    new Map(qcs.map(q => [q.id_pegawai, q])).values()
  );

  const kurir = pemesanan?.data.kurir ?? null;

  const poinDigunakan = pemesanan?.data.poin_digunakan ?? 0;
  const totalHarga = pemesanan?.data.total_harga ?? 0;
  const ongkos = pemesanan?.data.ongkos ?? 0;
  const poinDidapatkan = pemesanan?.data.poin_didapatkan ?? 0;
  const poinPembeli = pembeli?.poin_pembeli ?? 0;

  const potonganPoin = poinDigunakan * 100;
  const totalSetelahPotongan = totalHarga + ongkos - potonganPoin;
  const totalPoinCustomer = poinDidapatkan + poinPembeli;

  return (
    <div ref={ref} style={{ fontSize: '15px', padding: 20, width: 350, border: '1px solid black' }}>
      
      <div><strong>ReUse Mart</strong><br />Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta</div>

      <div style={{ marginTop: 10 }}>
        <table>
          <tbody>
            <tr><td>No Nota</td><td>: {pemesanan?.data.id_pemesanan ?? '-'}</td></tr>
            <tr><td>Tanggal pesan</td><td>: {pemesanan?.data.tanggal_pemesanan ?? '-'}</td></tr>
            <tr><td>Lunas pada</td><td>: {pemesanan?.data.tanggal_pelunasan ?? '-'}</td></tr>
            <tr><td>Tanggal kirim</td><td>: {pemesanan?.data.tanggal_pengiriman ?? '-'}</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>Pembeli</strong> : {pembeli?.email ?? '-'} / {pembeli?.nama ?? '-'}<br />
        {alamat?.nama_alamat ?? '-'}<br />
        Delivery: Kurir ReUseMart ({kurir?.nama ?? '-'})
      </div>

      <div style={{ marginTop: 10 }}>
        {rincian.length > 0 ? rincian.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{item.barang?.nama_barang ?? '-'}</span>
            <span>{(item.harga_barang ?? 0).toLocaleString()}</span>
          </div>
        )) : <div>(Tidak ada barang)</div>}
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <b>Total</b><span>{totalHarga.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          Ongkos Kirim<span>{ongkos.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <b>Total</b><span>{(totalHarga + ongkos).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          Potongan {poinDigunakan} poin<span>- {potonganPoin}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <b>Total</b><b>{totalSetelahPotongan.toLocaleString()}</b>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div>Poin dari pesanan ini: {poinDidapatkan}</div>
        <div>Total poin customer: {totalPoinCustomer}</div>
      </div>

      <div style={{ marginTop: 10 }}>
        QC oleh:
        <ul>
          {uniqueQCs.length > 0 ? (
            uniqueQCs.map((qc, idx) => (
              <li key={idx}>
                {qc.nama} ({qc.id_pegawai})
              </li>
            ))
          ) : (
            <li>-</li>
          )}
        </ul>
      </div>

      <div style={{ marginTop: 10 }}>
        Diterima oleh:<br /><br />
        (.......................................)<br />
        Tanggal: ..................................
      </div>
    </div>
  );
});

export default NotaKurir;
