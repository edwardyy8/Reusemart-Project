import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button, Table, Form, Pagination } from "react-bootstrap";

import { GetAllOrganisasi } from "../../../api/apiOrganisasi";

import reusemart from "../../../assets/images/titlereuse.png";

import { FaSearch } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";

import ModalShowOrg from "../../../components/modals/organisasi/ModalShowOrg";
import ModalDeleteOrg from "../../../components/modals/organisasi/ModalDeleteOrg";


const KelolaOrganisasiPage = () => {
    const [organisasis, setOrganisasis] = useState([]);
    const [jumlah, setJumlah] = useState(0);
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
                setJumlah(data.jumlah);
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

        setCurrentPage(1);
        const keyword = e.target.value;
        setSearchKeyword(keyword);
    
        const filtered = organisasis.filter((org) =>
            org.nama.toLowerCase().includes(keyword.toLowerCase())
        );
    
        setFilteredOrganisasis(filtered);
    };

    const navigate = useNavigate();
    
    return (
        <>  
            <Container className="boxHijau p-4 rounded-3 mb-4 mt-5 ms-5" style={{ width: "18vw" }}>
                <Row>
                    <Col >
                        <h3 style={{fontSize: "2vw"}}>Jumlah </h3>
                        <h3 style={{fontSize: "2vw"}}>Organisasi </h3>
                    </Col>
                    <Col className="text-center d-flex justify-content-center align-items-center">
                        <h1 style={{fontSize: "3vw"}}> {jumlah}</h1>
                    </Col>
                </Row>
            </Container>

            <Container className=" ps-5">

                <Container className="mb-5 ms-0 me-0">
                    <div className="mb-3 d-flex justify-content-between align-items-center">
                        <p className="" style={{fontSize: "2vw" }}>KELOLA ORGANISASI</p>
                        {/* Search barnya */}
                        <Form className="d-flex mx-lg-3 my-2 my-lg-0 position-relative" style={{ minWidth: "300px" }} onSubmit={(e) => e.preventDefault()} >
                            <Button
                                type="submit"
                                variant="link"
                                className="hijau position-absolute start-0 top-50 translate-middle-y bg-transparent border-0"
                                style={{
                                    transform: 'translateY(-50%)',
                                    padding: '0.375rem 0.75rem',
                                    zIndex: 2
                                }}
                                onClick={(e) => e.preventDefault()}
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
                        <Alert variant="warning" className="text-center ">
                            <h5>Belum ada organisasi yang terdaftar</h5>
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
                                            <th>Nama Organisasi</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.length > 0 ? (
                                            currentItems.map((organisasi) => (
                                                <tr key={organisasi.id_organisasi}>
                                                    <td>{organisasi.id_organisasi}</td>
                                                    <td>{organisasi.nama}</td>
                                                    <td className="d-flex justify-content-center" >
                                                        <ModalShowOrg organisasi={organisasi}/>
                                                        <Button onClick={() => navigate(`/pegawai/Admin/kelolaOrganisasi/${organisasi.id_organisasi}`)} className="me-2"><FaRegPenToSquare size={20} /></Button>
                                                        <ModalDeleteOrg organisasi={organisasi} onClose={fetchAllOrganisasi} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="text-center">
                                                <td colSpan={3} >
                                                    <Alert variant="warning" className="text-center mb-0">
                                                        <h5 className="mb-0">Data Pencarian Tidak Ditemukan</h5>
                                                    </Alert>
                                                </td>
                                            </tr>
                                        )}
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

export default KelolaOrganisasiPage;