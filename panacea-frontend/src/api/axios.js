import axios from "axios";

// Create a configured instance of axios
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor: Before every request, insert the Token (if it exists)
// This saves us from manually adding "Bearer Token" in every single file.
api.interceptors.request.use((config) => {
	const token = sessionStorage.getItem("token"); // Read from session
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
