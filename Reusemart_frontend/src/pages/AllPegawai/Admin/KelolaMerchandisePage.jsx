import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Button, Table, Form, Pagination } from "react-bootstrap";
import { GetAllMerchandiseCS } from "../../../api/apiMerchandise";
import { FaSearch } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";

import ModalShowMerchandise from "../../../components/modals/merchandise/ModalShowMerchandise";
import ModalDeleteMerchandise from "../../../components/modals/merchandise/ModalDeleteMerchandise";

const KelolaMerchandisePage = () => {
    const [merchandises, setMerchandises] = useState([]);
    const [jumlah, setJumlah] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredMerchandises, setFilteredMerchandises] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const dataToDisplay = searchKeyword ? filteredMerchandises : merchandises;
    const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
    const currentItems = dataToDisplay.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchAllMerchandise = () => {
        setIsLoading(true);
        GetAllMerchandiseCS()
            .then((data) => {
                setMerchandises(data.data);
                setJumlah(data.jumlah);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAllMerchandise();
    }, []);

    const handleSearchChange = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        const filtered = merchandises.filter((merchandise) =>
            merchandise.nama_merchandise.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredMerchandises(filtered);
    };

    const navigate = useNavigate();

    return (
        <Container className="p-0">
            <Container className="boxHijau p-3 rounded-3 mb-4 mt-4 ms-3" style={{ width: "13vw" }}>
                <Row>
                    <Col>
                        <p>Jumlah</p>
                        <p>Merchandise</p>
                    </Col>
                    <Col className="text-center d-flex justify-content-center align-items-center">
                        <h3>{jumlah}</h3>
                    </Col>
                </Row>
            </Container>

            <Container className="mb-5 ms-0 me-0">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <p style={{ fontSize: "2vw" }}>KELOLA MERCHANDISE</p>
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

                {merchandises.length === 0 && !isLoading ? (
                    <Alert variant="warning" className="text-center">
                        <h5>Belum ada merchandise yang terdaftar</h5>
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
                                    <th>ID</th>
                                    <th>Foto Merchandise</th>
                                    <th>Nama Merchandise</th>
                                    <th>Stok</th>
                                    <th>Poin</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((merchandise) => (
                                    <tr key={merchandise.id_merchandise}>
                                        <td>{merchandise.id_merchandise}</td>
                                        <td>{merchandise.foto_merchandise ? (
                                                <img
                                                    src={`http://127.0.0.1:8000/storage/foto_barang/${merchandise.foto_merchandise}`}
                                                    alt={merchandise.nama_merchandise}
                                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                "Tidak ada foto"
                                            )}</td>
                                        <td>{merchandise.nama_merchandise}</td>
                                        <td>{merchandise.stok_merchandise}</td>
                                        <td>{merchandise.poin_merchandise}</td>
                                        <td className="d-flex justify-content-center">
                                            <ModalShowMerchandise merchandise={merchandise} />
                                            <Button onClick={() => navigate(`/pegawai/Admin/kelolaMerchandise/${merchandise.id_merchandise}`)} className="me-2">
                                                <FaRegPenToSquare size={20} />
                                            </Button>
                                            <ModalDeleteMerchandise merchandise={merchandise} onClose={fetchAllMerchandise} />
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
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </Container>
        </Container>
    );
};

export default KelolaMerchandisePage;