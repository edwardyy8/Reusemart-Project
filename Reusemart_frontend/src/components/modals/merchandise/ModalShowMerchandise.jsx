import { Modal, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useState } from "react";

const ModalShowMerchandise = ({ merchandise }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="btnHijau me-2 shadow-sm" onClick={handleShow}>
                <FaEye size={20} />
            </Button>

            <Modal size="lg" show={show} onHide={handleClose} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Detail Merchandise</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-3">
                        <h3>{merchandise.nama_merchandise}</h3>
                        <h5>ID: {merchandise.id_merchandise}</h5>
                        <h5>Stok: {merchandise.stok_merchandise}</h5>
                        <h5>Poin: {merchandise.poin_merchandise}</h5>
                        <h5>Foto: {merchandise.foto_merchandise ? (
                            <img
                                src={`http://127.0.0.1:8000/storage/foto_barang/${merchandise.foto_merchandise}`}
                                alt={merchandise.nama_merchandise}
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                        ) : (
                            "Tidak ada foto"
                        )}</h5>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalShowMerchandise;