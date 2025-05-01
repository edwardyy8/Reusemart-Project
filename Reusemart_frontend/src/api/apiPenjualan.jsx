import useAxios from ".";

export const GetPenjualanByIdPenitip = async (id) => {
    try {
        const response = await useAxios.get(`/getPenjualanByIdPenitip/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const GetPenjualanById = async (id) => {
    try {
        const response = await useAxios.get(`/getPenjualanById/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}