import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const getRelativeBooksByCategories = async (data) => {
  return await axiosInstance.post(apiBooksRoute.getRelativesByCategories, data);
};
