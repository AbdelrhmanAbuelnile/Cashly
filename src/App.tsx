import { Routes, Route } from "react-router-dom";
import CashlyLanding from "./pages/home/CashlyLanding";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import Goals from "./pages/dashboard/pages/Goals";
import Transactions from "./pages/dashboard/pages/Transactions";
import SettingsPage from "./pages/dashboard/pages/Settings";
import GoalDetail from "./pages/dashboard/pages/GoalDetail";
import NewGoal from "./pages/dashboard/pages/NewGoal";
import TransactionDetail from "./pages/dashboard/pages/TransactionDetail";
import NewTransaction from "./pages/dashboard/pages/NewTransaction";

const App = () => {
	return (
		<Routes>
			{/* Public Routes */}
			<Route path="/" element={<CashlyLanding />} />
			<Route path="/signin" element={<LoginPage />} />
			<Route path="/signup" element={<SignupPage />} />
			{/* Protected Route */}
			<Route path="/dashboard" element={<DashboardPage />}>
				{/* <Route path="home" element={<Dashboard />} /> */}
				<Route path="goals" element={<Goals />} />
				<Route path="new-goal" element={<NewGoal />} />
				<Route path="new-transaction" element={<NewTransaction />} />
				<Route path="goals/:goalId" element={<GoalDetail />} />
				{/* <Route path="analytics" element={<Analytics />} /> */}
				<Route path="transactions" element={<Transactions />} />
				<Route
					path="transactions/:transactionId"
					element={<TransactionDetail />}
				/>
				<Route path="settings" element={<SettingsPage />} />
			</Route>
		</Routes>
	);
};

export default App;
