import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const ModalPesananSukses = ({ show, handleClose, noPemesanan }) => {
    const navigate = useNavigate();

    if (!show) return null;

    return (
        <div className="overlay">
        <div className="custom-modal-pemesanan-sukses">
            <div className="icon-container">
            <div className="checkmark">&#10004;</div>
            </div>
            <div className="modal-content">
            <h4 className="titlesukses">PESANAN BERHASIL DIBUAT</h4>
            <p className="transaksi">Nomor Pemesanan : <strong>{noPemesanan}</strong></p>
            <hr />
            <p className="deskripsisukses">
                Terima kasih atas pesanan Anda! Silahkan lanjutkan pembayaran untuk menyelesaikan transaksi di halaman selanjutnya.
                <br />
            </p>
            <Button className="btnHijau rounded-pill" onClick={() => navigate(`/pembeli/transferBukti/${noPemesanan}`)}>OK</Button>
            </div>
        </div>
        </div>
    );
}

export default ModalPesananSukses;
