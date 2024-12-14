/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userTypes } from "../types/userTypes";

interface AuthContextType {
	user: userTypes;
	login: (user: userTypes, token: string) => void;
	logout: () => void;
	token: string | null;
	updateUser: (user: userTypes) => void;
}

interface AuthProviderProps {
	children: React.ReactNode;
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
	const navigate = useNavigate();
	const [user, setUser] = useState<userTypes | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [expiresAt, setExpiresAt] = useState<number | null>(); // 1 hour

	useEffect(() => {
		const userString = localStorage.getItem("user");
		const expiresAtString = localStorage.getItem("expiresAt");
		if (userString && expiresAtString) {
			const user = JSON.parse(userString);
			const expiresAt = JSON.parse(expiresAtString);
			if (user && expiresAt && new Date().getTime() < expiresAt) {
				setUser(user);
				setExpiresAt(3600 * 1000);
				navigate("/dashboard");
			}
		}
	}, [navigate]);

	useEffect(() => {
		const interval = setInterval(() => {
			const expiresAtString = localStorage.getItem("expiresAt");
			if (expiresAtString) {
				const expiresAt = JSON.parse(expiresAtString);
				if (new Date().getTime() >= expiresAt) {
					logout();
				}
			}
		}, 1000 * 60); // Check every minute

		return () => clearInterval(interval);
	});

	const login = (user: userTypes, token: string) => {
		const expiryTime = new Date().getTime() + 3600 * 1000;
		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("expiresAt", JSON.stringify(expiryTime));
		localStorage.setItem("auth", JSON.stringify(token));
		setToken(token);
		setUser(user);
		setExpiresAt(expiryTime);
	};

	const logout = () => {
		localStorage.removeItem("user");
		localStorage.removeItem("expiresAt");
		localStorage.removeItem("auth");
		setUser(null);
		setExpiresAt(null);
		navigate("/");
	};

	const updateUser = (updatedUser: userTypes) => {
		setUser(updatedUser);
		localStorage.setItem("user", JSON.stringify(updatedUser));
	};

	// check for google callback
	useEffect(() => {
		if (user && token) {
			console.log("NO NEED TO CHECK FOR GOOGLE USER");
			return;
		}

		const params = new URLSearchParams(location.search);
		const googleToken = params.get("user");
		const googleAccount = googleToken ? JSON.parse(googleToken) : null;

		if (googleToken && googleAccount) {
			const expiryTime = new Date().getTime() + 3600 * 1000;
			setToken(googleAccount.token);
			setUser(googleAccount.user);

			localStorage.setItem("user", JSON.stringify(googleAccount.user));
			localStorage.setItem("expiresAt", JSON.stringify(expiryTime));
			localStorage.setItem("auth", JSON.stringify(googleAccount.token));

			navigate("/");
			navigate("/dashboard");
		}
	}, [location, user, token, expiresAt, navigate]);

	return (
		<AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
