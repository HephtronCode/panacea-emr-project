import api from "./axios";

export const fetchDashboardStats = async () => {
	const { data } = await api.get("/analytics/stats");
	return data.data;
};
