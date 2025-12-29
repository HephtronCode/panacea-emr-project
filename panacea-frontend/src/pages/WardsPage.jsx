import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	fetchWards,
	seedHospital,
	admitToBed,
	dischargeFromBed,
} from "@/api/wards";
import { fetchPatients } from "@/api/patients";
import { motion } from "framer-motion";
import { Bed, User, Activity, AlertCircle } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const WardsPage = () => {
	const queryClient = useQueryClient();
	const { theme } = useTheme();

	const [selectedBed, setSelectedBed] = useState(null);
	const [admissionId, setAdmissionId] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	// 1. DATA FETCHING
	const { data: wards, isLoading: loadingWards } = useQuery({
		queryKey: ["wards"],
		queryFn: fetchWards,
	});

	const { data: patients } = useQuery({
		queryKey: ["patients"],
		queryFn: fetchPatients,
		enabled: isModalOpen,
	});

	// 2. MUTATIONS
	const seedMutation = useMutation({
		mutationFn: seedHospital,
		onSuccess: () => queryClient.invalidateQueries(["wards"]),
	});

	const admitMutation = useMutation({
		mutationFn: admitToBed,
		onSuccess: () => {
			queryClient.invalidateQueries(["wards"]);
			setIsModalOpen(false);
			setAdmissionId("");
		},
		onError: (err) => alert(err.message),
	});

	const dischargeMutation = useMutation({
		mutationFn: dischargeFromBed,
		onSuccess: () => {
			queryClient.invalidateQueries(["wards"]);
			setIsModalOpen(false);
		},
	});

	// Handlers
	const handleBedClick = (wardId, bed) => {
		setSelectedBed({ ...bed, wardId });
		setIsModalOpen(true);
	};

	const confirmAction = () => {
		if (selectedBed.isOccupied) {
			dischargeMutation.mutate({
				wardId: selectedBed.wardId,
				bedId: selectedBed._id,
			});
		} else {
			if (!admissionId) return alert("Please select a patient");
			admitMutation.mutate({
				wardId: selectedBed.wardId,
				bedId: selectedBed._id,
				patientId: admissionId,
			});
		}
	};

	if (loadingWards)
		return (
			<div className="p-8 space-y-4">
				<Skeleton className="h-12 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		);

	return (
		<div className="space-y-6 animate-in fade-in duration-500">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-foreground">
					Unit Management
				</h1>
				<p className="text-muted-foreground mt-1">
					Live bed occupancy and patient triage.
				</p>
			</div>

			{/* EMPTY STATE */}
			{wards?.length === 0 ? (
				<div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/20">
					<Activity className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
					<h2 className="text-xl font-semibold mb-2 text-foreground">
						Unit Offline
					</h2>
					<p className="text-muted-foreground mb-6">
						Ward configuration not found in database.
					</p>
					<Button
						onClick={() => seedMutation.mutate()}
						disabled={seedMutation.isPending}
					>
						{seedMutation.isPending
							? "Constructing Grid..."
							: "Initialize Default Wards"}
					</Button>
				</div>
			) : (
				/* WARD TABS */
				<Tabs defaultValue={wards[0].name} className="w-full">
					<div className="flex justify-between items-center mb-6 overflow-x-auto pb-2">
						<TabsList className="bg-muted/50 border border-border">
							{wards.map((ward) => (
								<TabsTrigger key={ward._id} value={ward.name}>
									{ward.name}
									<Badge
										variant={ward.type === "ICU" ? "destructive" : "secondary"}
										className="ml-2 h-5 px-1.5 text-[10px]"
									>
										{ward.type}
									</Badge>
								</TabsTrigger>
							))}
						</TabsList>

						<div className="flex gap-4 text-xs font-medium text-muted-foreground hidden md:flex">
							<div className="flex items-center">
								<div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500 mr-2"></div>{" "}
								Available
							</div>
							<div className="flex items-center">
								<div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500 mr-2"></div>{" "}
								Occupied
							</div>
						</div>
					</div>

					{wards.map((ward) => (
						<TabsContent key={ward._id} value={ward.name} className="space-y-4">
							{/* STATS HEADER */}
							<div className="grid grid-cols-4 gap-4 mb-6">
								<div className="p-4 rounded-lg bg-card border border-border">
									<p className="text-xs text-muted-foreground uppercase">
										Capacity
									</p>
									<p className="text-2xl font-bold text-foreground">
										{ward.capacity}{" "}
										<span className="text-sm font-normal text-muted-foreground">
											Beds
										</span>
									</p>
								</div>
								<div className="p-4 rounded-lg bg-card border border-border">
									<p className="text-xs text-muted-foreground uppercase">
										Available
									</p>
									{/* SAFE MATH: Fallback to 0 */}
									<p className="text-2xl font-bold text-emerald-500">
										{ward.capacity - (ward.occupied || 0)}
									</p>
								</div>
								<div className="p-4 rounded-lg bg-card border border-border">
									<p className="text-xs text-muted-foreground uppercase">
										Occupancy
									</p>
									<p className="text-2xl font-bold text-blue-500">
										{/* SAFE MATH: Fallback to 0 */}
										{ward.capacity > 0
											? Math.round(((ward.occupied || 0) / ward.capacity) * 100)
											: 0}
										%
									</p>
								</div>
							</div>

							{/* BED GRID */}
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
								{ward.beds.map((bed) => (
									<motion.button
										key={bed._id}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => handleBedClick(ward._id, bed)}
										className={`
                                     relative h-40 rounded-xl border flex flex-col items-center justify-center p-4 transition-all
                                     ${
																				bed.isOccupied
																					? "bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20"
																					: "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20"
																			}
                                 `}
									>
										<div
											className={`absolute top-3 left-3 text-xs font-bold font-mono opacity-70 ${
												bed.isOccupied ? "text-rose-500" : "text-emerald-500"
											}`}
										>
											{bed.number}
										</div>

										<div
											className={`p-3 rounded-full mb-3 ${
												bed.isOccupied
													? "bg-rose-500/20 text-rose-500"
													: "bg-emerald-500/20 text-emerald-500"
											}`}
										>
											{bed.isOccupied ? (
												<User className="h-6 w-6" />
											) : (
												<Bed className="h-6 w-6" />
											)}
										</div>

										<div className="text-center">
											<p
												className={`font-semibold text-sm ${
													bed.isOccupied ? "text-rose-500" : "text-emerald-500"
												}`}
											>
												{bed.isOccupied ? "Occupied" : "Available"}
											</p>
											{bed.isOccupied && bed.patient && (
												<p className="text-xs text-foreground mt-1 px-2 py-0.5 rounded-md bg-background/50 backdrop-blur truncate max-w-[100px]">
													{bed.patient.name.split(" ")[0]}
												</p>
											)}
										</div>
									</motion.button>
								))}
							</div>
						</TabsContent>
					))}
				</Tabs>
			)}

			{/* ACTION DIALOG */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="bg-background border-border text-foreground">
					<DialogHeader>
						<DialogTitle>
							{selectedBed?.isOccupied ? "Discharge Patient" : "Admit Patient"}
						</DialogTitle>
						<DialogDescription className="text-muted-foreground">
							Bed {selectedBed?.number} is currently{" "}
							{selectedBed?.isOccupied ? "occupied" : "available"}.
						</DialogDescription>
					</DialogHeader>

					{selectedBed?.isOccupied ? (
						<div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 flex items-center gap-4 my-4">
							<AlertCircle className="h-8 w-8 text-destructive" />
							<div>
								<p className="font-semibold text-destructive">
									Confirm Discharge
								</p>
								<p className="text-sm text-destructive/80">
									This will remove{" "}
									<strong>{selectedBed?.patient?.name || "Patient"}</strong>{" "}
									from the active ward census.
								</p>
							</div>
						</div>
					) : (
						<div className="my-4 space-y-3">
							<Label>Select Patient for Admission</Label>
							<select
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus:ring-2 focus:ring-ring"
								onChange={(e) => setAdmissionId(e.target.value)}
								value={admissionId}
							>
								<option value="">-- Choose Patient --</option>
								{patients?.map((p) => (
									<option key={p._id} value={p._id}>
										{p.name} ({p.gender})
									</option>
								))}
							</select>
						</div>
					)}

					<DialogFooter>
						<Button variant="outline" onClick={() => setIsModalOpen(false)}>
							Cancel
						</Button>
						<Button
							variant={selectedBed?.isOccupied ? "destructive" : "default"}
							onClick={confirmAction}
							disabled={admitMutation.isPending || dischargeMutation.isPending}
						>
							{selectedBed?.isOccupied ? "Confirm Discharge" : "Assign Bed"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default WardsPage;
