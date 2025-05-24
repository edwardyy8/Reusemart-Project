import useAxios from ".";

export const GetPemesananByIdPembeli = async (id) => {
    try {
        const response = await useAxios.get(`/getPemesananByIdPembeli/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const GetPemesananById = async (id) => {
    try {
        const response = await useAxios.get(`/getPemesananById/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });

        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const GetPemesananByIdPemesanan = async (id) => {
    try {
        const response = await useAxios.get(`/getPemesananByIdPemesanan/${id}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const GetAllPemesanan = async () => {
    try {
        const response = await useAxios.get("/getAllPemesanan",{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
} 

export const GetAllPemesananUntukNota = async () => {
    try {
        const response = await useAxios.get("/getAllPemesananUntukNota",{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
} 

export const GetAllPickup = async () => {
    try {
        const response = await useAxios.get("/getAllPickup",{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
} 

export const GetAllDelivery = async () => {
    try {
        const response = await useAxios.get("/getAllDelivery", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data
    }
}

export const AmbilPemesanan = async (id_pemesanan) => {
    try {
        const response = await useAxios.post(`/ambilPemesanan/${id_pemesanan}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
}

export const AssignKurir = async (id_pemesanan, id_kurir) => {
  try {
    const response = await useAxios.post(`/assignKurir/${id_pemesanan}`, { id_kurir }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const UpdateTanggalPengiriman = async (id_pemesanan, tanggal_pengiriman) => {
  try {
    const response = await useAxios.post(`/updateTanggalPengiriman/${id_pemesanan}`, 
      { tanggal_pengiriman },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const UpdateTanggalPengambilan = async (id_pemesanan, jadwal_pengambilan) => {
  try {
    const response = await useAxios.post(`/updateTanggalPengambilan/${id_pemesanan}`, 
      { jadwal_pengambilan },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const ShowNota = async (id_pemesanan) => {
  try {
    const response = await useAxios.get(`/showNota/${encodeURIComponent(id_pemesanan)}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const HitungHasil = async (id_pemesanan) => {
  try {
    const response = await useAxios.post(`/hitungHasil/${encodeURIComponent(id_pemesanan)}`, {}, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}







