import axiosInstance from "@/api/axios-instance";
import { apiReportsRoute } from "@/configs/api.config";

export const calculateMembershipService = async (data) => {
  return await axiosInstance.post(apiReportsRoute.calculateMembership, data);
};
