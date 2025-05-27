import axios from "axios";

const VerifyToken = axios.create({
  baseURL: "https://???-api.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

VerifyToken.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

VerifyToken.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default VerifyToken;
