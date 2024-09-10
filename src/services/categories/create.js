import axiosInstance from "@/api/axios-instance";
import { apiCategoriesRoute } from "@/configs/api.config";

export const createCategoryService = async (data) => {
  return await axiosInstance.post(apiCategoriesRoute.create, data);
};
