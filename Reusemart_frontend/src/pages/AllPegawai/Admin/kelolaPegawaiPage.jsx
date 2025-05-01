import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner, Pagination } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

import ModalShowPegawai from "../../../components/modals/pegawai/ModalShowPegawai";
import ModalDeletePegawai from "../../../components/modals/pegawai/ModalDeletePegawai";

const KelolaPegawaiPage = () => {
  const [dataPegawai, setDataPegawai] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredPegawai, setFilteredPegawai] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/pegawai');
      if (!response.ok) {
        throw new Error('Gagal fetch data');
      }
      const data = await response.json();
      setDataPegawai(data);
    } catch (err) {
      console.error('Error fetch pegawai:', err);
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

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    setCurrentPage(1);

    const filtered = dataPegawai.filter((pegawai) =>
      pegawai.nama_pegawai.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredPegawai(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="p-0">
      <Container className="boxHijau p-3 rounded-3 mb-4 mt-4 ms-3" style={{ width: "13vw" }}>
        <Row>
          <Col>
            <p>Jumlah</p>
            <p>Pegawai</p>
          </Col>
          <Col className="text-center d-flex justify-content-center align-items-center">
            <h3>{dataPegawai.length}</h3>
          </Col>
        </Row>
      </Container>

      <Container className="mb-5 ms-0 me-0">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <p style={{ fontSize: "2vw" }}>KELOLA PEGAWAI</p>
          <Form className="d-flex mx-lg-3 my-2 my-lg-0 position-relative" style={{ minWidth: "300px" }}>
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
              placeholder="Cari nama pegawai"
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

        {dataPegawai.length === 0 && !isLoading ? (
          <Alert variant="warning" className="text-center">
            <h5>Belum ada pegawai yang terdaftar</h5>
          </Alert>
        ) : isLoading ? (
          <div className="text-center">
            <Spinner animation="border" variant="success" size="lg" />
            <p className="mb-0">Loading...</p>
          </div>
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
                    <td>{pegawai.nama_pegawai}</td>
                    <td className="d-flex justify-content-center">
                      <ModalShowPegawai pegawai={pegawai} />
                      <ModalDeletePegawai pegawai={pegawai} onClose={fetchData} />
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

export default KelolaPegawaiPage;
