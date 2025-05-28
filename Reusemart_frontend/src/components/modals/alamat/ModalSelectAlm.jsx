import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const ModalSelectAlm = ({ alamat }) => { 
    const [show, setShow] = useState(false);

    const [isPending, setIsPending] = useState(false);

    const navigate = useNavigate();

    const handleClose = () => {
        setShow(false);
    };

    const handleBatal = () => {
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const handlePilihAlamat = (alm) => {
        navigate(`/pembeli/checkout/`, {state: { alamat: alm }});
    };

    return (
        <>
            <Button className="w-0 ms-2 btnHijau" onClick={handleShow}> 
                Pilih Alamat
            </Button>

            <Modal size="lg" show={show} onHide={handleBatal} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Pilih Data Alamat</Modal.Title>
                </Modal.Header>
                
                <Modal.Body >
                    <div className="p-3">
                       <h5>Apakah Anda yakin ingin memilih data alamat ini?</h5>
                       <h4 className="fw-bold">{alamat.nama_penerima}  <span className="h5 text-muted">({alamat.label_alamat})</span></h4>
                       <h5 className="mb-0 text-muted">{alamat.no_hp}</h5>
                       <h5 className="text-muted">{alamat.nama_alamat}</h5>
                    </div>
                   
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        className="btnHijau"
                        onClick={() => handlePilihAlamat(alamat)}
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

export default ModalSelectAlm;