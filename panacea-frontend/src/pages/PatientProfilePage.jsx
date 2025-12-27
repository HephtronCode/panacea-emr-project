import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPatientById, updatePatientProfile } from "@/api/patients";
import { fetchPatientRecords } from "@/api/records";
import { fetchPatientAppointments } from "@/api/appointments";
import { motion } from "framer-motion";
import {
	User,
	Phone,
	MapPin,
	Calendar,
	FileText,
	Activity,
	Edit2,
	Save,
	X,
} from "lucide-react";

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PatientProfilePage = () => {
	const { id } = useParams(); // Get ID from URL
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// State for Editing
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({});

	// 1. FETCH DETAILS
	const {
		data: patient,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["patient", id],
		queryFn: () => fetchPatientById(id),
	});

	// 2. FETCH HISTORY
	const { data: records } = useQuery({
		queryKey: ["records", id],
		queryFn: () => fetchPatientRecords(id),
		enabled: !!patient, // Only run if patient exists
	});

	// 3. FETCH SCHEDULE
	const { data: appointments } = useQuery({
		queryKey: ["appointments", id],
		queryFn: () => fetchPatientAppointments(id),
		enabled: !!patient,
	});

	// 4. UPDATE MUTATION
	const updateMutation = useMutation({
		mutationFn: updatePatientProfile,
		onSuccess: (data) => {
			queryClient.setQueryData(["patient", id], data); // Optimistic Update
			setIsEditing(false);
		},
		onError: (err) => alert(err.message),
	});

	// Handle Edit Mode Toggle
	useEffect(() => {
		if (patient) setEditForm(patient);
	}, [patient]);

	const handleSave = () => {
		updateMutation.mutate({ id, data: editForm });
	};

	if (isLoading)
		return (
			<div className="p-8">
				<Skeleton className="h-64 w-full" />
			</div>
		);
	if (isError)
		return <div className="p-8 text-destructive">Patient not found.</div>;

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* TOP HEADER / PROFILE CARD */}
			<div className="relative rounded-xl border border-border bg-card overflow-hidden">
				<div className="h-32 bg-gradient-to-r from-primary/20 to-emerald-500/20"></div>
				<div className="px-6 pb-6 relative flex flex-col md:flex-row md:items-end gap-6 -mt-12">
					{/* Avatar */}
					<div className="h-24 w-24 rounded-full border-4 border-card bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground shadow-xl">
						{patient.name?.charAt(0)}
					</div>

					{/* Details */}
					<div className="flex-1 space-y-2 mb-2">
						{isEditing ? (
							<div className="space-y-2 max-w-md">
								<Input
									value={editForm.name}
									onChange={(e) =>
										setEditForm({ ...editForm, name: e.target.value })
									}
									className="text-lg font-bold"
								/>
								<div className="flex gap-2">
									<Input
										value={editForm.phone}
										onChange={(e) =>
											setEditForm({ ...editForm, phone: e.target.value })
										}
									/>
									<Input
										value={editForm.address}
										onChange={(e) =>
											setEditForm({ ...editForm, address: e.target.value })
										}
									/>
								</div>
							</div>
						) : (
							<>
								<h1 className="text-3xl font-bold text-foreground">
									{patient.name}
								</h1>
								<div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
									<div className="flex items-center">
										<Phone className="w-4 h-4 mr-1" /> {patient.phone}
									</div>
									<div className="flex items-center">
										<MapPin className="w-4 h-4 mr-1" />{" "}
										{patient.address || "No address"}
									</div>
									<div className="flex items-center">
										<Calendar className="w-4 h-4 mr-1" /> Born:{" "}
										{new Date(patient.dob).toLocaleDateString()}
									</div>
									<Badge
										variant={
											patient.gender === "Male" ? "default" : "secondary"
										}
									>
										{patient.gender}
									</Badge>
								</div>
							</>
						)}
					</div>

					{/* Actions */}
					<div className="flex gap-2 mb-2">
						{isEditing ? (
							<>
								<Button variant="ghost" onClick={() => setIsEditing(false)}>
									<X className="w-4 h-4 mr-2" /> Cancel
								</Button>
								<Button
									onClick={handleSave}
									disabled={updateMutation.isPending}
									className="bg-emerald-600 hover:bg-emerald-700"
								>
									<Save className="w-4 h-4 mr-2" />{" "}
									{updateMutation.isPending ? "Saving..." : "Save Changes"}
								</Button>
							</>
						) : (
							<Button variant="outline" onClick={() => setIsEditing(true)}>
								<Edit2 className="w-4 h-4 mr-2" /> Edit Profile
							</Button>
						)}
					</div>
				</div>
			</div>

			{/* CONTENT TABS */}
			<Tabs defaultValue="clinical" className="w-full">
				<TabsList className="bg-card/50 backdrop-blur border border-border">
					<TabsTrigger value="clinical">Clinical History</TabsTrigger>
					<TabsTrigger value="appointments">Appointments</TabsTrigger>
					<TabsTrigger value="info">Extended Details</TabsTrigger>
				</TabsList>

				{/* 1. CLINICAL RECORDS TAB */}
				<TabsContent value="clinical" className="space-y-4 mt-6">
					{records?.length === 0 ? (
						<div className="text-center p-12 text-muted-foreground border border-dashed rounded-lg border-border">
							No medical history on file.
						</div>
					) : (
						records?.map((rec) => (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								key={rec._id}
							>
								<Card>
									<CardHeader className="bg-muted/30 pb-3">
										<div className="flex justify-between items-center">
											<CardTitle className="text-lg font-medium flex items-center">
												<Activity className="w-4 h-4 mr-2 text-primary" />
												{rec.diagnosis}
											</CardTitle>
											<span className="text-xs text-muted-foreground">
												{new Date(rec.createdAt).toLocaleDateString()}
											</span>
										</div>
									</CardHeader>
									<CardContent className="pt-4 grid md:grid-cols-2 gap-4">
										<div>
											<Label className="text-xs text-muted-foreground uppercase">
												Treatment
											</Label>
											<p className="mt-1">{rec.treatment}</p>
										</div>
										<div className="grid grid-cols-2 gap-2 text-sm bg-muted/50 p-2 rounded">
											<div>
												<span className="text-muted-foreground">BP:</span>{" "}
												{rec.vitals?.bloodPressure || "--"}
											</div>
											<div>
												<span className="text-muted-foreground">Temp:</span>{" "}
												{rec.vitals?.temperature}°C
											</div>
										</div>
										{rec.prescriptions?.length > 0 && (
											<div className="col-span-2">
												<Label className="text-xs text-muted-foreground uppercase">
													Prescriptions
												</Label>
												<div className="flex gap-2 flex-wrap mt-2">
													{rec.prescriptions.map((pill, idx) => (
														<Badge
															key={idx}
															variant="outline"
															className="border-primary/20 text-primary"
														>
															{pill.medicine} ({pill.dosage})
														</Badge>
													))}
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						))
					)}
				</TabsContent>

				{/* 2. APPOINTMENTS TAB */}
				<TabsContent value="appointments" className="space-y-4 mt-6">
					<Card>
						<CardContent className="p-0">
							{appointments?.length === 0 ? (
								<div className="p-6 text-center text-muted-foreground">
									No upcoming visits.
								</div>
							) : (
								appointments?.map((apt, idx) => (
									<div
										key={apt._id}
										className={`flex justify-between items-center p-4 ${
											idx !== appointments.length - 1
												? "border-b border-border"
												: ""
										}`}
									>
										<div className="flex gap-4 items-center">
											<div className="bg-primary/10 text-primary p-2 rounded">
												<Calendar className="w-5 h-5" />
											</div>
											<div>
												<p className="font-semibold text-foreground">
													{new Date(apt.date).toLocaleDateString()}
												</p>
												<p className="text-sm text-muted-foreground">
													{new Date(apt.date).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-medium">{apt.reason}</p>
											<Badge
												variant={
													apt.status === "Completed" ? "default" : "secondary"
												}
											>
												{apt.status}
											</Badge>
										</div>
									</div>
								))
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* 3. INFO TAB */}
				<TabsContent value="info" className="mt-6">
					<Card>
						<CardHeader>
							<CardTitle>Full Registration Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<div className="grid grid-cols-3 py-2 border-b border-border">
								<span className="text-muted-foreground">Registered By</span>
								<span className="col-span-2 font-medium">
									{patient.registeredBy?.name || "System Admin"}
								</span>
							</div>
							<div className="grid grid-cols-3 py-2 border-b border-border">
								<span className="text-muted-foreground">Registration ID</span>
								<span className="col-span-2 font-mono text-xs">
									{patient._id}
								</span>
							</div>
							<div className="grid grid-cols-3 py-2">
								<span className="text-muted-foreground">Initial History</span>
								<span className="col-span-2">
									{patient.medicalHistory?.length > 0
										? patient.medicalHistory.join(", ")
										: "None Recorded"}
								</span>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default PatientProfilePage;
