import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Container, Spinner, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import { EditOrganisasi, GetOrganisasiByid } from "../../../api/apiOrganisasi";

const EditOrganisasiPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [organisasiData, setOrganisasiData] = useState({
        nama: "",
        email: "",
        alamat_organisasi: "",
        foto_profile: null,
    });

    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const fetchOrganisasi = async () => {
          try {
            const data = await GetOrganisasiByid(id);
            const cleanedData = { ...data.data, foto_profile: null };
            setOrganisasiData(cleanedData);
            setOriginalData(cleanedData);
          } catch (error) {
            alert("Gagal mengambil data: " + error.message);
            navigate(-1);
          } finally {
            setLoading(false);
          }
        };

        fetchOrganisasi();
    }, [id, navigate]);

    useEffect(() => {
        setIsChanged(JSON.stringify(organisasiData) !== JSON.stringify(originalData));
    }, [organisasiData, originalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrganisasiData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setOrganisasiData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const update = async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append("_method", "POST");
          formData.append("nama", organisasiData.nama);
          formData.append("email", organisasiData.email);
          formData.append("alamat_organisasi", organisasiData.alamat_organisasi);
          if (organisasiData.foto_profile) formData.append("foto_profile", organisasiData.foto_profile);
            console.log("Form Data:", formData);
          const response = await EditOrganisasi(id, formData);
          console.log("API Response:", response);
    
          if (response.status === "success") {
            toast.success("Data organisasi berhasil diperbarui");
            navigate("/pegawai/Admin/kelolaOrganisasi");
          } else {
            throw new Error(response.message || "Gagal update");
          }
        } catch (err) {
          console.log("Error detail:", err);
          toast.error("Gagal update: " + (err.response?.data?.message || "Terjadi kesalahan"));
        }
    };


    if(loading) return (
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
                
                <h1 className="mt-1 pb-1 hijau" >E D I T </h1>
                <h1 className="mt-1 pb-1 hijau" >O R G A N I S A S I </h1>

            </div>
            <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
                <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={update} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                    <Form.Label>Nama Organisasi</Form.Label>
                    <Form.Control className="text-muted" name="nama" value={organisasiData.nama} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>Email Organisasi</Form.Label>
                    <Form.Control className="text-muted" type="email" name="email" value={organisasiData.email} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>Alamat Organisasi</Form.Label>
                    <Form.Control className="text-muted" type="text" name="alamat_organisasi" value={organisasiData.alamat_organisasi} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>Foto Profil (upload baru jika ingin mengubah)</Form.Label>
                    <Form.Control type="file" name="foto_profile" accept="image/*" onChange={handleFileChange} />
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

export default EditOrganisasiPage;