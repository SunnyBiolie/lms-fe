import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const getBookByIdService = async (config) => {
  return await axiosInstance.get(apiBooksRoute.getById, config);
};
