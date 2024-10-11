import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const searchBooksService = async (data) => {
  return await axiosInstance.post(apiBooksRoute.search, data);
};
