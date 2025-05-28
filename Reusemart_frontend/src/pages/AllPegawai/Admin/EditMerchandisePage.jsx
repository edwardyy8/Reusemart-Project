import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Spinner, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { EditMerchandise, GetMerchandiseById } from "../../../api/apiMerchandise";

const EditMerchandisePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [merchandiseData, setMerchandiseData] = useState({
        nama_merchandise: "",
        stok_merchandise: "",
        poin_merchandise: "",
        foto_merchandise: null
    });

    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const fetchMerchandise = async () => {
            try {
                const data = await GetMerchandiseById(id);
                setMerchandiseData({
                    nama_merchandise: data.data.nama_merchandise,
                    stok_merchandise: data.data.stok_merchandise,
                    poin_merchandise: data.data.poin_merchandise,
                    foto_merchandise: null
                });
                setOriginalData(data.data);
            } catch (error) {
                toast.error("Gagal mengambil data: " + error.message);
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        fetchMerchandise();
    }, [id, navigate]);

    useEffect(() => {
        setIsChanged(JSON.stringify({...merchandiseData, foto_merchandise: merchandiseData.foto_merchandise?.name}) !== JSON.stringify(originalData));
    }, [merchandiseData, originalData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "foto_merchandise") {
            setMerchandiseData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setMerchandiseData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const update = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('nama_merchandise', merchandiseData.nama_merchandise);
            formData.append('stok_merchandise', merchandiseData.stok_merchandise);
            formData.append('poin_merchandise', merchandiseData.poin_merchandise);
            if (merchandiseData.foto_merchandise) {
                formData.append('foto_merchandise', merchandiseData.foto_merchandise);
            }

            const response = await EditMerchandise(id, formData);
            if (response.status === "success") {
                toast.success("Data merchandise berhasil diperbarui");
                navigate("/pegawai/Admin/kelolaMerchandise");
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
                <h1 className="mt-1 pb-1 hijau">M E R C H A N D I S E</h1>
            </div>

            <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
                <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={update}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama Merchandise</Form.Label>
                        <Form.Control
                            className="text-muted"
                            name="nama_merchandise"
                            value={merchandiseData.nama_merchandise}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Stok Merchandise</Form.Label>
                        <Form.Control
                            className="text-muted"
                            type="number"
                            name="stok_merchandise"
                            value={merchandiseData.stok_merchandise}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Poin Merchandise</Form.Label>
                        <Form.Control
                            className="text-muted"
                            type="number"
                            name="poin_merchandise"
                            value={merchandiseData.poin_merchandise}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Foto Merchandise</Form.Label>
                        <Form.Control
                            className="text-muted"
                            type="file"
                            name="foto_merchandise"
                            accept="image/jpeg,image/png,image/jpg,image/gif"
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

export default EditMerchandisePage;