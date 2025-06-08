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

export const GetLaporanKomisiBulanan = async (tahun, bulan) => {
  try {
    const response = await useAxios.get(`/laporanKomisiBulanan/${tahun}/${bulan}`, {
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

export const GetLaporanStokGudang = async () => {
  try {
    const response = await useAxios.get(`/laporanStokGudang`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    console.log('JANGAN AJA NGILANG:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error API Stok Gudang:', error.response?.data || error);
    throw error.response?.data || error;
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

export const GetLaporanPenjualanKeseluruhan = async (tahun) => {
  try {
    const response = await useAxios.get(`/laporanPenjualanKeseluruhan/${tahun}`, {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
