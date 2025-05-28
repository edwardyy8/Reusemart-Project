import { Modal, Button, Row, Col } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useState } from "react";
import { parseISO, isAfter, isEqual } from "date-fns";

const ModalShowPenitipan = ({ barang }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="btnHijau me-2 shadow-sm" onClick={handleShow}>
                <FaEye size={20} />
            </Button>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detail Barang</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {/* Info Kiri */}
                        <Col md={8}>
                            <div className="mb-3">
                                <h5 className="fw-bold mb-2">{barang.nama_barang}</h5>
                                <p className="mb-1">ID Barang: {barang.id_barang}</p>
                                <p className="mb-1">Nama Penitip: {barang.penitip?.nama}</p>
                                <p className="mb-1">Kategori: {barang.kategori?.nama_kategori}</p>
                                <p className="mb-1">Status: {barang.status_barang}</p>
                                <p className="mb-1">Harga: Rp{barang.harga_barang}</p>
                                <p className="mb-1">Stok: {barang.stok_barang}</p>
                                <div className="mb-3">
                                    <label className="fw-bold mb-1">Deskripsi:</label>
                                    <div
                                        className="p-2 rounded border"
                                        style={{
                                            backgroundColor: "#f8f9fa",
                                            whiteSpace: "pre-wrap",
                                            maxHeight: "150px",
                                            overflowY: "auto"
                                        }}
                                    >
                                        {barang.deskripsi || "Tidak ada deskripsi"}
                                    </div>
                                </div>

                            </div>

                            <hr />

                            <div className="mb-3">
                                <h6 className="fw-bold mb-2">Detail Penitipan</h6>
                                <p className="mb-1">
                                    Tanggal Garansi: {barang.tanggal_garansi} -{" "}
                                    {barang.tanggal_garansi && (isAfter(parseISO(barang.tanggal_garansi), new Date()) || isEqual(parseISO(barang.tanggal_garansi), new Date()))
                                        ? "Bergaransi"
                                        : "Tidak Bergaransi"}
                                </p>

                                <p className="mb-1">Tanggal Masuk: {barang.tanggal_masuk}</p>
                                <p className="mb-1">Tanggal Akhir: {barang.rincian_penitipan?.tanggal_akhir || '-'}</p>
                                <p className="mb-1">Batas Akhir: {barang.rincian_penitipan?.batas_akhir || '-'}</p>
                                <p className="mb-1">ID QC: {barang.rincian_penitipan?.penitipan?.id_qc || '-'}</p>
                                <p className="mb-1">ID Hunter: {barang.rincian_penitipan?.penitipan?.id_hunter || 'Tidak termasuk barang hunting'}</p>
                            </div>
                        </Col>

                        {/* Gambar */}
                        <Col md={4} className="d-flex justify-content-center align-items-center">
                            <div className="border rounded p-2" style={{ backgroundColor: "#f8f9fa" }}>
                                {barang.foto_barang ? (
                                    <img
                                        src={`http://127.0.0.1:8000/storage/foto_barang/${barang.foto_barang}`}
                                        alt={barang.nama_barang}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            maxHeight: "200px",
                                            objectFit: "cover",
                                            borderRadius: "8px"
                                        }}
                                    />
                                ) : (
                                    <p className="text-muted">No Image</p>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalShowPenitipan;
