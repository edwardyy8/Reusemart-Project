import { Modal, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import React, { useState } from "react"; // Import useState hook

const ModalShowJabatan = ({ jabatan }) => { 
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="btnHijau me-2 shadow-sm" onClick={handleShow}>
                <FaEye size={20}/>
            </Button>

            <Modal size="lg" show={show} onHide={handleClose} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Detail Jabatan</Modal.Title>
                </Modal.Header>
                
                <Modal.Body >
                    <div className="p-3">
                        <h3>{jabatan.nama_jabatan}</h3>
                        <h5>ID : {jabatan.id_jabatan}</h5>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalShowJabatan;
