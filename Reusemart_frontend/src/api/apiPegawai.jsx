import axios from "axios";
import useAxios from ".";

// axios.defaults.baseURL = "http://localhost:8000/api";

// Ambil semua pegawai
export const GetAllPegawai = async () => {
    try {
        const response = await axios.get("/pegawai", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil data pegawai." };
    }
};

// Hapus pegawai
export const DeletePegawai = async (id_pegawai) => {
    try {
        const response = await axios.post(`/deletePegawai/${id_pegawai}`, null, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal menonaktifkan data pegawai." };
    }
};


// Tambah pegawai
export const tambahPegawai = async (formData) => {
    try {
        const response = await useAxios.post("/tambahPegawai", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Edit pegawai
export const editPegawai = async (id, data) => {
    try {
        const response = await axios.post(`/updatePegawai/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Ambil pegawai berdasarkan ID
export const GetPegawaiById = async (id) => {
    try {
        const response = await axios.get(`/getPegawai/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil data pegawai." };
    }
};

// Ambil foto profil pegawai
export const getFotoPegawai = async (filename) => {
    try {
        const response = await axios.get(`/pegawai/foto-profile/${filename}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            responseType: "blob",
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mengambil foto pegawai." };
    }
};

export const GetAllKurir = async () => {
    try {
        const response = await useAxios.get("/getAllKurir", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal mendapatkan list kurir." };
    }
 
};
