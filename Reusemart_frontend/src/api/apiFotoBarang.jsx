import useAxios from ".";

export const GetFotoBarangByIdBarang = async (id_barang) => {
  try {
    const response = await useAxios.get(`/fotobarang/barang/${id_barang}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
