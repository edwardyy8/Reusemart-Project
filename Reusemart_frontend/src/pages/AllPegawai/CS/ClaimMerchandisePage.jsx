import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Button, Table, Form, Pagination } from "react-bootstrap";
import { GetAllClaimMerchandise } from "../../../api/apiMerchandise";
import { FaSearch, FaCheck } from "react-icons/fa";
import ModalKonfirmClaim from "../../../components/modals/claimMerchandise/ModalKonfirmMerchandise";

const KelolaClaimMerchandisePage = () => {
    const [claims, setClaims] = useState([]);
    const [jumlah, setJumlah] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredClaims, setFilteredClaims] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedClaimId, setSelectedClaimId] = useState(null);
    const itemsPerPage = 10;

    const dataToDisplay = searchKeyword ? filteredClaims : claims;
    const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
    const currentItems = dataToDisplay.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchAllClaims = () => {
        setIsLoading(true);
        GetAllClaimMerchandise()
            .then((data) => {
                setClaims(data);
                setJumlah(data.length);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAllClaims();
    }, []);

    const handleSearchChange = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        const filtered = claims.filter((claim) =>
            claim.merchandise.nama_merchandise.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredClaims(filtered);
    };

    const handleConfirmSuccess = (claimId, updatedClaim) => {
        setClaims(claims.map(claim =>
            claim.id_claim === claimId ? updatedClaim : claim
        ));
        setFilteredClaims(filteredClaims.map(claim =>
            claim.id_claim === claimId ? updatedClaim : claim
        ));
    };

    const handleShowModal = (claimId) => {
        setSelectedClaimId(claimId);
        setShowModal(true);
    };

    const navigate = useNavigate();

    return (
        <Container className="p-0">
            <Container className="boxHijau p-3 rounded-3 mb-4 mt-4 ms-3" style={{ width: "13vw" }}>
                <Row>
                    <Col>
                        <p>Jumlah</p>
                        <p>Claim</p>
                    </Col>
                    <Col className="text-center d-flex justify-content-center align-items-center">
                        <h3>{jumlah}</h3>
                    </Col>
                </Row>
            </Container>

            <Container className="mb-5 ms-0 me-0">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <p style={{ fontSize: "2vw" }}>KELOLA CLAIM MERCHANDISE</p>
                    <Form className="d-flex mx-lg-3 my-2 my-lg-0 position-relative" style={{ minWidth: "300px" }} onSubmit={handleSearchChange}>
                        <Button
                            type="submit"
                            variant="link"
                            className="hijau position-absolute start-0 top-50 translate-middle-y bg-transparent border-0"
                            style={{ transform: 'translateY(-50%)', padding: '0.375rem 0.75rem', zIndex: 2 }}
                        >
                            <FaSearch />
                        </Button>
                        <Form.Control
                            type="search"
                            placeholder="Cari nama merchandise"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                            className="ps-5"
                            aria-label="Search"
                            style={{ paddingLeft: '2.5rem', borderColor: 'rgba(83, 83, 83, 1)' }}
                        />
                    </Form>
                </div>

                {claims.length === 0 && !isLoading ? (
                    <Alert variant="warning" className="text-center">
                        <h5>Belum ada claim merchandise yang terdaftar</h5>
                    </Alert>
                ) : isLoading ? (
                    <div className="text-center">
                        <Spinner
                            as="span"
                            animation="border"
                            variant="success"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
                        <p className="mb-0">Loading...</p>
                    </div>
                ) : (
                    <>
                        <Table bordered hover>
                            <thead className="custom-table">
                                <tr>
                                    <th>ID Claim</th>
                                    <th>Nama Merchandise</th>
                                    <th>Pembeli</th>
                                    <th>Tanggal Claim</th>
                                    <th>Pegawai</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((claim) => (
                                    <tr key={claim.id_claim}>
                                        <td>{claim.id_claim}</td>
                                        <td>{claim.merchandise?.nama_merchandise}</td>
                                        <td>{claim.pembeli?.nama}</td>
                                        <td>{claim.tanggal_claim || "Belum ada data"}</td>
                                        <td>{claim.pegawai?.nama || "Belum ada data"}</td>
                                        <td>
                                            {claim.pegawai?.nama ? (
                                                "Sudah dikonfirmasi"
                                            ) : (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleShowModal(claim.id_claim)}
                                                >
                                                    <FaCheck />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {dataToDisplay.length > itemsPerPage && (
                            <div className="d-flex justify-content-center mt-3">
                                <Pagination>
                                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <Pagination.Item
                                                key={pageNum}
                                                active={pageNum === currentPage}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </Pagination.Item>
                                        );
                                    })}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    />
                                    <Pagination.Last
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </Container>

            <ModalKonfirmClaim
                show={showModal}
                claimId={selectedClaimId}
                onClose={() => setShowModal(false)}
                onConfirmSuccess={handleConfirmSuccess}
            />
        </Container>
    );
};

export default KelolaClaimMerchandisePage;