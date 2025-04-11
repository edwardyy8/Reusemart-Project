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