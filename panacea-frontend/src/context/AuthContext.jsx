import React, { createContext, useState, useContext } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	// 1. Initialize State (Try to read user from SessionStorage on load)
	const [user, setUser] = useState(() => {
		try {
			const savedUser = sessionStorage.getItem("user");
			return savedUser ? JSON.parse(savedUser) : null;
		} catch (e) {
			console.error("Error parsing user from session:", e);
			return null;
		}
	});

	// Derived state - if user exists, they are authenticated
	const isAuthenticated = !!user;

	// 2. The Login Action
	const login = async (email, password) => {
		try {
			const response = await api.post("/auth/login", { email, password });

			// STRUCTURAL ADAPTATION:
			// Backend now returns standardized: { success: true, message: "...", data: { token, user } }
			// Axios gives us the body at response.data
			// So the actual payload is at response.data.data

			const payload = response.data.data;

			const { token, user: userData } = payload;

			// Save to Session Storage
			sessionStorage.setItem("token", token);
			sessionStorage.setItem("user", JSON.stringify(userData));

			// Update State
			setUser(userData);
			return { success: true };
		} catch (error) {
			// Our improved axios interceptor (in api/axios.js) ensures 'error.message'
			// is already the clean text message from the backend.
			return { success: false, error: error.message };
		}
	};

	// 3. The Logout Action
	const logout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom Hook to use the Context easily
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
