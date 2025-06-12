import { API_BASE_URL } from "../config/api";

export const apiClient = async (
  path: string,
  options: RequestInit = {}
): Promise<Response> => {
  return await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
};
