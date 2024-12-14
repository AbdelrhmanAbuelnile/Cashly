import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CashlyLanding from "./pages/home/CashlyLanding";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { useAuth } from "./hooks/useAuth";
import DashboardPage from "./pages/dashboard/DashboardPage";

const App = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/dashboard");
		}
	}, [user, navigate]);

	return (
		<Routes>
			{/* Public Routes */}
			<Route path="/" element={<CashlyLanding />} />
			<Route path="/signin" element={<LoginPage />} />
			<Route path="/signup" element={<SignupPage />} />
			{/* Protected Route */}
			<Route path="/dashboard" element={<DashboardPage />} />
		</Routes>
	);
};

export default App;
