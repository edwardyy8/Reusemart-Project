import axios from ".";

export const GetAllOrganisasi = async () => {
    try {
        const response = await axios.get("/getAllOrganisasi", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const DeleteOrganisasi = async (id) => {
    try {
        const response = await axios.delete(`/deleteOrganisasi/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const EditOrganisasi = async (id, data) => {
    try {
        const response = await axios.post(`/editOrganisasi/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const GetOrganisasiByid = async (id) => {
    try {
        const response = await axios.get(`/getOrganisasi/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};