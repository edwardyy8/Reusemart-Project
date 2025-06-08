import useAxios from ".";

export const GetLaporanDonasiBarang = async (tahun) => {
  try {
    const response = await useAxios.get(`/laporanDonasiBarang/${tahun}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const GetLaporanRekapRequest = async () => {
  try {
    const response = await useAxios.get(`/laporanRekapRequest`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const GetLaporanPenitip = async (tahun, bulan, id) => {
  try {
    const response = await useAxios.get(`/laporanPenitip/${tahun}/${bulan}/${id}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const GetLaporanByKategori = async (tahun) => {
  try {
    const response = await useAxios.get(`/laporanByKategori/${tahun}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const GetLaporanPenitipanHabis = async (tahun) => {
  try {
    const response = await useAxios.get(`/laporanPenitipanHabis/${tahun}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
