import useAxios from ".";

// Mendapatkan semua penitip
export const GetAllPenitip = async () => {
  try {
    const response = await useAxios.get("/penitip", {
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

// Mendapatkan penitip berdasarkan ID
export const GetPenitipById = async (id_penitip) => {
  try {
    const response = await useAxios.get(`/penitip/${id_penitip}`, {
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
    const response = await useAxios.get(`/penitip/penitipProfile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.penitip;
  } catch (error){
    throw error.response.data;
  }
};

export const getSalesData = async (id_penitip) => {
  try{
    const response = await useAxios.get(`/penitip/${id_penitip}`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error){
    throw error.response.data;
  }
};

export const getPenitipanData = async (id_penitip) => {
  try{
    const response = await useAxios.get(`/penitip/${id_penitip}`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error){
    throw error.response.data;
  }
};