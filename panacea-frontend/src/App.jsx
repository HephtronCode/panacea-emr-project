import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext"; // <-- Import this
import LoginPage from "@/pages/LoginPage";

// We'll build Dashboard next, but let's placeholder it so we can test redirection
const DashboardPlaceholder = () => (
	<h1 className="text-3xl p-10">Welcome Doctor</h1>
);

function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="panacea-theme">
			{/* AuthProvider MUST be inside ThemeProvider but outside Routes */}
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						<Route path="/login" element={<LoginPage />} />

						{/* Temporary route for testing */}
						<Route path="/dashboard" element={<DashboardPlaceholder />} />

						<Route path="/" element={<Navigate to="/login" replace />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
