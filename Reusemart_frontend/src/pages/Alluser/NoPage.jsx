import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button } from "react-bootstrap";

import { BsTelephone, BsInstagram, BsGeoAlt } from "react-icons/bs";
import FooterBar from "../../components/FooterBar";

import reusemart from "../../assets/images/titlereuse.png";

const NoPage = () => {

    const navigate = useNavigate();
    
    return (
        
        <Container style={{  
            minHeight: "100vh", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
            }}>

            <Container className="p-4" style={{background: "rgba(231, 224, 218, 1)", borderRadius: "20px", width: "100%"}}>
                <div className="d-flex justify-content-center align-items-center flex-row">
                    <img src={reusemart} alt="ReuseMart" />
                    <div className="ms-3">
                        <h1 className="hijau">Halaman Tidak ditemukan</h1>
                        <h5>Halaman yang Anda Cari tidak ditemukan, mohon kembali ke baranda</h5>
                        <Button variant="success" className="mt-1" style={{ borderRadius: "50px", padding: "10px 20px" }}>
                            <span className="text-white" onClick={() => navigate("/")}>Kembali ke Beranda</span>
                        </Button>
                    </div>
                </div>
            </Container>
        </Container>
            
        
    );
};

export default NoPage;

