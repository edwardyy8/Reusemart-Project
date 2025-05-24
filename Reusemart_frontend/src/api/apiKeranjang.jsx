import useAxios from ".";

export const GetKeranjangByIdPembeli = async () => {
  try {
    const response = await useAxios.get(`/getKeranjangByIdPembeli`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const TambahKeranjang = async (data) => {
    try {
        const response = await useAxios.post("/tambahKeranjang", data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
};

export const HandleSelectKeranjang = async (id) => {
    try {
        const response = await useAxios.post(`/handleSelectKeranjang/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const DeleteKeranjang = async (id) => {
    try {
        const response = await useAxios.delete(`/deleteKeranjang/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const DeleteKeranjangHabis = async (id) => {
    try {
        const response = await useAxios.delete(`/deleteKeranjangHabis`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const HandleCheckoutDariBarang = async (id) => {
    try {
        const response = await useAxios.post(`/handleCheckoutDariBarang/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};