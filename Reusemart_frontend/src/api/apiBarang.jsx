import useAxios from ".";

export const GetAllBarangs = async () => {
  try {
    const response = await useAxios.get("/barang");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetBarangByCategory = async (id) => {
  try {
    const response = await useAxios.get(`/barang/kategori/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetBarangById = async (id_barang) => {
  try {
    const response = await useAxios.get(`/barang/${id_barang}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const SearchBarang = async (query) => {
  try {
    const response = await useAxios.get(`/barang/search?q=${query}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const donasiByPenitip = async (id_barang) => {
  try {
    const response = await useAxios.put(`/donasiByPenitip/${id_barang}`, {
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
