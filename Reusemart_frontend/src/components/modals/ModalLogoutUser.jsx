import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { LogOut } from "../../api/apiAuth";
import { useNavigate } from "react-router-dom";

const ModalLogoutUser = ({show, onClose }) => {
    const navigate = useNavigate();

    const [isPending, setIsPending] = useState(false);

    const Keluar = async () => {
        console.log("Keluar() dipanggil");
        setIsPending(true);
        try {
            const res = await LogOut();
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("id_pegawai");
            toast.success("Berhasil logout.");
            setTimeout(() => {
                navigate(0);
            }, 1000);
             
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsPending(false);
        }
    }



    return (
        <>
            {/* <Button onClick={handleShow} className="ms-auto me-3 border-0 btn-lg rounded-3 shadow-sm btnLogout">
                Keluar
            </Button> */}
            {/* <div style={{ padding: "8px", cursor: "pointer" }} onClick={handleShow}>
              Logout
            </div> */}

            <Modal size="md" show={show} onHide={onClose}>
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
                        type="button"
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

export default ModalLogoutUser;