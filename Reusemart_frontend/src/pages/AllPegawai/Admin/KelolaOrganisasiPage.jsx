import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Button, Table, Form, Pagination } from "react-bootstrap";

import { GetAllOrganisasi } from "../../../api/apiOrganisasi";

import { FaSearch } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";

import ModalShowOrg from "../../../components/modals/organisasi/ModalShowOrg";
import ModalDeleteOrg from "../../../components/modals/organisasi/ModalDeleteOrg";

const KelolaOrganisasiPage = () => {
    const [organisasis, setOrganisasis] = useState([]);
    const [jumlahAktif, setJumlahAktif] = useState(0);
    const [jumlahNon, setJumlahNon] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredOrganisasis, setFilteredOrganisasis] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const dataToDisplay = searchKeyword ? filteredOrganisasis : organisasis;

    const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
    const currentItems = dataToDisplay.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchAllOrganisasi = () => {
        setIsLoading(true);
        GetAllOrganisasi()
            .then((data) => {
                console.log(data);
                setOrganisasis(data.data);
                setJumlahAktif(data.jumlah_aktif);
                setJumlahNon(data.jumlah_non);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAllOrganisasi();
    }, []);

    const handleSearchChange = (e) => {
        e.preventDefault();
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        setCurrentPage(1);

        const filtered = organisasis.filter((org) =>
            org.nama.toLowerCase().includes(keyword.toLowerCase()) ||
            org.id_organisasi.toLowerCase().includes(keyword.toLowerCase()) ||
            org.is_aktif.toLowerCase().includes(keyword.toLowerCase())

        );

        setFilteredOrganisasis(filtered);
    };

    const navigate = useNavigate();

    return (
        <Container className="p-0">
            <Container className="d-flex flex-col ms-0 w-50">
                <Container className="boxHijau p-3 rounded-3 mb-4 mt-4 ms-3" >
                    <Row>
                        <Col>
                            <p>Jumlah</p>
                            <p>Organisasi</p>
                            <p>Aktif</p>
                        </Col>
                        <Col className="text-center d-flex justify-content-center align-items-center">
                            <h3>{jumlahAktif}</h3>
                        </Col>
                    </Row>
                </Container>

                <Container className="bg-danger text-white p-3 rounded-3 mb-4 mt-4 ms-3">
                    <Row>
                        <Col>
                            <p>Jumlah</p>
                            <p>Organisasi</p>
                            <p>Non Aktif</p>
                        </Col>
                        <Col className="text-center d-flex justify-content-center align-items-center">
                            <h3>{jumlahNon}</h3>
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container className="mb-5 ms-0 me-0">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <p className="" style={{ fontSize: "2vw" }}>KELOLA ORGANISASI</p>

                    <Form className="d-flex mx-lg-3 my-2 my-lg-0 position-relative" style={{ minWidth: "300px" }} onSubmit={handleSearchChange}>
                        <Button
                            type="submit"
                            variant="link"
                            className="hijau position-absolute start-0 top-50 translate-middle-y bg-transparent border-0"
                            style={{
                                transform: 'translateY(-50%)',
                                padding: '0.375rem 0.75rem',
                                zIndex: 2
                            }}
                        >
                            <FaSearch />
                        </Button>
                        <Form.Control
                            type="search"
                            placeholder="Cari nama organisasi"
                            value={searchKeyword}
                            onChange={handleSearchChange}
                            className="ps-5"
                            aria-label="Search"
                            style={{
                                paddingLeft: '2.5rem',
                                borderColor: 'rgba(83, 83, 83, 1)',
                            }}
                        />
                    </Form>
                </div>

                {organisasis.length === 0 && !isLoading ? (
                    <Alert variant="warning" className="text-center">
                        <h5>Belum ada organisasi yang terdaftar</h5>
                    </Alert>
                ) : (
                    isLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="success" />
                            <p className="mb-0">Loading...</p>
                        </div>
                    ) : (
                        <>
                            <Table bordered hover>
                                <thead className="custom-table">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nama Organisasi</th>
                                        <th>Status Aktif</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((org) => (
                                        <tr key={org.id_organisasi}>
                                            <td>{org.id_organisasi}</td>
                                            <td>{org.nama}</td>
                                            <td>{org.is_aktif}</td>
                                            <td className="d-flex justify-content-center">
                                                <ModalShowOrg organisasi={org} />
                                                {org.is_aktif === "Ya" && (
                                                    <>
                                                        <Button onClick={() => navigate(`/pegawai/Admin/kelolaOrganisasi/${org.id_organisasi}`)} className="me-2">
                                                            <FaRegPenToSquare size={20} />
                                                        </Button>
                                                        <ModalDeleteOrg organisasi={org} onClose={fetchAllOrganisasi} />
                                                    </>
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

                                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )
                )}
            </Container>
        </Container>
    );
};

export default KelolaOrganisasiPage;
