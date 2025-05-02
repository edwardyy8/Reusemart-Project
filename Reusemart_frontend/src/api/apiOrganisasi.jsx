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

export const getRequestDonasiByOrganisasi = async () => {
  try{
    const response = await useAxios.get('/organisasi/request-donasi', {
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

export const getRequestDonasiById = async (id) => {
  try {
    const response = await useAxios.get(`/organisasi/request-donasi/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createRequest = async (data) => {
  try{
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
    });
    const response = await useAxios.post("/request_donasi", formData,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteRequestById = async (id_request) => {
  try {
    const response = await useAxios.delete(`/request_donasi/${id_request}`, {
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

export const updateRequestById = async (id, data) => {
  const token = sessionStorage.getItem("token");
  const response = await useAxios.post(`request_donasi/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    }
  });
  return response.data;
};
