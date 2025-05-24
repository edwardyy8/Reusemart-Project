import useAxios from ".";

export const GetAlamatByIdPembeli = async (id) => {
    try {
        const response = await useAxios.get(`/getAlamatByIdPembeli/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const DeleteAlamat = async (id) => {
    try {
        const response = await useAxios.delete(`/deleteAlamat/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const EditAlamat = async (id, data) => {
    try {
        const response = await useAxios.post(`/editAlamat/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const GetAlamatById = async (id) => {
    try {
        const response = await useAxios.get(`/getAlamatById/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const TambahAlamat = async (data) => {
    try {
        const response = await useAxios.post("/tambahAlamat", data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const GetDefaultAlamat = async () => {
    try {
        const response = await useAxios.get("/getDefaultAlamat", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};