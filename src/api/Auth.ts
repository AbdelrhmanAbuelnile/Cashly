import axiosInstance from "./axios";

interface LoginData {
	email: string;
	password: string;
}

interface RegisterData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	gender: string;
}

const AuthApi = {
	login: (data: LoginData) => {
		const endpoint = `/auth/login`;
		return axiosInstance.post(endpoint, data);
	},
	register: (data: RegisterData) => {
		const endpoint = `/auth/register`;
		return axiosInstance.post(endpoint, data);
	},
};

export default AuthApi;
