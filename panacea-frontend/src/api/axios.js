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

// 2. Response Interceptor (The Smart Adapter)
api.interceptors.response.use(
	(response) => {
		// Backend now returns: { success: true, message: "...", data: {...} }
		// We generally just want the 'response' object to handle normally,
		// or we can strictly return response.data if we trust the format.
		return response;
	},
	(error) => {
		// UNIFIED ERROR HANDLING
		const originalRequest = error.config;

		// Extract the simplified error message from our backend Standard Response
		const backendMessage =
			error.response?.data?.message ||
			error.message ||
			"An unexpected error occurred";

		// Log it for dev
		console.error("API Error:", backendMessage);

		// Optional: Detect 401 (Expired Token) and auto-logout
		if (error.response?.status === 401 && !originalRequest._retry) {
			sessionStorage.clear();
			window.location.href = "/login";
			return Promise.reject(new Error("Session expired. Please login again."));
		}

		// Return a cleaner error object to the component
		// Instead of error.response.data, we attach the message directly to the error object used in catch
		const cleanError = new Error(backendMessage);
		cleanError.status = error.response?.status;
		return Promise.reject(cleanError);
	}
);

export default api;
