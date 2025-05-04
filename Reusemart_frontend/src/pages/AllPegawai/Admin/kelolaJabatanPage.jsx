import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button, Table, Form, Pagination } from "react-bootstrap";
import { GetAllJabatan } from "../../../api/apiJabatan";  // API untuk mengambil data jabatan

import { FaSearch } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";

import ModalShowJabatan from "../../../components/modals/jabatan/ModalShowJabatan";
import ModalDeleteJabatan from "../../../components/modals/jabatan/ModalDeleteJabatan";

const KelolaJabatanPage = () => {
    const [jabatans, setJabatans] = useState([]);
    const [jumlah, setJumlah] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredJabatans, setFilteredJabatans] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const dataToDisplay = searchKeyword ? filteredJabatans : jabatans;

    const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
    const currentItems = dataToDisplay.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchAllJabatan = () => {
        setIsLoading(true);
        GetAllJabatan()
            .then((data) => {
                console.log(data);
                setJabatans(data.data);
                setJumlah(data.jumlah);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAllJabatan();
    }, []);

    const handleSearchChange = (e) => {
        e.preventDefault();

        setCurrentPage(1);
        const keyword = e.target.value;
        setSearchKeyword(keyword);
    
        const filtered = jabatans.filter((jabatan) =>
            jabatan.nama_jabatan.toLowerCase().includes(keyword.toLowerCase())
        );
    
        setFilteredJabatans(filtered);
    };

    const navigate = useNavigate();

    return (
        <>
            <Container className="p-0">
                <Container className="boxHijau p-3 rounded-3 mb-4 mt-4 ms-3" style={{ width: "13vw" }}>
                    <Row>
                        <Col >
                            <p>Jumlah </p>
                            <p>Jabatan </p>
                        </Col>
                        <Col className="text-center d-flex justify-content-center align-items-center">
                            <h3> {jumlah}</h3>
                        </Col>
                    </Row>
                </Container>

                <Container className="mb-5 ms-0 me-0">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <p className="" style={{fontSize: "2vw" }}>KELOLA JABATAN</p>
                        {/* Search bar */}
                        <Form className="d-flex mx-lg-3 my-2 my-lg-0 position-relative" style={{ minWidth: "300px" }} onSubmit={handleSearchChange} >
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
                                placeholder="Cari nama jabatan"
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

                    {jabatans.length === 0 && !isLoading ? (
                        <Alert variant="warning" className="text-center ">
                            <h5>Belum ada jabatan yang terdaftar</h5>
                        </Alert>
                    ) : (
                        isLoading ? (
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
                                            <th>Nama Jabatan</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((jabatan) => (
                                            <tr key={jabatan.id_jabatan}>
                                                <td>{jabatan.id_jabatan}</td>
                                                <td>{jabatan.nama_jabatan}</td>
                                                <td className="d-flex justify-content-center">
                                                    <ModalShowJabatan jabatan={jabatan}/>
                                                    <Button onClick={() => navigate(`/pegawai/Admin/kelolaJabatan/${jabatan.id_jabatan}`)} className="me-2"><FaRegPenToSquare size={20} /></Button>
                                                    <ModalDeleteJabatan jabatan={jabatan} onClose={fetchAllJabatan} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                {dataToDisplay.length > itemsPerPage && (
                                    <div className="d-flex justify-content-center mt-3">
                                        <Pagination>
                                            <Pagination.First 
                                            onClick={() => handlePageChange(1)} 
                                            disabled={currentPage === 1} 
                                            />
                                            <Pagination.Prev 
                                            onClick={() => handlePageChange(currentPage - 1)} 
                                            disabled={currentPage === 1} 
                                            />
                                            
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
                        )
                    )}

                    
                </Container>
            
            </Container>
                
        </>    
    );
};

export default KelolaJabatanPage;
