import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/api/analytics"; // Import API
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { useTheme } from "@/components/theme-provider";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({
	title,
	value,
	subtext,
	icon: Icon,
	delay,
	color,
	isLoading,
}) => {
	const { theme } = useTheme();
	const chartColor = theme === "dark" ? "#ffffff" : "#475569";
	const mockChartData = [
		{ value: value * 0.4 },
		{ value: value * 0.6 },
		{ value: value * 0.3 },
		{ value: value * 0.8 },
		{ value: value * 0.5 },
		{ value: value },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: delay, duration: 0.5 }}
		>
			<Card className="border-border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden relative group hover:border-primary/50 transition-all duration-300">
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
					{isLoading ? (
						<Skeleton className="h-9 w-24 mb-1" />
					) : (
						<div className="text-3xl font-bold text-foreground mb-1 tracking-tight">
							{value}
						</div>
					)}
					<div className="flex items-center text-xs">
						<TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
						<p className="text-emerald-500 font-medium">{subtext}</p>
						<span className="text-muted-foreground ml-1">Live data</span>
					</div>
				</CardContent>

				<div className="absolute bottom-0 left-0 w-full h-1/2 opacity-10 pointer-events-none">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={mockChartData}>
							<Area
								type="monotone"
								dataKey="value"
								stroke={chartColor}
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
	// 1. USE REAL DATA
	const { data: stats, isLoading } = useQuery({
		queryKey: ["dashboard-stats"],
		queryFn: fetchDashboardStats,
		refetchInterval: 30000, // Refresh stats every 30 seconds automatically
	});

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div className="flex items-center justify-between">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
				>
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
						SYSTEM ONLINE
					</span>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<StatCard
					title="Total Patients"
					value={stats?.patients || 0}
					subtext="Registered"
					icon={Users}
					delay={0.1}
					color="bg-blue-500"
					isLoading={isLoading}
				/>
				<StatCard
					title="Pending Appointments"
					value={stats?.appointments || 0}
					subtext="Upcoming"
					icon={Calendar}
					delay={0.2}
					color="bg-purple-500"
					isLoading={isLoading}
				/>
				<StatCard
					title="Occupancy Rate"
					value={isLoading ? 0 : `${stats?.occupancy}%`}
					subtext="Across All Wards"
					icon={Activity}
					delay={0.3}
					color="bg-rose-500"
					isLoading={isLoading}
				/>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="mt-6 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-md shadow-sm"
			>
				<div className="flex flex-col items-center justify-center py-10">
					<h3 className="text-xl font-bold mb-2">Workflow Analytics</h3>
					<p className="text-muted-foreground text-center max-w-lg mb-6">
						Real-time patient throughput visualization module is ready for
						future integration (Phase 2).
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default DashboardOverview;
