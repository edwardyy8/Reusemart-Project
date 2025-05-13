import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { FaRegPenToSquare } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

import ModalDeletePegawai from "../../../components/modals/pegawai/ModalDeletePegawai";
import ModalShowPegawai from "../../../components/modals/pegawai/ModalShowPegawai";

import { ResetPasswordPegawai } from '../../../api/apiAuth';
import { toast } from 'react-toastify';

const KelolaPegawaiPage = () => {
  const [dataPegawai, setDataPegawai] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const filteredPegawai = dataPegawai.filter((pegawai) => {
    const keyword = searchKeyword.toLowerCase();
    return (
      pegawai.nama?.toLowerCase().includes(keyword) ||
      pegawai.email?.toLowerCase().includes(keyword) ||
      pegawai.tanggal_lahir?.toLowerCase().includes(keyword) ||
      pegawai.id_pegawai?.toLowerCase().includes(keyword) ||
      pegawai.id_jabatan?.toString().toLowerCase().includes(keyword) ||
      pegawai.is_aktif?.toString().toLowerCase().includes(keyword)
    );
  });


  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/pegawai');
      if (!response.ok) throw new Error('Gagal fetch data');
      const data = await response.json();
      setDataPegawai(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dataToDisplay = searchKeyword ? filteredPegawai : dataPegawai;
  const totalPages = Math.ceil(dataToDisplay.length / itemsPerPage);
  const currentItems = dataToDisplay.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleEditClick = (id) => navigate(`/pegawai/Admin/KelolaPegawaiPage/${id}`);

  // Menyaring data berdasarkan jabatan
  const countByJabatan = (jabatanId) => {
    return dataPegawai.filter(pegawai => pegawai.id_jabatan === jabatanId).length;
  };

  const countNonAktif = () => {
    return dataPegawai.filter((pegawai) => pegawai.is_aktif === "Tidak").length;
  };


  const handleResetPasswordPegawai = async (id) => {
    try {
      const response = await ResetPasswordPegawai(id);
      if (!response.ok) throw new Error('Gagal reset password');
      toast.success('Password berhasil direset!');
    } catch (err) {
      setError(err.message);
      toast.error('Gagal reset password');
    }
  }

  return (
    <Container className="p-0">
      <Row className="d-flex justify-content-between align-items-center mb-4">
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className="boxHijau p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px' }} // Menetapkan lebar minimal
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah</p><p className="mb-0" style={{ fontSize: '1rem' }}>Pegawai</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{dataPegawai.length}</h3>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className="p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px', backgroundColor: '#2B74F8', color: 'white' }}
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah Owner</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{countByJabatan(1)}</h3>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className=" p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px', backgroundColor: '#FF5959', color: 'white' }}
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah Admin</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{countByJabatan(2)}</h3>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className="boxHijau p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px' }}
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah Customer Service</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{countByJabatan(3)}</h3>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className="p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px', backgroundColor: '#2B74F8', color: 'white' }}
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah Hunter</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{countByJabatan(4)}</h3>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className="p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px', backgroundColor: '#FF5959', color: 'white' }}
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah Gudang</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{countByJabatan(5)}</h3>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className="boxHijau p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px' }}
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah Quality Control</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{countByJabatan(6)}</h3>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className="p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px', backgroundColor: '#2B74F8', color: 'white' }}
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Jumlah Kurir</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{countByJabatan(7)}</h3>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          sm={6}
          md={3}
          lg={1}
          className="p-3 rounded-3 text-center mb-4"
          style={{ minHeight: '100px', minWidth: '150px', backgroundColor: '#FF5959', color: 'white' }}
        >
          <Row>
            <Col><p className="mb-0" style={{ fontSize: '1rem' }}>Pegawai NonAktif</p></Col>
            <Col className="d-flex justify-content-center align-items-center">
              <h3>{countNonAktif()}</h3>
            </Col>
          </Row>
        </Col>
      </Row>

      <Container className="mb-5 ms-0 me-0">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <p style={{ fontSize: "2vw" }}>KELOLA PEGAWAI</p>
          <Form className="d-flex position-relative" style={{ minWidth: "300px" }} onSubmit={(e) => e.preventDefault()}>
            <FaSearch className="position-absolute start-0 top-50 translate-middle-y ms-2" style={{ zIndex: 2 }} />
            <Form.Control
              type="search"
              placeholder="Cari nama pegawai"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="ps-5"
              style={{ borderColor: 'rgba(83, 83, 83, 1)' }}
            />
          </Form>
          <Button className="border-0" style={{ backgroundColor: "rgba(4, 121, 2, 1)" }} onClick={() => navigate("/pegawai/Admin/kelolaPegawai/tambahPegawai")}>+ Tambah</Button>

        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mb-0">Loading...</p>
          </div>
        ) : dataToDisplay.length === 0 ? (
          <Alert variant="warning" className="text-center">
            <h5>Belum ada pegawai yang terdaftar</h5>
          </Alert>
        ) : (
          <>
            <Table bordered hover>
              <thead className="custom-table">
                <tr>
                  <th>ID Pegawai</th>
                  <th>Nama Pegawai</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((pegawai) => (
                  <tr key={pegawai.id_pegawai}>
                    <td>{pegawai.id_pegawai}</td>
                    <td>{pegawai.nama}</td>
                    <td className="d-flex justify-content-center">
                      {pegawai.is_aktif === "Tidak" ? (
                        <ModalShowPegawai pegawai={pegawai} />
                      ) : (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => handleResetPasswordPegawai(pegawai.id_pegawai)}
                            className="me-2"
                          >
                            Reset Password?
                          </Button>
                          <ModalShowPegawai pegawai={pegawai} />
                          <Button
                            onClick={() => navigate(`/pegawai/Admin/kelolaPegawai/${pegawai.id_pegawai}`)}
                            className="me-2"
                          >
                            <FaRegPenToSquare size={20} />
                          </Button>
                          <ModalDeletePegawai pegawai={pegawai} onClose={fetchData} />
                        </>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination>
                  <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages)
                    .map(p => (
                      <Pagination.Item key={p} active={p === currentPage} onClick={() => handlePageChange(p)}>
                        {p}
                      </Pagination.Item>
                    ))}
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

export default KelolaPegawaiPage;
