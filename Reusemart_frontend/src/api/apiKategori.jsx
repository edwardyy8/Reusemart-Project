import useAxios from ".";

// Get all categories
export const GetAllKategoris = async () => {
  try {
    const response = await useAxios.get("/kategori", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get single category by id (optional)
export const GetKategoriById = async (id) => {
  try {
    const response = await useAxios.get(`/kategori/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
