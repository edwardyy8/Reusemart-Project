import useAxios from ".";

export const GetPemesananByIdPembeli = async (id) => {
    try {
        const response = await useAxios.get(`/getPemesananByIdPembeli/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const GetPemesananById = async (id) => {
    try {
        const response = await useAxios.get(`/getPemesananById/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
