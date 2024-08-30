import axiosInstance from "@/api/axios-instance";
import { apiCategoriesRoute } from "@/configs/api.config";

export const getAllCategoriesService = async () => {
  return await axiosInstance.get(apiCategoriesRoute.getAll);
};
