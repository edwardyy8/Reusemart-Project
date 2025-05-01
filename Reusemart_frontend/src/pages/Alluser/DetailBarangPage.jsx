import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { FaRegCommentDots } from 'react-icons/fa'; // Importing the comment icon
import { useParams } from "react-router-dom";
import { GetBarangById } from "../../api/apiBarang";
import { GetFotoBarangByIdBarang } from "../../api/apiFotoBarang"; // pastikan fungsinya ada
import { GetPenitipById } from "../../api/apiPenitip";
import iconPenitip from "../../assets/images/iconPenitip.png";
import FooterBar from "../../components/FooterBar";

const DetailBarangPage = () => {
  const { id } = useParams();
  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);
  const [penitip, setPenitip] = useState(null);
  const [fotoBarangList, setFotoBarangList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barangData = await GetBarangById(id);
        setBarang(barangData);

        const penitipData = await GetPenitipById(barangData.id_penitip);
        setPenitip(penitipData);

        const fotoList = await GetFotoBarangByIdBarang(id);
        setFotoBarangList(fotoList);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5" style={{ marginTop: "5rem" }}>
        <Spinner animation="border" variant="success" />
        <p>Loading Detail Barang...</p>
      </div>
    );
  }

  if (!barang) {
    return (
      <Container className="text-center my-5" style={{ marginTop: "5rem" }}>
        <h3>Barang tidak ditemukan</h3>
      </Container>
    );
  }

  // Pisahkan foto utama dan foto lain
  const fotoUtama = fotoBarangList.length > 0 ? fotoBarangList[0].foto_barang : null;
  const fotoLainnya = fotoBarangList.slice(1); // Foto-foto lainnya selain foto utama

  return (
    <>
      <Container className="my-5">
        <Row className="g-4">
          {/* Foto Utama */}
          <Col md={4}>
            <Card>
              <Card.Img
                variant="top"
                src={`/images/${fotoUtama}`}
                alt={barang.nama_barang}
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </Card>
          </Col>

          {/* Informasi Barang & Penitip */}
          <Col md={8}>
            <Row>
              <Col md={8}>
                <h2>{barang.nama_barang}</h2>
                <p className="text-success">
                  {barang.status_barang} - {barang.garansi === "Ya" ? "Garansi" : "Tidak Bergaransi"} - {barang.berat_barang} Kg
                </p>
                <h3>Rp {Number(barang.harga_barang).toLocaleString("id-ID")}</h3>
              </Col>
              <Col md={4}>
                <div className="p-3 border rounded">
                  <Row>
                    <Col md={4}>
                      <img src={iconPenitip} alt="Penitip" className="img-fluid rounded" />
                    </Col>
                    <Col md={8}>
                      <h5 className="fw-bold">{penitip?.nama_penitip || "Nama Penitip"}</h5>
                      <p className="text-muted mb-1">Rating Penjual: ⭐ {penitip?.rating_penitip} </p>
                      <p className="text-muted">Barang Terjual: Masih dummyy</p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <hr />
            <h4 className="text-success text-decoration-underline">Detail Produk</h4>
            <p>{barang.deskripsi}</p>
            <hr />
          </Col>
        </Row>

        {/* Foto Lainnya */}
        <Row className="my-3">
          <Col md={8}>
            {fotoLainnya.length > 0 ? (
              fotoLainnya.map((foto, index) => (
                <img
                  key={index}
                  src={`/images/${foto.foto_barang}`}
                  alt={`Foto ${index + 2}`}
                  className="img-fluid rounded me-2 mb-2"
                  style={{ maxWidth: "150px" }}
                />
              ))
            ) : (
              <p>Tidak ada foto lainnya</p>
            )}
          </Col>
          <Col md={4} className="d-flex justify-content-end align-items-center">
            <div className="d-flex gap-2 w-100">
              <button className="btn btn-outline-success w-50">+ Keranjang</button>
              <button className="btn btn-success w-50">Checkout</button>
            </div>
          </Col>
        </Row>

        {/* Diskusi Produk */}
        <hr className="my-4" />
        <h4 className="text-success text-decoration-underline">Diskusi Produk</h4>

        <div className="border rounded p-4">
          <div className="border bg-light rounded p-2 mb-3 d-flex align-items-center">
            <img
              src={iconPenitip}
              alt="icon user"
              width={30}
              height={30}
              className="me-2"
            />
            <div>
              <strong>Abrakadabra</strong>
              <p className="mb-0">Baterainya masih bagus ga ?</p>
            </div>
          </div>

          <div className="d-flex align-items-center w-100 mt-5">
            <FaRegCommentDots size={20} className="me-2" />
            <input
              type="text"
              placeholder="Masukkan diskusi Anda . . ."
              className="form-control me-2"
            />
            <button className="btn btn-outline-success">Kirim</button>
          </div>
        </div>
      </Container>

      <FooterBar />
    </>
  );
};

export default DetailBarangPage;
