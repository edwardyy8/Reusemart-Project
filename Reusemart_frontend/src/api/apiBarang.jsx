import useAxios from ".";  

// Mendapatkan semua barang
export const GetAllBarangs = async () => {
  try {
    const response = await useAxios.get("/barang", {
      headers: {
        "Content-Type": "application/json",
      //   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Mendapatkan barang kategori utama
export const GetBarangByCategory = async (id) => {
  try {
    const response = await useAxios.get(`/barang/kategori/${id}`, {
      headers: {
        "Content-Type": "application/json",
      //   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
}

// Mendapatkan barang dari id
export const GetBarangById = async (id_barang) => {
  try {
    const response = await useAxios.get(`/barang/${id_barang}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};


