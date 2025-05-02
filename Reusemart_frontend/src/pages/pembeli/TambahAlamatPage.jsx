import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Container, Spinner, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

import { TambahAlamat } from "../../api/apiAlamat";

import reusemart from "../../assets/images/titlereuse.png";
import InputFloatingForm from "../../components/forms/InputFloatingForm";

const TambahAlamatPage = () => {
    const navigate = useNavigate();

    const [alamatData, setAlamatData] = useState({
        label_alamat: "",
        nama_penerima: "",
        alamat_organisasi: "",
        no_hp: "",
        is_default: false,
    });

    const [loading, setLoading] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [isCheckDis, setIsCheckDis] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAlamatData((prev) => ({ 
          ...prev, 
          [name]: type==="checkbox" ? checked : value 
        }));
      };

    const tambah = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const response = await TambahAlamat(alamatData);
          console.log("API Response:", response);
    
          if (response.status) {
            toast.success("Data Alamat berhasil ditambahkan");
            navigate("/pembeli/profile?tab=alamat")
          } else {
            throw new Error(response.message || "Gagal update");
          }
        } catch (err) {
          console.log("Error detail:", err);
          toast.error("Gagal tambah: " + (err.message || "Terjadi kesalahan"));
        }
        finally {
            setLoading(false);
        }
    };


    if(loading) return (
        <div className="text-center" style={{minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
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
            <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
                  <img src={reusemart} alt="ReuseMart" />
                  <div className="d-flex flex-column justify-content-center text-start">
                    <h1 className="mt-1 pb-1 hijau" >T A M B A H</h1>
                    <h1 className="mt-1 pb-1 hijau" >A L A M A T </h1>
                  </div>
                </div>
            <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
                <Form style={{ maxWidth: "550px", margin: "auto" }} onSubmit={tambah}>
                    <InputFloatingForm label="Label Alamat" type="text" name="label_alamat" value={alamatData.label_alamat} onChange={handleChange} placeholder="Masukkan label alamat" required/>

                    <InputFloatingForm label="Nama Penerima" type="text" name="nama_penerima" value={alamatData.nama_penerima} onChange={handleChange} placeholder="Masukkan nama penerima" required/>
                    
                    <InputFloatingForm label="Nomor Telepon" type="text" name="no_hp" value={alamatData.no_hp} onChange={handleChange} placeholder="Masukkan nomor hp" required/>

                    <Form.Group className="mb-3">
                      <Form.Label className="abu83 h5">Alamat Lengkap</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="nama_alamat" 
                        onChange={handleChange}
                        value={alamatData.nama_alamat}
                        placeholder="Masukkan alamat lengkap"
                        required
                      />
                    </Form.Group>

                    <label className="d-flex justify-content-start">
                        <Form.Check type="checkbox" onChange={handleChange} name="is_default" checked={alamatData.is_default} disabled={isCheckDis}/>
                        <p className="ms-2 abu83">
                            Tandai Sebagai Default
                        </p>
                    </label>

                    <div className="d-flex gap-3">
                        <Button variant="secondary" className="mt-3 w-100 border-0 btn-lg rounded-5 shadow-sm" onClick={() => navigate("/pembeli/profile?tab=alamat")}>
                            Kembali
                        </Button>
                        <Button type="submit" className="mt-3 w-100 border-0 buttonSubmit btn-lg rounded-5 shadow-sm" style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}>
                            Simpan
                        </Button>
                    </div>
                </Form>
            </Container>
       </Container>
    );
};

export default TambahAlamatPage;