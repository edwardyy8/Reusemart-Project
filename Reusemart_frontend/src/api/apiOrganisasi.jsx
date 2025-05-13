import useAxios from ".";
import axios from ".";

export const GetAllOrganisasi = async () => {
    try {
        const response = await axios.get("/getAllOrganisasi", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const DeleteOrganisasi = async (id) => {
    try {
        const response = await axios.delete(`/deleteOrganisasi/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const EditOrganisasi = async (id, data) => {
    try {
        const response = await axios.post(`/editOrganisasi/${id}`, data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const GetOrganisasiByid = async (id) => {
    try {
        const response = await axios.get(`/getOrganisasi/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getProfileData = async () => {
  try{
    console.log('asa');
    const response = await useAxios.get(`/organisasi/organisasiPage`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    console.log(response)
    return response.data.organisasi;
  } catch (error){
     throw {
      message: error?.response?.data?.message || error?.message || "Gagal memuat profile",
    };
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
