import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button, Table, Form } from "react-bootstrap";

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
                                onClick={() => handleSearchChange}
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
                            
                            <Table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nama Organisasi</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(filteredOrganisasis.length > 0 || searchKeyword !== "" ? filteredOrganisasis : organisasis).map((organisasi) => (
                                        <tr key={organisasi.id_organisasi}>
                                            <td>{organisasi.id_organisasi}</td>
                                            <td>{organisasi.nama}</td>
                                            <td className="d-flex justify-content-center" >
                                                <ModalShowOrg organisasi={organisasi}/>
                                                <Button onClick={() => navigate(`/pegawai/Admin/kelolaOrganisasi/${organisasi.id_organisasi}`)} className="me-2"><FaRegPenToSquare size={20} /></Button>
                                                <ModalDeleteOrg organisasi={organisasi} onClose={fetchAllOrganisasi} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )
                    )}

                    
                </Container>
            
            </Container>
                
        </>    
    );
};

export default KelolaOrganisasiPage;

