import axios from ".";

export const GetAllJabatan = async () => {
    try {
        const response = await axios.get("/getAllJabatan", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const DeleteJabatan = async (id) => {
    try {
        const response = await axios.delete(`/deleteJabatan/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const EditJabatan = async (id, data) => {
    try {
        const response = await axios.post(`/editJabatan/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const GetJabatanById = async (id) => {
    try {
        const response = await axios.get(`/getJabatan/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

