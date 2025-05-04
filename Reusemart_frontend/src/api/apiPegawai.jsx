import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

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
        const response = await axios.delete(`/deletePegawai/${id_pegawai}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal menghapus data pegawai." };
    }
};

// Tambah pegawai
export const tambahPegawai = async (data) => {
    try {
        const token = sessionStorage.getItem("token");
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Cek jika foto_pegawai ada, append ke FormData
        if (data.foto_pegawai) {
            formData.append('foto_pegawai', data.foto_pegawai);
        }

        const response = await axios.post("/tambahPegawai", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data", // Tentukan tipe konten sebagai multipart/form-data
            },
        });

        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Gagal menambah data pegawai." };
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
