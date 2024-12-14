import axios, { AxiosInstance } from "axios";

const axiosInstance: AxiosInstance = axios.create({
	baseURL: "https://cashly-backend-production.up.railway.app/api/v1", // Your backend URL
	withCredentials: true, // Send cookies with requests
});

export default axiosInstance;
