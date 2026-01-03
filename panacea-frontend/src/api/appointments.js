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


// Update status or reschedule
export const updateAppointment = async ({ id, data }) => {
	const response = await api.put(`/appointments/${id}`, data);
	return response.data; // Unwrapped by axios interceptor? check context.
	// If interceptor returns 'response', use response.data.data.
	// Based on previous step, we kept interceptor returning full response object.
	// So stick to consistent: return response.data.data
};

export const deleteAppointment = async (id) => {
	const response = await api.delete(`/appointments/${id}`);
	return response.data;
};