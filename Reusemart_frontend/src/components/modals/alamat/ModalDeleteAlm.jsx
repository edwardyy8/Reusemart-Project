import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

import { toast } from "react-toastify";
import { DeleteAlamat } from "../../../api/apiAlamat";

const ModalDeleteAlm = ({ alamat, onClose }) => { 
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
            const res = await DeleteAlamat(alamat.id_alamat);
            toast.success("Berhasil menghapus alamat.");
            handleClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <Button className="w-0 me-2" variant="danger" onClick={handleShow}> 
                Hapus
            </Button>

            <Modal size="lg" show={show} onHide={handleBatal} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Hapus Data Alamat</Modal.Title>
                </Modal.Header>
                
                <Modal.Body >
                    <div className="p-3">
                       <h5>Apakah Anda yakin ingin menghapus data alamat ini?</h5>
                       <h4 className="fw-bold">{alamat.nama_alamat}</h4>
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

export default ModalDeleteAlm;