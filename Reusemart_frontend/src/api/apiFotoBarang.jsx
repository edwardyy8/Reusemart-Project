import useAxios from ".";

// Mendapatkan semua foto barang berdasarkan ID barang
export const GetFotoBarangByIdBarang = async (id_barang) => {
  try {
    const response = await useAxios.get(`/fotobarang/${id_barang}`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
