import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRecords, createRecord } from "@/api/records"; // We just made this
import { fetchPatients } from "@/api/patients"; // Need to select patient
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Plus, FileText, Pill, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area"; // Add this component via shadcn if missing, or standard div
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

const MedicalRecordsPage = () => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);

	// Form State
	const [formData, setFormData] = useState({
		patientId: "",
		diagnosis: "",
		treatment: "",
		notes: "",
		vitals: {
			bloodPressure: "",
			temperature: "",
			pulse: "",
			weight: "",
		},
		// Prescription is an Array!
		prescriptions: [],
	});

	// State for the current "pill" being added
	const [currentMeds, setCurrentMeds] = useState({
		medicine: "",
		dosage: "",
		frequency: "",
		duration: "",
	});

	// Queries
	const { data: records, isLoading } = useQuery({
		queryKey: ["records"],
		queryFn: async () => {
			// Fallback for axios config in api file
			// Ensure api/records.js uses the '/records/all' route
			const { default: api } = await import("@/api/axios");
			const { data } = await api.get("/records/all");
			return data.data;
		},
	});

	const { data: patients } = useQuery({
		queryKey: ["patients"],
		queryFn: fetchPatients,
	});

	// Mutation
	const mutation = useMutation({
		mutationFn: createRecord,
		onSuccess: () => {
			queryClient.invalidateQueries(["records"]);
			setIsOpen(false);
			// Reset Form
			setFormData({
				patientId: "",
				diagnosis: "",
				treatment: "",
				notes: "",
				vitals: { bloodPressure: "", temperature: "", pulse: "", weight: "" },
				prescriptions: [],
			});
		},
		onError: (err) => alert("Failed: " + err.response?.data?.message),
	});

	// Helpers
	const addPill = () => {
		if (!currentMeds.medicine) return;
		setFormData((prev) => ({
			...prev,
			prescriptions: [...prev.prescriptions, currentMeds],
		}));
		setCurrentMeds({ medicine: "", dosage: "", frequency: "", duration: "" });
	};

	const removePill = (index) => {
		setFormData((prev) => ({
			...prev,
			prescriptions: prev.prescriptions.filter((_, i) => i !== index),
		}));
	};

	const handleVitalChange = (e) => {
		setFormData((prev) => ({
			...prev,
			vitals: { ...prev.vitals, [e.target.name]: e.target.value },
		}));
	};

	return (
		<div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
			{/* HEADER */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Medical Records
					</h1>
					<p className="text-muted-foreground mt-1">
						Clinical history and treatment logs.
					</p>
				</div>

				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button className="bg-primary shadow-lg shadow-primary/20">
							<Activity className="mr-2 h-4 w-4" /> New Examination
						</Button>
					</DialogTrigger>
					{/* LARGE MODAL */}
					<DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-background border-border text-foreground">
						<DialogHeader>
							<DialogTitle>Clinical Examination</DialogTitle>
							<DialogDescription>
								Record vitals, diagnosis, and treatment plan.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-6 py-4">
							{/* 1. Patient Selection */}
							<div className="grid gap-2">
								<Label>Select Patient</Label>
								<select
									className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus:ring-2 focus:ring-ring"
									value={formData.patientId}
									onChange={(e) =>
										setFormData({ ...formData, patientId: e.target.value })
									}
								>
									<option value="">-- Choose Patient --</option>
									{patients?.map((p) => (
										<option key={p._id} value={p._id}>
											{p.name}
										</option>
									))}
								</select>
							</div>

							{/* 2. Vitals Grid */}
							<div className="p-4 rounded-lg bg-muted/30 border border-border">
								<Label className="mb-3 block text-primary font-semibold">
									Vitals Signs
								</Label>
								<div className="grid grid-cols-4 gap-4">
									<div>
										<Label className="text-xs">BP (mmHg)</Label>
										<Input
											name="bloodPressure"
											placeholder="120/80"
											value={formData.vitals.bloodPressure}
											onChange={handleVitalChange}
											className="bg-background h-8"
										/>
									</div>
									<div>
										<Label className="text-xs">Temp (°C)</Label>
										<Input
											name="temperature"
											type="number"
											placeholder="37.5"
											value={formData.vitals.temperature}
											onChange={handleVitalChange}
											className="bg-background h-8"
										/>
									</div>
									<div>
										<Label className="text-xs">Pulse (bpm)</Label>
										<Input
											name="pulse"
											type="number"
											placeholder="72"
											value={formData.vitals.pulse}
											onChange={handleVitalChange}
											className="bg-background h-8"
										/>
									</div>
									<div>
										<Label className="text-xs">Weight (kg)</Label>
										<Input
											name="weight"
											type="number"
											placeholder="70"
											value={formData.vitals.weight}
											onChange={handleVitalChange}
											className="bg-background h-8"
										/>
									</div>
								</div>
							</div>

							{/* 3. Diagnosis & Treatment */}
							<div className="grid gap-4">
								<div className="grid gap-2">
									<Label>Diagnosis</Label>
									<Input
										placeholder="Primary complaint identification"
										value={formData.diagnosis}
										onChange={(e) =>
											setFormData({ ...formData, diagnosis: e.target.value })
										}
										className="bg-muted/50"
									/>
								</div>
								<div className="grid gap-2">
									<Label>Treatment Plan</Label>
									<Textarea
										placeholder="Recommended procedure / therapy..."
										value={formData.treatment}
										onChange={(e) =>
											setFormData({ ...formData, treatment: e.target.value })
										}
										className="bg-muted/50 min-h-[60px]"
									/>
								</div>
							</div>

							{/* 4. Prescription Builder */}
							<div className="p-4 rounded-lg bg-muted/30 border border-border">
								<Label className="mb-3 block text-primary font-semibold flex items-center">
									<Pill className="h-4 w-4 mr-2" /> Prescriptions
								</Label>

								{/* Mini Form for Pills */}
								<div className="grid grid-cols-12 gap-2 items-end mb-4">
									<div className="col-span-4">
										<Input
											placeholder="Medicine Name"
											value={currentMeds.medicine}
											onChange={(e) =>
												setCurrentMeds({
													...currentMeds,
													medicine: e.target.value,
												})
											}
											className="h-8 text-xs"
										/>
									</div>
									<div className="col-span-3">
										<Input
											placeholder="Dosage (500mg)"
											value={currentMeds.dosage}
											onChange={(e) =>
												setCurrentMeds({
													...currentMeds,
													dosage: e.target.value,
												})
											}
											className="h-8 text-xs"
										/>
									</div>
									<div className="col-span-3">
										<Input
											placeholder="Freq (2x daily)"
											value={currentMeds.frequency}
											onChange={(e) =>
												setCurrentMeds({
													...currentMeds,
													frequency: e.target.value,
												})
											}
											className="h-8 text-xs"
										/>
									</div>
									<div className="col-span-2">
										<Button
											type="button"
											onClick={addPill}
											size="sm"
											className="w-full h-8 bg-secondary text-secondary-foreground"
										>
											Add
										</Button>
									</div>
								</div>

								{/* List of Added Pills */}
								<div className="space-y-2">
									{formData.prescriptions.map((pill, idx) => (
										<div
											key={idx}
											className="flex items-center justify-between p-2 rounded bg-background border border-border text-sm"
										>
											<span>
												{pill.medicine} -{" "}
												<span className="text-muted-foreground">
													{pill.dosage} ({pill.frequency})
												</span>
											</span>
											<button
												onClick={() => removePill(idx)}
												className="text-destructive hover:text-red-400"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									))}
									{formData.prescriptions.length === 0 && (
										<p className="text-xs text-muted-foreground text-center italic">
											No medicines prescribed.
										</p>
									)}
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								onClick={() => mutation.mutate(formData)}
								disabled={mutation.isPending}
								className="w-full sm:w-auto"
							>
								{mutation.isPending
									? "Submitting Record..."
									: "Sign & Save Record"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* FEED GRID */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{isLoading ? (
					<p className="text-muted-foreground">Loading feed...</p>
				) : (
					records?.map((record) => (
						<motion.div
							key={record._id}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							className="rounded-xl border border-border bg-card shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden"
						>
							<div className="flex items-start justify-between mb-4">
								<div>
									<h3 className="font-bold text-foreground text-lg">
										{record.patient?.name}
									</h3>
									<p className="text-xs text-muted-foreground">
										{new Date(record.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div className="p-2 rounded-full bg-primary/10 text-primary">
									<Activity className="h-5 w-5" />
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center text-sm border-b border-border pb-2">
									<span className="text-muted-foreground">Diagnosis:</span>
									<span className="font-medium">{record.diagnosis}</span>
								</div>
								<div className="grid grid-cols-2 gap-2 text-xs">
									<div className="bg-muted/50 p-2 rounded">
										BP: {record.vitals?.bloodPressure}
									</div>
									<div className="bg-muted/50 p-2 rounded">
										Temp: {record.vitals?.temperature}°C
									</div>
								</div>
								<div className="mt-2">
									<p className="text-xs font-semibold text-muted-foreground mb-1">
										Prescription:
									</p>
									<div className="flex flex-wrap gap-1">
										{record.prescriptions?.slice(0, 3).map((p, i) => (
											<span
												key={i}
												className="px-2 py-0.5 rounded-full bg-secondary/50 text-[10px] text-secondary-foreground border border-border"
											>
												{p.medicine}
											</span>
										))}
										{record.prescriptions?.length > 3 && (
											<span className="text-[10px] text-muted-foreground">
												...
											</span>
										)}
									</div>
								</div>
							</div>
						</motion.div>
					))
				)}
			</div>
		</div>
	);
};

export default MedicalRecordsPage;
