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
import Home from "./pages/home/Home";

const App = () => {
	return (
		<Router>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<Home />} />
			</Routes>
		</Router>
	);
};

export default App;
