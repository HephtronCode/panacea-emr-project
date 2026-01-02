import api from "./axios"; // The configured axios instance we made

export const fetchPatients = async () => {
	const { data } = await api.get("/patients");
	return data.data; // Backend returns { status: 'success', data: [...] }
};

export const createPatient = async (patientData) => {
	const { data } = await api.post("/patients", patientData);
	return data.data;
};

export const fetchPatientById = async (Id) => {
	const { data } = await api.get(`/patients/${Id}`);
	return data.data;
};

export const updatePatientProfile = async ({ id, data: updates }) => {
	const { data } = await api.put(`/patients/${id}`, updates);
	return data.data;
};

export const deletePatient = async (id) => {
	const { data } = await api.delete(`/patients/${id}`);
	return data;
};
