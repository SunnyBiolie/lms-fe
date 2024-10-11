import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const getLikedByAccIdService = async (config) => {
  return await axiosInstance.get(apiBooksRoute.getLikedByAccId, config);
};
