import axios from "axios"; 

export const BASE_URL = "https://laraveledwardy.barioth.web.id";

const useAxios = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export default useAxios;