import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPatients, createPatient } from "@/api/patients";
import { motion } from "framer-motion";
import { Plus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";

const PatientsPage = () => {
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		dob: "",
		gender: "Male",
		address: "",
	});

	const {
		data: patients,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["patients"],
		queryFn: fetchPatients,
	});

	const mutation = useMutation({
		mutationFn: createPatient,
		onSuccess: () => {
			queryClient.invalidateQueries(["patients"]);
			setIsOpen(false);
			setFormData({
				name: "",
				phone: "",
				dob: "",
				gender: "Male",
				address: "",
			});
		},
		onError: (error) => {
			alert(
				"Failed to add patient: " +
					(error.response?.data?.message || "Unknown error")
			);
		},
	});

	const filteredPatients = patients?.filter(
		(p) =>
			p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			p.phone.includes(searchTerm)
	);

	const handleSubmit = (e) => {
		e.preventDefault();
		mutation.mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	if (isError)
		return (
			<div className="p-8 text-destructive">
				Error loading patients. Is the backend running?
			</div>
		);

	return (
		<div className="space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
			{/* HEADER SECTION */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
				<div>
					{/* Switched text-white to text-foreground (Smart Color) */}
					<h1 className="text-3xl font-bold tracking-tight text-foreground">
						Patient Registry
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage intake and digital records.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="relative group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
						<Input
							placeholder="Search records..."
							/* Background adapts to theme, border adapts to theme */
							className="pl-10 w-64 bg-background border-border focus:border-primary/50"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
								<Plus className="mr-2 h-4 w-4" /> Add Patient
							</Button>
						</DialogTrigger>

						{/* Fixed Modal Backgrounds for Light Mode */}
						<DialogContent className="sm:max-w-[425px] bg-background border-border text-foreground shadow-2xl">
							<DialogHeader>
								<DialogTitle>Admit New Patient</DialogTitle>
								<DialogDescription className="text-muted-foreground">
									Create a basic file. Vitals are added in the medical record
									later.
								</DialogDescription>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label>Full Name</Label>
									<Input
										name="name"
										required
										value={formData.name}
										onChange={handleInputChange}
										className="bg-muted/50 border-input"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label>Phone</Label>
										<Input
											name="phone"
											required
											value={formData.phone}
											onChange={handleInputChange}
											className="bg-muted/50 border-input"
										/>
									</div>
									<div className="grid gap-2">
										<Label>Date of Birth</Label>
										<Input
											type="date"
											name="dob"
											required
											value={formData.dob}
											onChange={handleInputChange}
											className="bg-muted/50 border-input"
										/>
									</div>
								</div>
								<div className="grid gap-2">
									<Label>Gender</Label>
									<select
										name="gender"
										className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										value={formData.gender}
										onChange={handleInputChange}
									>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
								</div>
								<div className="grid gap-2">
									<Label>Address</Label>
									<Input
										name="address"
										value={formData.address}
										onChange={handleInputChange}
										className="bg-muted/50 border-input"
									/>
								</div>
								<DialogFooter className="mt-4">
									<Button type="submit" disabled={mutation.isPending}>
										{mutation.isPending ? "Saving..." : "Create File"}
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* TABLE SECTION */}
			{/* Changed bg-slate-900 to bg-card, border-white/10 to border-border */}
			<div className="rounded-xl border border-border bg-card/50 backdrop-blur-md overflow-hidden shadow-sm">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow className="border-border hover:bg-transparent">
							<TableHead className="text-muted-foreground font-semibold">
								Patient Name
							</TableHead>
							<TableHead className="text-muted-foreground font-semibold">
								Contact Info
							</TableHead>
							<TableHead className="text-muted-foreground font-semibold">
								Gender
							</TableHead>
							<TableHead className="text-muted-foreground font-semibold">
								Age
							</TableHead>
							<TableHead className="text-muted-foreground font-semibold text-right">
								Actions
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							[...Array(5)].map((_, i) => (
								<TableRow key={i} className="border-border">
									<TableCell>
										<Skeleton className="h-10 w-40 bg-muted rounded-lg" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-24 bg-muted rounded" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-12 bg-muted rounded" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-8 bg-muted rounded" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-8 w-20 bg-muted rounded ml-auto" />
									</TableCell>
								</TableRow>
							))
						) : filteredPatients?.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="h-40 text-center text-muted-foreground"
								>
									<div className="flex flex-col items-center justify-center">
										<User className="h-10 w-10 mb-2 opacity-20" />
										<p>No records found.</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							filteredPatients?.map((patient) => (
								<motion.tr
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									key={patient._id}
									// Hover effect now uses sematic 'muted' color
									className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group"
								>
									<TableCell className="font-medium text-foreground">
										<div className="flex items-center gap-3">
											{/* Icon Background */}
											<div className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
												{patient.name.charAt(0)}
											</div>
											<span className="group-hover:text-primary transition-colors">
												{patient.name}
											</span>
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{patient.phone}
									</TableCell>
									<TableCell className="text-muted-foreground">
										<span
											className={`px-2 py-1 rounded-full text-xs border ${
												patient.gender === "Male"
													? "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/20"
													: "bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/20"
											}`}
										>
											{patient.gender}
										</span>
									</TableCell>
									<TableCell className="text-muted-foreground">
										{new Date().getFullYear() -
											new Date(patient.dob).getFullYear()}{" "}
										yrs
									</TableCell>
									<TableCell className="text-right">
										<Button
											variant="ghost"
											size="sm"
											className="text-muted-foreground hover:text-foreground"
										>
											View File
										</Button>
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

export default PatientsPage;
