import useAxios from ".";

// Mendapatkan semua penitip
export const GetAllPenitip = async () => {
  try {
    const response = await useAxios.get("/penitip", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProfileData = async () => {
  try{
    const response = await useAxios.get(`/penitipProfile`, {
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
    const response = await useAxios.get(`/getPenitipanByIdPenitip/${id_penitip}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error){
    throw error.response.data;
  }
};

export const deletePenitipById = async (id_penitip) => {
  try {
    const response = await useAxios.post(`/deletePenitip/${id_penitip}`, {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createPenitip = async (data) => {
  try{
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });

    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const response = await useAxios.post("/penitip", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
  
};

export const updatePenitipById = async (id, data) => {
  const token = sessionStorage.getItem("token");
  const response = await useAxios.post(`penitip/${id}?_method=PUT`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${token}`
    }
  });
  return response.data;
};

export const perpanjangRincianPenitipan = async (id_rincianpenitipan, tanggal_akhir) => {
  try {
    const response = await useAxios.put(`/perpanjangRincianPenitipan/${id_rincianpenitipan}`, {
      tanggal_akhir: tanggal_akhir,
      perpanjangan: "Ya"
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const ambilTitipan = async (id_rincianpenitipan) =>{
  try{
    const response = await useAxios.put(`/ambilTitipan/${id_rincianpenitipan}`, {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

