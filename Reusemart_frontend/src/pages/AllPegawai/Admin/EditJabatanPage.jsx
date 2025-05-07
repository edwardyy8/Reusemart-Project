import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Spinner, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import { EditJabatan, GetJabatanById } from "../../../api/apiJabatan";

const EditJabatanPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [jabatanData, setJabatanData] = useState({
        nama_jabatan: "",
    });

    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const fetchJabatan = async () => {
            try {
                const data = await GetJabatanById(id);
                setJabatanData(data.data);
                setOriginalData(data.data);
            } catch (error) {
                alert("Gagal mengambil data: " + error.message);
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchJabatan();
    }, [id, navigate]);

    useEffect(() => {
        setIsChanged(JSON.stringify(jabatanData) !== JSON.stringify(originalData));
    }, [jabatanData, originalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJabatanData((prev) => ({ ...prev, [name]: value }));
    };

    const update = async (e) => {
        e.preventDefault();
        try {
            const response = await EditJabatan(id, jabatanData);
            if (response.status === "success") {
                toast.success("Data jabatan berhasil diperbarui");
                navigate("/pegawai/Admin/kelolaJabatan");
            } else {
                throw new Error(response.message || "Gagal update");
            }
        } catch (err) {
            toast.error("Gagal update: " + (err.response?.data?.message || "Terjadi kesalahan"));
        }
    };

    if (loading)
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

    return (
        <Container className="mt-5 mb-5">
            <div className="text-center mb-3 d-flex flex-column justify-content-center align-items-center">
                <h1 className="mt-1 pb-1 hijau">E D I T</h1>
                <h1 className="mt-1 pb-1 hijau">J A B A T A N</h1>
            </div>

            <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
                <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={update}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Jabatan</Form.Label>
                        <Form.Control
                            className="text-muted"
                            name="nama_jabatan"
                            value={jabatanData.nama_jabatan}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="d-flex gap-3">
                        <Button
                            type="submit"
                            disabled={!isChanged}
                            className="mt-3 w-100 border-0 buttonSubmit btn-lg rounded-5 shadow-sm"
                            style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
                        >
                            Simpan
                        </Button>
                        <Button
                            variant="secondary"
                            className="mt-3 w-100 border-0 btn-lg rounded-5 shadow-sm"
                            onClick={() => navigate(-1)}
                        >
                            Kembali
                        </Button>
                    </div>
                </Form>
            </Container>
        </Container>
    );
};

export default EditJabatanPage;
