import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner"; // <-- New Toaster Import

// Pages and Layouts
import LoginPage from "@/pages/LoginPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardOverview from "@/pages/DashboardOverview";
import PatientsPage from "@/pages/PatientsPage";
import PatientProfilePage from "@/pages/PatientProfilePage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import MedicalRecordsPage from "@/pages/MedicalRecordsPage";
import WardsPage from "@/pages/WardsPage";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="panacea-theme">
			<AuthProvider>
				<BrowserRouter>
					<Routes>
						{/* Public */}
						<Route path="/login" element={<LoginPage />} />

						{/* Private Dashboard Shell */}
						<Route path="/dashboard" element={<DashboardLayout />}>
							<Route index element={<DashboardOverview />} />
							<Route path="patients" element={<PatientsPage />} />
							<Route path="patients/:id" element={<PatientProfilePage />} />
							<Route path="appointments" element={<AppointmentsPage />} />
							<Route path="records" element={<MedicalRecordsPage />} />
							<Route path="wards" element={<WardsPage />} />
						</Route>

						{/* Redirects */}
						<Route path="/" element={<Navigate to="/dashboard" replace />} />
						<Route path="*" element={<Navigate to="/dashboard" replace />} />
					</Routes>
				</BrowserRouter>

				{/* Global Toast System (Visible above everything) */}
				<Toaster richColors position="top-right" closeButton expand={true} />
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
