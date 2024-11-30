import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	Outlet,
	Link,
} from "react-router-dom";
import AuthProvider, { useAuth } from "./hooks/useAuth";

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* Public Routes */}
					<Route element={<PublicRoute />}>
						<Route path="/landing" element={<LandingPage />} />
						<Route path="/signin" element={<SignIn />} />
						<Route path="/signup" element={<SignUp />} />
					</Route>

					{/* Protected Routes */}
					<Route element={<ProtectedRoute />}>
						<Route path="/overview" element={<Overview />} />
						<Route path="/home" element={<UserHome />} />
					</Route>

					{/* Default Redirect */}
					<Route path="*" element={<Navigate to="/landing" replace />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
};

const Overview = () => (
	<div className="p-4">
		<h1 className="text-2xl">Platform Overview</h1>
		<p>Detailed information about our platform.</p>
	</div>
);

const UserHome = () => {
	const { user, logout } = useAuth();

	return (
		<div className="p-4">
			<h1 className="text-2xl">Welcome, {user.name}!</h1>
			<button
				onClick={logout}
				className="bg-red-500 text-white p-2 rounded mt-4"
			>
				Logout
			</button>
		</div>
	);
};

const SignUp = () => {
	const { login } = useAuth();
	const handleSignUp = () => {
		// Simulated sign-up
		login({ id: "123", name: "New User" });
	};

	return (
		<div className="p-4">
			<h2 className="text-xl">Sign Up</h2>
			<button
				onClick={handleSignUp}
				className="bg-green-500 text-white p-2 rounded mt-4"
			>
				Sign Up
			</button>
		</div>
	);
};

const ProtectedRoute = () => {
	const { user } = useAuth();
	return user ? <Outlet /> : <Navigate to="/landing" />;
};

// Public Route Component
const PublicRoute = () => {
	const { user } = useAuth();
	return !user ? <Outlet /> : <Navigate to="/overview" />;
};

// Landing Page
const LandingPage = () => (
	<div className="p-4">
		<h1 className="text-2xl">Welcome to Our Platform</h1>
		<p>
			Please <Link to={"/signin"}>sign in</Link> or{" "}
			<Link to={"/signup"}>sign up</Link> to access features.
		</p>
	</div>
);

// SignIn Page
const SignIn = () => {
	const { login } = useAuth();
	const handleSignIn = () => {
		// Simulated sign-in
		login({ id: "123", name: "User" });
	};

	return (
		<div className="p-4">
			<h2 className="text-xl">Sign In</h2>
			<button
				onClick={handleSignIn}
				className="bg-blue-500 text-white p-2 rounded mt-4"
			>
				Sign In
			</button>
		</div>
	);
};

export default App;
