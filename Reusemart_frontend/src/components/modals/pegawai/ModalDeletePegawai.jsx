import { Modal, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeletePegawai } from "../../../api/apiPegawai";

const ModalDeletePegawai = ({ pegawai, onClose }) => {
    const [show, setShow] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            await DeletePegawai(pegawai.id_pegawai);
            toast.success("Berhasil menghapus pegawai.");
            handleClose();
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                <FaTrash size={20} />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Hapus Data Pegawai</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Apakah Anda yakin ingin menghapus pegawai ini?</p>
                    <h4>{pegawai.nama_pegawai}</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Spinner as="span" animation="grow" size="sm" /> Loading...
                            </>
                        ) : (
                            "Ya"
                        )}
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Batal
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalDeletePegawai;
