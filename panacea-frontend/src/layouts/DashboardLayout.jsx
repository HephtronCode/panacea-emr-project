import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion"; // Animation library
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

	const handleLogout = () => {
		logout();
		navigate("/login");
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
		// Background mesh is handled in index.css
		<div className="flex h-screen overflow-hidden bg-background/50 backdrop-blur-3xl text-foreground">
			{/* --- GLASS SIDEBAR --- */}
			<motion.aside
				initial={{ x: -100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="w-72 hidden md:flex flex-col border-r border-white/10 bg-slate-900/60 backdrop-blur-xl relative z-20 shadow-2xl"
			>
				{/* Logo Area */}
				<div className="h-20 flex items-center px-8 border-b border-white/5">
					<div className="p-2 rounded-lg bg-primary/20 mr-3 text-primary shadow-[0_0_15px_rgba(56,189,248,0.3)]">
						<Stethoscope size={24} />
					</div>
					<div>
						<span className="font-bold text-xl tracking-tight block">
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
										? "text-white"
										: "text-slate-400 hover:text-slate-100 hover:bg-white/5"
								}`
							}
						>
							{({ isActive }) => (
								<>
									{/* Active Indicator Glow */}
									{isActive && (
										<motion.div
											layoutId="activeNav"
											className="absolute inset-0 bg-primary/20 rounded-xl border border-primary/20 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
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
				<div className="p-6 border-t border-white/5 bg-slate-950/30">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center">
							<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-emerald-500 p-[1px]">
								<div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
									<span className="font-bold text-xs">
										{user?.name?.substring(0, 2).toUpperCase()}
									</span>
								</div>
							</div>
							<div className="ml-3">
								<p className="text-sm font-semibold text-white/90">
									{user?.name}
								</p>
								<p className="text-xs text-primary/80 capitalize">
									{user?.role} Access
								</p>
							</div>
						</div>
					</div>
					<Button
						variant="ghost"
						className="w-full border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all"
						onClick={handleLogout}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Sign Out Protocol
					</Button>
				</div>
			</motion.aside>

			{/* --- MAIN CONTENT AREA --- */}
			<main className="flex-1 flex flex-col h-screen overflow-hidden relative">
				{/* Glowing Top Decoration */}
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>

				<header className="h-20 flex items-center justify-between px-8 bg-background/20 backdrop-blur-md z-10">
					<h2 className="text-2xl font-light text-foreground/80">
						Dashboard /{" "}
						<span className="font-bold text-foreground">Overview</span>
					</h2>
					<Button
						variant="outline"
						size="sm"
						className="rounded-full border-white/10 bg-white/5 backdrop-blur-md"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						{theme === "dark" ? "☀" : "🌙"}
					</Button>
				</header>

				<div className="flex-1 overflow-y-auto p-8 relative">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default DashboardLayout;
