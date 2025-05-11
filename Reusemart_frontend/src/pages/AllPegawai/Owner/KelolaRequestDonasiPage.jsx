import { useEffect, useState } from "react";
import { Alert, Button, Container, Row, Spinner, Table, Pagination, Col } from "react-bootstrap";
import { FaTrash, FaCheck } from "react-icons/fa";
import ModalDeleteRequest from "../../../components/modals/requestDonasi/ModalDeleteRequest";
import ModalKonfirmRequest from "../../../components/modals/requestDonasi/ModalKonfirmRequest";
import { toast } from "react-toastify";
import { GetAllRequestDonasis } from "../../../api/apiDonasi";

const KelolaRequestDonasi = () => {
    const [requestDonasis, setRequestDonasis] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [requestIdToDelete, setRequestIdToDelete] = useState(null);
    const [requestIdToConfirm, setRequestIdToConfirm] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchRequestDonasis();
    }, []);

    const fetchRequestDonasis = () => {
        setIsLoading(true);
        GetAllRequestDonasis()
            .then((data) => {
                setRequestDonasis(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("Error fetching data:", err);
                setIsLoading(false);
            });
    };

    const handlePageChange = (page) => setCurrentPage(page);

    const handleShowModal = (id) => {
        setRequestIdToDelete(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setRequestIdToDelete(null);
    };

    const handleShowConfirmModal = (id) => {
        setRequestIdToConfirm(id);
        setShowConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setShowConfirmModal(false);
        setRequestIdToConfirm(null);
    };

    const handleDeleteRequestSuccess = (id) => {
        setRequestDonasis((prevRequests) =>
            prevRequests.filter((request) => request.id_request !== id)
        );
    };

    const handleConfirmRequest = (id) => {
        setRequestDonasis((prevRequests) =>
            prevRequests.map((request) =>
                request.id_request === id
                    ? { ...request, tanggal_approve: new Date().toISOString().split("T")[0] }
                    : request
            )
        );
    };

    const acceptedRequests = requestDonasis.filter(
        (request) => request.tanggal_approve !== null && request.tanggal_approve !== ""
    ).length;

    const pendingRequests = requestDonasis.filter(
        (request) => request.tanggal_approve === null || request.tanggal_approve === ""
    ).length;

    const filteredRequests = requestDonasis.filter(
        (request) => request.tanggal_approve === null || request.tanggal_approve === ""
    );

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const currentItems = filteredRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Container fluid className="p-0">
            <Row className="align-items-start ms-3">
                <Col style={{ minWidth: "200px", maxWidth: "200px", minHeight: "120px", maxHeight: "120px" }}>
                    <Container className="p-3 rounded-3 mb-4 mt-4 boxHijau" style={{ height: "100%", color: "white" }}>
                        <Row className="d-flex justify-content-center align-items-center h-100">
                            <Col>
                                <p className="mb-1">Pending Request</p>
                                <h3>{pendingRequests}</h3>
                            </Col>
                        </Row>
                    </Container>
                </Col>

                <Col style={{ minWidth: "200px", maxWidth: "200px", minHeight: "120px", maxHeight: "120px" }}>
                    <Container
                        className="p-3 rounded-3 mb-4 mt-4"
                        style={{ backgroundColor: "#2B74F8", border: "1px solid #2B74F8", height: "100%", color: "white" }}
                    >
                        <Row className="d-flex justify-content-center align-items-center h-100">
                            <Col>
                                <p className="mb-1">Request Diterima</p>
                                <h3>{acceptedRequests}</h3>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>

            <Container className="mb-5 mt-3 ms-0 me-0">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <p style={{ fontSize: "2vw" }}>HISTORY REQUEST DONASI</p>
                </div>

                {filteredRequests.length === 0 && !isLoading ? (
                    <Alert variant="warning" className="text-center">
                        <h5>Tidak ada request donasi yang menunggu konfirmasi</h5>
                    </Alert>
                ) : isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="success" size="lg" />
                        <p className="mb-0">Loading...</p>
                    </div>
                ) : (
                    <Table bordered hover responsive>
                        <thead className="custom-table">
                            <tr>
                                <th>ID Request</th>
                                <th>Nama Organisasi</th>
                                <th>Isi Request</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((request) => (
                                <tr key={request.id_request}>
                                    <td>{request.id_request}</td>
                                    <td>{request.organisasi ? request.organisasi.nama : "Tidak Diketahui"}</td>
                                    <td>{request.isi_request}</td>
                                    <td>
                                        <Button variant="danger" onClick={() => handleShowModal(request.id_request)}>
                                            <FaTrash size={20} />
                                        </Button>
                                        <Button
                                            variant="success"
                                            onClick={() => handleShowConfirmModal(request.id_request)}
                                            className="ms-2"
                                            style={{ backgroundColor: "#2B74F8", borderColor: "#2B74F8" }}
                                        >
                                            <FaCheck size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <Pagination.Item key={p} active={p === currentPage} onClick={() => handlePageChange(p)}>
                                    {p}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                )}
            </Container>

            <ModalDeleteRequest
                show={showModal}
                requestId={requestIdToDelete}
                onClose={handleCloseModal}
                onDeleteSuccess={handleDeleteRequestSuccess}
            />

            <ModalKonfirmRequest
                show={showConfirmModal}
                requestId={requestIdToConfirm}
                onClose={handleCloseConfirmModal}
                onConfirmSuccess={handleConfirmRequest}
            />
        </Container>
    );
};

export default KelolaRequestDonasi;
