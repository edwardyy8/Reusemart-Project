import useAxios from ".";

export const GetDiskusiByIdBarang = async (id_barang) => {
    try {
        const response = await useAxios.get(`/getDiskusiByIdBarang/${id_barang}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const TambahDiskusi = async (data) => {
    try {
        const response = await useAxios.post("/tambahDiskusi", data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const GetAllDiskusiKecualiCS = async () => {
    try {
        const response = await useAxios.get("/getAllDiskusiKecualiCS", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}