import api from "./axios"; // The configured axios instance we made

export const fetchPatients = async () => {
	const { data } = await api.get("/patients");
	return data.data; // Backend returns { status: 'success', data: [...] }
};

export const createPatient = async (patientData) => {
	const { data } = await api.post("/patients", patientData);
	return data.data;
};
