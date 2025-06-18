import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Carousel, Image } from "react-bootstrap";
import { BsPatchCheckFill } from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getRole } from "../../api/apiAuth";
import { GetBarangById } from "../../api/apiBarang";
import { GetDiskusiByIdBarang, TambahDiskusi } from "../../api/apiDiskusi";
import { GetPenitipById } from "../../api/apiPenitip";
import { TambahKeranjang, HandleCheckoutDariBarang } from "../../api/apiKeranjang";
import { useKeranjang } from "../../context/KeranjangContext";

import logo from "../../assets/images/logoreuse.png";
import badgeIcon from "../../assets/images/iconbadge.png";

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
  const [activeIndex, setActiveIndex] = useState(0);

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
    } else {
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
  };

  const fetchRole = async () => {
    setIsPending(true);
    try {
      const res = await getRole();
      setUserType(res.user_type);
    } catch (err) {
      console.log(err);
      toast.error("Terjadi Kesalahan! Silahkan login ulang.");
      sessionStorage.removeItem("token");
      navigate("/login");
    } finally {
      setIsPending(false);
    }
  };

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
      return;
    } else {
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
        fetchKeranjang();
        if (err.message === "Unauthenticated.") {
          toast.error("Hanya pembeli yang bisa menambah keranjang!");
        } else if (err.message === "Maaf, Barang sudah habis") {
          toast.error(err.message);
          navigate("/kategori");
        } else {
          toast.error(err.message ?? "Hanya pembeli yang bisa menambah keranjang!");
        }
        setIsPendingKeranjang(false);
        setIsDisabled(false);
      });
  };

  const handleCheckout = () => {
    setIsDisabled(true);
    setIsPendingKeranjang(true);

    const tokenDariSS = sessionStorage.getItem("token");

    if (!tokenDariSS) {
      navigate("/login");
      toast.error("Silahkan login terlebih dahulu!");
      return;
    } else {
      fetchRole();
    }

    HandleCheckoutDariBarang(id)
      .then((res) => {
        fetchKeranjang();
        navigate("/pembeli/checkout");
        setIsPendingKeranjang(false);
        setIsDisabled(false);
      })
      .catch((err) => {
        console.log(err);
        fetchKeranjang();
        if (err.message === "Unauthenticated.") {
          toast.error("Hanya pembeli yang bisa melakukan checkout!");
        } else if (err.message === "Maaf, Barang sudah habis") {
          toast.error(err.message);
          navigate("/kategori");
        } else {
          toast.error(err.message ?? "Hanya pembeli yang bisa melakukan checkout!");
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

        const penitipData = await GetPenitipById(barangData.barang.id_penitip);
        setPenitip({ ...penitipData, jumlahTerjual: barangData.jumlah_barang_terjual });
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
        <p>Loading Detail barang...</p>
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

  // Prepare photos for carousel
  const photos = [
    {
      src: barang.barang.foto_barang
        ? `http://127.0.0.1:8000/storage/foto_barang/${barang.barang.foto_barang}`
        : null,
      alt: "Foto Utama",
    },
    {
      src: barang.barang.foto_barang2
        ? `http://127.0.0.1:8000/storage/foto_barang/${barang.barang.foto_barang2}`
        : null,
      alt: "Foto Kedua",
    },
    {
      src: barang.barang.foto_barang3
        ? `http://127.0.0.1:8000/storage/foto_barang/${barang.barang.foto_barang3}`
        : null,
      alt: "Foto Ketiga",
    },
  ].filter((photo) => photo.src);

  // Fallback image for broken links
  const fallbackImage = "https://via.placeholder.com/400x400?text=Tidak+Ada+Gambar";

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <Container className="my-5">
      <Row className="g-4">
        {/* Carousel Foto Barang dengan Thumbnail */}
        <Col md={4}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
            {photos.length > 0 ? (
              <>
                <Carousel
                  activeIndex={activeIndex}
                  onSelect={handleSelect}
                  indicators={true}
                  prevIcon={
                    <span
                      className="carousel-control-prev-icon"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "50%",
                        padding: "15px",
                        transition: "opacity 0.2s ease, transform 0.2s",
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = 1)}
                      onMouseLeave={(e) => (e.target.style.opacity = 0)}
                      aria-label="Foto Sebelumnya"
                    />
                  }
                  nextIcon={
                    <span
                      className="carousel-control-next-icon"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        borderRadius: "50%",
                        padding: "15px",
                        transition: "opacity 0.2s ease, transform 0.2s",
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => (e.target.style.opacity = 1)}
                      onMouseLeave={(e) => (e.target.style.opacity = 0)}
                      aria-label="Foto Berikutnya"
                    />
                  }
                  interval={null}
                  style={{ transition: "transform 0.2s ease" }} // Faster transition
                >
                  {photos.map((photo, index) => (
                    <Carousel.Item key={index}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "clamp(300px, 50vw, 400px)",
                          transition: "transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          onError={(e) => (e.target.src = fallbackImage)}
                          style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                            borderRadius: "12px",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                          }}
                          aria-label={photo.alt}
                        />
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
                {/* Thumbnail Navigation */}
                <div
                  className="d-flex justify-content-center gap-2 mt-1 flex-wrap"
                  style={{ padding: "5px" }} // Reduced margin
                >
                  {photos.map((photo, index) => (
                    <Button
                      key={index}
                      variant="link"
                      onClick={() => setActiveIndex(index)}
                      style={{
                        padding: 0,
                        border: activeIndex === index ? "2px solid #047902" : "1px solid #dee2e6",
                        borderRadius: "6px",
                        overflow: "hidden",
                        transition: "border-color 0.2s ease, transform 0.2s",
                        transform: activeIndex === index ? "scale(1.1)" : "scale(1)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = activeIndex === index ? "scale(1.1)" : "scale(1)")}
                      aria-label={`Pilih ${photo.alt}`}
                    >
                      <Image
                        src={photo.src}
                        alt={`Thumbnail ${photo.alt}`}
                        onError={(e) => (e.target.src = fallbackImage)}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </Button>
                  ))}
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "clamp(300px, 50vw, 400px)",
                  borderRadius: "12px",
                  textAlign: "center",
                  color: "#6c757d",
                  fontSize: "1.2rem",
                  border: "1px solid #dee2e6",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                Tidak ada foto tersedia
              </div>
            )}
          </Card>
        </Col>

        {/* Informasi Barang & Penitip */}
        <Col md={8}>
          <Row>
            <Col md={8}>
              <h2>{barang.barang.nama_barang}</h2>
              <p className="text-success">
                {barang.barang.status_barang} -{" "}
                {barang.barang.tanggal_garansi
                  ? new Date(barang.barang.tanggal_garansi) > new Date()
                    ? "Bergaransi"
                    : "Tidak Bergaransi"
                  : "Tidak Bergaransi"}{" "}
                - {barang.barang.berat_barang} Kg
              </p>
              <h3>Rp {Number(barang.barang.harga_barang).toLocaleString("id-ID")}</h3>
            </Col>
            <Col md={4}>
              <div className="p-3 border rounded">
                <Row>
                  <Col md={4}>
                    <img
                      src={`http://127.0.0.1:8000/storage/foto_profile/${penitip?.foto_profile}`}
                      alt="Penitip"
                      className="img-fluid rounded"
                    />
                  </Col>
                  <Col md={8}>
                    <div className="d-flex align-items-center">
                      {penitip?.is_top === "Ya" && (
                        <img
                          src={badgeIcon}
                          alt="Top Seller Badge"
                          style={{ width: "24px", height: "24px", marginRight: "8px" }}
                        />
                      )}
                      <h5 className="fw-bold mb-0">{penitip?.nama}</h5>
                    </div>
                    {penitip?.is_top === "Ya" && <p className="text-success">Top Seller</p>}
                    <p className="text-muted mb-1">Rating Penjual: ⭐ {penitip?.rating_penitip}</p>
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
            <button
              className="btn btn-outline-success w-50"
              onClick={submitTambahKeranjang}
              disabled={isDisabled}
            >
              {isPendingKeranjang ? (
                <Spinner animation="border" size="sm" variant="success" className="me-2" />
              ) : (
                <span>+ Keranjang</span>
              )}
            </button>
            <button className="btn btn-success w-50" disabled={isDisabled} onClick={handleCheckout}>
              {isPendingKeranjang ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : (
                <span>Checkout</span>
              )}
            </button>
          </div>
        </Col>
      </Row>

      {/* Diskusi Produk */}
      <hr />
      <h4 className="text-success text-decoration-underline">Diskusi Produk</h4>

      <div className="border rounded p-4">
        {!loadingDiskusi || !isPending ? (
          <>
            {diskusiList.length > 0 ? (
              diskusiList.map((diskusi, index) => (
                <div
                  key={index}
                  className="border bg-light rounded p-2 mb-3 d-flex align-items-center px-3"
                >
                  <img
                    src={
                      diskusi.id_pegawai
                        ? logo
                        : `http://127.0.0.1:8000/storage/foto_profile/${diskusi.foto_profile_pembeli}`
                    }
                    alt="icon user"
                    width={35}
                    height={35}
                    className="me-2 border rounded-circle"
                  />
                  <div className="w-100 d-flex justify-content-between align-items-center">
                    <div>
                      <strong>
                        {diskusi.nama_pembeli || diskusi.nama_pegawai}
                        {diskusi.id_pegawai && (
                          <>
                            <span className="ms-1 hijau">(Customer Service)</span>{" "}
                            <BsPatchCheckFill className="hijau ms-1" />
                          </>
                        )}
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
              <Button variant="outline-success" type="submit" disabled={isDisabled}>
                Kirim
              </Button>
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