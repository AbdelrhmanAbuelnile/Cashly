import React, { useState } from "react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

interface SidebarProps {
	items: Array<{
		icon: React.ComponentType<{ className?: string }>;
		label: string;
		key: string;
	}>;
	handlePageChange: (key: string) => void;
	isMobile?: boolean;
	onClose?: () => void;
}

const Sidebar = ({
	items,
	handlePageChange,
	isMobile = false,
	onClose,
}: SidebarProps) => {
	const [activeItem, setActiveItem] = useState("settings");
	const { logout } = useAuth();

	return (
		<div
			className={`
        bg-[#F0BB78] 
        text-[#543A14] 
        ${isMobile ? "w-full h-full" : "w-64 h-screen sticky top-0 left-0"}
        overflow-y-auto 
        shadow-lg 
        flex 
        flex-col
      `}
		>
			{/* Mobile Close Button */}
			{isMobile && (
				<div className="p-4 flex justify-between items-center border-b border-[#543A14]/20">
					<h2 className="text-2xl font-bold">Cashly</h2>
					<button
						onClick={onClose}
						className="p-2 rounded-lg hover:bg-[#543A14]/10"
					>
						<X />
					</button>
				</div>
			)}

			{/* Desktop Logo (only for desktop) */}
			{!isMobile && (
				<div className="p-6 border-b border-[#543A14]/20">
					<h2 className="text-2xl font-bold">Cashly</h2>
				</div>
			)}

			<nav className="flex-grow p-4">
				<ul className={`${isMobile ? "space-y-4" : "space-y-2"}`}>
					{items?.map((item) => (
						<li
							key={item.key}
							className={`
                flex 
                items-center 
                p-3 
                rounded-lg 
                cursor-pointer 
                transition-all 
                duration-200 
                ${
									activeItem === item.key
										? "bg-[#543A14] text-[#FFF0DC]"
										: "hover:bg-[#543A14]/10"
								}
              `}
							onClick={() => {
								setActiveItem(item.key);
								handlePageChange(item.key);
							}}
						>
							<item.icon className="h-5 w-5 mr-3" />
							<span className="text-md">{item.label}</span>
						</li>
					))}
				</ul>
			</nav>

			<div className="p-4 border-t border-[#543A14]/20">
				<button
					onClick={logout}
					className="
            flex 
            items-center 
            p-3 
            rounded-lg 
            cursor-pointer 
            hover:bg-[#543A14]/10 
            transition-all 
            duration-200
            w-full
          "
				>
					<LogOut className="h-5 w-5 mr-3" />
					<span className="text-md">Logout</span>
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
