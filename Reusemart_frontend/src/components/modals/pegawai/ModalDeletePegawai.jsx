import { Modal, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeletePegawai } from "../../../api/apiPegawai"; // pastikan path-nya sesuai

const ModalDeletePegawai = ({ pegawai, onClose }) => {
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
            await DeletePegawai(pegawai.id_pegawai);
            toast.success("Berhasil menghapus pegawai.");
            handleClose();
        } catch (error) {
            toast.error(error.message || "Gagal menghapus pegawai.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <Button variant="danger" className="shadow-sm" onClick={handleShow}>
                <FaTrash size={20} />
            </Button>

            <Modal size="lg" show={show} onHide={handleClose} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Hapus Data Pegawai</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="p-3">
                        <h5>Apakah Anda yakin ingin menghapus pegawai ini?</h5>
                        <h4 className="fw-bold">{pegawai.nama}</h4>
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
};

export default ModalDeletePegawai;
