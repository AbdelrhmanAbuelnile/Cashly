// Assuming you are using React
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useQuery = () => {
	return new URLSearchParams(useLocation().search);
};

const AuthCallback = () => {
	const query = useQuery();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const userData = query.get("user");
		if (userData) {
			setUser(JSON.parse(decodeURIComponent(userData)));
		}
	}, [query]);

	return (
		<div>
			{user ? (
				<div>
					<h1>Welcome, {user.name}</h1>
					{/* Render user data securely */}
				</div>
			) : (
				<h1>Loading...</h1>
			)}
		</div>
	);
};

export default AuthCallback;
