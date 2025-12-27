import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";

// Pages and Layouts
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardOverview from "@/pages/DashboardOverview";
import PatientsPage from "@/pages/PatientsPage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import MedicalRecordsPage from "@/pages/MedicalRecordsPage"; // <-- New Import

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="panacea-theme">
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						{/* --- Public Route --- */}
						<Route path="/login" element={<LoginPage />} />

						{/* --- Protected Dashboard Routes --- */}
						{/* The Layout contains the Sidebar & Header */}
						<Route path="/dashboard" element={<DashboardLayout />}>
							{/* 1. Dashboard Overview (http://localhost:5173/dashboard) */}
							<Route index element={<DashboardOverview />} />

							{/* 2. Patient Registry (http://localhost:5173/dashboard/patients) */}
							<Route path="patients" element={<PatientsPage />} />

							{/* 3. Appointment Scheduler (http://localhost:5173/dashboard/appointments) */}
							<Route path="appointments" element={<AppointmentsPage />} />

							{/* 4. Clinical Records (http://localhost:5173/dashboard/records) */}
							<Route path="records" element={<MedicalRecordsPage />} />
						</Route>

						{/* --- Global Redirects --- */}
						{/* Redirect root to dashboard */}
						<Route path="/" element={<Navigate to="/dashboard" replace />} />

						{/* Catch-all for 404s - Send to dashboard */}
						<Route path="*" element={<Navigate to="/dashboard" replace />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
