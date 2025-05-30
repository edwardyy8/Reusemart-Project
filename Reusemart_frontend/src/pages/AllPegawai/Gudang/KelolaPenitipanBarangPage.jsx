import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner, Table, Form, Pagination, Button } from "react-bootstrap";
import { GetAllPenitipanBarang } from "../../../api/apiBarang"; // Updated import to match previous API file
import { FaSearch } from "react-icons/fa";
import { parseISO, addDays, format } from 'date-fns';
import ModalShowPenitipan from "../../../components/modals/penitipan/ModalShowPenitipan";
import { useNavigate } from 'react-router-dom';
import { FaRegPenToSquare } from "react-icons/fa6";

const KelolaPenitipanBarangPage = () => {
    const [barangs, setBarangs] = useState([]);
    const [jumlah, setJumlah] = useState(0);
    const [barangTerjual, setBarangTerjual] = useState(0);
    const [barangTersedia, setBarangTersedia] = useState(0);
    const [barangTerdonasikan, setBarangTerdonasikan] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filteredBarangs, setFilteredBarangs] = useState([]);
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const dataToDisplay = searchKeyword ? filteredBarangs : barangs;

    const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
    const currentItems = dataToDisplay.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchAllPenitipanBarang = () => {
        setIsLoading(true);
        GetAllPenitipanBarang()
            .then((data) => {
                setBarangs(data.data);
                setJumlah(data.data.length);
                setBarangTersedia(data.data.filter(barang => barang.status_barang === "Tersedia").length);
                setBarangTerjual(data.data.filter(barang => barang.status_barang === "Terjual").length);
                setBarangTerdonasikan(data.data.filter(barang => barang.status_barang === "Didonasikan").length);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAllPenitipanBarang();
    }, []);

    const handleSearchChange = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        const keyword = e.target.value;
        setSearchKeyword(keyword);

        const filtered = barangs.filter((barang) => {
            const nama = barang.nama_barang ? barang.nama_barang.toLowerCase() : "";
            const status = barang.status_barang ? barang.status_barang.toLowerCase() : "";
            const id = barang.id_barang ? barang.id_barang.toLowerCase() : "";
            return (
                nama.includes(keyword.toLowerCase()) ||
                status.includes(keyword.toLowerCase()) ||
                id.includes(keyword.toLowerCase())
            );
        });

        setFilteredBarangs(filtered);
    };

    return (
        <Container className="p-0">
            <Container className="p-0 m-2">
                <Row className="d-flex mb-4 flex-wrap">
                    <Col
                        xs={12}
                        sm={6}
                        md={3}
                        lg={1}
                        className="boxHijau p-3 rounded-3 text-center m-3"
                        style={{ minHeight: '100px', minWidth: '180px' }}
                    >
                        <Row>
                            <Col>
                                <p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah</p>
                                <p className="mb-0" style={{ fontSize: '1rem' }}>Total Barang</p>
                            </Col>
                            <Col className="d-flex justify-content-center align-items-center">
                                <h3>{jumlah}</h3>
                            </Col>
                        </Row>
                    </Col>

                    <Col
                        xs={12}
                        sm={6}
                        md={3}
                        lg={1}
                        className="boxHijau p-3 rounded-3 text-center m-3"
                        style={{ minHeight: '100px', minWidth: '180px' }}
                    >
                        <Row>
                            <Col>
                                <p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah</p>
                                <p className="mb-0" style={{ fontSize: '1rem' }}>Barang Tersedia</p>
                            </Col>
                            <Col className="d-flex justify-content-center align-items-center">
                                <h3>{barangTersedia}</h3>
                            </Col>
                        </Row>
                    </Col>

                    <Col
                        xs={12}
                        sm={6}
                        md={3}
                        lg={1}
                        className="p-3 rounded-3 text-center m-3"
                        style={{ minHeight: '100px', minWidth: '180px', backgroundColor: '#2B74F8', color: 'white' }}
                    >
                        <Row>
                            <Col>
                                <p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah</p>
                                <p className="mb-0" style={{ fontSize: '1rem' }}>Barang Terjual</p>
                            </Col>
                            <Col className="d-flex justify-content-center align-items-center">
                                <h3>{barangTerjual}</h3>
                            </Col>
                        </Row>
                    </Col>

                    <Col
                        xs={12}
                        sm={6}
                        md={3}
                        lg={1}
                        className="p-3 rounded-3 text-center m-3"
                        style={{ minHeight: '100px', minWidth: '180px', backgroundColor: '#FF5959', color: 'white' }}
                    >
                        <Row>
                            <Col>
                                <p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah</p>
                                <p className="mb-0" style={{ fontSize: '1rem' }}>Barang Terdonasikan</p>
                            </Col>
                            <Col className="d-flex justify-content-center align-items-center">
                                <h3>{barangTerdonasikan}</h3>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>


            <Container className="mb-5 ms-0 me-0">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <p style={{ fontSize: "2vw" }}>KELOLA PENITIPAN BARANG</p>
                    <Form className="d-flex align-items-center mx-lg-3 my-2 my-lg-0" style={{ minWidth: "350px" }} onSubmit={handleSearchChange}>
                        <div style={{ position: 'relative', flexGrow: 1 }}>
                            <FaSearch
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '10px',
                                    transform: 'translateY(-50%)',
                                    color: '#0f5132',
                                    pointerEvents: 'none',
                                    fontSize: '1rem',
                                }}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Cari Barang..."
                                value={searchKeyword}
                                onChange={handleSearchChange}
                                style={{ paddingLeft: '35px' }} // kasih space kiri supaya tulisan nggak ketutupan icon
                            />
                        </div>

                        <Button
                            className="border-0 ms-3"
                            style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
                            onClick={() => navigate("/pegawai/Gudang/kelolaPenitipanBarang/tambahPenitipanBarang")}
                        >
                            Tambah Barang
                        </Button>
                    </Form>

                </div>

                {barangs.length === 0 && !isLoading ? (
                    <Alert variant="warning" className="text-center">
                        <h5>Belum ada barang yang terdaftar</h5>
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
                                    <th>Foto Barang</th>
                                    <th>ID Barang</th>
                                    <th>Kategori Barang</th>
                                    <th>Nama Barang</th>
                                    <th>Nama Penitip</th>
                                    <th>Tanggal Masuk</th>
                                    <th>Masa Penitipan</th> {/* <- ini harus hasil tanggal_masuk + 30 */}
                                    <th>Status Barang</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((barang) => (
                                    <tr key={barang.id_barang}>
                                        <td>
                                            {barang.foto_barang ? (
                                                <img
                                                    src={`http://127.0.0.1:8000/storage/foto_barang/${barang.foto_barang}`}
                                                    alt={barang.nama_barang}
                                                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                'No Image'
                                            )}
                                        </td>
                                        <td>{barang.id_barang}</td>
                                        <td>{barang.kategori?.nama_kategori}</td>
                                        <td>{barang.nama_barang}</td>
                                        <td>{barang.penitip?.nama}</td>
                                        <td>{barang.tanggal_masuk}</td>
                                        <td>
                                            {barang.tanggal_masuk
                                                ? format(
                                                    addDays(parseISO(barang.tanggal_masuk), 30),
                                                    'yyyy-MM-dd'
                                                )
                                                : '-'}
                                        </td>
                                        <td>{barang.status_barang}</td>
                                        <td className="d-flex flex-column gap-2">
                                            <ModalShowPenitipan barang={barang} />
                                            <Button
                                                onClick={() => navigate(`/pegawai/Gudang/kelolaPenitipanBarang/${barang.id_barang}`)}
                                                className="me-2"
                                                style={{ border: "none" }}
                                            >
                                                <FaRegPenToSquare size={20} />
                                            </Button>
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
                )}
            </Container>
        </Container>
    );
};

export default KelolaPenitipanBarangPage;