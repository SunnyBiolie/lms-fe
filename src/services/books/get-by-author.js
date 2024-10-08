import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const getListBooksByAuthor = async (config) => {
  return await axiosInstance.get(apiBooksRoute.getByAuthor, config);
};
