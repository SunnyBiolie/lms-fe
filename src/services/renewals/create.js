import axiosInstance from "@/api/axios-instance";
import { apiRenewalsRoute } from "@/configs/api.config";

export const createRenewalService = async (data) => {
  return await axiosInstance.post(apiRenewalsRoute.create, data);
};
