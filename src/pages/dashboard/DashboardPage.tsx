import { useState } from "react";
import { Wallet, Goal, Settings, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import UserProfileDropdown from "./components/UserProfileDropdown";
import Sidebar from "./components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const DashboardPage = () => {
	const { user, logout } = useAuth();
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const location = useLocation();

	// Improved path determination that handles detail routes
	const getPageInfo = () => {
		const pathSegments = location.pathname.split("/").filter(Boolean);

		// Default case
		if (pathSegments.length <= 1) return "dashboard";

		// Handle main sections
		const mainSection = pathSegments[1];

		// Handle detail pages like /transactions/:id
		if (pathSegments.length > 2 && mainSection === "transactions") {
			return { path: mainSection, title: "Transaction Details" };
		}

		// Handle other potential detail pages
		if (pathSegments.length > 2 && mainSection === "goals") {
			return { path: mainSection, title: "Goal Details" };
		}

		// Regular pages
		return { path: mainSection, title: mainSection };
	};

	const pageInfo = getPageInfo();
	const currentPath = typeof pageInfo === "string" ? pageInfo : pageInfo.path;
	const pageTitle = typeof pageInfo === "string" ? pageInfo : pageInfo.title;

	const menuItems = [
		// {
		// 	icon: Home,
		// 	label: "Dashboard",
		// 	key: "dashboard",
		// 	path: "/dashboard/home",
		// },
		// {
		// 	icon: TrendingUp,
		// 	label: "Analytics",
		// 	key: "analytics",
		// 	path: "/dashboard/analytics",
		// },
		{
			icon: Wallet,
			label: "Transactions",
			key: "transactions",
			path: "/dashboard/transactions",
		},
		{
			icon: Goal,
			label: "Goals",
			key: "goals",
			path: "/dashboard/goals",
		},
		{
			icon: Settings,
			label: "Settings",
			key: "settings",
			path: "/dashboard/settings",
		},
	];

	const handlePageChange = () => {
		setIsMobileSidebarOpen(false);
	};

	const toggleMobileSidebar = () => {
		setIsMobileSidebarOpen(!isMobileSidebarOpen);
	};

	// useEffect(() => {
	// 	if (user) {
	// 		const path = window.location.pathname;
	// 		// Only redirect if on landing page, login, or signup
	// 		if (
	// 			path === "/" ||
	// 			path === "/signin" ||
	// 			path === "/signup" ||
	// 			path === "/dashboard/" ||
	// 			path === "/dashboard"
	// 		) {
	// 			navigate("/dashboard/transactions"); // Navigate to home sub-route
	// 		}
	// 	}
	// }, [user, navigate]);

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-[#FFF0DC] text-[#543A14]">
			{/* Mobile Header */}
			<div className="md:hidden flex justify-between items-center p-4 bg-[#F0BB78]">
				<h2 className="text-2xl font-bold">Cashly</h2>
				<div className="flex justify-center items-center gap-2">
					<button
						onClick={toggleMobileSidebar}
						className="p-2 rounded-lg hover:bg-[#543A14]/10"
					>
						{isMobileSidebarOpen ? <X /> : <Menu />}
					</button>
					<UserProfileDropdown
						user={user}
						onLogout={logout}
						balance={user?.balance || 0}
					/>
				</div>
			</div>

			{/* Mobile Sidebar */}
			<div
				className={`
          md:hidden 
          fixed 
          inset-0 
          z-40 
          bg-[#F0BB78] 
          transform 
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform 
          duration-300 
          ease-in-out
        `}
			>
				<Sidebar
					items={menuItems}
					handlePageChange={handlePageChange}
					isMobile={true}
					onClose={() => setIsMobileSidebarOpen(false)}
					currentItem={currentPath}
				/>
			</div>

			{/* Desktop Sidebar */}
			<div className="hidden md:block">
				<Sidebar
					items={menuItems}
					handlePageChange={handlePageChange}
					isMobile={false}
					currentItem={currentPath}
				/>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-4 md:p-6 overflow-auto">
				<div className="lg:container w-full mx-auto">
					<div className="w-full flex justify-between items-center mb-6">
						<h1 className="text-2xl md:text-3xl font-bold capitalize">
							{pageTitle}
						</h1>
						<div className="hidden md:block">
							<UserProfileDropdown
								user={user}
								onLogout={logout}
								balance={user?.balance || 0}
							/>
						</div>
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
