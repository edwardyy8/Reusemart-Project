import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { useState } from "react";
import { toast } from "react-toastify";

import { LogOut } from "../../api/apiAuth";
import { useNavigate } from "react-router-dom";

const ModalLogout = () => {
    const navigate = useNavigate();

    const [show, setShow] = useState(false);

    const [isPending, setIsPending] = useState(false);

    const handleClose = () => {
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const Keluar = async () => {
        setIsPending(true);
        try {
            const res = await LogOut();
            sessionStorage.removeItem("token");
            toast.success("Berhasil logout.");
            setTimeout(() => {
                navigate(0);
            }, 600);
             
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <Button onClick={handleShow} className="ms-auto me-3 border-0 btn-lg rounded-3 shadow-sm btnLogout">
                Keluar
            </Button>

            <Modal size="md" show={show} onHide={handleClose}>
                <Modal.Header className="boxHijau" closeButton>
                <Modal.Title>Keluar Dari Akun</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <h5>Apakah Anda yakin ingin keluar dari akun ini?</h5>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="btnLogout border-0 btn-lg"
                        onClick={Keluar}
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
                            <span>Keluar</span>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalLogout;