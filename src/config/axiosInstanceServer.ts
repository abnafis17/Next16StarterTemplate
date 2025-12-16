// src/api/axiosInstanceServer.ts
import axios from "axios";
import { API } from "@/constant/API_PATH";

const axiosInstanceServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    Accept: "application/json",
  },
});

export const makeServerApiRequest = async ({
  url,
  method = "GET",
  data,
  accessToken,
  refreshToken,
}: {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  accessToken?: string;
  refreshToken?: string;
}): Promise<any> => {
  try {
    // Determine if the data is FormData
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    const response = await axiosInstanceServer.request({
      url,
      method,
      data,
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        // Only set Content-Type if not FormData
        ...(!isFormData && { "Content-Type": "application/json" }),
      },
    });

    return response.data;
  } catch (error: any) {
    return {
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
};
