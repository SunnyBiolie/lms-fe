import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const createBooksService = async function (data) {
  return await axiosInstance.post(apiBooksRoute.create, data);
};
