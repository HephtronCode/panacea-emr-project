import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useTheme } from "@/components/theme-provider"; // Import Theme Hook

// Dummy data for the mini-chart
const data = [
	{ value: 400 },
	{ value: 300 },
	{ value: 550 },
	{ value: 450 },
	{ value: 650 },
	{ value: 600 },
	{ value: 750 },
];

const StatCard = ({ title, value, subtext, icon: Icon, delay, color }) => {
	const { theme } = useTheme(); // Detect current theme

	// Determine chart color based on theme
	// Dark mode: White/Light lines. Light mode: Slate/Dark lines.
	const chartColor = theme === "dark" ? "#ffffff" : "#475569"; // Slate-600

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: delay, duration: 0.5 }}
		>
			{/* Switched bg-slate-900 to bg-card (white in light mode) */}
			<Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden relative group hover:border-primary/50 transition-all duration-300">
				{/* Neon Glow effect (Adapted opacity for Light mode) */}
				<div
					className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${color} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity duration-500`}
				></div>

				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
					<CardTitle className="text-sm font-medium text-muted-foreground">
						{title}
					</CardTitle>
					<Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
				</CardHeader>
				<CardContent className="z-10 relative">
					<div className="text-3xl font-bold text-foreground mb-1 tracking-tight">
						{value}
					</div>
					<div className="flex items-center text-xs">
						<TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
						<p className="text-emerald-500 font-medium">{subtext}</p>
						<span className="text-muted-foreground ml-1">vs last month</span>
					</div>
				</CardContent>

				{/* Background Chart Decoration */}
				<div className="absolute bottom-0 left-0 w-full h-1/2 opacity-10 pointer-events-none">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data}>
							<Area
								type="monotone"
								dataKey="value"
								stroke={chartColor} // Dynamic Color
								fill={chartColor}
								strokeWidth={2}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</Card>
		</motion.div>
	);
};

const DashboardOverview = () => {
	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div className="flex items-center justify-between">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
				>
					{/* Use standard Foreground color instead of white gradient so it works in light mode */}
					<h1 className="text-4xl font-bold tracking-tight text-foreground">
						Mission Control
					</h1>
					<p className="text-muted-foreground mt-2">
						Live hospital metrics and resource triage.
					</p>
				</motion.div>

				<div className="flex gap-2">
					<span className="flex h-3 w-3 relative">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
						<span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
					</span>
					<span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
						SYSTEM OPERATIONAL
					</span>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-6 md:grid-cols-3">
				<StatCard
					title="Total Patients"
					value="1,234"
					subtext="+12.5%"
					icon={Users}
					delay={0.1}
					color="bg-blue-500"
				/>
				<StatCard
					title="Scheduled Appts"
					value="42"
					subtext="+8%"
					icon={Calendar}
					delay={0.2}
					color="bg-purple-500"
				/>
				<StatCard
					title="ER Occupancy"
					value="88%"
					subtext="+2%"
					icon={Activity}
					delay={0.3}
					color="bg-rose-500"
				/>
			</div>

			{/* Bottom Panel Placeholder */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="mt-6 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-md shadow-sm"
			>
				<div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
					<p className="text-muted-foreground text-sm">
						Real-time Patient Flow Analytics (Component Pending)
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default DashboardOverview;
