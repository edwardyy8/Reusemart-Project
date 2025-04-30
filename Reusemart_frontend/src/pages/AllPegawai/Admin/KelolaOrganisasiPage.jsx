import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button, Table } from "react-bootstrap";

import { GetAllOrganisasi } from "../../../api/apiOrganisasi";

import reusemart from "../../../assets/images/titlereuse.png";

import { FaEye, FaTrash } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";

import ModalShowOrg from "../../../components/modals/organisasi/ModalShowOrg";
import ModalDeleteOrg from "../../../components/modals/organisasi/ModalDeleteOrg";
import EditOrganisasiPage from "./EditOrganisasiPage";



const KelolaOrganisasiPage = () => {
      const [organisasis, setOrganisasis] = useState([]);
      const [jumlah, setJumlah] = useState(0);
      const [isLoading, setIsLoading] = useState(false);

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

    const navigate = useNavigate();
    
    return (
        <>  
            <Container className="boxHijau p-4 rounded-3 mb-4 mt-5 ms-5" style={{ width: "18rem" }}>
                <Row>
                        <Col>
                            <h3>Jumlah </h3>
                            <h3>Organisasi </h3>
                        </Col>
                        <Col className="text-center d-flex justify-content-center align-items-center">
                            <h1>{jumlah}</h1>
                        </Col>
                </Row>
            </Container>

            <Container className=" ps-5">

                <Container className="mb-5 ms-0 me-0">
                    <div className="mb-3">
                        <h1 className="">KELOLA ORGANISASI</h1>

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
                                    {organisasis.map((organisasi) => (
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

