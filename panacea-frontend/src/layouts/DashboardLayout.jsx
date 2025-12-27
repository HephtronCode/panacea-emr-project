import React from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	Users,
	Calendar,
	Activity,
	LogOut,
	Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

const DashboardLayout = () => {
	const { user, logout } = useAuth();
	const { theme, setTheme } = useTheme();
	const navigate = useNavigate();
	const location = useLocation(); // Hook to read the current URL

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	// Logic to determine Page Title based on URL path
	const getPageTitle = () => {
		const path = location.pathname;
		if (path === "/dashboard") return "Overview";
		if (path.includes("/dashboard/patients")) {
			// If path has more than 3 parts (e.g. /dashboard/patients/123), it's a Profile
			return path.split("/").length > 3
				? "Patient Profile"
				: "Patient Registry";
		}
		if (path.includes("/dashboard/appointments")) return "Schedule";
		if (path.includes("/dashboard/records")) return "Medical Records";
		return "System";
	};

	const navItems = [
		{
			label: "Overview",
			path: "/dashboard",
			icon: <LayoutDashboard size={18} />,
		},
		{
			label: "Patients",
			path: "/dashboard/patients",
			icon: <Users size={18} />,
		},
		{
			label: "Appointments",
			path: "/dashboard/appointments",
			icon: <Calendar size={18} />,
		},
		{
			label: "Medical Records",
			path: "/dashboard/records",
			icon: <Activity size={18} />,
		},
	];

	return (
		// Main Container with Semantic Backgrounds
		<div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
			{/* --- GLASS SIDEBAR --- */}
			<motion.aside
				initial={{ x: -100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="w-72 hidden md:flex flex-col border-r border-border bg-card/40 backdrop-blur-xl relative z-20 shadow-2xl"
			>
				{/* Logo Area */}
				<div className="h-20 flex items-center px-8 border-b border-border">
					<div className="p-2 rounded-lg bg-primary/20 mr-3 text-primary shadow-sm">
						<Stethoscope size={24} />
					</div>
					<div>
						<span className="font-bold text-xl tracking-tight block text-foreground">
							Panacea
						</span>
						<span className="text-[10px] text-muted-foreground uppercase tracking-widest">
							Enterprise EMR
						</span>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-4 py-8 space-y-2">
					{navItems.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							end={item.path === "/dashboard"}
							className={({ isActive }) =>
								`group relative flex items-center px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ease-in-out
                ${
									isActive
										? "text-foreground font-semibold"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/30"
								}`
							}
						>
							{({ isActive }) => (
								<>
									{/* Active Indicator Glow */}
									{isActive && (
										<motion.div
											layoutId="activeNav"
											className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20 shadow-sm"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
										/>
									)}
									<span className="relative z-10 flex items-center">
										{item.icon}
										<span className="ml-3 tracking-wide">{item.label}</span>
									</span>
								</>
							)}
						</NavLink>
					))}
				</nav>

				{/* User Footer */}
				<div className="p-6 border-t border-border bg-card/20">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center">
							<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-emerald-500 p-[1px]">
								<div className="w-full h-full rounded-full bg-background flex items-center justify-center border border-border">
									<span className="font-bold text-xs text-foreground">
										{user?.name?.substring(0, 2).toUpperCase()}
									</span>
								</div>
							</div>
							<div className="ml-3">
								<p className="text-sm font-semibold text-foreground">
									{user?.name}
								</p>
								<p className="text-xs text-muted-foreground capitalize">
									{user?.role} Access
								</p>
							</div>
						</div>
					</div>
					<Button
						variant="ghost"
						className="w-full border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
						onClick={handleLogout}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Sign Out Protocol
					</Button>
				</div>
			</motion.aside>

			{/* --- MAIN CONTENT AREA --- */}
			<main className="flex-1 flex flex-col h-screen overflow-hidden relative">
				{/* Gradient Header Line */}
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50 z-20"></div>

				{/* Dynamic Header */}
				<header className="h-20 flex items-center justify-between px-8 bg-background/20 backdrop-blur-md z-10 sticky top-0 border-b border-white/5">
					<h2 className="text-2xl font-light text-muted-foreground">
						Dashboard /{" "}
						<span className="font-bold text-foreground">{getPageTitle()}</span>
					</h2>
					<Button
						variant="outline"
						size="sm"
						className="rounded-full border-border bg-card/50 backdrop-blur-md hover:bg-card"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						{theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
					</Button>
				</header>

				<div className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
