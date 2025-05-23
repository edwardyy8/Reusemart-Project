import useAxios from ".";

export const GetAllClaimMerchandise = async () => {
  try {
    const response = await useAxios.get("/getAllClaimMerchandise", {
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

export const GetClaimMerchandiseById = async (id) => {
  try {
    const response = await useAxios.get(`/getClaimMerchandiseById/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data; // Mengembalikan respons jika berhasil
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Gagal menghapus request donasi');
    }
  }
};

export const ConfirmClaimMerchandise = async (id_request) => {
  try {
    const id_pegawai = sessionStorage.getItem("id_pegawai");
    const response = await useAxios.post(
      `/confirmClaimMerchandise/${id_request}`,
      { id_pegawai },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("ConfirmClaimMerchandise Error:", error);
    throw new Error(error.response?.data?.message || "Gagal mengonfirmasi claim merchandise.");
  }
};

export const GetAllMerchandiseCS = async () => {
  try {
    const response = await useAxios.get("/getAllMerchandiseCS", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,

      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetMerchandiseById = async (id) => {
  try {
    const response = await useAxios.get(`/getMerchandiseById/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,

      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal mengambil data merchandise");
  }
};

export const CreateMerchandise = async (data) => {
  try {
    const response = await useAxios.post("/createMerchandise", data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,

      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal menambah merchandise");
  }
};

export const EditMerchandise = async (id, data) => {
  try {
    const response = await useAxios.put(`/updateMerchandise/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,

      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal memperbarui merchandise");
  }
};

export const DeleteMerchandise = async (id) => {
  try {
    const response = await useAxios.delete(`/deleteMerchandise/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,

      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Gagal menghapus merchandise");
  }
};