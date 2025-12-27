import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAppointments, createAppointment } from "@/api/appointments";
import { fetchPatients } from "@/api/patients"; // Needed for the Dropdown!
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
	Plus,
	Calendar,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const AppointmentsPage = () => {
	const queryClient = useQueryClient();
	const { user } = useAuth(); // We need our own ID to set ourselves as the doctor
	const [isOpen, setIsOpen] = useState(false);

	// Form State
	const [formData, setFormData] = useState({
		patientId: "",
		date: "",
		time: "",
		reason: "",
	});

	// 1. QUERY: Get The Schedule
	const {
		data: appointments,
		isLoading: loadingAppts,
		isError,
	} = useQuery({
		queryKey: ["appointments"],
		queryFn: fetchAppointments,
	});

	// 2. QUERY: Get Patients (For the selection dropdown)
	const { data: patients, isLoading: loadingPatients } = useQuery({
		queryKey: ["patients"],
		queryFn: fetchPatients,
	});

	// 3. MUTATION: Book it
	const mutation = useMutation({
		mutationFn: createAppointment,
		onSuccess: () => {
			queryClient.invalidateQueries(["appointments"]);
			setIsOpen(false);
			setFormData({ patientId: "", date: "", time: "", reason: "" });
		},
		onError: (error) => {
			alert(
				"Booking failed: " + (error.response?.data?.message || error.message)
			);
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		// Combine Date and Time into one ISO string
		const fullDate = new Date(`${formData.date}T${formData.time}`);

		mutation.mutate({
			patientId: formData.patientId,
			doctorId: user._id, // Assign to self (Logged in Doctor)
			date: fullDate.toISOString(),
			reason: formData.reason,
		});
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Status Badge Logic
	const getStatusBadge = (status) => {
		const styles = {
			Pending:
				"bg-yellow-500/15 text-yellow-600 border-yellow-200 dark:border-yellow-500/20 dark:text-yellow-400",
			Completed:
				"bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:border-emerald-500/20 dark:text-emerald-400",
			Cancelled:
				"bg-red-500/15 text-red-600 border-red-200 dark:border-red-500/20 dark:text-red-400",
		};
		return styles[status] || styles["Pending"];
	};

	if (isError)
		return (
			<div className="p-8 text-destructive">
				System Error: Scheduler Offline.
			</div>
		);

	return (
		<div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Schedule
					</h1>
					<p className="text-muted-foreground mt-1">
						Upcoming consultations and triage.
					</p>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-3">
					{/* Modal */}
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
								<Plus className="mr-2 h-4 w-4" /> Book Appointment
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[500px] bg-background border-border text-foreground shadow-2xl">
							<DialogHeader>
								<DialogTitle>New Consultation</DialogTitle>
								<DialogDescription className="text-muted-foreground">
									Schedule a visit for an existing patient.
								</DialogDescription>
							</DialogHeader>

							<form onSubmit={handleSubmit} className="grid gap-4 py-4">
								{/* Patient Select */}
								<div className="grid gap-2">
									<Label>Select Patient</Label>
									{loadingPatients ? (
										<Skeleton className="h-10 w-full" />
									) : (
										<select
											name="patientId"
											className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											required
											value={formData.patientId}
											onChange={handleInputChange}
										>
											<option value="">-- Choose a Patient --</option>
											{patients?.map((p) => (
												<option key={p._id} value={p._id}>
													{p.name} ({p.phone})
												</option>
											))}
										</select>
									)}
								</div>

								{/* Date & Time */}
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label>Date</Label>
										<Input
											type="date"
											name="date"
											required
											className="bg-muted/50"
											onChange={handleInputChange}
										/>
									</div>
									<div className="grid gap-2">
										<Label>Time</Label>
										<Input
											type="time"
											name="time"
											required
											className="bg-muted/50"
											onChange={handleInputChange}
										/>
									</div>
								</div>

								{/* Reason */}
								<div className="grid gap-2">
									<Label>Chief Complaint / Reason</Label>
									<Input
										name="reason"
										placeholder="e.g. Migraine, Follow-up..."
										required
										className="bg-muted/50"
										onChange={handleInputChange}
									/>
								</div>

								<DialogFooter className="mt-4">
									<Button type="submit" disabled={mutation.isPending}>
										{mutation.isPending ? "Scheduling..." : "Confirm Booking"}
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* APPOINTMENT TABLE */}
			<div className="rounded-xl border border-border bg-card/50 backdrop-blur-md overflow-hidden shadow-sm">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow className="border-border hover:bg-transparent">
							<TableHead className="text-muted-foreground font-semibold">
								Time & Date
							</TableHead>
							<TableHead className="text-muted-foreground font-semibold">
								Patient
							</TableHead>
							<TableHead className="text-muted-foreground font-semibold">
								Reason
							</TableHead>
							<TableHead className="text-muted-foreground font-semibold">
								Doctor
							</TableHead>
							<TableHead className="text-muted-foreground font-semibold text-right">
								Status
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loadingAppts ? (
							// Skeleton
							[...Array(3)].map((_, i) => (
								<TableRow key={i} className="border-border">
									<TableCell>
										<Skeleton className="h-4 w-32 bg-muted" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-24 bg-muted" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-40 bg-muted" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-20 bg-muted" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-8 w-16 bg-muted ml-auto" />
									</TableCell>
								</TableRow>
							))
						) : appointments?.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-32 text-center text-muted-foreground"
								>
									<div className="flex flex-col items-center justify-center">
										<Calendar className="h-10 w-10 mb-2 opacity-20" />
										<p>No scheduled appointments.</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							appointments?.map((appt) => (
								<motion.tr
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									key={appt._id}
									className="border-b border-border hover:bg-muted/50 transition-colors"
								>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-medium text-foreground">
												{new Date(appt.date).toLocaleDateString()}
											</span>
											<span className="text-xs text-muted-foreground flex items-center">
												<Clock className="h-3 w-3 mr-1" />
												{new Date(appt.date).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}
											</span>
										</div>
									</TableCell>
									<TableCell className="font-medium text-primary">
										{/* The backend populate gives us patient object or just ID if fetch fails. Safely access. */}
										{appt.patient?.name || "Unknown Patient"}
									</TableCell>
									<TableCell className="text-muted-foreground max-w-[200px] truncate">
										{appt.reason}
									</TableCell>
									<TableCell className="text-muted-foreground text-xs">
										{appt.doctor?.name || "Unassigned"}
									</TableCell>
									<TableCell className="text-right">
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
												appt.status
											)}`}
										>
											{appt.status}
										</span>
									</TableCell>
								</motion.tr>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default AppointmentsPage;
