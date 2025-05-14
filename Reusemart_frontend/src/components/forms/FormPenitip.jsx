import { Button, Alert, Spinner, Form, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputFloatingForm from "./InputFloatingForm";

import { createPenitip } from "../../api/apiPenitip";

const FormPenitip = () => {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    nama: "",
    no_ktp: "",
    email: "",
    password: "",
    confirm_password: "",
    foto_ktp: null,
    // foto_profile: null
  });

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    setData({
      ...data,
      [name]: type === "file" ? files[0] : value,
    });
    // setData({ ...data, [event.target.name]: event.target.value });
  };

  const Tambah = (event) => {
    event.preventDefault();
    console.log(data);
    createPenitip(data)
      .then((res) => {
        toast.success(res.message || "Berhasil Menambahkan Penitip");
        navigate("/pegawai/Customer Service/managePenitip");
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
              type="text"
              label="Nama"
              name="nama"
              onChange={handleChange}
              placeholder="Masukkan Nama Penitip"
              required
            />

            <InputFloatingForm
              type="text"
              label="Nomor KTP"
              name="no_ktp"
              onChange={handleChange}
              placeholder="Masukkan Nomor KTP Penitip"
              required
            />

            <InputFloatingForm
              type="email"
              label="Email"
              name="email"
              onChange={handleChange}
              placeholder="Masukkan Email"
              required
            />
  
            <InputFloatingForm
              type="password"
              label="Kata Sandi"
              name="password"
              onChange={handleChange}
              placeholder="Masukkan Password"
              autoComplete="off"
              required
            />
  
            <InputFloatingForm
              type="password"
              label="Konfirmasi Kata Sandi"
              name="confirm_password"
              onChange={handleChange}
              placeholder="Konfirmasi Password"
              autoComplete="off"
              required
            />

            <InputFloatingForm
              type="file"
              label="Foto KTP"
              name="foto_ktp"
              onChange={handleChange}
              required
            />

            {/* <InputFloatingForm
              type="file"
              label="Foto Profile"
              name="foto_profile"
              onChange={handleChange}
              required
            /> */}
              <Button
                type="submit"
                className="mt-3 w-100 border-0 buttonSubmit btn-lg rounded-5 shadow-sm"
                style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
              >
                Daftar
              </Button>

          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default FormPenitip;
