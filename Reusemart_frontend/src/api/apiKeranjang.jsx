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