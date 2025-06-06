import { useEffect, useState, useRef } from "react";
import { Alert, Col, Container, Row, Spinner, Table, Pagination, Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { FaPrint } from "react-icons/fa";
import { useReactToPrint } from 'react-to-print';

import { GetAllPenitip } from "../../../api/apiPenitip";
import { GetLaporanDonasiBarang, GetLaporanRekapRequest, GetLaporanPenitip, GetLaporanByKategori, GetLaporanPenitipanHabis } from "../../../api/apiLaporan";

import LaporanDonasiBarang from "../../../components/laporans/LaporanDonasiBarang";
import LaporanRekapRequest from "../../../components/laporans/LaporanRekapRequest";
import LaporanPenitip from "../../../components/laporans/LaporanPenitip";
import LaporanByKategori from "../../../components/laporans/LaporanByKategori";
import LaporanPenitipanHabis from "../../../components/laporans/LaporanPenitipanHabis";

const CetakLaporanPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showModalNoYear, setShowModalNoYear] = useState(false);
    const [showModalPenitip, setShowModalPenitip] = useState(false);
    const [penitipData, setPenitipData] = useState([]);
    const [namaLaporan, setNamaLaporan] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [tahun, setTahun] = useState("");
    const [bulan, setBulan] = useState("");
    const [selectedPenitip, setSelectedPenitip] = useState("");
    const [isLoadingCetak, setIsLoadingCetak] = useState(false);
    const [laporan, setLaporan] = useState([]);
    const [laporanPenitip, setLaporanPenitip] = useState([]);
    const [laporanKategori, setLaporanKategori] = useState([]);
    const [laporanPenitipan, setLaporanPenitipan] = useState([]);

    const refDonasiBarang = useRef(null);
    const refRekapRequest = useRef(null);
    const refPenitip = useRef(null);
    const refByKategori = useRef(null);
    const refPenitipan = useRef(null);

    const handlePrintDonasiBarang  = useReactToPrint({ contentRef: refDonasiBarang });
    const handlePrintRekapRequest  = useReactToPrint({ contentRef: refRekapRequest });
    const handlePrintPenitip  = useReactToPrint({ contentRef: refPenitip });
    const handlePrintByKategori  = useReactToPrint({ contentRef: refByKategori });
    const handlePrintPenitipanHabis = useReactToPrint({ contentRef: refPenitipan });

    const navigate = useNavigate(); 

    const fetchLaporanDonasiBarang = () => {
        setIsLoadingCetak(true);
        GetLaporanDonasiBarang(tahun)
            .then((data) => {
                setLaporan(data.data);
                toast.success("Laporan Donasi Barang berhasil diambil");
                setTahun("");
                setDisabled(true);
                setIsLoadingCetak(false);
                checkAndPrint(refDonasiBarang, handlePrintDonasiBarang);
            })
            .catch((err) => {
                console.log(err);
                toast.error(`Tidak ada data laporan donasi barang pada tahun ${tahun}`);
                setIsLoadingCetak(false);
            });
    };

    const fetchLaporanRekapRequestDonasi = () => {
        setIsLoadingCetak(true);
        GetLaporanRekapRequest()
            .then((data) => {
                setLaporan(data.data);
                toast.success("Laporan Rekap Request berhasil diambil");
                setTahun("");
                setDisabled(true);
                setIsLoadingCetak(false);
                checkAndPrint(refRekapRequest, handlePrintRekapRequest);
            })
            .catch((err) => {
                console.log(err);
                toast.error(`Tidak ada data laporan rekap request donasi yang belum terpenuhi`);
                setIsLoadingCetak(false);
            });
    };

    const fetchLaporanPenitip = () => {
        setIsLoadingCetak(true);
        GetLaporanPenitip(tahun, bulan, selectedPenitip)
            .then((data) => {
                console.log(data.data);
                setLaporanPenitip(data.data);
                toast.success("Laporan Penitip berhasil diambil");
                setTahun("");
                setBulan("");
                setSelectedPenitip("");
                setDisabled(true);
                setIsLoadingCetak(false);
                checkAndPrint(refPenitip, handlePrintPenitip);
            })
            .catch((err) => {
                console.log(err);
                toast.error(`Tidak ada data laporan penitip pada tahun ${tahun}, bulan ${bulan}, dan penitip ${selectedPenitip}`);
                setIsLoadingCetak(false);
            });
    };

    const fetchLaporanByKategori = () => {
        setIsLoadingCetak(true);
        GetLaporanByKategori(tahun)
        .then((data) => {
            console.log(data);
            setLaporanKategori(data);
            toast.success("Laporan Penjualan berhasil diambil");
            setTahun("");
            setDisabled(true);
            setIsLoadingCetak(false);
            checkAndPrint(refByKategori, handlePrintByKategori);
        })
         .catch((err) => {
            console.log(err);
            toast.error(`Tidak ada data laporan penjualan pada tahun ${tahun}`);
            setIsLoadingCetak(false);
        });
    }

    const fetchLaporanPenitipanHabis = () => {
        setIsLoadingCetak(true);
        GetLaporanPenitipanHabis()
            .then((data) => {
                setLaporanPenitipan(data.data);
                toast.success("Laporan Penitipan Habis berhasil diambil");
                setDisabled(true);
                setIsLoadingCetak(false);
                checkAndPrint(refPenitipan, handlePrintPenitipanHabis);
            })
            .catch((err) => {
                console.log(err);
                toast.error(`Tidak ada data laporan penitipan habis`);
                setIsLoadingCetak(false);
            });
    };

    const checkAndPrint = (componentRef, action) => {
        if (!componentRef || !componentRef.current) {
            setTimeout(() => checkAndPrint(componentRef, action), 100);
            return;
        }

        const node = componentRef.current;
        if (node && node.offsetHeight > 0) {
            setTimeout(() => {
                action();
                // setLaporan(null);
                // setLaporanPenitip(null);
            }, 500);
        } else {
            setTimeout(checkAndPrint(componentRef, action), 100);
        }
    };

    const laporanActions = {
        'Donasi Barang': fetchLaporanDonasiBarang,
        'Rekap request donasi': fetchLaporanRekapRequestDonasi,
        'Laporan untuk Penitip': fetchLaporanPenitip,
        'Laporan Penjualan Per Kategori': fetchLaporanByKategori,
        'Laporan Penitipan Habis': fetchLaporanPenitipanHabis,
    };

    useEffect(() => {
       const fetchPenitipData = async () => {
            setIsLoading(true);
            try {
                const data = await GetAllPenitip();
                setPenitipData(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching penitip data:", error);
                toast.error("Gagal mengambil data penitip");
                setIsLoading(false);
            }
        }

        fetchPenitipData();
    }, []);

    const validateForm = (tahun, bulan, penitip) => {
        if (
            tahun.length === 4 &&
            !isNaN(tahun) &&
            bulan !== '' &&
            penitip !== ''
        ) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    };
    

    return (
        <>
            <Container fluid className="p-0">
                <Container className="mb-5 ms-0 me-0 mt-3">
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                        <p className="" style={{ fontSize: "2vw" }}>CETAK LAPORAN</p>
                    </div>

                    {isLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="success" size="lg" />
                            <p className="mb-0">Loading...</p>
                        </div>
                    ) : (
                        <>
                            <Table bordered hover responsive>
                                <thead className="custom-table">
                                    <tr>
                                        <th className="text-center">No</th>
                                        <th>Nama Laporan</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-center">1</td>
                                        <td>Penjualan Bulanan Keseluruhan</td>
                                        <td className="text-center">
                                            <Button variant="primary" size="sm" onClick={() => {window.print()}}>
                                                <FaPrint />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">2</td>
                                        <td>Komisi bulanan per produk</td>
                                        <td className="text-center">
                                            <Button variant="primary" size="sm" onClick={() => {window.print()}}>
                                                <FaPrint />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">3</td>
                                        <td>Stok Gudang</td>
                                        <td className="text-center">
                                            <Button variant="primary" size="sm" onClick={() => {window.print()}}>
                                                <FaPrint />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">4</td>
                                        <td>Penjualan per kategori barang (dalam 1 tahun)</td>
                                        <td className="text-center">
                                            <Button variant="primary" size="sm" 
                                                onClick={() => {setShowModal(true); setNamaLaporan("Laporan Penjualan Per Kategori");}}>
                                                <FaPrint />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">5</td>
                                        <td>Barang yang Masa Penitipannya Sudah Habis</td>
                                        <td className="text-center">
                                            <Button variant="primary" size="sm" 
                                                onClick={() => {setShowModalNoYear(true); setNamaLaporan("Laporan Penitipan Habis");}}>
                                                <FaPrint />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">6</td>
                                        <td>Donasi Barang</td>
                                        <td className="text-center">
                                            <Button variant="primary" size="sm" 
                                                onClick={() => {setShowModal(true); setNamaLaporan("Donasi Barang");}}>
                                                <FaPrint />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">7</td>
                                        <td>Rekap request donasi (semua yang belum terpenuhi)</td>
                                        <td className="text-center">
                                            <Button variant="primary" size="sm" 
                                                onClick={() => {setShowModalNoYear(true); setNamaLaporan("Rekap request donasi");}}>
                                                <FaPrint />
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">8</td>
                                        <td>Laporan untuk Penitip</td>
                                        <td className="text-center">
                                            <Button variant="primary" size="sm" 
                                                onClick={() => {setShowModalPenitip(true); setNamaLaporan("Laporan untuk Penitip");}}>
                                                <FaPrint />
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </>
                    )}
                </Container>
            </Container>

            {/* Modal input tahun */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{namaLaporan}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Inputkan tahun yang mau dicetak !</h5>
                    <Row className="mt-3">
                        <Col>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Tahun (YYYY)"
                                min={1900}
                                value={tahun}
                                onChange={(e) => {
                                    const year = e.target.value;
                                    setTahun(year);
                                    
                                    if (year.length === 4 && !isNaN(year)) {
                                        setDisabled(false);
                                    } else {
                                        setDisabled(true);
                                    }
                                }}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Batal
                    </Button>
                    {isLoadingCetak ? (
                        <Button variant="primary" disabled>
                            <Spinner animation="border" size="sm" />
                        </Button>
                    ) : (
                        <Button variant="primary" disabled={disabled} 
                            onClick={() => {  
                                const action = laporanActions[namaLaporan];
                                if (action) action();
                            }}>
                            Cetak
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Modal konfirmasi tanpa tahun */}
            <Modal show={showModalNoYear} onHide={() => setShowModalNoYear(false)} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{namaLaporan}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Apakah Anda yakin ingin mencetak laporan?</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalNoYear(false)}>
                        Batal
                    </Button>
                    {isLoadingCetak ? (
                        <Button variant="primary" disabled>
                            <Spinner animation="border" size="sm" />
                        </Button>
                    ) : (
                        <Button variant="primary" 
                            onClick={() => {  
                                const action = laporanActions[namaLaporan];
                                if (action) action();
                            }}>
                            Cetak
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Modal untuk memilih penitip */}
            <Modal show={showModalPenitip} onHide={() => setShowModalPenitip(false)} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{namaLaporan}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>Inputkan periode dan penitip yang mau dicetak!</h5>
                    
                    {/* Tahun */}
                    <Row className="mt-3">
                        <Col>
                            <input
                            type="number"
                            className="form-control"
                            placeholder="Tahun (YYYY)"
                            min={1900}
                            value={tahun}
                            onChange={(e) => {
                                const year = e.target.value;
                                setTahun(year);
                                validateForm(year, bulan, selectedPenitip);
                            }}
                            />
                        </Col>
                    </Row>

                    {/* Bulan */}
                    <Row className="mt-3">
                        <Col>
                            <Form.Select
                            value={bulan}
                            onChange={(e) => {
                                setBulan(e.target.value);
                                validateForm(tahun, e.target.value, selectedPenitip);
                            }}
                            >
                            <option value="">Pilih Bulan</option>
                            {[
                                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                            ].map((name, index) => (
                                <option key={index + 1} value={index + 1}>{name}</option>
                            ))}
                            </Form.Select>
                        </Col>
                    </Row>

                    {/* Penitip */}
                    <Row className="mt-3">
                        <Col>
                            <Form.Select
                                value={selectedPenitip}
                                onChange={(e) => {
                                    setSelectedPenitip(e.target.value);
                                    validateForm(tahun, bulan, e.target.value);
                                }}
                            >
                                <option value="">Pilih Penitip</option>
                                {penitipData.map((penitip) => (
                                    <option key={penitip.id_penitip} value={penitip.id_penitip}>
                                        {penitip.nama} - {penitip.id_penitip}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalPenitip(false)}>
                        Batal
                    </Button>
                    {isLoadingCetak ? (
                    <Button variant="primary" disabled>
                        <Spinner animation="border" size="sm" />
                    </Button>
                    ) : (
                    <Button
                        variant="primary"
                        disabled={disabled}
                        onClick={() => {
                            const action = laporanActions[namaLaporan];
                            if (action) action();
                        }}
                    >
                        Cetak
                    </Button>
                    )}
                </Modal.Footer>
            </Modal>


            {/* cetak laporan */}
            {laporan && (
                <div style={{ position: 'absolute', left: '-9999px' }}>
                    <LaporanDonasiBarang
                        ref={refDonasiBarang}
                        laporan={laporan ? laporan : null}
                    />

                    <LaporanRekapRequest
                        ref={refRekapRequest}
                        laporan={laporan ? laporan : null}
                    />

                    <LaporanPenitip
                        ref={refPenitip}
                        laporan={laporanPenitip ? laporanPenitip : null}
                    />

                    <LaporanByKategori
                        ref={refByKategori}
                        laporan={laporanKategori ? laporanKategori : null}
                    />

                    <LaporanPenitipanHabis
                        ref={refPenitipan}
                        laporan={laporanPenitipan ? laporanPenitipan : null}
                    />
                    
                </div>
            )}

        </>
    );
};

export default CetakLaporanPage;
