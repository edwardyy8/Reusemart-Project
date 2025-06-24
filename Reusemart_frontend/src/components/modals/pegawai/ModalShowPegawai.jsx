import { Modal, Button, Row, Col } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useState } from "react";

const ModalShowPegawai = ({ pegawai }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="btnHijau me-2 shadow-sm" onClick={handleShow}>
                <FaEye size={20} />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Pegawai</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col md={8}>
                            <h3>{pegawai.nama_pegawai}</h3>
                            <h5>ID : {pegawai.id_pegawai}</h5>
                            <h5>Email : {pegawai.email}</h5>
                            <h5>ID Jabatan : {pegawai.id_jabatan}</h5>
                            <h5>Tanggal Lahir : {pegawai.tanggal_lahir}</h5>
                            <h5>Status : {pegawai.is_aktif}</h5>
                        </Col>
                        <Col md={4} className="d-flex justify-content-center align-items-center">
                            <img
                                src={`https://laraveledwardy.barioth.web.id/storage/foto_profile/${pegawai.foto_profile}`}
                                alt="Profile"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalShowPegawai;
