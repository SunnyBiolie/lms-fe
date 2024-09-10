import axiosInstance from "@/api/axios-instance";
import { apiCategoriesRoute } from "@/configs/api.config";

export const deleteCategoryService = async (data) => {
  return await axiosInstance.delete(apiCategoriesRoute.delete, data);
};
