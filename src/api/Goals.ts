import axiosInstance from "./axios";

interface myGoalsQuery {
	limit?: number;
	page?: number;
	sort?: string;
	order?: string;
	search?: string;
}

interface GoalData {
	name: string;
	icon?: string;
	amount: number;
	description?: string;
	startDate?: string;
	endDate: string;
	status?: string;
	goalBalance?: number;
}

const GoalsApi = {
	createGoal: (data: GoalData) => {
		const endpoint = `/saving-goal/new`;
		return axiosInstance.post(endpoint, data);
	},
	updateGoal: (goalId: string, data: GoalData) => {
		const endpoint = `/saving-goal/${goalId}`;
		return axiosInstance.put(endpoint, data);
	},
	deleteGoal: (goalId: string) => {
		const endpoint = `/saving-goal/${goalId}`;
		return axiosInstance.delete(endpoint);
	},
	getMyGoals: (query: myGoalsQuery) => {
		const endpoint = `/saving-goal`;
		return axiosInstance.get(endpoint, { params: query });
	},
	getGoal: (goalId: string) => {
		const endpoint = `/saving-goal/${goalId}`;
		return axiosInstance.get(endpoint);
	},
};

export default GoalsApi;
