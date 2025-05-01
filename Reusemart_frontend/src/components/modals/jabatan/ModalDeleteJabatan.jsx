import { Modal, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeleteJabatan } from "../../../api/apiJabatan";

const ModalDeleteJabatan = ({ jabatan, onClose }) => { 
    const [show, setShow] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    const handleDelete = async () => {
        setIsPending(true);
        try {
            const res = await DeleteJabatan(jabatan.id_jabatan);
            toast.success("Berhasil menghapus jabatan.");
            handleClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <Button variant="danger" className="shadow-sm" onClick={() => setShow(true)}>
                <FaTrash size={20} />
            </Button>

            <Modal size="lg" show={show} onHide={handleClose} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Hapus Jabatan</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <div className="p-3">
                        <h5>Apakah Anda yakin ingin menghapus jabatan ini?</h5>
                        <h4 className="fw-bold">{jabatan.nama_jabatan}</h4>
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

export default ModalDeleteJabatan;
