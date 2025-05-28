import { Modal, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeleteMerchandise } from "../../../api/apiMerchandise";

const ModalDeleteMerchandise = ({ merchandise, onClose }) => {
    const [show, setShow] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    const handleDelete = async () => {
        setIsPending(true);
        try {
            await DeleteMerchandise(merchandise.id_merchandise);
            toast.success("Berhasil menghapus merchandise.");
            handleClose();
        } catch (error) {
            toast.error(error.message || "Gagal menghapus merchandise.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <Button variant="danger" className="shadow-sm" onClick={() => setShow(true)}>
                <FaTrash size={20} />
            </Button>

            <Modal size="lg" show={show} onHide={handleClose} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Hapus Merchandise</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-3">
                        <h5>Apakah Anda yakin ingin menghapus merchandise ini?</h5>
                        <h4 className="fw-bold">{merchandise.nama_merchandise}</h4>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete} disabled={isPending}>
                        {isPending ? <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> : "Ya"}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>Batal</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalDeleteMerchandise;