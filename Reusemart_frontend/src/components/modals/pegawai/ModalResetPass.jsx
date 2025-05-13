import { Modal, Button, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { ResetPasswordPegawai } from '../../../api/apiAuth';

const ModalResetPass = ({ pegawai, onClose }) => {
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

    const handleResetPasswordPegawai = async (id) => {
        setIsPending(true);
        try {
          const response = await ResetPasswordPegawai(id);
          console.log(response);
          if (!response.sukses) throw new Error('Gagal reset password');
          toast.success('Password berhasil direset!');
          
        } catch (err) {
          setError(err.message);
          toast.error('Gagal reset password');
        } finally {
            setIsPending(false);
            handleClose();
        }
      }

    return (
        <>
            <Button variant="secondary" className="shadow-sm me-2" onClick={handleShow}>
                Reset Password?
            </Button>

            <Modal size="lg" show={show} onHide={handleClose} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Reset Password Pegawai</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="p-3">
                        <h5>Apakah Anda yakin ingin mereset password pegawai ini?</h5>
                        <h4 className="fw-bold">{pegawai.nama}</h4>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        variant="danger"
                        onClick={() => handleResetPasswordPegawai(pegawai.id_pegawai)}
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

export default ModalResetPass;
