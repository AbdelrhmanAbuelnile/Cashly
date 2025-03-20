import axiosInstance from "./axios";

interface SettingsData {
	currency: string;
	currencySymbol: string;
	firstName?: string;
	lastName: string;
	paymentDay?: number;
	picture?: string;
	salary?: number;
	balance?: number;
}

const UserApi = {
	updateSettings: (data: SettingsData) => {
		const endpoint = `/user/settings`;
		return axiosInstance.post(endpoint, data);
	},
};

export default UserApi;
