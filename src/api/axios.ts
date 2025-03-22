import axios, { AxiosInstance } from "axios";

let baseUrl: string | undefined;

if (import.meta.env.VITE_MODE === "dev") {
	baseUrl = import.meta.env.VITE_BASEURL_DEV;
} else if (import.meta.env.VITE_MODE === "prod") {
	baseUrl = import.meta.env.VITE_BASEURL;
}

const axiosInstance: AxiosInstance = axios.create({
	baseURL: baseUrl,
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		// If we get a 401 or 403, redirect to login
		if (
			error.response &&
			(error.response.status === 401 || error.response.status === 403)
		) {
			// Redirect to login page
			// window.location.href = "/signin";
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
