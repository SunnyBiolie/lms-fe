import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const getBooksService = async (data) => {
  return await axiosInstance.post(apiBooksRoute.get, data);
};
