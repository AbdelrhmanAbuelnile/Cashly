import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { userTypes } from "../../../types/userTypes";

interface UserProfileDropdownProps {
	user: userTypes;
	balance?: number;
	onLogout: () => void;
}

const UserProfileDropdown = ({
	user,
	onLogout,
	balance,
}: UserProfileDropdownProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown if clicked outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Placeholder for user photo or icon
	const UserAvatar = () => {
		return (
			<div
				className="w-10 h-10 rounded-full border-2 border-[#543A14] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
			>
				{user?.picture ? (
					<img
						src={user?.picture}
						loading="lazy"
						alt={`${user.name}'s profile`}
						className="w-full h-full object-cover rounded-full"
						onError={(e) => {
							e.currentTarget.src = `https://via.assets.so/img.jpg?w=400&h=150&tc=#ababab&bg=#cecece00`; //fallback image
							e.currentTarget.alt = "Fallback image"; // Update the alt
						}}
					/>
				) : (
					<User className="w-6 h-6 text-[#543A14]" />
				)}
			</div>
		);
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<div className="flex items-center gap-2">
				<span className="text-lg font-semibold hidden md:block capitalize">
					hi {user?.firstName}
				</span>
				<UserAvatar />
			</div>

			<AnimatePresence>
				{isDropdownOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="absolute right-0 top-full mt-2 w-64 bg-[#F0BB78] rounded-lg shadow-lg border border-[#543A14] z-50"
					>
						<div className="p-4 border-b border-[#543A14]/20">
							<div className="flex items-center space-x-3">
								<UserAvatar />
								<div>
									<p className="font-semibold">{user?.name}</p>
									<p className="text-sm text-[#543A14]/70">Remaining Balance</p>
									<p className="text-lg font-bold">{balance}</p>
								</div>
							</div>
						</div>
						<div className="p-2">
							<button
								onClick={() => {
									onLogout();
									setIsDropdownOpen(false);
								}}
								className="w-full flex items-center justify-center space-x-2 py-2 hover:bg-[#543A14]/10 rounded-md transition-colors"
							>
								<LogOut className="w-4 h-4" />
								<span>Logout</span>
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default UserProfileDropdown;
