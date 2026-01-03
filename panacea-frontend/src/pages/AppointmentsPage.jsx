import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAppointments, createAppointment, updateAppointment, deleteAppointment } from '@/api/appointments';
import { fetchPatients } from '@/api/patients';
import { useAuth } from '@/context/AuthContext';
import { Plus, Clock, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
	Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger
} from "@/components/ui/dialog";
import {
	DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const AppointmentsPage = () => {
	const queryClient = useQueryClient();
	const { user } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [editAppt, setEditAppt] = useState(null); // If set, modal is for editing status

	const [formData, setFormData] = useState({
		patientId: '', date: '', time: '', reason: ''
	});

	const { data: appointments, isLoading: loadingAppts } = useQuery({
		queryKey: ['appointments'],
		queryFn: fetchAppointments,
	});

	const { data: patients } = useQuery({ queryKey: ['patients'], queryFn: fetchPatients });

	const mutation = useMutation({
		mutationFn: createAppointment,
		onSuccess: () => {
			queryClient.invalidateQueries(['appointments']);
			setIsOpen(false);
			setFormData({ patientId: '', date: '', time: '', reason: '' });
			toast.success("Appointment Scheduled");
		},
		onError: (err) => toast.error(err.message)
	});

	const statusMutation = useMutation({
		mutationFn: updateAppointment,
		onSuccess: () => {
			queryClient.invalidateQueries(['appointments']);
			toast.success("Status Updated");
		}
	});

	const deleteMutation = useMutation({
		mutationFn: deleteAppointment,
		onSuccess: () => {
			queryClient.invalidateQueries(['appointments']);
			toast.success("Appointment Cancelled");
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		const fullDate = new Date(`${formData.date}T${formData.time}`);
		mutation.mutate({
			patientId: formData.patientId,
			doctorId: user._id,
			date: fullDate.toISOString(),
			reason: formData.reason
		});
	};

	const getStatusBadge = (status) => {
		const styles = {
			Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
			Completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
			Cancelled: "bg-red-500/10 text-red-500 border-red-500/20"
		};
		return styles[status] || styles['Pending'];
	};

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			<div className="flex justify-between items-center border-b border-border pb-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-foreground">Schedule</h1>
					<p className="text-muted-foreground mt-1">Manage doctor availability.</p>
				</div>
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>
						<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
							<Plus className="mr-2 h-4 w-4" /> Book Appointment
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-background border-border text-foreground">
						<DialogHeader><DialogTitle>New Booking</DialogTitle></DialogHeader>
						<form onSubmit={handleSubmit} className="grid gap-4 py-4">
							{/* ... (Existing Form Input fields from prev session - condensed for brevity) ... */}
							{/* Just Copy the inputs from previous implementation here */}
							<div className="grid gap-2">
								<Label>Select Patient</Label>
								<select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
										onChange={e => setFormData({...formData, patientId: e.target.value})}
								>
									<option>Select...</option>
									{patients?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
								</select>
							</div>
							<Input type="date" className="bg-background" onChange={e => setFormData({...formData, date: e.target.value})} />
							<Input type="time" className="bg-background" onChange={e => setFormData({...formData, time: e.target.value})} />
							<Input placeholder="Reason" className="bg-background" onChange={e => setFormData({...formData, reason: e.target.value})} />
							<Button type="submit">Confirm</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="rounded-xl border border-border bg-card/50 overflow-hidden">
				<Table>
					<TableHeader className="bg-muted/50"><TableRow><TableHead>Date</TableHead><TableHead>Patient</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
					<TableBody>
						{loadingAppts ? <Skeleton className="h-20 w-full" /> : appointments?.map((appt) => (
							<TableRow key={appt._id} className="hover:bg-muted/50">
								<TableCell className="font-medium">
									{new Date(appt.date).toLocaleDateString()} <span className="text-xs text-muted-foreground ml-1">{new Date(appt.date).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
								</TableCell>
								<TableCell>{appt.patient?.name}</TableCell>
								<TableCell className="text-muted-foreground">{appt.reason}</TableCell>
								<TableCell>
									<span className={`px-2 py-1 rounded-full text-xs border ${getStatusBadge(appt.status)}`}>{appt.status}</span>
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button></DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Update Status</DropdownMenuLabel>
											<DropdownMenuItem onClick={() => statusMutation.mutate({ id: appt._id, data: { status: 'Completed' }})}>
												<CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Mark Completed
											</DropdownMenuItem>
											<DropdownMenuItem onClick={() => statusMutation.mutate({ id: appt._id, data: { status: 'Cancelled' }})}>
												<XCircle className="mr-2 h-4 w-4 text-orange-500" /> Cancel Visit
											</DropdownMenuItem>
											<DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteMutation.mutate(appt._id)}>
												Delete Record
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
export default AppointmentsPage;