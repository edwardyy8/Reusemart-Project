import useAxios from ".";

export const getProfileData = async () => {
    try{
      const response = await useAxios.get(`/pembeli/pembeliProfile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      return response.data.pembeli;
    } catch (error){
      throw error.response.data;
    }
};