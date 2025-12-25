import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";

// Pages and Layouts
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardOverview from "@/pages/DashboardOverview";
import PatientsPage from "@/pages/PatientsPage"; // <-- The New Component

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="panacea-theme">
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						{/* --- Public Route --- */}
						<Route path="/login" element={<LoginPage />} />

						{/* --- Protected Dashboard Routes --- */}
						{/* The Layout acts as the Shell (Sidebar + Header) */}
						<Route path="/dashboard" element={<DashboardLayout />}>
							{/* 1. Dashboard Overview (http://localhost:5173/dashboard) */}
							<Route index element={<DashboardOverview />} />

							{/* 2. Patient Registry (http://localhost:5173/dashboard/patients) */}
							<Route path="patients" element={<PatientsPage />} />
						</Route>

						{/* --- Global Redirects --- */}
						{/* If user goes to root /, send them to dashboard (or login via protection logic) */}
						<Route path="/" element={<Navigate to="/dashboard" replace />} />

						{/* Catch-all for unknown routes */}
						<Route path="*" element={<Navigate to="/dashboard" replace />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
