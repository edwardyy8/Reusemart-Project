import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner, Alert, Form, Button } from "react-bootstrap";
import { FaRegCommentDots } from 'react-icons/fa';
import { BsPatchCheckFill } from "react-icons/bs";
import { useParams, useNavigate } from "react-router-dom";
import { GetBarangById } from "../../api/apiBarang";
import { GetPenitipById } from "../../api/apiPenitip";
import { GetDiskusiByIdBarang, TambahDiskusi } from "../../api/apiDiskusi";
import { getRole } from "../../api/apiAuth";
import { toast } from "react-toastify";

import { TambahKeranjang } from "../../api/apiKeranjang";
import { useKeranjang } from "../../context/KeranjangContext";

import logo from "../../assets/images/logoreuse.png";


const DetailBarangPage = () => {
  const { id } = useParams();
  const [barang, setBarang] = useState(null);
  const [penitip, setPenitip] = useState(null);
  const [diskusiList, setDiskusiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDiskusi, setLoadingDiskusi] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [userType, setUserType] = useState("");

  const [isPendingKeranjang, setIsPendingKeranjang] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { fetchKeranjang } = useKeranjang();
  
  const navigate = useNavigate();

  const [diskusiInput, setDiskusiInput] = useState({
    komentar: "",
    id_barang: id,
    id_pegawai: "",
    id_pembeli: "",
  });

  const handleChange = (e) => {
    setDiskusiInput({ ...diskusiInput, [e.target.name]: e.target.value });
  };

  const submitDiskusi = (event) => {
    event.preventDefault();
    setIsDisabled(true);

    const tokenDariSS = sessionStorage.getItem("token");

    if (!tokenDariSS) {
      navigate("/login");
      toast.error("Silahkan login terlebih dahulu!");
      return;
    }else{
      fetchRole();
    }

    TambahDiskusi(diskusiInput)
      .then((res) => {    
        toast.success(res.message); 
        fetchDiskusi(); 
        setDiskusiInput({ komentar: "", id_barang: id, id_pegawai: "", id_pembeli: "" });
        setIsDisabled(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
        setIsDisabled(false);
      });
  };
  
  const fetchDiskusi = async () => {
    try {
      setLoadingDiskusi(true);
      const res = await GetDiskusiByIdBarang(id);
      setDiskusiList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDiskusi(false);
    }
  }

  const fetchRole = async () => {
    setIsPending(true);
    const token = sessionStorage.getItem("token");

    try {
      const res = await getRole();
      setUserType(res.user_type);
    } catch (err) { 
      console.log(err);
      toast.error("Terjadi Kesalahan! Silahkan login ulang.");
      sessionStorage.removeItem("token");
      navigate("/login");
    }finally {
      setIsPending(false);
    }
  };

  // buat keranjang
  const [keranjangInput, setKeranjangInput] = useState({
    id_barang: id,
    harga_barang: null,
  });

  const submitTambahKeranjang = () => {
    setIsDisabled(true);
    setIsPendingKeranjang(true);

    const tokenDariSS = sessionStorage.getItem("token");

    if (!tokenDariSS) {
      navigate("/login");
      toast.error("Silahkan login terlebih dahulu!");
      navigate("/login");
      return;
    }else{
      fetchRole();
    }

    TambahKeranjang(keranjangInput)
      .then((res) => {    
        toast.success(res.message); 
        fetchKeranjang();
        setIsPendingKeranjang(false);
        setIsDisabled(false);
      })
      .catch((err) => {
        console.log(err);
        if(err.message == "Unauthenticated."){
          toast.error("Hanya pembeli yang bisa menambah keranjang!");
        }else {
          toast.error(err.message ?? "Hanya pembeli yang bisa menambah keranjang!");
        }
        setIsPendingKeranjang(false);
        setIsDisabled(false);
      });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barangData = await GetBarangById(id);
        setBarang(barangData);
        setKeranjangInput({ ...keranjangInput, harga_barang: barangData.barang.harga_barang });

        const penitipData = await GetPenitipById(barangData.barang.id_penitip); // <--- perhatikan di sini
        setPenitip({ ...penitipData, jumlahTerjual: barangData.jumlah_barang_terjual }); // ← Tambahkan properti ini
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchDiskusi();
  }, [id]);


  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="success" />
        <p>Loading Detail barang.barang...</p>
      </div>
    );
  }

  if (!barang) {
    return (
      <Container className="text-center my-5">
        <h3>Barang tidak ditemukan</h3>
      </Container>
    );
  }

  return (
     <Container className="my-5">
      <Row className="g-4">
        {/* Foto Utama */}
        <Col md={4}>
          <Card>
            <Card.Img
              variant="top"
              src={`http://127.0.0.1:8000/storage/foto_barang/${barang.barang.foto_barang}`}
              alt={barang.barang.nama_barang}
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </Card>
        </Col>

        {/* Informasi Barang & Penitip */}
        <Col md={8}>
          <Row>
            <Col md={8}>
              <h2>{barang.barang.nama_barang}</h2>
              <p className="text-success">
                {barang.barang.status_barang} - {barang.barang.garansi === "Ya" ? "Garansi" : "Tidak Bergaransi"} - {barang.barang.berat_barang} Kg
              </p>
              <h3>Rp {Number(barang.barang.harga_barang).toLocaleString("id-ID")}</h3>
            </Col>
            <Col md={4}>
              <div className="p-3 border rounded">
                <Row>
                  <Col md={4}>
                    <img src={`http://127.0.0.1:8000/storage/foto_profile/${penitip?.foto_profile}`} 
                      alt="Penitip" 
                      className="img-fluid rounded" 
                    />
                  </Col>
                  <Col md={8}>
                    <h5 className="fw-bold">{penitip?.nama}</h5>
                    <p className="text-muted mb-1">Rating Penjual: ⭐ {penitip?.rating_penitip} </p>
                    <p className="text-muted">Barang Terjual: {penitip?.jumlahTerjual ?? 0}</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <hr />
          <h4 className="text-success text-decoration-underline">Detail Produk</h4>
          <p>{barang.barang.deskripsi}</p>
          <hr />
        </Col>
      </Row>

      {/* Tombol Aksi */}
      <Row className="my-4">
        <Col md={12} className="d-flex justify-content-end">
          <div className="d-flex gap-2 w-50">
            <button className="btn btn-outline-success w-50" onClick={() => submitTambahKeranjang()} disabled={isDisabled}>
              {isPendingKeranjang ? (
                <Spinner animation="border" size="sm" variant="success" className="me-2" />
              ) : (
                <span>+ Keranjang</span>
              )}
            </button>
            <button className="btn btn-success w-50">Checkout</button>
          </div>
        </Col>
      </Row>

      {/* Diskusi Produk */}
      <hr />
      <h4 className="text-success text-decoration-underline">Diskusi Produk</h4>
      
      <div className="border rounded p-4">
        {/* Input Diskusi */}
        {!loadingDiskusi || !isPending ? (
          <>
            {diskusiList.length > 0 ? (
              diskusiList.map((diskusi, index) => (
                <div key={index} className="border bg-light rounded p-2 mb-3 d-flex align-items-center px-3">
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
                      <p className="text-muted mb-0">{formatDate(diskusi.tanggal_diskusi)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Alert variant="light" className="text-center mb-0">
                <p className="text-center mb-0">Tidak ada diskusi untuk produk ini.</p>
              </Alert>       
            )}

            <Form className="d-flex align-items-center w-100 mt-5" onSubmit={submitDiskusi}>
              <FaRegCommentDots size={20} className="me-2" />
              <Form.Control
                type="text"
                placeholder="Masukkan diskusi Anda . . ."
                className="form-control me-2"
                name="komentar"
                onChange={handleChange}
                required
                value={diskusiInput.komentar}
              />
              <Button variant="outline-success" type="submit" disabled={isDisabled} >Kirim</Button>
            </Form>
          </>
        ) : (
          <div className="text-center my-5 pt-5" style={{ marginTop: "5rem" }}>
            <Spinner animation="border" variant="success" />
            <p>Loading Diskusi...</p>
          </div>
        )}
      </div>

    </Container>
    
  );
};

export default DetailBarangPage;
