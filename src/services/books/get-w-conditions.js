import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const getBooksWithConditionsService = async (data) => {
  return await axiosInstance.post(apiBooksRoute.getWithConditions, data);
};
