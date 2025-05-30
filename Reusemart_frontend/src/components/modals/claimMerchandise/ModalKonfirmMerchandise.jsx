import { Modal, Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import { ConfirmClaimMerchandise } from "../../../api/apiMerchandise";
import { toast } from "react-toastify";

const ModalKonfirmClaim = ({ show, claimId, onClose, onConfirmSuccess }) => {
    const [isPending, setIsPending] = useState(false);

    const handleConfirm = async () => {
        setIsPending(true);
        try {
            const response = await ConfirmClaimMerchandise(claimId);
            onConfirmSuccess(claimId, response.data); // Teruskan data claim dari response
            toast.success("Claim merchandise berhasil dikonfirmasi.");
            onClose();
        } catch (error) {
            toast.error(error.message || "Gagal mengonfirmasi claim merchandise.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Modal size="lg" show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Konfirmasi Claim Merchandise</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="p-3">
                    <h5>Apakah Anda yakin ingin mengonfirmasi claim merchandise ini?</h5>
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

export default ModalKonfirmClaim;