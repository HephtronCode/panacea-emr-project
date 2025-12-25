import React, { createContext, useState, useEffect, useContext } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	// 1. Initialize State (Try to read user from SessionStorage on load)
	const [user, setUser] = useState(() => {
		const savedUser = sessionStorage.getItem("user");
		return savedUser ? JSON.parse(savedUser) : null;
	});

	// Derived state - if user exists, they are authenticated
	const isAuthenticated = !!user;

	// 2. The Login Action
	const login = async (email, password) => {
		try {
			const response = await api.post("/auth/login", { email, password });

			// Expected response: { token, data: { ...user } }
			const { token, data } = response.data;

			// Save to Session Storage
			sessionStorage.setItem("token", token);
			sessionStorage.setItem("user", JSON.stringify(data));

			// Update State
			setUser(data);
			return { success: true };
		} catch (error) {
			// Return error message to the component
			const message = error.response?.data?.message || "Login failed";
			return { success: false, error: message };
		}
	};

	// 3. The Logout Action
	const logout = () => {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
		setUser(null);
		// Optional: window.location.href = '/login';
	};

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom Hook to use the Context easily
export const useAuth = () => {
	return useContext(AuthContext);
};
