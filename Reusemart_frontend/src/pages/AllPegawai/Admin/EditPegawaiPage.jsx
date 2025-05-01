import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { EditPegawai, GetPegawaiByid } from "../../../api/apiPegawai";

const EditPegawaiPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pegawaiData, setPegawaiData] = useState({
        nama_pegawai: "",
        email: "",
        id_jabatan: "",
        foto_profile: null,
        tanggal_lahir: "",
    });

    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const fetchPegawai = async () => {
            try {
                const data = await GetPegawaiByid(id);
                setPegawaiData(data.data);
            } catch (error) {
                toast.error("Gagal mengambil data: " + error.message);
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchPegawai();
    }, [id, navigate]);

    useEffect(() => {
        setIsChanged(JSON.stringify(pegawaiData) !== JSON.stringify({
            nama_pegawai: "",
            email: "",
            id_jabatan: "",
            foto_profile: null,
            tanggal_lahir: "",
        }));
    }, [pegawaiData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPegawaiData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setPegawaiData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("_method", "POST");
            formData.append("nama_pegawai", pegawaiData.nama_pegawai);
            formData.append("email", pegawaiData.email);
            formData.append("id_jabatan", pegawaiData.id_jabatan);
            formData.append("tanggal_lahir", pegawaiData.tanggal_lahir);
            if (pegawaiData.foto_profile) formData.append("foto_profile", pegawaiData.foto_profile);

            const response = await EditPegawai(id, formData);
            toast.success("Pegawai berhasil diperbarui");
            navigate("/pegawai/Admin/kelolaPegawai");
        } catch (err) {
            toast.error("Gagal update: " + err.message);
        }
    };

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
            <h1 className="text-center mb-3">Edit Pegawai</h1>
            <Container className="rounded-3 w-50" style={{ backgroundColor: '#f1ede9' }}>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Pegawai</Form.Label>
                        <Form.Control 
                            name="nama_pegawai" 
                            value={pegawaiData.nama_pegawai} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email Pegawai</Form.Label>
                        <Form.Control 
                            type="email" 
                            name="email" 
                            value={pegawaiData.email} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Jabatan</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="id_jabatan" 
                            value={pegawaiData.id_jabatan} 
                            onChange={handleChange}
                        >
                            {/* Assuming you will fetch jabatan list */}
                            <option value="1">Jabatan 1</option>
                            <option value="2">Jabatan 2</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Foto Profil (upload jika ingin mengubah)</Form.Label>
                        <Form.Control 
                            type="file" 
                            name="foto_profile" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tanggal Lahir</Form.Label>
                        <Form.Control 
                            type="date" 
                            name="tanggal_lahir" 
                            value={pegawaiData.tanggal_lahir} 
                            onChange={handleChange} 
                        />
                    </Form.Group>

                    <Button 
                        type="submit" 
                        disabled={!isChanged} 
                        className="w-100 btn-lg btn-success"
                    >
                        Simpan
                    </Button>
                </Form>
            </Container>
        </Container>
    );
};

export default EditPegawaiPage;
