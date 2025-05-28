import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Spinner, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { CreateMerchandise } from "../../../api/apiMerchandise";

const TambahMerchandisePage = () => {
    const navigate = useNavigate();

    const [merchandiseData, setMerchandiseData] = useState({
        nama_merchandise: "",
        stok_merchandise: "",
        poin_merchandise: "",
        foto_merchandise: null
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "foto_merchandise" && files[0]) {
            setMerchandiseData((prev) => ({ ...prev, [name]: files[0] }));
            setPreviewImage(URL.createObjectURL(files[0]));
        } else {
            setMerchandiseData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validasi frontend
        if (!merchandiseData.nama_merchandise || merchandiseData.nama_merchandise.trim() === "") {
            toast.error("Nama merchandise harus diisi");
            setLoading(false);
            return;
        }
        if (merchandiseData.stok_merchandise === "" || isNaN(merchandiseData.stok_merchandise) || parseInt(merchandiseData.stok_merchandise) < 0) {
            toast.error("Stok merchandise harus berupa angka positif");
            setLoading(false);
            return;
        }
        if (merchandiseData.poin_merchandise === "" || isNaN(merchandiseData.poin_merchandise) || parseInt(merchandiseData.poin_merchandise) < 0) {
            toast.error("Poin merchandise harus berupa angka positif");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('nama_merchandise', merchandiseData.nama_merchandise);
            formData.append('stok_merchandise', parseInt(merchandiseData.stok_merchandise)); // Konversi ke integer
            formData.append('poin_merchandise', parseInt(merchandiseData.poin_merchandise)); // Konversi ke integer
            if (merchandiseData.foto_merchandise) {
                formData.append('foto_merchandise', merchandiseData.foto_merchandise);
            }

            const response = await CreateMerchandise(formData);
            if (response.status === "success") {
                toast.success("Merchandise berhasil ditambahkan");
                navigate("/pegawai/Admin/kelolaMerchandise");
            } else {
                throw new Error(response.message || "Gagal menambah merchandise");
            }
        } catch (err) {
            // Tangani error validasi (422) atau error lain
            if (err.response?.status === 422 && err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(", ");
                toast.error(`Validasi gagal: ${errorMessages}`);
            } else {
                toast.error("Gagal menambah merchandise: " + (err.response?.data?.message || err.message || "Terjadi kesalahan"));
            }
        } finally {
            setLoading(false);
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
                <h1 className="mt-1 pb-1 hijau">T A M B A H</h1>
                <h1 className="mt-1 pb-1 hijau">M E R C H A N D I S E</h1>
            </div>

            <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
                <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={handleSubmit}>
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
                            min="0"
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
                            min="0"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Foto Merchandise</Form.Label>
                        <Form.Control
                            className="text-muted"
                            type="file"
                            name="foto_merchandise"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
                            />
                        )}
                    </Form.Group>

                    <div className="d-flex gap-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="mt-3 w-100 border-0 buttonSubmit btn-lg rounded-5 shadow-sm"
                            style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
                        >
                            Simpan
                        </Button>
                        <Button
                            variant="secondary"
                            className="mt-3 w-100 border-0 btn-lg rounded-5 shadow-sm"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                        >
                            Kembali
                        </Button>
                    </div>
                </Form>
            </Container>
        </Container>
    );
};

export default TambahMerchandisePage;