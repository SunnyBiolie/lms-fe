import axiosInstance from "@/api/axios-instance";
import { apiCategoriesRoute } from "@/configs/api.config";

export const editCategoryService = async (data) => {
  return await axiosInstance.post(apiCategoriesRoute.edit, data);
};
