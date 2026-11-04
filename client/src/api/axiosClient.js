import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1",
  withCredentials: true, // Sends httpOnly refresh token cookie
  headers: { "Content-Type": "application/json" },
});

// Attach Access Token in memory (supports legacy token or Clerk token getter)
let accessToken = null;
let clerkTokenGetter = null;

export const setAccessToken = (token) => {
  accessToken = token;
};
export const setClerkTokenGetter = (fn) => {
  clerkTokenGetter = fn;
};

apiClient.interceptors.request.use(async (config) => {
  let token = accessToken;
  if (clerkTokenGetter) {
    try {
      const clerkToken = await clerkTokenGetter();
      if (clerkToken) {
        token = clerkToken;
      }
    } catch {
      // fall back to accessToken
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Silent Token Refresh Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error.response?.data || error);
  },
);

// Domain Service Modules
export const AuthAPI = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  register: (userData) => apiClient.post("/auth/register", userData),
  refresh: () => apiClient.post("/auth/refresh"),
};

export const CatalogAPI = {
  getFeed: (params) => apiClient.get("/products", { params }),
  getBySlug: (slug) => apiClient.get(`/products/${slug}`),
  getCategories: () => apiClient.get("/products/categories"),
  getEditorialGuides: (category) =>
    apiClient.get("/editorial/guides", { params: { category } }),
};

export const AdminAPI = {
  getAccounts: (params) => apiClient.get("/admin/accounts", { params }),
  updateAccountStatus: (id, payload) =>
    apiClient.patch(`/admin/accounts/${id}/status`, payload),
  getAuditLogs: (id) => apiClient.get(`/admin/accounts/${id}/activity`),
  getPresignedMediaUrl: (fileMeta) =>
    apiClient.post("/media/presign", fileMeta),
  createProduct: (payload) => apiClient.post("/admin/products", payload),
};

export const CheckoutAPI = {
  createYoupiSession: (payload) => apiClient.post("/checkout/youpi", payload),
  getSessionStatus: (paymentId) =>
    apiClient.get(`/checkout/session/${paymentId}`),
};
