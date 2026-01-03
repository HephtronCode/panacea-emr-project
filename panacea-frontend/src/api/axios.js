import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// 1. Request Interceptor (Attach Token)
api.interceptors.request.use(
	(config) => {
		const token = sessionStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

/// 2. Response Interceptor (The Smart Adapter)
api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const originalRequest = error.config;

		const backendMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

		// --- THE FIX IS HERE ---
		// Don't auto-logout if we are TRYING to log in.
		// We only auto-logout if it's a different request (like getting patients) that failed.
		const isLoginRequest = originalRequest.url.includes('/auth/login');

		if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
			sessionStorage.clear();
			window.location.href = '/login';
			return Promise.reject(new Error("Session expired. Please login again."));
		}

		const cleanError = new Error(backendMessage);
		cleanError.status = error.response?.status;
		return Promise.reject(cleanError);
	}
);

export default api;
