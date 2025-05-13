import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useState } from "react";

const ModalShowOrg = ({ organisasi }) => { 
    const [show, setShow] = useState(false);

    const [isPending, setIsPending] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => setShow(true);

    return (
        <>
            <Button className="btnHijau me-2 shadow-sm" onClick={handleShow}>
                <FaEye size={20}/>
            </Button>

            <Modal size="lg" show={show} onHide={handleClose} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Detail Organisasi</Modal.Title>
                </Modal.Header>
                
                <Modal.Body >
                    <div className="p-3 d-flex justify-content-between align-items-center">
                        <div>
                            <h3>{organisasi.nama}</h3>
                            <h5>ID : {organisasi.id_organisasi}</h5>
                            <h5>Email : {organisasi.email}</h5>
                            <h5>Alamat : {organisasi.alamat_organisasi}</h5>
                            <h5>Status Aktif : {organisasi.is_aktif}</h5>
                        </div>
                        <div>
                            <img style={{ width: "150px", height: "150px" }}
                                src={`http://127.0.0.1:8000/storage/foto_profile/${organisasi.foto_profile}`} 
                                alt="Profile Organisasi" />
                        </div>
                    </div>
                   
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalShowOrg;