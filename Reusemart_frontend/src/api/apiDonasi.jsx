import useAxios from ".";  

// Mendapatkan semua donasi
export const GetAllDonasis = async () => {
    try {
      const response = await useAxios.get("/donasi", {
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