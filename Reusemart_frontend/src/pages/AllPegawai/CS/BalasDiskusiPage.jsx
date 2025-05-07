import { useEffect, useState } from "react";
import { Container, Button, Card, Row, Col, Form, Modal, Pagination, Alert, Spinner } from "react-bootstrap";
import { FaEye} from "react-icons/fa";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { useNavigate, Outlet } from "react-router-dom";
import { GetAllDiskusiKecualiCS, TambahDiskusi, GetDiskusiByIdBarang } from "../../../api/apiDiskusi"; 

import reusemart from "../../../assets/images/titlereuse.png";
import logo from "../../../assets/images/logoreuse.png";
import { toast } from "react-toastify";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa6";


const BalasDiskusiPage = () => {
  const [diskusiList, setDiskusiList] = useState([]);
  const [diskusiListByBarang, setDiskusiListByBarang] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBarang, setIsLoadingBarang] = useState(false);
  
  const [showAdd, setShowAdd] = useState(false);

  const [selectedDiskusi, setSelectedDiskusi] = useState(null);

  const [diskusiInput, setDiskusiInput] = useState({
    komentar: "",
    id_barang: "",
    id_pegawai: "",
  });

  const handleChange = (event) => {
    setDiskusiInput({ ...diskusiInput, [event.target.name]: event.target.value });
  };

  const submitDiskusi = (event) => {
    event.preventDefault();
    diskusiInput.id_barang = selectedDiskusi.id_barang;
    TambahDiskusi(diskusiInput)
      .then((res) => {    
        toast.success(res.message); 
        fetchDiskusiByIdBarang(selectedDiskusi.id_barang);
        setDiskusiInput({ komentar: "", id_barang: "", id_pegawai: "" });
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAllDiskusi = () => {
    setIsLoading(true);
    GetAllDiskusiKecualiCS()
      .then((data) => {
        console.log(data);
        setDiskusiList(data.data);
        setIsLoading(false);
          
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
        setIsLoading(false);
      });
  };

  const fetchDiskusiByIdBarang = (id_barang) => {
    setIsLoadingBarang(true);
    GetDiskusiByIdBarang(id_barang)
      .then((data) => {
        console.log(data);
        setDiskusiListByBarang(data.data);
        setIsLoadingBarang(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
        setIsLoadingBarang(false);
      });
  };
  
  useEffect(() => {
    fetchAllDiskusi();
  }, []);

  useEffect(() => {
    fetchDiskusiByIdBarang(selectedDiskusi?.id_barang);
  }, [selectedDiskusi]);

  const jumlahDiskusiHariIni = diskusiList.filter((d) => {
    const today = new Date();
    const diskusiDate = new Date(d.tanggal_diskusi);
    return (
      diskusiDate.getDate() === today.getDate() &&
      diskusiDate.getMonth() === today.getMonth() &&
      diskusiDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const totalPages = Math.ceil(diskusiList.length / itemsPerPage);
  const currentItems = diskusiList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDateAja = (tanggal) => {
    const date = new Date(tanggal);
    const tahun = date.getFullYear();
    const bulan = String(date.getMonth() + 1).padStart(2, '0');
    const hari = String(date.getDate()).padStart(2, '0');
    return `${tahun}-${bulan}-${hari}`;
  };


  return (
    <Container className="mt-5">
      <Row className="mb-4 d-flex gap-2">
        <Col md={3}>
          <Card style={{backgroundColor:"rgba(4, 121, 2, 1"}} text="white">
            <Card.Body>
              <Card.Title>Total Diskusi Pembeli</Card.Title>
              <h3>{diskusiList.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="primary" text="white">
            <Card.Body>
              <Card.Title className="d-flex flex-column">Total Diskusi Pembeli Hari Ini</Card.Title>
              <h3>{jumlahDiskusiHariIni}</h3>
            </Card.Body>
          </Card>
        </Col>
            
      </Row>
      
      <div className="border rounded p-4 bg-white">
        <h2 className="hijau mb-3 borderHijauBwh">List Diskusi</h2>
        {!isLoading ? (
          <>
            {currentItems.length > 0 ? (
              currentItems.map((diskusi, index) => (
                <div key={index} className="border bg-light rounded p-2 mb-3 d-flex flex-column px-3" onClick={() => { setSelectedDiskusi(diskusi); setShowAdd(true); }}>
                  <h5>Barang: {diskusi.barang.nama_barang}</h5>
                  <div className="border-bottom border-dark mb-1"></div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <img
                      src={`http://127.0.0.1:8000/storage/foto_profile/${diskusi.foto_profile_pembeli}`}
                      alt="icon user"
                      width={35}
                      height={35}
                      className="me-2 border rounded-circle"
                    />
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <div>
                        <strong>
                          {diskusi.nama_pembeli || diskusi.nama_pegawai}  
                        </strong> 
                        <p className="mb-0">{diskusi.komentar}</p>
                      </div>
                      <div>
                        <p className="text-muted mb-0">{formatDateAja(diskusi.tanggal_diskusi)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Alert variant="light" className="text-center mb-0">
                <p className="text-center mb-0">Belum ada diskusi user.</p>
              </Alert>       
            )}
          </>
        ) : (
          <div className="text-center my-5 pt-5" style={{ marginTop: "5rem" }}>
            <Spinner animation="border" variant="success" />
            <p>Loading Diskusi...</p>
          </div>
        )}
      </div>

      {diskusiList.length > itemsPerPage && (
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

      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title >Detail Diskusi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDiskusi && (
            <>
              <Row>
                <Col md={6} className="gap-4">
                  <h3><b>{selectedDiskusi.barang.nama_barang}</b></h3>
                  <p className="mb-1">Harga Barang: Rp {selectedDiskusi.barang.harga_barang.toLocaleString("id-ID")}</p>
                  <p className="mb-1">Status Barang: {selectedDiskusi.barang.status_barang}</p>
                  <p className="mb-1">Deskripsi: {selectedDiskusi.barang.deskripsi}</p>
                  <p className="mb-1">Tanggal Garansi: {selectedDiskusi.barang.tanggal_garansi}</p>
                </Col>
                <Col ms={6} className="d-flex flex-column align-items-end mt-5">
                  <img 
                    src={`http://127.0.0.1:8000/storage/foto_barang/${selectedDiskusi.barang.foto_barang}`}
                    alt="Foto Barang" 
                    style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }} 
                  />  
                </Col>
              </Row>
              <Row className="px-3 mt-3">
                <div className="border rounded p-4">
                  <h4 className="hijau mb-3">Balas Diskusi</h4>
                  {!isLoadingBarang ? (
                    <>
                      {diskusiListByBarang.length > 0 ? (
                        diskusiListByBarang.map((diskusi, index) => (
                          <div key={index} className="border bg-light rounded p-2 mb-3 d-flex justify-content-between align-items-center px-3">
                            <img
                              src={diskusi.id_pegawai ? ( logo
                                ) : (
                                `http://127.0.0.1:8000/storage/foto_profile/${diskusi.foto_profile_pembeli}`
                              )}
                              alt="icon user"
                              width={35}
                              height={35}
                              className="me-2 border rounded-circle"
                            />
                            <div className="w-100 d-flex justify-content-between align-items-center">
                              <div>
                                <strong>
                                  {diskusi.nama_pembeli || diskusi.nama_pegawai}  
                                  {diskusi.id_pegawai && 
                                    <>
                                      <span className="ms-1 hijau">(Customer Service)</span> <BsPatchCheckFill className="hijau ms-1" />
                                    </>
                                  }
                                </strong>  
                                <p className="mb-0">{diskusi.komentar}</p>
                              </div>
                              <div>
                                <p className="text-muted mb-0">{formatDateAja(diskusi.tanggal_diskusi)}</p>
                              </div>
                            </div>

                          </div>
                        ))
                      ) : (
                        <Alert variant="light" className="text-center mb-0">
                          <p className="text-center mb-0">Tidak ada diskusi untuk produk ini.</p>
                        </Alert>       
                      )}
                    </>
                  ) : (
                    <div className="text-center my-5 pt-5" style={{ marginTop: "5rem" }}>
                      <Spinner animation="border" variant="success" />
                      <p>Loading Diskusi...</p>
                    </div>
                  )}  

                  <Form className="d-flex align-items-center w-100 mt-5" onSubmit={submitDiskusi}>
                    <FaRegCommentDots size={20} className="me-2" />
                    <Form.Control
                      type="text"
                      placeholder="Masukkan diskusi Anda . . ."
                      className="form-control me-2"
                      name="komentar"
                      onChange={handleChange}
                      value={diskusiInput.komentar}
                      required
                    />
                    <Button variant="outline-success" type="submit">Kirim</Button>
                  </Form>
                </div>
              </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default BalasDiskusiPage;