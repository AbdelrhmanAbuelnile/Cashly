import { useContext, useState, createContext, useEffect } from "react";

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
	return useContext(AuthContext);
};

interface AuthContextType {
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
}

interface User {
	id: string;
	name: string;
	email: string;
}

import { ReactNode } from "react";

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [expiresIn, setExpiresIn] = useState<number | null>(null);

	const login = (userData: User) => {
		setUser(userData);
	};

	// useEffect(() => {
	// 	const dateNOw = new Date().getTime();
	// 	if (expiresIn && dateNOw > expiresIn) {
	// 		const user = localStorage.getItem("user");
	// 		if (user) {
	// 			setUser(JSON.parse(user));
	// 		}
	// 	}
	// }, [user, expiresIn]);

	const logout = () => {
		setUser(null);
		// localStorage.removeItem("user");
		// localStorage.removeItem("expiresIn");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
