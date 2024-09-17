import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getAdmSearchTransOptsService = async (config) => {
  return await axiosInstance.get(
    apiTransactionsRoute.getAdmSearchTransOpts,
    config
  );
};
