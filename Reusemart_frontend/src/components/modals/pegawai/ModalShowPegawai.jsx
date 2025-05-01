import { Modal, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useState } from "react";

const ModalShowPegawai = ({ pegawai }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="btnHijau me-2 shadow-sm" onClick={handleShow}>
                <FaEye size={20}/>
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Pegawai</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h3>{pegawai.nama_pegawai}</h3>
                    <h5>ID : {pegawai.id_pegawai}</h5>
                    <h5>Email : {pegawai.email}</h5>
                    <h5>Jabatan : {pegawai.jabatan?.nama_jabatan}</h5>
                    <img
                        src={`http://127.0.0.1:8000/storage/foto_profile/${pegawai.foto_profile}`}
                        alt="Profile"
                        style={{ width: "150px", height: "150px" }}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalShowPegawai;
