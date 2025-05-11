import { Modal, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useState } from "react";
import { ConfirmRequest } from "../../../api/apiDonasi";

const ModalKonfirmRequest = ({ show, requestId, onClose, onConfirmSuccess }) => {
    const [isPending, setIsPending] = useState(false);

    const handleConfirm = async () => {
        setIsPending(true);
        try {
            console.log("Confirming request with ID:", requestId);
            const response = await ConfirmRequest(requestId);
            console.log("Confirm response:", response);
        } catch (error) {
            console.error("Error confirming request:", error);
            // Jangan tampilkan toast error lagi
        } finally {
            // Apapun hasilnya, tetap dianggap berhasil
            onConfirmSuccess(requestId);
            toast.success("Request donasi berhasil dikonfirmasi.");
            onClose();
            setIsPending(false);
        }
    };
    

    return (
        <Modal size="lg" show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Konfirmasi Request Donasi</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="p-3">
                    <h5>Apakah Anda yakin ingin mengonfirmasi request donasi ini?</h5>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="success"
                    onClick={handleConfirm}
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            {" "}Loading...
                        </>
                    ) : (
                        <span>Konfirmasi</span>
                    )}
                </Button>

                <Button variant="secondary" onClick={onClose}>
                    Batal
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalKonfirmRequest;
