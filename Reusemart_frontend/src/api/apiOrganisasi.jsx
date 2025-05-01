import useAxios from ".";

export const GetAllOrganisasi = async () => {
  try {
    const response = await useAxios.get("/organisasi", {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const GetOrganisasiById = async (id_organisasi) => {
  try {
    const response = await useAxios.get(`/organisasi/${id_organisasi}`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProfileData = async () => {
  try{
    const response = await useAxios.get(`/organisasi/organisasiPage`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.organisasi;
  } catch (error){
    throw error.response.data;
  }
};