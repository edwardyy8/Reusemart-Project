import useAxios from ".";

const getFotoPegawai = async (filename) => {
    try {
        const response = await useAxios.get(`/pegawai/foto-profile/${filename}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            responseType: "blob",
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
} 


export {getFotoPegawai}; 