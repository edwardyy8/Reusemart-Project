import { Button, Alert, Spinner, Form, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputFloatingForm from "./InputFloatingForm";

import { getRequestDonasiById, updateRequestById } from "../../api/apiOrganisasi";

const FormEditRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [requestData, setRequestData] = useState({
    isi_request:"",
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchRequestDonasi= async () => {
      try {
        const data = await getRequestDonasiById(id);
        const cleanedData = { ...data};
        setRequestData(cleanedData);
        setOriginalData(cleanedData);
        
      } catch (error) {
        alert("Gagal mengambil data: " + error.message);
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchRequestDonasi();
  }, [id, navigate]);

  useEffect(() => {
    setIsChanged(JSON.stringify(requestData) !== JSON.stringify(originalData));
  }, [requestData, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({ ...prev, [name]: value }));
  };


  const Update = async (e) => {
    e.preventDefault();

    if(!window.confirm('Apakah kamu yakin ingin mengubah data?')) return;

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("isi_request", requestData?.isi_request);
      console.log("update: ", requestData);
      const response = await updateRequestById(id, formData);
      console.log("API Response:", response);

      if (response.status === "success") {
        toast.success("Data berhasil diperbarui");
        navigate("/organisasi/organisasiPage?tab=donasi");
      } else {
        throw new Error(response.message || "Gagal update");
      }
    } catch (err) {
      console.log("Error detail:", err);
      alert("Gagal update: " + (err.response?.data?.message || "Terjadi kesalahan"));
    }
  };

  return (
    <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
      <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={Update} encType="multipart/form-data">
        <Row className="g-5">
          <Col>
            <InputFloatingForm
                as="textarea"
                rows={4}
                type="text"
                label="Request Barang"
                name="isi_request"
                onChange={handleChange}
                placeholder={requestData.isi_request}
                required
            />
            <div className="d-flex flex-row gap-3">
                <Button 
                    onClick={() => navigate("/organisasi/organisasiPage")} 
                    className="w-50 border-0 btn-lg rounded-5 shadow-sm" 
                    variant="secondary"
                >
                    Kembali
                </Button>
                <Button 
                    type="submit" 
                    disabled={!isChanged || !requestData.isi_request?.trim()} 
                    className="w-50 border-0 buttonSubmit btn-lg rounded-5 shadow-sm" 
                    style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
                >
                    Simpan
                </Button>
            </div>

          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default FormEditRequest;
