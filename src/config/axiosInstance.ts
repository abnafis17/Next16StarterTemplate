// src/api/axiosInstance.ts
import { HOST } from "@/constant";
import { API } from "@/constant/API_PATH";
import axios from "axios";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

const axiosInstance = axios.create({
  baseURL: HOST,
  headers: {
    "Content-Type": "application/json", // Default content type
    Accept: "application/json",
  },
  withCredentials: true,
});

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token found");

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const response = await axios.get(
      baseUrl + "/" + API.GENERATE_ACCESS_TOKEN,
      {
        headers: {
          refreshtoken: `Bearer ${refreshToken}`,
        },
      }
    );

    if (response.status === 200 && response.data?.results?.accessToken) {
      const newAccessToken = response.data?.results?.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      return newAccessToken;
    } else {
      throw new Error("Invalid refresh token response");
    }
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

axiosInstance.interceptors.request.use(
  async (config: any) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Conditionally handle Content-Type
    if (!config.headers?.["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error: any) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   // originalRequest._retry = true;
    //   // const newAccessToken = await refreshAccessToken();
    //   // if (newAccessToken) {
    //   //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //   //   return axiosInstance(originalRequest);
    //   // }
    //   redirectToLogin();
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
