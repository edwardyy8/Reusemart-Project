import useAxios from ".";

export const GetAllBarangs = async () => {
  try {
    const response = await useAxios.get("/barang");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetBarangByCategory = async (id) => {
  try {
    const response = await useAxios.get(`/barang/kategori/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetBarangById = async (id_barang) => {
  try {
    const response = await useAxios.get(`/barang/${id_barang}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const SearchBarang = async (query) => {
  try {
    const response = await useAxios.get(`/barang/search?q=${query}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const donasiByPenitip = async (id_barang) => {
  try {
    const response = await useAxios.put(`/donasiByPenitip/${id_barang}`, {
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const AmbilBarang = async (id_barang) =>{
  try{
    const response = await useAxios.post(`/ambilBarang/${id_barang}`, {},
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

export const GetAllBarangDiambil = async () =>{
  try{
    const response = await useAxios.get("/getAllBarangDiambil",
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

export const GetAllRequiredTambahBarang = async () => {
    try {
        const response = await useAxios.get("/getAllRequiredTambahBarang", {
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

export const TambahPenitipanBarang = async (formData) => {
    try {
        const response = await useAxios.post("/tambahPenitipanBarang", formData, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const EditPenitipanBarang = async (id, formData) => {
  try {
    const response = await useAxios.post(`/editPenitipanBarang/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Terjadi kesalahan." };
  }
};


export const GetPenitipanBarangById = async (id) => {
    try {
        const response = await useAxios.get(`/getPenitipanBarangById/${id}`, {
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

export const GetAllPenitipanBarang = async () => {
    try {
        const response = await useAxios.get("/getAllPenitipanBarang", {
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


export const GetPenitipanDetails = async (id) => {
  try {
    const response = await useAxios.get(`/penitipan-barang/details/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
    return response.data.data; // Matches the response structure from the controller
  } catch (error) {
    throw error.response?.data || error; // Consistent error handling
  }
};