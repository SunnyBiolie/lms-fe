import axiosInstance from "@/api/axios-instance";
import { apiRenewalsRoute } from "@/configs/api.config";

export const getRenewalsByTransactionIdService = async (data) => {
  return await axiosInstance.get(apiRenewalsRoute.getByTransactionId, data);
};
