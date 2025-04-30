import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetPenitipById, updatePenitipById } from "../../api/apiPenitip";
import { Container, Spinner, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const FormEditPenitip = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [penitipData, setPenitipData] = useState({
    nama: "",
    email: "",
    no_ktp: "",
    foto_ktp: null,
    foto_profile: null
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchPenitip = async () => {
      try {
        const data = await GetPenitipById(id);
        const cleanedData = { ...data, foto_ktp: null, foto_profile: null };
        setPenitipData(cleanedData);
        setOriginalData(cleanedData);
      } catch (error) {
        alert("Gagal mengambil data: " + error.message);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchPenitip();
  }, [id, navigate]);

  useEffect(() => {
    setIsChanged(JSON.stringify(penitipData) !== JSON.stringify(originalData));
  }, [penitipData, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPenitipData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setPenitipData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const update = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("nama", penitipData.nama);
      formData.append("email", penitipData.email);
      formData.append("no_ktp", penitipData.no_ktp);
      if (penitipData.foto_ktp) formData.append("foto_ktp", penitipData.foto_ktp);
      if (penitipData.foto_profile) formData.append("foto_profile", penitipData.foto_profile);

      const response = await updatePenitipById(id, formData);
      console.log("API Response:", response);

      if (response.status === "success") {
        toast.success("Data berhasil diperbarui");
        navigate("/pegawai/Customer Service/managePenitip");
      } else {
        throw new Error(response.message || "Gagal update");
      }
    } catch (err) {
      console.log("Error detail:", err);
      alert("Gagal update: " + (err.response?.data?.message || "Terjadi kesalahan"));
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
      <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={update} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Nama Penitip</Form.Label>
          <Form.Control className="text-muted" name="nama" value={penitipData.nama} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nomor KTP</Form.Label>
          <Form.Control className="text-muted" type="text" name="no_ktp" value={penitipData.no_ktp} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email Penitip</Form.Label>
          <Form.Control className="text-muted" type="email" name="email" value={penitipData.email} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Foto KTP (upload baru jika ingin mengubah)</Form.Label>
          <Form.Control type="file" name="foto_ktp" accept="image/*" onChange={handleFileChange} />
        </Form.Group>

        {/* <Form.Group className="mb-3">
          <Form.Label>Foto Profil (upload baru jika ingin mengubah)</Form.Label>
          <Form.Control type="file" name="foto_profile" accept="image/*" onChange={handleFileChange} />
        </Form.Group> */}
        <div className="d-flex flex-row gap-3">
        <Button 
            onClick={() => navigate("/pegawai/Customer Service/managePenitip")} 
            className="w-50 border-0 btn-lg rounded-5 shadow-sm" 
            variant="secondary"
        >
            Kembali
        </Button>
        <Button 
            type="submit" 
            disabled={!isChanged} 
            className="w-50 border-0 buttonSubmit btn-lg rounded-5 shadow-sm" 
            style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
        >
            Simpan
        </Button>
        </div>
      </Form>
    </Container>
  );
};

export default FormEditPenitip;