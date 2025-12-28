import api from "./axios";

export const fetchWards = async () => {
	const { data } = await api.get("/wards");
	return data.data;
};

// Logic: If fetching empty, user clicks "Initialize" button
export const seedHospital = async () => {
	const { data } = await api.post("/wards/seed");
	return data;
};

export const admitToBed = async ({ wardId, bedId, patientId }) => {
	const { data } = await api.put(`/wards/${wardId}/admit`, {
		bedId,
		patientId,
	});
	return data.data;
};

export const dischargeFromBed = async ({ wardId, bedId }) => {
	const { data } = await api.put(`/wards/${wardId}/discharge`, { bedId });
	return data.data;
};
