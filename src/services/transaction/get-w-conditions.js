import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getTransWithConditionsService = async (config) => {
  return await axiosInstance.get(
    apiTransactionsRoute.getWithConditions,
    config
  );
};
