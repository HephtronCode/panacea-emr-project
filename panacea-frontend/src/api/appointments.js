import api from "./axios";

export const fetchAppointments = async () => {
	// This would fetch all appointments
	const { data } = await api.get("/appointments");
	return data.data; // Assuming backend returns { status: 'success', data: [...] }
};

export const createAppointment = async (appointmentData) => {
	const { data } = await api.post("/appointments", appointmentData);
	return data.data;
};

export const fetchPatientAppointments = async (patientId) => {
	const { data } = await api.get(`/appointments?patientId=${patientId}`);

	return data.data;
};
