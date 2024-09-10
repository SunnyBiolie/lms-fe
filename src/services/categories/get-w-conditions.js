import axiosInstance from "@/api/axios-instance";
import { apiCategoriesRoute } from "@/configs/api.config";

export const getCategoriesWithConditionsService = async (data) => {
  return await axiosInstance.post(apiCategoriesRoute.getWithConditions, data);
};
