import axiosInstance from "@/api/axios-instance";
import { apiRenewalsRoute } from "@/configs/api.config";

export const countRenewalsByTransactionIdService = async (data) => {
  return await axiosInstance.get(apiRenewalsRoute.countByTransactionId, data);
};
