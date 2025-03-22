import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userTypes } from "../types/userTypes";
import axios from "axios";

// Configure axios to include credentials in requests
axios.defaults.withCredentials = true;

// Local storage keys
const USER_STORAGE_KEY = "auth_user";
const AUTH_STATUS_KEY = "auth_status";

interface AuthContextType {
	user: userTypes | null;
	login: (credentials: {
		email: string;
		password: string;
		rememberMe?: boolean;
	}) => Promise<void>;
	logout: () => Promise<void>;
	updateUser: (user: userTypes) => void;
	refreshToken: () => Promise<boolean>;
	isAuthenticated: boolean;
	isLoading: boolean;
}

interface AuthProviderProps {
	children: React.ReactNode;
}

interface errorType {
	response?: {
		status?: number;
	};
	message?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
	let baseUrl: string | undefined;

	if (import.meta.env.VITE_MODE === "dev") {
		baseUrl = import.meta.env.VITE_BASEURL_DEV;
	} else if (import.meta.env.VITE_MODE === "prod") {
		baseUrl = import.meta.env.VITE_BASEURL;
	}
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Initialize state from local storage if available
	const [user, setUser] = useState<userTypes | null>(() => {
		const storedUser = localStorage.getItem(USER_STORAGE_KEY);
		return storedUser ? JSON.parse(storedUser) : null;
	});

	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
		const storedAuthStatus = localStorage.getItem(AUTH_STATUS_KEY);
		return storedAuthStatus ? JSON.parse(storedAuthStatus) : false;
	});

	// Persist user and auth status to local storage when they change
	useEffect(() => {
		if (user) {
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(USER_STORAGE_KEY);
		}
	}, [user]);

	useEffect(() => {
		localStorage.setItem(AUTH_STATUS_KEY, JSON.stringify(isAuthenticated));
	}, [isAuthenticated]);

	// Function to check authentication status
	const checkAuthStatus = async () => {
		try {
			// Even if we have local storage data, verify with the server
			const response = await axios.get(`${baseUrl}/user/profile`, {
				withCredentials: true,
			});

			if (response.status === 200) {
				setUser(response.data.user);
				setIsAuthenticated(true);
			}
		} catch (error: unknown) {
			const err = error as errorType;
			console.log("Server validation error:", err?.message);

			// Only clear authentication if it's an auth error (401/403)
			// This preserves local session during network issues
			if (
				err?.response &&
				(err?.response?.status === 401 || err?.response?.status === 403)
			) {
				console.log("Authentication error - clearing session");
				setUser(null);
				setIsAuthenticated(false);
				localStorage.removeItem(USER_STORAGE_KEY);
				localStorage.removeItem(AUTH_STATUS_KEY);
			} else {
				// For network errors, keep the existing state
				console.log("Network or other error - maintaining existing session");
				// Keep using localStorage values (already loaded in useState)
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Check auth status on mount
	useEffect(() => {
		if (user && isAuthenticated) {
			checkAuthStatus();
		}
	}, []);

	// Check for Google callback
	useEffect(() => {
		if (user) {
			console.log("User already authenticated");
			return;
		}

		const params = new URLSearchParams(window.location.search);
		const googleUserParam = params.get("user");

		if (googleUserParam) {
			try {
				const googleAccount = JSON.parse(googleUserParam);
				setUser(googleAccount.user);
				setIsAuthenticated(true);

				// Clear the URL params
				window.history.replaceState(
					{},
					document.title,
					window.location.pathname
				);
				navigate("/dashboard");
			} catch (error) {
				console.error("Error parsing Google user data:", error);
			}
		}
	}, [user, navigate]);

	const login = async (credentials: {
		email: string;
		password: string;
		rememberMe?: boolean;
	}) => {
		try {
			setIsLoading(true);
			const response = await axios.post(`${baseUrl}/auth/login`, credentials, {
				withCredentials: true,
			});

			setUser(response.data.user);
			setIsAuthenticated(true);
			navigate("/dashboard");
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const refreshToken = async () => {
		try {
			const response = await axios.post(
				`${baseUrl}/auth/refresh-token`,
				{},
				{ withCredentials: true }
			);

			// Update user data if needed
			if (response.data.user) {
				setUser(response.data.user);
			}

			return true;
		} catch (error: unknown) {
			const err = error as errorType;
			console.error("Token refresh failed:", err);

			// Only clear authentication if it's an auth error (401/403)
			// This preserves local session during network issues
			if (
				err?.response &&
				(err?.response?.status === 401 || err?.response?.status === 403)
			) {
				logout();
			}
			return false;
		}
	};

	useEffect(() => {
		if (!isAuthenticated) return;

		// Set up automatic token refresh - refresh every 45 minutes
		// (assuming tokens expire after 1 hour)
		const refreshInterval = setInterval(() => {
			refreshToken();
		}, 45 * 60 * 1000); // 45 minutes

		return () => clearInterval(refreshInterval);
	}, [isAuthenticated]);

	const logout = async () => {
		try {
			await axios.post(`${baseUrl}/auth/logout`, {}, { withCredentials: true });
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {
			// Clear state and local storage
			setUser(null);
			setIsAuthenticated(false);
			localStorage.removeItem(USER_STORAGE_KEY);
			localStorage.removeItem(AUTH_STATUS_KEY);
			navigate("/");
		}
	};

	const updateUser = (updatedUser: userTypes) => {
		setUser(updatedUser);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				refreshToken,
				updateUser,
				isAuthenticated,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
