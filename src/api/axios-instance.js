import axios from "axios";
import apiRoot from "@/configs/api.config";

const axiosInstance = axios.create({
  baseURL: apiRoot,
  withCredentials: true,
});

export default axiosInstance;
