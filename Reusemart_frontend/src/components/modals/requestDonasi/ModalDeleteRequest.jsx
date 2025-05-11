// ModalDeleteRequest.js
import React, { useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { DeleteRequest } from "../../../api/apiDonasi"; 

const ModalDeleteRequest = ({ show, requestId, onClose, onDeleteSuccess }) => {
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        setIsPending(true);  // Set loading untuk tombol
        try {
            await DeleteRequest(requestId);  // Menghapus request
            toast.success("Berhasil menghapus request donasi.");
            onDeleteSuccess(requestId);  // Memperbarui UI setelah penghapusan
            onClose();  // Menutup modal setelah berhasil
        } catch (error) {
            toast.error(error.message || "Gagal menghapus request donasi.");
        } finally {
            setIsPending(false);  // Menonaktifkan loading
        }
    };

    return (
        <Modal size="lg" show={show} onHide={onClose} centered>
            <Modal.Header className="boxHijau" closeButton>
                <Modal.Title className="ms-3">Tolak Request Donasi</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="p-3">
                    <h5>Apakah Anda yakin ingin menolak request donasi ini?</h5>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isPending} // Menonaktifkan tombol selama proses
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

                <Button variant="secondary" onClick={onClose}>
                    Batal
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDeleteRequest;
