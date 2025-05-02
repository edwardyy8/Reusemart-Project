import { Container, Card, Spinner, Alert, Row, Col, Button } from "react-bootstrap";

import { GetPemesananByIdPembeli } from "../../api/apiPemesanan";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const DetailPembelianPage = () => {
    const [pembelianData, setPembelianData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPembelianData = async () => {
        try {
            setLoading(true);
            
            const pembelian = await GetPemesananByIdPembeli(profile.id_pembeli);
            if (!pembelian) {
                return (
                    <Container className="mt-5 text-center">
                    <Alert variant="warning">Data pembelian tidak ditemukan</Alert>
                    </Container>
                );
            }
            setPembelianData(pembelian.data);
            
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || err.message || "Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPembelianData();
    }, []);

    const formatTanpaDetik = (tanggal) => {
        const date = new Date(tanggal);
        const tahun = date.getFullYear();
        const bulan = String(date.getMonth() + 1).padStart(2, '0');
        const hari = String(date.getDate()).padStart(2, '0');
        const jam = String(date.getHours()).padStart(2, '0');
        const menit = String(date.getMinutes()).padStart(2, '0');
        
        return `${tahun}-${bulan}-${hari} ${jam}:${menit}`;
    };

    if (loading) { 
        return(
            <Container style={{  
            minHeight: "100vh", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
            }}>
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
            </Container>
        ); 
    }

    if (error) {
        return (
            <Container className="mt-5 text-center">
            <Alert variant="danger">Error: {error}</Alert>
            </Container>
        );
    }


    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">

        </Container>
    );
}

export default DetailPembelianPage;