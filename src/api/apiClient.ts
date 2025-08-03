import axios from 'axios';
import { toast } from 'react-toastify';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

const shownToasts = new Set<string>();
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status && status >= 400 && status < 500) {
      const msg = error.response?.data?.message ?? error.message;

      if (!shownToasts.has(msg)) {
        toast.error(msg);
        shownToasts.add(msg);
        setTimeout(() => shownToasts.delete(msg), 5000);
      }
    }
    return Promise.reject(error);
  }
);
