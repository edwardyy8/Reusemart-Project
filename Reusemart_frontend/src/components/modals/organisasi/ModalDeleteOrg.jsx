import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

import { toast } from "react-toastify";
import { DeleteOrganisasi } from "../../../api/apiOrganisasi";

const ModalDeleteOrg = ({ organisasi, onClose }) => { 
    const [show, setShow] = useState(false);

    const [isPending, setIsPending] = useState(false);

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    const handleBatal = () => {
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            const res = await DeleteOrganisasi(organisasi.id_organisasi);
            toast.success("Berhasil menghapus organisasi.");
            handleClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <Button variant="danger" className="shadow-sm" onClick={handleShow}>
                <FaTrash size={20} />
            </Button>

            <Modal size="lg" show={show} onHide={handleBatal} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Hapus Data Organisasi</Modal.Title>
                </Modal.Header>
                
                <Modal.Body >
                    <div className="p-3">
                       <h5>Apakah Anda yakin ingin menghapus data organisasi ini?</h5>
                       <h4 className="fw-bold">{organisasi.nama}</h4>
                    </div>
                   
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="danger"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                />{" "}
                                Loading...
                            </>
                        ) : (
                            <span>Ya</span>
                        )}
                    </Button>

                    <Button variant="secondary" onClick={handleBatal}>
                        Batal
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteOrg;