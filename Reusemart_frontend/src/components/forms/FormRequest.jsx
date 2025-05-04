import { Button, Alert, Spinner, Form, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputFloatingForm from "./InputFloatingForm";

import { createRequest } from "../../api/apiOrganisasi";

const FormRequest = () => {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    isi_request:"",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const Tambah = (event) => {
    event.preventDefault();
    console.log(data);

    createRequest(data)
      .then((res) => {
        toast.success(res.message || "Berhasil Menambahkan Request");
        navigate("/organisasi/organisasiPage?tab=donasi");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
    });
  };

  return (
    <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
      <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={Tambah} encType="multipart/form-data">
        <Row className="g-5">
          <Col>

            <InputFloatingForm
              as="textarea"
              rows={4}
              type="text"
              label="Request Barang"
              name="isi_request"
              onChange={handleChange}
              placeholder="Masukkan Request Barang Donasi...."
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
                    disabled={!data.isi_request?.trim()}
                    className="w-50 border-0 buttonSubmit btn-lg rounded-5 shadow-sm" 
                    style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
                >
                    Tambah
                </Button>
            </div>

          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default FormRequest;