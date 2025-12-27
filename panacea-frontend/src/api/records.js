import api from "./axios";

export const fetchRecords = async () => {
	const { data } = await api.get(`/records/all`); // We will add this backend route quickly to support "Recent"
	return data.data;
};

export const createRecord = async (recordData) => {
	const { data } = await api.post(`/records`, recordData);

	return data.data;
};
