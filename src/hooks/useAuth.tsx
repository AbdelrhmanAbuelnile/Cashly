import { useContext, useState, createContext } from "react";

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

	const login = (userData: User) => {
		setUser(userData);
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
