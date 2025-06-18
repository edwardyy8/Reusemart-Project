import { useState } from "react";
import { Modal, Button, Carousel, Image, Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { parseISO, addDays } from "date-fns";
import { FaEye } from "react-icons/fa";

const ModalShowPenitipan = ({ barang }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Prepare photos for carousel
  const photos = [
    {
      src: barang.foto_barang
        ? `http://127.0.0.1:8000/storage/foto_barang/${barang.foto_barang}`
        : null,
      caption: "Foto Utama",
    },
    {
      src: barang.foto_barang2
        ? `http://127.0.0.1:8000/storage/foto_barang/${barang.foto_barang2}`
        : null,
      caption: "Foto Kedua",
    },
    {
      src: barang.foto_barang3
        ? `http://127.0.0.1:8000/storage/foto_barang/${barang.foto_barang3}`
        : null,
      caption: "Foto Ketiga",
    },
  ].filter((photo) => photo.src); // Filter out null photos

  return (
    <>
      <Button className="btnHijau me-2 shadow-sm" onClick={handleShow}>
                <FaEye size={20} />
            </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detail Barang: {barang.nama_barang}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {photos.length > 0 ? (
            <Carousel
              indicators={true}
              prevIcon={
                <span
                  className="carousel-control-prev-icon"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "20px",
                    transition: "background-color 0.3s",
                  }}
                />
              }
              nextIcon={
                <span
                  className="carousel-control-next-icon"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    padding: "20px",
                    transition: "background-color 0.3s",
                  }}
                />
              }
              style={{ marginBottom: "20px" }}
            >
              {photos.map((photo, index) => (
                <Carousel.Item key={index}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "400px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                  <Carousel.Caption
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      borderRadius: "5px",
                      padding: "5px 10px",
                    }}
                  >
                    <p style={{ margin: 0, color: "white" }}>{photo.caption}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                textAlign: "center",
                color: "#6c757d",
                fontSize: "1.2rem",
                border: "1px solid #dee2e6",
              }}
            >
              Tidak ada foto tersedia
            </div>
          )}

          <Row>
            <Col md={6}>
              <p><strong>ID Barang:</strong> {barang.id_barang}</p>
              <p><strong>Kategori:</strong> {barang.kategori?.nama_kategori || "-"}</p>
              <p><strong>Nama Barang:</strong> {barang.nama_barang}</p>
              <p><strong>Harga Barang:</strong> Rp {barang.harga_barang?.toLocaleString("id-ID") || "-"}</p>
              <p><strong>Berat Barang:</strong> {barang.berat_barang} gram</p>
              <p><strong>Deskripsi:</strong> {barang.deskripsi || "-"}</p>
            </Col>
            <Col md={6}>
              <p><strong>Nama Penitip:</strong> {barang.penitip?.nama || "-"}</p>
              <p><strong>Tanggal Masuk:</strong> {barang.tanggal_masuk || "-"}</p>
              <p>
                <strong>Masa Penitipan:</strong>{" "}
                {barang.tanggal_masuk
                  ? format(addDays(parseISO(barang.tanggal_masuk), 30), "yyyy-MM-dd")
                  : "-"}
              </p>
              <p><strong>Status Barang:</strong> {barang.status_barang || "-"}</p>
              <p>
                <strong>Status Penitipan:</strong>{" "}
                {barang.rincian_penitipan?.status_penitipan || "-"}
              </p>
              <p>
                <strong>Perpanjangan:</strong>{" "}
                {barang.rincian_penitipan?.perpanjangan == 1 ? "Ya" : "Tidak"}
              </p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalShowPenitipan;