import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

// Pages and Layouts
import LandingPage from "@/pages/LandingPage"; // <-- NEW: Import LandingPage
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

						{/* --- Public Routes --- */}
						<Route path="/" element={<LandingPage />} /> {/* <-- NEW: Landing page at root */}
						<Route path="/login" element={<LoginPage />} />

						{/* --- Protected Dashboard Routes --- */}
						{/* The Layout contains the Sidebar & Header */}
						<Route path="/dashboard" element={<DashboardLayout />}>

							{/* 1. Dashboard Overview */}
							<Route index element={<DashboardOverview />} />

							{/* 2. Patient Registry & Profile */}
							<Route path="patients" element={<PatientsPage />} />
							<Route path="patients/:id" element={<PatientProfilePage />} />

							{/* 3. Appointment Scheduler */}
							<Route path="appointments" element={<AppointmentsPage />} />

							{/* 4. Clinical Records */}
							<Route path="records" element={<MedicalRecordsPage />} />

							{/* 5. Ward / Unit Management */}
							<Route path="wards" element={<WardsPage />} />

						</Route>

						{/* --- Fallback for unknown paths: Redirect to landing page --- */}
						<Route path="*" element={<Navigate to="/" replace />} />

					</Routes>
				</BrowserRouter>

				{/* Global Toast System (Visible above everything) */}
				<Toaster richColors position="top-right" closeButton expand={true} />

			</AuthProvider>
		</ThemeProvider>
	)
}

export default App;