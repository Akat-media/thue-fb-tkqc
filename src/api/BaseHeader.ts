import axios from 'axios';
export const BaseUrl = import.meta.env.VITE_BASE_URL;
export const BaseUrlSocket =
  import.meta.env.VITE_BASE_URL_SOCKET || 'https://api.duynam.store';

const BaseHeader = axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

BaseHeader.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: any = [];

function onRefreshed(newToken: any) {
  refreshSubscribers.forEach((callback: any) => callback(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: any) {
  refreshSubscribers.push(callback);
}

BaseHeader.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((newToken: any) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(BaseHeader(originalRequest));
          });
        });
      }
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refresh_token');
      try {
        const res = await axios.post(BaseUrl + '/refresh-token', {
          refreshToken,
        });
        const { accessToken } = res.data;
        localStorage.setItem('access_token', accessToken);
        onRefreshed(accessToken);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return BaseHeader(originalRequest);
      } catch (refreshError) {
        console.error('Không thể làm mới token:', refreshError);
        window.location.href = '/login';
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status == 405) {
      window.location.href = '/login';
      localStorage.clear();
    }

    return Promise.reject(error);
  }
);

export default BaseHeader;
