import { useState } from "react";
import {
	Wallet,
	Goal,
	TrendingUp,
	Home,
	Settings,
	Menu,
	X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import UserProfileDropdown from "./components/UserProfileDropdown";
import Dashboard from "./pages/Home";
import Analytics from "./pages/Analytics";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import SettingsPage from "./pages/Settings";
import Sidebar from "./components/Sidebar";

const DashboardPage = () => {
	const { user, logout } = useAuth();
	const [renderPage, setRenderPage] = useState("analytics");
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

	const menuItems = [
		{
			icon: Home,
			label: "Dashboard",
			key: "dashboard",
		},
		{
			icon: TrendingUp,
			label: "Analytics",
			key: "analytics",
		},
		{
			icon: Wallet,
			label: "Transactions",
			key: "transactions",
		},
		{
			icon: Goal,
			label: "Goals",
			key: "goals",
		},
		{
			icon: Settings,
			label: "Settings",
			key: "settings",
		},
	];

	const renderComponent = () => {
		switch (renderPage) {
			case "dashboard":
				return <Dashboard />;
			case "analytics":
				return <Analytics />;
			case "transactions":
				return <Transactions />;
			case "goals":
				return <Goals />;
			case "settings":
				return <SettingsPage />;
			default:
				return <Dashboard />;
		}
	};

	const handlePageChange = (key: string) => {
		setRenderPage(key);
		setIsMobileSidebarOpen(false);
	};

	const toggleMobileSidebar = () => {
		setIsMobileSidebarOpen(!isMobileSidebarOpen);
	};

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
					currentItem={renderPage}
				/>
			</div>

			{/* Desktop Sidebar */}
			<div className="hidden md:block">
				<Sidebar
					items={menuItems}
					handlePageChange={handlePageChange}
					isMobile={false}
					currentItem={renderPage}
				/>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-4 md:p-6 overflow-auto">
				<div className="lg:container w-full mx-auto">
					<div className="w-full flex justify-between items-center mb-6">
						<h1 className="text-2xl md:text-3xl font-bold capitalize">
							{renderPage}
						</h1>
						<div className="hidden md:block">
							<UserProfileDropdown
								user={user}
								onLogout={logout}
								balance={user?.balance || 0}
							/>
						</div>
					</div>
					{renderComponent()}
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
