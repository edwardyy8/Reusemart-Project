import useAxios from ".";  
import axios from "axios";

// Mendapatkan semua donasi
export const GetAllDonasis = async () => {
  try {
    const response = await useAxios.get("/donasi", {
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

export const GetAllBarangTerdonasikan = async () => {
  try {
    const response = await useAxios.get("/getAllBarangTerdonasikan", {
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

export const GetRequestNotNull = async () => {
  try {
    const response = await useAxios.get("/getRequestNotNull", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data; // BUKAN .data.data
  } catch (error) {
    console.error("Error saat fetch request donasi:", error);
    throw error.response?.data || error;
  }
};

export const GetAllRequestDonasis = async () => {
  try {
    const response = await useAxios.get("/get-request-donasi", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data; // BUKAN .data.data
  } catch (error) {
    console.error("Error saat fetch request donasi:", error);
    throw error.response?.data || error;
  }
};


export const DeleteRequest = async (id) => {
  try {
    const response = await axios.delete(`/deleteRequestOwner/${id}`, {
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

export const ConfirmRequest = async (id_request) => {
  try {
    const response = await useAxios.post(
      `/confirmRequest/${id_request}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        validateStatus: function (status) {
          // Anggap semua response < 500 sebagai berhasil
          return status < 500;
        },
      }
    );

    if (response.status >= 400) {
      throw response.data; // Paksa masuk catch kalau emang error dari server
    }

    return response.data;
  } catch (error) {
    console.error("ConfirmRequest Error:", error);
    throw error || { message: "Gagal mengonfirmasi request donasi." };
  }
};

// Menambahkan donasi baru
export const CreateDonasiOwner = async (payload) => {
  try {
    const response = await useAxios.post("/createDonasiOwner", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Gagal menambahkan donasi:", error);
    throw error.response?.data || error;
  }
};


export const GetBarangTerdonasikan = async () => {
  try {
    const response = await useAxios.get("/barang/didonasi", {
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

