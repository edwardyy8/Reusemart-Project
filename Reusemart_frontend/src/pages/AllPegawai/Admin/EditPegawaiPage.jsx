import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { editPegawai, GetPegawaiById } from "../../../api/apiPegawai";

const EditPegawaiPage = () => {
    const { id } = useParams(); // mengambil id pegawai dari URL params
    const navigate = useNavigate();

    // Menggunakan state untuk menyimpan data pegawai dan status loading
    const [pegawaiData, setPegawaiData] = useState({
        nama: "",
        email: "",
        id_jabatan: "",
        foto_profile: null,
    });

    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);

    // Fetch data pegawai berdasarkan id
    useEffect(() => {
            const fetchPegawai = async () => {
              try {
                const data = await GetPegawaiById(id);
                const cleanedData = { ...data.data, foto_profile: null };
                setPegawaiData(cleanedData);
                setOriginalData(cleanedData);
              } catch (error) {
                alert("Gagal mengambil data: " + error.message);
                navigate(-1);
              } finally {
                setLoading(false);
              }
            };
    
            fetchPegawai();
        }, [id, navigate]);

        useEffect(() => {
            setIsChanged(JSON.stringify(pegawaiData) !== JSON.stringify(originalData));
        }, [pegawaiData, originalData]);

    // Fungsi untuk meng-handle perubahan input pada form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPegawaiData((prev) => ({ ...prev, [name]: value }));
    };

    // Fungsi untuk meng-handle perubahan file (foto profil)
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setPegawaiData((prev) => ({ ...prev, [name]: files[0] }));
    };

    // Fungsi untuk menangani pengiriman form
    const update = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("_method", "POST");
            formData.append("nama", pegawaiData.nama);
            formData.append("email", pegawaiData.email);
            formData.append("id_jabatan", pegawaiData.id_jabatan); // Pastikan id_jabatan ada
            if (pegawaiData.foto_profile) {
                formData.append("foto_profile", pegawaiData.foto_profile);
            }
    
            const response = await editPegawai(id, formData); // Menggunakan FormData
    
            if (response.status === "success") {
                toast.success("Data pegawai berhasil diperbarui");
                navigate("/pegawai/Admin/kelolaPegawai"); // Perbaikan URL navigasi
            } else {
                throw new Error(response.message || "Gagal update");
            }
        } catch (err) {
            console.log("Error detail:", err);
            toast.error("Gagal update: " + (err.response?.data?.message || "Terjadi kesalahan"));
        }
    };
    

    // Jika data pegawai sedang di-fetch, tampilkan loading spinner
    if (loading) {
        return (
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
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <div className="text-center mb-3 d-flex flex-column justify-content-center align-items-center">
                <h1 className="mt-1 pb-1 hijau">E D I T</h1>
                <h1 className="mt-1 pb-1 hijau">P E G A W A I</h1>
            </div>
            <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
                <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={update} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Pegawai</Form.Label>
                        <Form.Control
                            className="text-muted"
                            name="nama"
                            value={pegawaiData.nama}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email Pegawai</Form.Label>
                        <Form.Control
                            className="text-muted"
                            type="email"
                            name="email"
                            value={pegawaiData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Jabatan</Form.Label>
                        <Form.Control
                            className="text-muted"
                            as="select"
                            name="id_jabatan"
                            value={pegawaiData.id_jabatan}
                            onChange={handleChange}
                        >
                            <option value="1">Owner</option>
                            <option value="2">Admin</option>
                            <option value="3">Customer Service</option>
                            <option value="4">Hunter</option>
                            <option value="5">Gudang</option>
                            <option value="6">QualityControl</option>
                            <option value="7">Kurir</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Foto Profil (upload baru jika ingin mengubah)</Form.Label>
                        <Form.Control
                            type="file"
                            name="foto_profile"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Form.Group>

                    <div className="d-flex gap-3">
                        <Button type="submit" disabled={!isChanged} className="mt-3 w-100 border-0 buttonSubmit btn-lg rounded-5 shadow-sm" style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}>
                            Simpan
                        </Button>
                        <Button variant="secondary" className="mt-3 w-100 border-0 btn-lg rounded-5 shadow-sm" onClick={() => navigate(-1)}>
                            Kembali
                        </Button>
                    </div>
                </Form>
            </Container>
        </Container>
    );
};

export default EditPegawaiPage;
